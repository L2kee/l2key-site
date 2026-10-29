"""Narrates each upcoming Reel with Kokoro, the same voice engine as the Job Site Studio pipeline.
Every Reel is narrated in a British accent, Moe's standing rule since 2026-10-11. Since 2026-10-12 the voice is bf_lily
at 1.15 speed (Moe picked it from samples, because bf_emma at normal speed sounded slow and flat).

Usage:  python social/voice.py social/<week>.json [more week files] [--out <dir>] [--voice bf_lily] [--speed 1.15] [--only <post id>] [--limit N]

For every post that is still upcoming and has no reel narrated in this voice yet, writes one wav per slide plus voice.json
(<out>/<post id>/0.wav ... 5.wav, and the length of each) for social/reel.js. reel.js holds each slide until its
line is said and mixes the clips into the Reel. Posts with no voice files render silent, as before.

The script per slide is the post's "say" list when the week file has one (6 spoken lines, written to sound lively,
not read off the slides), otherwise the slide's own text with spoken links: the hook, the why, "First," step 1, "Next,"
step 2, "And the best one." step 3, then the takeaway. The closing ask is always added here: a post with a "keyword"
asks people to follow and DM that word for the prompt, other value posts ask for the follow, the promo points to the audit.
The voice is recorded as "<voice>@<speed>" (bf_lily@1.15), so changing either one re-narrates every upcoming Reel. Runs on the CPU (the GitHub runner has no GPU); the 82M model loads once per run.
Posts whose Reel format (social/config/abtest.json) is stick figure, mascot, or avatar are skipped: those Reels bring their own voices.
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
# Keep in step with ENGINE in reel.js. A Reel made by an older engine gets narrated again, so its re-render keeps its voice.
REEL_ENGINE = 2
LINK = ["First,", "Next,", "And the best one."]
# The tagline changes to "AI skills and people skills" from this date (Moe, 2026-10-24). Keep in step with style.js and schedule.py.
PEOPLE_FROM = "2026-11-02"


def say(text):
    """Spoken form of slide text. URLs and symbols read badly, so they get words."""
    text = text.replace("evogencyglobal.com/contact", "evogency global dot com, slash contact")
    text = text.replace("evogencyglobal.com", "evogency global dot com")
    text = text.replace("EVOGENCY", "Evogency").replace("&", " and ").replace("%", " percent")
    return re.sub(r"\s+", " ", text).strip()


def script(p):
    kw = (p.get("keyword") or "").strip()
    if p.get("kind") == "promo":
        ask = "Want a second set of eyes? Get a free audit at evogencyglobal.com/contact."
    elif kw:
        ask = f"Want the exact prompt? Follow us, and DM the word {kw.capitalize()}."
    else:
        ask = ("Follow Evogency for daily AI skills and people skills, and save this one." if p["date"] >= PEOPLE_FROM
               else "Follow Evogency for daily AI news and tools, and save this one.")
    lines = list(p["say"]) if len(p.get("say") or []) == 6 else [
        p["hook"], p["why"], *[f"{LINK[k]} {s}" for k, s in enumerate(p["steps"])], p["take"]]
    lines[-1] = f"{lines[-1]} {ask}"
    return [say(x) for x in lines]


AB = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "config", "abtest.json"), encoding="utf-8"))
FIRST_DAY = datetime(2026, 10, 5).date()


def format_of(p, slot):
    """The Reel format: the A/B test window, the three format rotation, then slides and avatar from avatar.start.
    Keep in step with formatOf in style.js."""
    formats, av = AB["rotation"]["formats"], AB["avatar"]
    if p.get("format") in formats or p.get("format") in av["formats"]:
        return p["format"]
    if p.get("kind") == "promo":
        return "slides"
    days = (datetime.fromisoformat(p["date"]).date() - FIRST_DAY).days
    if p["date"] >= av["start"]:
        return av["formats"][(days + slot) % len(av["formats"])]
    if p["date"] >= AB["rotation"]["start"]:
        return formats[(days + slot) % 3]
    if p["date"] < AB["start"] or p["date"] > AB["end"]:
        return "slides"
    return "stickman" if (days * 3 + slot) % 2 else "slides"


def slots(week):
    """Each post's place in its day (0, 1, 2 by time), as reel.js and style.js count it."""
    out, by_day = {}, {}
    for p in week["posts"]:
        by_day.setdefault(p["date"], []).append(p)
    for day in by_day.values():
        for k, p in enumerate(sorted(day, key=lambda q: q.get("time") or week.get("time", ""))):
            out[id(p)] = k
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weeks", nargs="+")
    ap.add_argument("--out", default=os.environ.get("VOICE_DIR", "/tmp/voice"))
    ap.add_argument("--voice", default="bf_lily")
    ap.add_argument("--speed", type=float, default=1.15)
    ap.add_argument("--only")
    ap.add_argument("--limit", type=int, default=0, help="narrate at most this many posts, soonest first")
    a = ap.parse_args()
    key = f"{a.voice}@{a.speed:g}"  # what reel.json and the Buffer format record, so a new voice or speed re-narrates

    try:
        now = datetime.now(ZoneInfo("America/New_York"))
    except Exception:  # Windows without tzdata; Eastern daylight time is close enough to pick upcoming posts
        now = datetime.now(timezone(timedelta(hours=-4)))
    now = now.strftime("%Y-%m-%d %H:%M")
    todo = []
    for f in a.weeks:
        week = json.load(open(f, encoding="utf-8"))
        slot = slots(week)
        for p in week["posts"]:
            pid = p.get("id") or p["date"]
            if format_of(p, slot[id(p)]) != "slides":
                continue  # stick figure, mascot, and avatar Reels bring their own voices
            when = f"{p['date']} {p.get('time') or week.get('time', '11:15')}"
            if a.only and pid != a.only:
                continue
            if not a.only and when <= now:
                continue
            info = os.path.join(ROOT, "public", "social", pid, "reel.json")
            made = json.load(open(info, encoding="utf-8")) if os.path.exists(info) else {}
            if made.get("voice") == key and made.get("engine", 1) == REEL_ENGINE:
                continue  # already narrated in this voice and speed by the current engine (anything else gets narrated again)
            done = os.path.join(a.out, pid, "voice.json")
            if os.path.exists(done) and json.load(open(done, encoding="utf-8")).get("voice") == key:
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
        json.dump({"voice": key, "seconds": lens, "lines": script(p)}, open(os.path.join(d, "voice.json"), "w", encoding="utf-8"), indent=2)
        print(f"voice {pid}: {sum(lens):.1f}s over {len(lens)} slides")


if __name__ == "__main__":
    sys.exit(main())
