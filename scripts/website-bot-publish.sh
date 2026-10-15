#!/usr/bin/env bash
# Publishes a website-bot/* branch. The Website Bot pushes one when the cloud check blocks its push to master.
# Run by .github/workflows/website-bot-publish.yml from master's copy of this file, so a branch can't loosen the rules.
#
# It never merges the branch's files. It checks the branch did exactly what the bot's standing jobs do, then redoes
# that work on master:
#   "Publish 3 posts dated D"  reruns publish-next-posts.mjs on master and requires the identical change.
#                              D must be today or yesterday (New York time).
#   "Social week of M"         copies the one new social/M.json (M a Monday, not on master yet, valid JSON).
# Any other commit, file, or change and it stops without publishing anything.
#
# Usage: website-bot-publish.sh <sha> <branch>    (DRY_RUN=1 checks and builds but pushes nothing)
set -euo pipefail
SHA=$1
BRANCH=$2
DRY_RUN=${DRY_RUN:-0}
BLOG_FILES=(src/lib/blog.ts src/lib/blog-backlog.ts)
fail() { echo "::error::$*"; echo "Not published: $*" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; exit 1; }
note() { echo "$*"; echo "- $*" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; }

git fetch -q origin master "$SHA"
git checkout -q -B master origin/master
git reset -q --hard origin/master
BASE=$(git merge-base origin/master "$SHA")

