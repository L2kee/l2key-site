// IndexNow: tells Bing (and other IndexNow engines; Google doesn't use it)
// that URLs were added or changed, instead of waiting for a recrawl. Bing's
// index feeds ChatGPT search and Copilot, so this is the fast lane there.
// The key is public by design: it's served at /<key>.txt to prove ownership.
//
// Usage:
//   node scripts/indexnow.mjs --all                 every URL in the live sitemap
//   node scripts/indexnow.mjs /blog/a /blog/b ...   specific paths
const HOST = "evogencyglobal.com";
const KEY = "bd351ae6223e1d6a68347be86c983a17";

const args = process.argv.slice(2);
let urls;
if (args[0] === "--all") {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else {
  urls = args.map((p) => (p.startsWith("http") ? p : `https://${HOST}${p.startsWith("/") ? p : "/" + p}`));
}
if (urls.length === 0) throw new Error("No URLs given");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted and key validation pending (normal on first use).
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status >= 300) {
  console.error(await res.text());
  process.exit(1);
}
