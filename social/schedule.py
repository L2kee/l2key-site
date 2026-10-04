"""Schedules a week of EVOGENCY carousel posts in Buffer (Instagram, Facebook, TikTok).

Usage:
  python social/schedule.py channels                 list connected Buffer channels (no changes)
  python social/schedule.py schedule social/<week>.json

Needs BUFFER_API_KEY (a GitHub Actions secret, never printed). Slides must already be live at
https://evogencyglobal.com/social/<date>/slide-N.png. Every scheduled post's Buffer id is saved in
social/state/<week>.json, so a rerun only retries what failed and never double posts.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

API = "https://api.buffer.com"
SITE = "https://evogencyglobal.com"
ET = ZoneInfo("America/New_York")
SERVICES = ("instagram", "facebook", "tiktok")


def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(API, data=body, method="POST", headers={
        "Authorization": "Bearer " + os.environ["BUFFER_API_KEY"],
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            out = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Buffer API HTTP {e.code}: {e.read(300).decode(errors='replace')}")
    if out.get("errors"):
        sys.exit(f"Buffer API error: {out['errors'][0].get('message')}")
    return out["data"]


def channels():
    orgs = gql("{ account { organizations { id name } } }")["account"]["organizations"]
    found = []
    for org in orgs:
        q = "query($id: OrganizationId!) { channels(input: {organizationId: $id}) { id name service isQueuePaused } }"
        for c in gql(q, {"id": org["id"]})["channels"]:
            found.append(c)
            print(f"{org['name']} | {c['service']} | {c['name']} | {c['id']}{' | QUEUE PAUSED' if c['isQueuePaused'] else ''}")
    return found


def live(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=30) as r:
            return r.status == 200 and r.headers.get("Content-Type", "").startswith("image/")
    except Exception:
        return False


def wait_for_slides(week):
    urls = [f"{SITE}/social/{p['date']}/slide-{k}.png" for p in week["posts"] for k in range(1, 7)]
    for _ in range(40):  # up to 20 minutes for the Vercel deploy
        missing = [u for u in urls if not live(u)]
        if not missing:
            return
        print(f"waiting for {len(missing)} slides to go live, e.g. {missing[0]}")
        time.sleep(30)
    sys.exit("Slides never went live, nothing scheduled.")


def alt(p, k):
    return [p["hook"], p["why"], *p["steps"], p["take"] + " Free audit at evogencyglobal.com/contact"][k - 1]


MUTATION = """mutation($input: CreatePostInput!) { createPost(input: $input) {
  __typename ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }"""

META = {
    "instagram": lambda p: {"instagram": {"type": "post", "shouldShareToFeed": True}},
    "facebook": lambda p: {"facebook": {"type": "post"}},
    "tiktok": lambda p: {"tiktok": {"title": p["hook"][:90]}},
}


def schedule(path):
    week = json.load(open(path, encoding="utf-8"))
    state_path = os.path.join(os.path.dirname(path), "state", os.path.basename(path))
    state = json.load(open(state_path, encoding="utf-8")) if os.path.exists(state_path) else {}
    targets = [c for c in channels() if c["service"] in SERVICES]
    if not targets:
        sys.exit("No Instagram, Facebook, or TikTok channel is connected in Buffer.")
    wait_for_slides(week)
    hh, mm = map(int, week["time"].split(":"))
    failed = 0
    for p in week["posts"]:
        due = datetime.fromisoformat(p["date"]).replace(hour=hh, minute=mm, tzinfo=ET)
        if due <= datetime.now(ET):
            print(f"{p['date']}: time already passed, skipped")
            continue
        assets = [{"image": {"url": f"{SITE}/social/{p['date']}/slide-{k}.png", "metadata": {"altText": alt(p, k)}}}
                  for k in range(1, 7)]
        for c in targets:
            key = f"{p['date']}|{c['id']}"
            if key in state:
                continue
            inp = {"channelId": c["id"], "text": p["captions"][c["service"]], "assets": assets,
                   "metadata": META[c["service"]](p), "schedulingType": "automatic",
                   "mode": "customScheduled", "dueAt": due.isoformat()}
            res = gql(MUTATION, {"input": inp})["createPost"]
            if res["__typename"] == "PostActionSuccess":
                state[key] = res["post"]["id"]
                print(f"{p['date']} {c['service']}: scheduled for {res['post']['dueAt']} (post {res['post']['id']})")
                os.makedirs(os.path.dirname(state_path), exist_ok=True)
                with open(state_path, "w", encoding="utf-8") as f:
                    json.dump(state, f, indent=2)
            else:
                failed += 1
                print(f"{p['date']} {c['service']}: FAILED, {res.get('message')}")
    return 1 if failed else 0


if __name__ == "__main__":
    if sys.argv[1:2] == ["channels"]:
        channels()
    elif sys.argv[1:2] == ["schedule"] and len(sys.argv) == 3:
        sys.exit(schedule(sys.argv[2]))
    else:
        sys.exit(__doc__)
