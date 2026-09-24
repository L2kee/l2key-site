// Drip publish: moves the next N unpublished posts from blog-backlog.ts into
// the live blog by appending their slugs to PUBLISHED_BACKLOG_SLUGS in blog.ts,
// and stamps each one's `date` with the real publish day (the byline shows it).
//
// Usage: node scripts/publish-next-posts.mjs [count=3] [date=today, YYYY-MM-DD]
import fs from "node:fs";

const count = Number(process.argv[2] ?? 3);
const date = process.argv[3] ?? new Date().toLocaleDateString("en-CA");
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`bad date: ${date}`);

const BLOG = new URL("../src/lib/blog.ts", import.meta.url);
const BACKLOG = new URL("../src/lib/blog-backlog.ts", import.meta.url);

const read = (f) => {
  const raw = fs.readFileSync(f, "utf8");
  return { crlf: raw.includes("\r\n"), text: raw.replace(/\r\n/g, "\n") };
};
const write = (f, { crlf, text }) =>
  fs.writeFileSync(f, crlf ? text.replace(/\n/g, "\r\n") : text);

const blog = read(BLOG);
const backlog = read(BACKLOG);

const listMatch = blog.text.match(/const PUBLISHED_BACKLOG_SLUGS = \[\n([\s\S]*?)\];/);
if (!listMatch) throw new Error("PUBLISHED_BACKLOG_SLUGS not found in blog.ts");
const published = [...listMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const allSlugs = [...backlog.text.matchAll(/^ {4}slug: "([^"]+)",$/gm)].map((m) => m[1]);
const next = allSlugs.filter((s) => !published.includes(s)).slice(0, count);
if (next.length === 0) {
  console.log("Backlog empty: nothing left to publish.");
  process.exit(0);
}

for (const slug of next) {
  const start = backlog.text.indexOf(`    slug: "${slug}",\n`);
  const end = backlog.text.indexOf("\n  },", start);
  const entry = backlog.text.slice(start, end);
  const dated = entry.replace(/^ {4}date: "[^"]*",$/m, `    date: "${date}",`);
  if (dated === entry && !entry.includes(`date: "${date}"`)) throw new Error(`no date field in ${slug}`);
  backlog.text = backlog.text.slice(0, start) + dated + backlog.text.slice(end);
}

const newList = [...published, ...next].map((s) => `  "${s}",`).join("\n");
blog.text = blog.text.replace(listMatch[0], `const PUBLISHED_BACKLOG_SLUGS = [\n${newList}\n];`);

write(BACKLOG, backlog);
write(BLOG, blog);
console.log(`Published ${next.length} (dated ${date}), ${allSlugs.length - published.length - next.length} left:`);
for (const s of next) console.log(`  /blog/${s}`);
