"""Keeps EVOGENCY's carousel posts booked in Buffer (Instagram, Facebook, TikTok).

Usage:
  python social/schedule.py channels        list connected Buffer channels and plan limits (no changes)
  python social/schedule.py inspect <id>    read one Buffer post (no changes)
  python social/schedule.py sync            book the soonest posts from every social/<week>.json
  python social/schedule.py cleanup         delete the slides and reels of posts that already went out

Buffer's free plan only holds a few scheduled posts at once (10 on this account), so sync is a refill:
it books the soonest upcoming posts until the plan's cap is reached, and runs again every day to top up
as posts go out. Posts further out wait for a later sync.

Every post this script books is recorded in social/state/<week>.json, keyed by "<date> <time>|<channel>".
- A post deleted by hand in Buffer stays recorded, so it is never booked again (that's how Moe kills one).
- If a slot's post was rewritten (new "id") or moved (new time), the old Buffer post is deleted and the new
  one booked. An old post that already went out is left alone.
- To make room for a sooner post, a later post this script booked can be unbooked; it gets rebooked later.

Instagram and TikTok get each post as a reel with motion (social/reel.js renders public/social/<post id>/reel.mp4).
A post whose reel isn't rendered yet waits for a later run, unless it's due within FALLBACK_HOURS, when it goes out
as the image carousel instead. A booked carousel is swapped for the reel once the reel exists ("fmt" in the state).
If Buffer refuses a reel, the carousel is booked in its place and the run fails, so GitHub emails Moe.

Weekly cleanup: once a post is published, Instagram, Facebook, and TikTok keep their own copy of the media, so its
folder in public/social is dead weight. cleanup deletes every post folder dated 2 or more days ago (folders are named
<date>-<slug>). Git history still holds the old files, but the site, the deploys, and every checkout stay small.

Needs BUFFER_API_KEY for channels, inspect, and sync (a GitHub Actions secret, never printed). Slides must be live at
https://evogencyglobal.com/social/<post id>/slide-N.png (and reels at .../reel.mp4) before a post is booked.
"""
import glob
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

API = "https://api.buffer.com"
SITE = "https://evogencyglobal.com"
ET = ZoneInfo("America/New_York")
SERVICES = ("instagram", "facebook", "tiktok")
SOCIAL = os.path.dirname(os.path.abspath(__file__))
# Facebook pages get hidden when they post too often, so Facebook only takes each day's first post.
FIRST_OF_DAY_ONLY = ("facebook",)
# Channels that get the reel with motion instead of the still carousel.
REEL_SERVICES = ("instagram", "tiktok")
FALLBACK_HOURS = 12


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


def organizations():
    return gql("{ account { organizations { id name limits { channels scheduledPosts } } } }")["account"]["organizations"]


def channels(orgs=None):
    found = []
    for org in orgs or organizations():
        print(f"{org['name']} | plan limits: {org['limits']['channels']} channels, {org['limits']['scheduledPosts']} scheduled posts")
        q = "query($id: OrganizationId!) { channels(input: {organizationId: $id}) { id name service isQueuePaused } }"
        for c in gql(q, {"id": org["id"]})["channels"]:
            c["org"] = org["id"]
            found.append(c)
            print(f"{org['name']} | {c['service']} | {c['name']} | {c['id']}{' | QUEUE PAUSED' if c['isQueuePaused'] else ''}")
    return found


def scheduled_ids(org_id):
    q = """query($id: OrganizationId!, $after: String) {
      posts(first: 100, after: $after, input: {organizationId: $id, filter: {status: [scheduled]}}) {
        edges { node { id } } pageInfo { hasNextPage endCursor } } }"""
    ids, after = set(), None
    while True:
        page = gql(q, {"id": org_id, "after": after})["posts"]
        ids |= {e["node"]["id"] for e in page["edges"]}
        if not page["pageInfo"]["hasNextPage"]:
            return ids
        after = page["pageInfo"]["endCursor"]


def pid(p):
    return p.get("id") or p["date"]


def live(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=30) as r:
            return r.status == 200 and r.headers.get("Content-Type", "").startswith(("image/", "video/"))
    except Exception:
        return False


def has_reel(p):
    """The reel is in this checkout (rendered by reel.js), so it's live once the site deploys."""
    return os.path.exists(os.path.join(SOCIAL, "..", "public", "social", pid(p), "reel.mp4"))


def reel_info(p):
    with open(os.path.join(SOCIAL, "..", "public", "social", pid(p), "reel.json"), encoding="utf-8") as f:
        return json.load(f)


