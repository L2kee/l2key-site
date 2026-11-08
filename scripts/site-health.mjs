// Read only health check of the live site: every URL in the sitemap plus a few files the pages load.
// Usage: node scripts/site-health.mjs     Exit 0 when everything answers 200, 1 with the failures listed.
const HOST = "https://evogencyglobal.com";
const EXTRA = ["/hero-lotus.mp4"];

const xml = await (await fetch(`${HOST}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) {
  console.log("PROBLEM sitemap.xml has no URLs");
  process.exit(1);
}
const all = [...urls, ...EXTRA.map((p) => HOST + p)];

const bad = [];
let next = 0;
async function worker() {
  while (next < all.length) {
    const url = all[next++];
    let status = 0;
    for (let attempt = 0; attempt < 2 && status !== 200; attempt++) {
      try {
        const res = await fetch(url, { method: url.endsWith(".mp4") ? "HEAD" : "GET", redirect: "manual" });
        status = res.status;
        await res.arrayBuffer().catch(() => {});
      } catch {
        status = 0;
      }
    }
    if (status !== 200) bad.push(`${url} answered ${status || "no response"}`);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Health check: ${all.length - bad.length} of ${all.length} URLs answered 200.`);
for (const b of bad) console.log(`PROBLEM ${b}`);
process.exit(bad.length ? 1 : 0);
