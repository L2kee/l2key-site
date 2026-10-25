"""Posts EVOGENCY's Threads posts straight through Meta's Threads API (no Buffer, $0).

Usage:
  python social/threads.py post      publish every post that came due in the last GRACE_HOURS and isn't up yet
  python social/threads.py check     confirm the token works and say which account it posts as (never prints the token)
  python social/threads.py refresh   renew the 60 day token (Sundays, from the workflow)
  python social/threads.py lint      validate every week file, no network

Week files live in social/threads/<Monday>.json, a subfolder on purpose: every social/*.json is read as an
Instagram week file by render.js, voice.py, reel.js, and schedule.py, so a Threads file there breaks that run.

  {"week": "2026-10-26", "approved": true, "posts": [
    {"date": "2026-10-26", "time": "08:00", "kind": "take", "tag": "Small Business", "text": "..."}, ...]}

- Nothing in a week posts until "approved" is true (Moe reviews each new week first).
- A post with "skip": true never posts. That's the kill switch (or delete the post from the file).
- Times are Eastern. The Threads API has no scheduling, so the workflow runs this every 15 minutes and it publishes
  whatever is due. A post more than GRACE_HOURS late is skipped as stale instead of going out at the wrong time.

No state file: before publishing, it reads back the account's latest posts and skips any whose text is already up,
so a rerun never double posts and nothing gets committed (no extra Vercel deploys).

Token: THREADS_TOKEN (long lived, 60 days) and THREADS_USER_ID, both GitHub Actions secrets, never printed.
refresh renews it every Sunday. If Meta hands back a different token string, the run fails and GitHub emails Moe the
one command to store it, because this workflow can't write secrets (on purpose). A failed refresh fails loudly too,
with weeks of runway before the token would actually expire.
"""
import glob
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

API = os.environ.get("THREADS_API", "https://graph.threads.com")
ET = ZoneInfo("America/New_York")
HERE = os.path.dirname(os.path.abspath(__file__))
WEEKS = os.path.join(HERE, "threads")
GRACE_HOURS = 3
KINDS = {"take", "useful", "question", "build", "promo"}
MAX_BYTES = 500  # Threads' text limit; emojis count by their UTF-8 bytes


def now():
    fake = os.environ.get("THREADS_NOW")  # tests only, an ISO time in Eastern
    return datetime.fromisoformat(fake).replace(tzinfo=ET) if fake else datetime.now(ET)