# 1. Every commit on the branch is one of the two standing jobs.
[ -n "$(git rev-list "$BASE..$SHA")" ] || fail "the branch has no commits that aren't on master already"
[ -z "$(git rev-list --min-parents=2 "$BASE..$SHA")" ] || fail "the branch has a merge commit"
DRIP_DATE="" WEEK="" AUTHOR=""
for c in $(git rev-list --reverse "$BASE..$SHA"); do
  subject=$(git log -1 --format=%s "$c")
  if [[ $subject =~ ^Publish\ 3\ posts\ dated\ ([0-9]{4}-[0-9]{2}-[0-9]{2})$ ]]; then
    [ -z "$DRIP_DATE" ] || [ "$DRIP_DATE" = "${BASH_REMATCH[1]}" ] || fail "two different drip dates on one branch"
    DRIP_DATE=${BASH_REMATCH[1]}
    AUTHOR=$(git log -1 --format='%an <%ae>' "$c")
  elif [[ $subject =~ ^Social\ week\ of\ ([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
    [ -z "$WEEK" ] || [ "$WEEK" = "${BASH_REMATCH[1]}" ] || fail "two different social weeks on one branch"
    WEEK=${BASH_REMATCH[1]}
  else
    fail "commit $c is not a standing job: $subject"
  fi
done

# 2. Only the files those jobs touch.
while read -r status path; do
  case "$path" in
    src/lib/blog.ts|src/lib/blog-backlog.ts) [ -n "$DRIP_DATE" ] || fail "$path changed without a drip commit" ;;
    "social/$WEEK.json") [ -n "$WEEK" ] && [ "$status" = A ] || fail "$path must be a new file from a social week commit" ;;
    *) fail "the branch touches $path, which isn't a standing job file" ;;
  esac
done < <(git diff --no-renames --name-status "$BASE" "$SHA")

PUBLISHED=0 SLUGS=()

# 3. Blog drip: redo it on master and require the branch's change to match line for line.
if [ -n "$DRIP_DATE" ]; then
  TODAY=$(TZ=America/New_York date +%F)
  YESTERDAY=$(TZ=America/New_York date -d yesterday +%F)
  [ "$DRIP_DATE" = "$TODAY" ] || [ "$DRIP_DATE" = "$YESTERDAY" ] || fail "drip date $DRIP_DATE is not today or yesterday"
  # No "git log | grep -q" here: with pipefail, grep quitting early kills git log and the check reads as false.
  if [ -n "$(git log origin/master -1 --format=%h --grep="^Publish 3 posts dated $DRIP_DATE\$")" ]; then
    note "Posts dated $DRIP_DATE are already on master, skipped."
  else
    changed_lines() { grep -E '^[+-]' | grep -vE '^(\+\+\+|---) ' || true; }
    WANT=$(git diff -U0 "$BASE" "$SHA" -- "${BLOG_FILES[@]}" | changed_lines)
    OUT=$(node scripts/publish-next-posts.mjs 3 "$DRIP_DATE")
    echo "$OUT"
    GOT=$(git diff -U0 -- "${BLOG_FILES[@]}" | changed_lines)
    [ -n "$GOT" ] || fail "the backlog is empty, nothing to publish"
    [ "$WANT" = "$GOT" ] || { diff <(echo "$WANT") <(echo "$GOT") || true; fail "the branch's blog change doesn't match what the drip script does on master"; }
    mapfile -t SLUGS < <(echo "$OUT" | sed -n 's#^  /blog/##p')
    git add "${BLOG_FILES[@]}"
    git -c user.name="Website Bot Publish" -c user.email="actions@users.noreply.github.com" \
      commit -q --author="$AUTHOR" -m "Publish 3 posts dated $DRIP_DATE"
    PUBLISHED=1
    note "Drip $DRIP_DATE matches: ${SLUGS[*]}"
  fi
fi

# 4. Social week: copy the one new file.
if [ -n "$WEEK" ]; then
  [ "$(date -d "$WEEK" +%u)" = 1 ] || fail "social week $WEEK is not a Monday"
  if git cat-file -e "origin/master:social/$WEEK.json" 2>/dev/null; then
    note "social/$WEEK.json is already on master, skipped."
  else
    git show "$SHA:social/$WEEK.json" > "social/$WEEK.json"
    node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "social/$WEEK.json" || fail "social/$WEEK.json is not valid JSON"
    git add "social/$WEEK.json"
    git -c user.name="Website Bot Publish" -c user.email="actions@users.noreply.github.com" \
      commit -q -m "Social week of $WEEK"
    PUBLISHED=1
    SOCIAL_NEW=1
    note "Social week $WEEK copied."
  fi
fi

delete_branch() {
  # Only if nobody pushed to it since this run started; a newer push gets its own run.
  if git push -q --force-with-lease="refs/heads/$BRANCH:$SHA" origin ":refs/heads/$BRANCH"; then
    note "Deleted $BRANCH."
  else
    note "Left $BRANCH in place (it moved or is already gone)."
  fi
}

if [ "$PUBLISHED" = 0 ]; then
  [ "$DRY_RUN" = 1 ] || delete_branch
  exit 0
fi

# 5. The site must build.
npm ci --no-audit --no-fund
npm run build

if [ "$DRY_RUN" = 1 ]; then
  note "Dry run: checks and build passed, nothing pushed."
  exit 0
fi

# 6. Publish (a push to master deploys on Vercel).
pushed=0
for i in 1 2 3 4; do
  { git pull -q --rebase origin master || { git rebase --abort; fail "master changed and the rebase conflicted"; }; } \
    && git push -q origin HEAD:master && { pushed=1; break; }
  sleep $((i * 5))
done
[ "$pushed" = 1 ] || fail "could not push to master"
note "Pushed $(git rev-parse --short HEAD) to master."
delete_branch

# A push made with the Actions token doesn't start other workflows, so start the social one by hand.
if [ "${SOCIAL_NEW:-0}" = 1 ]; then
  gh workflow run social.yml --ref master -f mode=sync
  note "Started Social posts (mode sync)."
fi

# 7. Wait for the posts to go live, then tell IndexNow.
if [ "${#SLUGS[@]}" -gt 0 ]; then
  live=0
  for i in $(seq 1 45); do
    live=0
    for s in "${SLUGS[@]}"; do
      page=$(curl -s --max-time 20 "https://evogencyglobal.com/blog/$s" || true)
      if [[ $page == *"dateTime=\"$DRIP_DATE\""* ]]; then live=$((live + 1)); fi
    done
    [ "$live" = "${#SLUGS[@]}" ] && break
    sleep 20
  done
  [ "$live" = "${#SLUGS[@]}" ] || fail "pushed, but only $live of ${#SLUGS[@]} posts were live after 15 minutes"
  note "All ${#SLUGS[@]} posts live with dateTime $DRIP_DATE."
  node scripts/indexnow.mjs "${SLUGS[@]/#//blog/}" /blog
  note "IndexNow sent."
fi