def wait_for_slides(posts, reels=()):
    urls = [f"{SITE}/social/{pid(p)}/slide-{k}.png" for p in posts for k in range(1, 7)]
    urls += [f"{SITE}/social/{pid(p)}/reel.mp4" for p in reels]
    for _ in range(40):  # up to 20 minutes for the Vercel deploy
        missing = [u for u in urls if not live(u)]
        if not missing:
            return
        print(f"waiting for {len(missing)} slides to go live, e.g. {missing[0]}")
        time.sleep(30)
    sys.exit("Slides never went live, nothing booked.")


def alt(p, k):
    return [p["hook"], p["why"], *p["steps"], p["take"] + " Free audit at evogencyglobal.com/contact"][k - 1]


CREATE = """mutation($input: CreatePostInput!) { createPost(input: $input) {
  __typename ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }"""
DELETE = """mutation($input: DeletePostInput!) { deletePost(input: $input) {
  __typename ... on DeletePostSuccess { id } ... on VoidMutationError { message } } }"""
META = {
    "instagram": lambda p: {"instagram": {"type": "post", "shouldShareToFeed": True}},
    "instagram_reel": lambda p: {"instagram": {"type": "reel", "shouldShareToFeed": True}},
    "facebook": lambda p: {"facebook": {"type": "post"}},
    "tiktok": lambda p: {"tiktok": {"title": p["hook"][:90]}},
}


def save(path, state):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def delete(buffer_id):
    res = gql(DELETE, {"input": {"id": buffer_id}})["deletePost"]
    return res["__typename"] == "DeletePostSuccess", res.get("message")