def call(method, path, params):
    params = dict(params, access_token=os.environ["THREADS_TOKEN"])
    url = API + path
    data = None
    if method == "GET":
        url += "?" + urllib.parse.urlencode(params)
    else:
        data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(url, data=data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace").replace(os.environ["THREADS_TOKEN"], "***")
        raise SystemExit(f"Threads API {method} {path} failed with HTTP {e.code}: {body[:500]}")


def lint_week(path):
    """Returns (week, problems). A week with problems never posts."""
    problems = []
    try:
        with open(path, encoding="utf-8") as f:
            week = json.load(f)
    except (OSError, ValueError) as e:
        return None, [f"can't read it ({e})"]
    posts = week.get("posts")
    if not isinstance(posts, list):
        return week, ["no posts list"]
    seen = set()
    for i, p in enumerate(posts, 1):
        where = f"post {i} ({p.get('date')} {p.get('time')})"
        try:
            datetime.strptime(f"{p.get('date')} {p.get('time')}", "%Y-%m-%d %H:%M")
        except (TypeError, ValueError):
            problems.append(f"{where}: date must be YYYY-MM-DD and time HH:MM")
        if (p.get("date"), p.get("time")) in seen:
            problems.append(f"{where}: two posts in the same slot")
        seen.add((p.get("date"), p.get("time")))
        text = p.get("text")
        if not isinstance(text, str) or not text.strip():
            problems.append(f"{where}: no text")
        elif len(text.encode("utf-8")) > MAX_BYTES:
            problems.append(f"{where}: {len(text.encode('utf-8'))} bytes, Threads allows {MAX_BYTES}")
        tag = p.get("tag", "")
        if tag and (len(tag) > 50 or "." in tag or "&" in tag):
            problems.append(f"{where}: topic tag must be 1 to 50 characters with no periods or ampersands")
        if p.get("kind") not in KINDS:
            problems.append(f"{where}: kind must be one of {', '.join(sorted(KINDS))}")
    return week, problems


def weeks():
    for path in sorted(glob.glob(os.path.join(WEEKS, "*.json"))):
        week, problems = lint_week(path)
        yield os.path.basename(path), week, problems


def lint():
    bad = 0
    for name, week, problems in weeks():
        for p in problems:
            print(f"{name}: {p}")
        bad += len(problems)
        if not problems:
            state = "approved" if week.get("approved") else "waiting on Moe's approval"
            print(f"{name}: {len(week['posts'])} posts, ok, {state}")
    return bad


def same(a, b):
    return " ".join(a.split()) == " ".join(b.split())


def publish(user, p):
    params = {"media_type": "TEXT", "text": p["text"]}
    if p.get("tag"):
        params["topic_tag"] = p["tag"]
    container = call("POST", f"/v1.0/{user}/threads", params)["id"]
    for _ in range(12):  # Meta suggests waiting about 30 seconds; text is usually ready at once
        status = call("GET", f"/v1.0/{container}", {"fields": "status,error_message"})
        if status.get("status") == "FINISHED":
            break
        if status.get("status") in ("ERROR", "EXPIRED"):
            raise SystemExit(f"Threads refused the post: {status.get('error_message') or status.get('status')}")
        time.sleep(5)
    return call("POST", f"/v1.0/{user}/threads_publish", {"creation_id": container})["id"]


def post():
    if not os.environ.get("THREADS_TOKEN") or not os.environ.get("THREADS_USER_ID"):
        print("Threads isn't set up yet (no THREADS_TOKEN or THREADS_USER_ID secret), nothing to do.")
        return 0
    user = os.environ["THREADS_USER_ID"]
    t = now()
    due, failed = [], 0
    for name, week, problems in weeks():
        if problems:
            print(f"{name}: skipped, fix it first ({len(problems)} problems, run lint)")
            failed += 1
            continue
        for p in week["posts"]:
            at = datetime.strptime(f"{p['date']} {p['time']}", "%Y-%m-%d %H:%M").replace(tzinfo=ET)
            if at > t or p.get("skip"):
                continue
            if t - at > timedelta(hours=GRACE_HOURS):
                continue  # stale, or already handled on an earlier run
            if not week.get("approved"):
                print(f"{name}: {p['date']} {p['time']} is due but the week isn't approved, not posting")
                continue
            due.append(p)
    if not due:
        print(f"Nothing due at {t:%Y-%m-%d %H:%M} ET.")
        return 1 if failed else 0
    recent = call("GET", f"/v1.0/{user}/threads", {"fields": "id,text,timestamp", "limit": 25}).get("data", [])
    for p in due:
        if any(same(r.get("text") or "", p["text"]) for r in recent):
            print(f"{p['date']} {p['time']}: already up, skipped")
            continue
        media = publish(user, p)
        print(f"{p['date']} {p['time']}: posted ({p['kind']}, media {media})")
    return 1 if failed else 0


def check():
    if not os.environ.get("THREADS_TOKEN"):
        raise SystemExit("No THREADS_TOKEN secret.")
    me = call("GET", "/v1.0/me", {"fields": "id,username"})
    print(f"Token works. Posts as @{me.get('username')} (user id {me.get('id')}).")
    if os.environ.get("THREADS_USER_ID") and os.environ["THREADS_USER_ID"] != me.get("id"):
        raise SystemExit("THREADS_USER_ID doesn't match the token's account. Set it to the id above.")
    return 0


def refresh():
    if not os.environ.get("THREADS_TOKEN"):
        print("Threads isn't set up yet, nothing to refresh.")
        return 0
    r = call("GET", "/refresh_access_token", {"grant_type": "th_refresh_token"})
    days = int(r.get("expires_in", 0)) // 86400
    if r.get("access_token") and r["access_token"] != os.environ["THREADS_TOKEN"]:
        print("Meta returned a NEW token string, so the stored one has to be replaced.")
        print("Moe, get the new token from the Meta app dashboard and run this in the l2key-site folder,")
        print("then paste the token when it asks:  gh secret set THREADS_TOKEN")
        return 1
    print(f"Token refreshed, good for {days} more days.")
    return 0


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    modes = {"post": post, "check": check, "refresh": refresh, "lint": lint}
    if mode not in modes:
        raise SystemExit(__doc__)
    sys.exit(1 if modes[mode]() else 0)
