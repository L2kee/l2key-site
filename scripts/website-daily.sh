#!/usr/bin/env bash
# The Website Bot's daily job without AI, run by .github/workflows/website-daily.yml.
#   1. Blog drip: publish the next 3 backlog posts dated today, build, check each rendered post
#      (200, today's date, no dashes, no review gating), push to master, wait until live, ping IndexNow.
#   2. Health check: every sitemap URL answers 200.
#   3. Social refill: today's remaining posts are booked.
# Any problem fails the run, and GitHub emails Moe. The Chief of Staff's brief reports those emails.
# The Friday social week file is still written by the Website Bot routine.
#
# Usage: website-daily.sh        (DRY_RUN=1 does everything except push and IndexNow)
set -euo pipefail
DRY_RUN=${DRY_RUN:-0}
TODAY=$(TZ=America/New_York date +%F)
BLOG_FILES=(src/lib/blog.ts src/lib/blog-backlog.ts)
PROBLEMS=()
note() { echo "$*"; echo "- $*" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; }
problem() { echo "::error::$*"; echo "- PROBLEM: $*" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; PROBLEMS+=("$*"); }

git config user.name "Website Daily"
git config user.email "actions@users.noreply.github.com"

# 1. Blog drip
if [ -n "$(git log origin/master -1 --format=%h --grep="^Publish 3 posts dated $TODAY\$")" ]; then
  note "Posts dated $TODAY are already on master, drip skipped."
else
  OUT=$(node scripts/publish-next-posts.mjs 3 "$TODAY")
  echo "$OUT"
  if [[ $OUT == Backlog\ empty* ]]; then
    problem "Blog backlog is finished, nothing left to publish"
  else
    mapfile -t SLUGS < <(echo "$OUT" | sed -n 's#^  /blog/##p')
    npm ci --no-audit --no-fund
    npm run build
    npx next start -p 3123 > /tmp/next.log 2>&1 &
    SERVER=$!
    for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:3123/ && break; sleep 1; done
    if node scripts/check-posts.mjs http://localhost:3123 "$TODAY" "${SLUGS[@]}"; then
      kill "$SERVER" || true
      git add "${BLOG_FILES[@]}"
      git commit -q -m "Publish 3 posts dated $TODAY"
      if [ "$DRY_RUN" = 1 ]; then
        note "Dry run: ${SLUGS[*]} built and passed every check, nothing pushed."
      else
        pushed=0
        for i in 1 2 3 4; do
          { git pull -q --rebase origin master || { git rebase --abort; problem "master changed and the rebase conflicted, posts not published"; break; }; } \
            && git push -q origin HEAD:master && { pushed=1; break; }
          sleep $((i * 5))
        done
        if [ "$pushed" = 1 ]; then
          note "Pushed $(git rev-parse --short HEAD): ${SLUGS[*]}"
          live=0
          for i in $(seq 1 45); do
            live=0
            for s in "${SLUGS[@]}"; do
              page=$(curl -s --max-time 20 "https://evogencyglobal.com/blog/$s" || true)
              [[ $page == *"dateTime=\"$TODAY\""* ]] && live=$((live + 1))
            done
            [ "$live" = "${#SLUGS[@]}" ] && break
            sleep 20
          done
          if [ "$live" = "${#SLUGS[@]}" ]; then
            note "All ${#SLUGS[@]} posts live with today's date."
            node scripts/indexnow.mjs "${SLUGS[@]/#//blog/}" /blog
          else
            problem "pushed, but only $live of ${#SLUGS[@]} posts were live after 15 minutes"
          fi
        elif [ ${#PROBLEMS[@]} -eq 0 ]; then
          problem "could not push to master"
        fi
      fi
    else
      kill "$SERVER" || true
      git checkout -- "${BLOG_FILES[@]}"
      problem "a new post failed its checks (see the PROBLEM lines above), nothing was published"
    fi
  fi
fi

# 2. Health check (read only)
node scripts/site-health.mjs || problem "health check found URLs that don't answer 200 (listed above)"

# 3. Social refill (read only)
node scripts/social-refill-check.mjs || problem "today's social posts aren't all booked (listed above)"

if [ ${#PROBLEMS[@]} -gt 0 ]; then
  echo "${#PROBLEMS[@]} problem(s):"; printf '  %s\n' "${PROBLEMS[@]}"
  exit 1
fi
note "Website daily: all good."
