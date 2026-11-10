"""Posts EVOGENCY's Threads posts straight through Meta's Threads API (no Buffer, $0).

Usage:
  python social/threads.py post      publish the newest post that came due in the last GRACE_HOURS and isn't up yet
  python social/threads.py check     confirm the token works and say which account it posts as (never prints the token)
  python social/threads.py refresh   renew the 60 day token (Sundays, from the workflow)
  python social/threads.py lint      validate every week file, no network

Week files live in social/threads/<Monday>.json, a subfolder on purpose: every social/*.json is read as an
Instagram week file by render.js, voice.py, reel.js, and schedule.py, so a Threads file there breaks that run.

  {"week": "2026-10-26", "approved": true, "posts": [
    {"date": "2026-10-26", "time": "08:00", "kind": "take", "tag": "Small Business", "text": "..."}, ...]}

- Nothing in a week posts until "approved" is true (Moe reviews each new week first).
- A post with "skip": true never posts. That's the kill switch (or delete the post from the file).
- Times are Eastern. The Threads API has no scheduling, and GitHub starts scheduled runs 15 minutes to 3.5 hours late
  (measured on week 1), so a scheduled run doesn't just post and quit. With THREADS_LOOP_MINUTES set it stays up,
  sleeps until each next slot, posts it on the minute, and pulls the repo before each pass so a week approved
  mid run is seen. The workflow gives it about 5 hours, and the next queued run picks up where it stops.
- One post per pass. If a gap left several posts due, only the newest goes out and the older ones are dropped,
  so the feed never gets 3 posts dumped at once. A post more than GRACE_HOURS (2) late is dropped as stale.
- Fails loudly (GitHub emails Moe) when no approved week has posts for today, so it can never sit quiet and green
  with nothing to post again (that hid an empty week 2 from 2026-11-02).
- Warns ahead too (since 2026-11-10, after the account went dark 11-09 with no week 3). From Friday 6 PM ET the run
  fails if no week file has posts for next Monday (the Website Bot writes it Fridays at 1 PM), and from Saturday it
  fails if next Monday's posts aren't approved yet. The warning never stops this week's posts, the run still posts
  every slot and only reports the failure when it ends.
- If Meta loses a post between create and publish ("Media Not Found", seen 2026-11-08 8 AM), it checks the post isn't
  up, then creates it again, up to 3 tries. A post that still fails is logged and the run keeps going to the next slot
  (that failure used to end the run, which also lost the 10 AM and 12 PM slots on 11-08), then fails at the end.

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
import subprocess
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
GRACE_HOURS = 2
KINDS = {"take", "useful", "question", "build", "promo"}
MAX_BYTES = 500  # Threads' text limit; emojis count by their UTF-8 bytes


_skew = timedelta()  # tests only, how far the fake clock has been slept forward
_said_stale = set()  # stale notices already logged this run, so a long run says each one once


def now():
    fake = os.environ.get("THREADS_NOW")  # tests only, an ISO time in Eastern
    return datetime.fromisoformat(fake).replace(tzinfo=ET) + _skew if fake else datetime.now(ET)


def sleep_until(at):
    global _skew
    wait = (at - now()).total_seconds()
    if wait <= 0:
        return
    if os.environ.get("THREADS_NOW"):
        _skew += timedelta(seconds=wait)
    else:
        time.sleep(wait)


def pull():
    """Fetch the newest week files mid run. A failed pull isn't fatal, the files on disk still post."""
    if not os.environ.get("THREADS_PULL"):
        return
    r = subprocess.run(["git", "pull", "--ff-only", "-q"], cwd=os.path.dirname(HERE), capture_output=True, text=True)
    if r.returncode:
        print(f"git pull failed, posting from the files already here ({r.stderr.strip()[:200]})")


class ApiError(SystemExit):
    """A failed Threads API call. Still a SystemExit, so anything that doesn't catch it ends the run as before."""

    def __init__(self, message, code, body):
        super().__init__(message)
        self.code, self.body = code, body


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
        raise ApiError(f"Threads API {method} {path} failed with HTTP {e.code}: {body[:500]}", e.code, body)


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


def is_up(user, text):
    recent = call("GET", f"/v1.0/{user}/threads", {"fields": "id,text,timestamp", "limit": 25}).get("data", [])
    return any(same(r.get("text") or "", text) for r in recent)


def media_lost(e):
    """Meta's "Media Not Found" on publish (code 24, subcode 4279009): the container vanished, so make a new one."""
    return e.code == 400 and ('"error_subcode":4279009' in e.body or "Media Not Found" in e.body)


def publish_once(user, p):
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
        sleep(5)
    return call("POST", f"/v1.0/{user}/threads_publish", {"creation_id": container})["id"]


def publish(user, p, tries=3):
    """Returns the media id, or None if a retry found the post already up."""
    for attempt in range(1, tries + 1):
        try:
            return publish_once(user, p)
        except ApiError as e:
            if not media_lost(e) or attempt == tries:
                raise
            print(f"{p['date']} {p['time']}: Meta lost the post before publishing (try {attempt} of {tries}), retrying in 30 seconds")
            sleep(30)
            if is_up(user, p["text"]):  # it went up after all, don't post it twice
                return None