def sync():
    orgs = organizations()
    targets = [c for c in channels(orgs) if c["service"] in SERVICES]
    if not targets:
        sys.exit("No Instagram, Facebook, or TikTok channel is connected in Buffer.")
    now = datetime.now(ET)
    failed = 0

    # Every post in every week file, with its state file.
    weeks = {}
    for path in sorted(glob.glob(os.path.join(SOCIAL, "*.json"))):
        state_path = os.path.join(SOCIAL, "state", os.path.basename(path))
        week = json.load(open(path, encoding="utf-8"))
        state = json.load(open(state_path, encoding="utf-8")) if os.path.exists(state_path) else {}
        weeks[path] = (week, state, state_path)

    for org in orgs:
        cap = org["limits"]["scheduledPosts"]
        org_targets = [c for c in targets if c["org"] == org["id"]]
        booked = scheduled_ids(org["id"])
        mine = {e["buffer"] for _, st, _ in weeks.values() for e in st.values() if isinstance(e, dict)}
        mine |= {e for _, st, _ in weeks.values() for e in st.values() if isinstance(e, str)}
        others = len(booked - mine)  # posts Moe scheduled by hand count against the cap too

        # Every upcoming (post, channel) slot, soonest first.
        slots = []
        for path, (week, state, state_path) in weeks.items():
            firsts = {}
            for p in week["posts"]:
                t = p.get("time") or week.get("time", "11:15")
                firsts.setdefault(p["date"], t)
                firsts[p["date"]] = min(firsts[p["date"]], t)
            for p in week["posts"]:
                t = p.get("time") or week.get("time", "11:15")
                due = datetime.fromisoformat(f"{p['date']}T{t}").replace(tzinfo=ET)
                if due <= now + timedelta(minutes=10):
                    continue
                for c in org_targets:
                    if c["service"] in FIRST_OF_DAY_ONLY and t != firsts[p["date"]]:
                        continue
                    slots.append((due, p, c, path, f"{p['date']} {t}|{c['id']}"))
        slots.sort(key=lambda s: s[0])

        # Reel channels get the reel once it exists. Until then a post waits, unless it's due soon or already
        # booked as a carousel, in which case the carousel stands.
        def fmt(p, c):
            return "reel" if c["service"] in REEL_SERVICES and has_reel(p) else "image"
        slots = [
            s for s in slots
            if s[2]["service"] not in REEL_SERVICES or fmt(s[1], s[2]) == "reel"
            or s[0] <= now + timedelta(hours=FALLBACK_HOURS) or s[4] in weeks[s[3]][1]]

        # Stale entries: old key format, or a slot whose post was rewritten, moved, or now has a reel.
        # Delete if still booked.
        wanted = {key: (pid(p), due.isoformat(), fmt(p, c)) for due, p, c, path, key in slots}
        for path, (week, state, state_path) in weeks.items():
            for key, entry in list(state.items()):
                bid = entry if isinstance(entry, str) else entry["buffer"]
                fresh = isinstance(entry, dict) and wanted.get(key) == (
                    entry.get("post"), entry.get("due"), entry.get("fmt", "image"))
                if fresh or bid not in booked:
                    continue  # current, or already sent, or killed by hand (kept so it's never rebooked)
                ok, msg = delete(bid)
                if not ok:
                    failed += 1
                    print(f"{key}: could not delete outdated post {bid} ({msg})")
                    continue
                print(f"{key}: deleted outdated post {bid}")
                booked.discard(bid)
                del state[key]
                save(state_path, state)

        # The soonest slots that fit under the cap should be booked; later ones booked by us get unbooked.
        room = cap - others
        keep = []
        for slot in slots:
            due, p, c, path, key = slot
            entry = weeks[path][1].get(key)
            if entry and entry["buffer"] not in booked:
                continue  # sent or killed by hand: never rebook
            keep.append(slot)
        keep, extra = keep[:max(room, 0)], keep[max(room, 0):]
        for due, p, c, path, key in extra:
            week, state, state_path = weeks[path]
            entry = state.get(key)
            if entry and entry["buffer"] in booked:
                ok, msg = delete(entry["buffer"])
                if ok:
                    print(f"{key}: unbooked to make room for sooner posts (rebooked later)")
                    booked.discard(entry["buffer"])
                    del state[key]
                    save(state_path, state)
                else:
                    failed += 1
                    print(f"{key}: could not unbook {entry['buffer']} ({msg})")

        todo = [s for s in keep if s[4] not in weeks[s[3]][1]]
        if todo:
            wait_for_slides([p for _, p, _, _, _ in todo], [p for _, p, c, _, _ in todo if fmt(p, c) == "reel"])
        for due, p, c, path, key in todo:
            week, state, state_path = weeks[path]
            if len(booked) >= cap:
                print(f"{key}: Buffer is full ({cap}), waiting for the next sync")
                continue
            carousel = [{"image": {"url": f"{SITE}/social/{pid(p)}/slide-{k}.png", "metadata": {"altText": alt(p, k)}}}
                        for k in range(1, 7)]
            tries = [("image", carousel, META[c["service"]](p))]
            if fmt(p, c) == "reel":
                reel = [{"video": {"url": f"{SITE}/social/{pid(p)}/reel.mp4",
                                   "metadata": {"thumbnailOffset": reel_info(p)["cover_ms"]}}}]
                tries.insert(0, ("reel", reel, META.get(c["service"] + "_reel", META[c["service"]])(p)))
            for kind, assets, meta in tries:
                inp = {"channelId": c["id"], "text": p["captions"][c["service"]], "assets": assets,
                       "metadata": meta, "schedulingType": "automatic",
                       "mode": "customScheduled", "dueAt": due.isoformat()}
                res = gql(CREATE, {"input": inp})["createPost"]
                if res["__typename"] == "PostActionSuccess":
                    booked.add(res["post"]["id"])
                    state[key] = {"buffer": res["post"]["id"], "post": pid(p), "due": due.isoformat(), "fmt": kind}
                    save(state_path, state)
                    print(f"{key} {c['service']}: booked {pid(p)} as {kind} (post {res['post']['id']})")
                    break
                failed += 1
                print(f"{key} {c['service']}: {kind} FAILED, {res.get('message')}")
        print(f"{org['name']}: {len(booked)} of {cap} scheduled posts in use")
    return 1 if failed else 0


def cleanup():
    media = os.path.join(SOCIAL, "..", "public", "social")
    cutoff = (datetime.now(ET) - timedelta(days=2)).date().isoformat()
    gone = 0
    for name in sorted(os.listdir(media)):
        if os.path.isdir(os.path.join(media, name)) and name[:10] < cutoff:
            shutil.rmtree(os.path.join(media, name))
            gone += 1
    print(f"cleanup: removed {gone} post folders dated before {cutoff}")


if __name__ == "__main__":
    if sys.argv[1:2] == ["channels"]:
        channels()
    elif sys.argv[1:2] == ["inspect"] and len(sys.argv) == 3:
        q = "query($id: PostId!) { post(input: {id: $id}) { id status dueAt sentAt via allowedActions } }"
        print(json.dumps(gql(q, {"id": sys.argv[2]})["post"], indent=2))
    elif sys.argv[1:2] == ["cleanup"]:
        cleanup()
    elif sys.argv[1:2] == ["sync"]:
        sys.exit(sync())
    else:
        sys.exit(__doc__)
