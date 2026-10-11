"""Narrates each upcoming Reel with Kokoro, the same voice engine as the Job Site Studio pipeline.
Every Reel is narrated in a British accent (bf_emma), Moe's standing rule since 2026-10-11.

Usage:  python social/voice.py social/<week>.json [more week files] [--out <dir>] [--voice bf_emma] [--only <post id>] [--limit N]

For every post that is still upcoming and has no reel narrated in this voice yet, writes one wav per slide plus voice.json
(<out>/<post id>/0.wav ... 5.wav, and the length of each) for social/reel.js. reel.js holds each slide until its
line is said and mixes the clips into the Reel. Posts with no voice files render silent, as before.

The script per slide is the slide's own text: the hook, the why, "One." plus step 1 (and so on), then the takeaway
and the closing card's ask. Runs on the CPU (the GitHub runner has no GPU); the 82M model loads once per run.
Needs: pip install kokoro soundfile (plus torch).
"""
import argparse
import glob
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RATE = 24000
NUMS = ["One.", "Two.", "Three."]


def say(text):
    """Spoken form of slide text. URLs and symbols read badly, so they get words."""
    text = text.replace("evogencyglobal.com/contact", "evogency global dot com, slash contact")
    text = text.replace("evogencyglobal.com", "evogency global dot com")
    text = text.replace("EVOGENCY", "Evogency").replace("&", " and ").replace("%", " percent")
    return re.sub(r"\s+", " ", text).strip()


def script(p):
    promo = p.get("kind") == "promo"
    ask = ("Want a second set of eyes? Get a free audit at evogencyglobal.com/contact." if promo
           else "Want one of these every day? Follow EVOGENCY, and save this so you have it later.")
    return [say(x) for x in [p["hook"], p["why"], *[f"{NUMS[k]} {s}" for k, s in enumerate(p["steps"])], f"{p['take']} {ask}"]]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weeks", nargs="+")
    ap.add_argument("--out", default=os.environ.get("VOICE_DIR", "/tmp/voice"))
    ap.add_argument("--voice", default="bf_emma")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--only")
    ap.add_argument("--limit", type=int, default=0, help="narrate at most this many posts, soonest first")
    a = ap.parse_args()

    try:
        now = datetime.now(ZoneInfo("America/New_York"))
    except Exception:  # Windows without tzdata; Eastern daylight time is close enough to pick upcoming posts
        now = datetime.now(timezone(timedelta(hours=-4)))
    now = now.strftime("%Y-%m-%d %H:%M")
    todo = []
    for f in a.weeks:
        week = json.load(open(f, encoding="utf-8"))
        for p in week["posts"]:
            pid = p.get("id") or p["date"]
            when = f"{p['date']} {p.get('time') or week.get('time', '11:15')}"
            if a.only and pid != a.only:
                continue
            if not a.only and when <= now:
                continue
            info = os.path.join(ROOT, "public", "social", pid, "reel.json")
            if os.path.exists(info) and json.load(open(info, encoding="utf-8")).get("voice") == a.voice:
                continue  # already narrated in this voice (a reel in another voice gets narrated again)
            if os.path.exists(os.path.join(a.out, pid, "voice.json")):
                continue
            todo.append((when, pid, p))
    todo = [(pid, p) for _, pid, p in sorted(todo, key=lambda x: x[0])]
    if a.limit:
        todo = todo[:a.limit]
    if not todo:
        print("voice: nothing to narrate")
        return

    import numpy as np
    import soundfile as sf
    from kokoro import KPipeline
    lang = "b" if a.voice.startswith(("bf_", "bm_")) else "a"
    pipe = KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
    for pid, p in todo:
        d = os.path.join(a.out, pid)
        os.makedirs(d, exist_ok=True)
        lens = []
        for i, line in enumerate(script(p)):
            parts = [audio for _, _, audio in pipe(line, voice=a.voice, speed=a.speed)]
            audio = np.concatenate([x.cpu().numpy() if hasattr(x, "cpu") else x for x in parts])
            # Kokoro pads each clip with silence; trim it to a short breath so the Reel doesn't drag between slides.
            loud = np.flatnonzero(np.abs(audio) > 0.01)
            if loud.size:
                pad = int(0.06 * RATE)
                audio = audio[max(0, loud[0] - pad):loud[-1] + pad]
            sf.write(os.path.join(d, f"{i}.wav"), audio, RATE)
            lens.append(round(len(audio) / RATE, 3))
        json.dump({"voice": a.voice, "seconds": lens, "lines": script(p)}, open(os.path.join(d, "voice.json"), "w", encoding="utf-8"), indent=2)
        print(f"voice {pid}: {sum(lens):.1f}s over {len(lens)} slides")


if __name__ == "__main__":
    sys.exit(main())
