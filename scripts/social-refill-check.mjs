// Checks that today's remaining social posts are booked. Every post in social/<week>.json due later today
// (New York time) must have at least one entry in social/state/<week>.json, keyed "<date> <time>|<channel>".
// Posts for tomorrow are normal to be missing, the 11:17 PM sync books them.
// Usage: node scripts/social-refill-check.mjs     Exit 0 when booked, 1 with the unbooked posts listed.
import fs from "node:fs";

const now = new Date();
const ny = Object.fromEntries(
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(now).map((p) => [p.type, p.value]),
);
const today = `${ny.year}-${ny.month}-${ny.day}`;
const nowHm = `${ny.hour}:${ny.minute}`;

const weeks = fs.readdirSync("social").filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
const missing = [];
let due = 0;
for (const f of weeks) {
  const week = JSON.parse(fs.readFileSync(`social/${f}`, "utf8"));
  const todays = (week.posts ?? []).filter((p) => p.date === today && p.time > nowHm);
  if (todays.length === 0) continue;
  const stateFile = `social/state/${f}`;
  const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : {};
  const keys = Object.keys(state);
  for (const p of todays) {
    due++;
    if (!keys.some((k) => k.startsWith(`${p.date} ${p.time}|`))) missing.push(`${p.date} ${p.time} (${p.id})`);
  }
}
console.log(`Social refill: ${due - missing.length} of ${due} posts left today are booked.`);
for (const m of missing) console.log(`PROBLEM social post not booked for ${m}, run Social posts (mode sync) in the Actions tab`);
process.exit(missing.length ? 1 : 0);
