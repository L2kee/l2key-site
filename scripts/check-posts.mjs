// Checks freshly published blog posts the way the Website Bot did by eye.
// For each slug: HTTP 200, the byline dateTime is the given date, no dashes in the article text
// (em, en, or hyphenated words; phone numbers are fine), and no review gating instructions.
//
// Usage: node scripts/check-posts.mjs <base url> <YYYY-MM-DD> <slug> [slug...]
// Exit 0 when every post passes, 1 with one line per problem otherwise.
const [base, date, ...slugs] = process.argv.slice(2);
if (!base || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || slugs.length === 0) {
  console.error("usage: check-posts.mjs <base url> <YYYY-MM-DD> <slug> [slug...]");
  process.exit(2);
}

const decode = (s) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
   .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

// The article runs from the title (h1) to the page footer, which is what a reader sees.
function articleText(html) {
  const i = html.indexOf("<h1");
  const j = html.indexOf("<footer", i);
  if (i < 0 || j < 0) return null;
  return decode(html.slice(i, j).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function dashProblems(text) {
  const hits = [];
  for (const m of text.matchAll(/.{0,20}(?:[‒–—―−]|\p{L}-\p{L}).{0,20}/gu)) hits.push(m[0].trim());
  return hits;
}

// Review gating = telling a business to ask only happy customers. Warnings against it are fine.
function gatingProblems(text) {
  const hits = [];
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (/\b(don'?t|do not|never|avoid|against|violat|ban|illegal|not allowed)\b/i.test(sentence)) continue;
    if (/\b(only|just)\b[^.!?]{0,40}\b(ask|invite|request|send|text|email)\b[^.!?]{0,40}\b(happy|satisfied|positive|loyal)\b/i.test(sentence) ||
        /\b(ask|invite|request|send)\b[^.!?]{0,30}\bonly\b[^.!?]{0,30}\b(happy|satisfied|positive)\b/i.test(sentence) ||
        /\b(filter|screen)\b[^.!?]{0,40}\b(unhappy|negative|bad)\b[^.!?]{0,40}\breview/i.test(sentence)) {
      hits.push(sentence.slice(0, 160));
    }
  }
  return hits;
}

{
  const problems = [];
  for (const slug of slugs) {
    const url = `${base.replace(/\/$/, "")}/blog/${slug}`;
    let res, html;
    try {
      res = await fetch(url, { redirect: "manual" });
      html = await res.text();
    } catch (e) {
      problems.push(`${slug}: fetch failed (${e.message})`);
      continue;
    }
    if (res.status !== 200) { problems.push(`${slug}: HTTP ${res.status}`); continue; }
    if (!html.includes(`dateTime="${date}"`)) problems.push(`${slug}: byline date is not ${date}`);
    const text = articleText(html);
    if (!text) { problems.push(`${slug}: could not find the article text (h1 to footer)`); continue; }
    for (const d of dashProblems(text)) problems.push(`${slug}: dash in "${d}"`);
    for (const g of gatingProblems(text)) problems.push(`${slug}: possible review gating in "${g}"`);
    console.log(`checked ${slug}: ${text.length} characters`);
  }
  if (problems.length) {
    for (const p of problems) console.log(`PROBLEM ${p}`);
    process.exit(1);
  }
  console.log(`All ${slugs.length} posts pass.`);
}