def sleep(seconds):
    sleep_until(now() + timedelta(seconds=seconds))


def slot_time(p):
    return datetime.strptime(f"{p['date']} {p['time']}", "%Y-%m-%d %H:%M").replace(tzinfo=ET)


def post_once(user):
    """One pass. Returns (failed, next_slot, post_failed). next_slot is the next approved post still ahead, or None.
    failed ends the run at once (a broken week file, or nothing approved for today). post_failed is one post that
    wouldn't publish, which the run reports at the end after posting the rest of its slots."""
    t = now()
    due, failed, next_slot, today = [], 0, None, 0
    for name, week, problems in weeks():
        if problems:
            print(f"{name}: skipped, fix it first ({len(problems)} problems, run lint)")
            failed += 1
            continue
        for p in week["posts"]:
            if p.get("skip"):
                continue
            at = slot_time(p)
            if week.get("approved") and p["date"] == f"{t:%Y-%m-%d}":
                today += 1
            if at > t:
                if week.get("approved") and (next_slot is None or at < next_slot):
                    next_slot = at
                continue
            if t - at > timedelta(hours=GRACE_HOURS):
                # Stale, or already handled on an earlier pass. Say so for a day, so a dropped post shows in the log.
                if t - at <= timedelta(hours=24) and (p["date"], p["time"]) not in _said_stale:
                    _said_stale.add((p["date"], p["time"]))
                    print(f"{p['date']} {p['time']}: past the {GRACE_HOURS} hour window, not posting (fine if it's already up)")
                continue
            if not week.get("approved"):
                print(f"{name}: {p['date']} {p['time']} is due but the week isn't approved, not posting")
                continue
            due.append(p)
    if not today:
        print(f"NO APPROVED THREADS POSTS FOR {t:%A %Y-%m-%d}. The account is dark today. Write or approve the week file "
              f"in social/threads/ (the Website Bot writes it on Fridays, Moe sets \"approved\": true).")
        failed += 1
    if not due:
        print(f"Nothing due at {t:%Y-%m-%d %H:%M} ET.")
        return failed, next_slot, 0
    due.sort(key=slot_time)
    for p in due[:-1]:
        print(f"{p['date']} {p['time']}: dropped, the newer {due[-1]['time']} slot is due too (one post per pass)")
    p = due[-1]
    if is_up(user, p["text"]):
        print(f"{p['date']} {p['time']}: already up, skipped")
        return failed, next_slot, 0
    try:
        media = publish(user, p)
    except SystemExit as e:
        print(f"::error::{p['date']} {p['time']}: NOT POSTED. {e}")
        return failed, next_slot, 1
    print(f"{p['date']} {p['time']}: " + (f"posted ({p['kind']}, media {media})" if media else "went up on Meta's side after all, not posted twice"))
    return failed, next_slot, 0


def next_week_warning(t):
    """From Friday 6 PM ET, 1 if next Monday has no posts in any week file. From Saturday, 1 if they aren't approved."""
    if t.weekday() < 4 or (t.weekday() == 4 and t.hour < 18):
        return 0
    monday = f"{(t + timedelta(days=7 - t.weekday())):%Y-%m-%d}"
    written = approved = 0
    for name, week, problems in weeks():
        if problems:
            continue  # post_once reports broken files
        for p in week["posts"]:
            if p["date"] == monday and not p.get("skip"):
                written += 1
                approved += bool(week.get("approved"))
    if not written:
        print(f"::error::NEXT WEEK'S THREADS ISN'T WRITTEN. Nothing in social/threads/ for Monday {monday}. The Website Bot "
              f"writes it Fridays at 1 PM ET, so it missed this week. Without it the account goes dark Monday.")
        return 1
    if not approved and t.weekday() >= 5:
        print(f"::error::NEXT WEEK'S THREADS ISN'T APPROVED. Monday {monday} has {written} posts written and waiting on Moe. "
              f"Read the week file, then set \"approved\": true (or tell Jarvis to). Without it the account goes dark Monday.")
        return 1
    return 0


def post():
    if not os.environ.get("THREADS_TOKEN") or not os.environ.get("THREADS_USER_ID"):
        print("Threads isn't set up yet (no THREADS_TOKEN or THREADS_USER_ID secret), nothing to do.")
        return 0
    user = os.environ["THREADS_USER_ID"]
    stop = now() + timedelta(minutes=int(os.environ.get("THREADS_LOOP_MINUTES") or 0))
    failed = warned = post_failures = 0
    while True:
        if not warned:
            warned = next_week_warning(now())  # checked each pass until it fires, then said once per run
        f, next_slot, post_failed = post_once(user)
        failed += f
        post_failures += post_failed
        if f or next_slot is None or next_slot > stop:
            break  # a run with nothing approved for today ends at once so GitHub emails Moe now, not hours later
        print(f"Waiting for the {next_slot:%Y-%m-%d %H:%M} ET slot.")
        sleep_until(next_slot + timedelta(seconds=20))
        pull()
    if (warned or post_failures) and not failed:
        print("Run failing on purpose so GitHub emails Moe, see the ::error:: lines above.")
    return 1 if failed or warned or post_failures else 0


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
