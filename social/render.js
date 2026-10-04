// Renders each post's 6 carousel slides into public/social/<date>/slide-N.png.
// Usage: node social/render.js social/<week>.json   (needs the playwright package and Chromium)
// Slides that already exist are skipped, so reruns are cheap.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const week = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'public/evogency-logo-512.png')).toString('base64');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const css = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;background:#000;color:#f3ede0;font-family:'Geist',system-ui,sans-serif}
.s{position:relative;width:1080px;height:1350px;padding:110px 96px;display:flex;flex-direction:column;overflow:hidden;
 background:radial-gradient(900px 700px at 85% 8%,rgba(240,193,75,.16),transparent 60%),radial-gradient(700px 600px at 0% 100%,rgba(201,146,44,.10),transparent 60%),#000}
.top{position:absolute;top:56px;left:96px;right:96px;display:flex;align-items:center;justify-content:space-between;font-size:26px;letter-spacing:.32em;color:#c9b98f}
.brand{display:flex;align-items:center;gap:16px;font-weight:600}
.brand img{width:46px;height:46px}
.count{letter-spacing:.1em;font-variant-numeric:tabular-nums}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center}
.kicker{font-size:28px;letter-spacing:.28em;color:#f0c14b;font-weight:600;margin-bottom:40px;text-transform:uppercase}
.hook{font-size:96px;line-height:1.05;font-weight:700;letter-spacing:-.025em}
.bar{width:140px;height:8px;background:#f0c14b;border-radius:4px;margin-top:56px}
.body{font-size:62px;line-height:1.2;font-weight:600;letter-spacing:-.015em}
.src{margin-top:44px;font-size:28px;color:#9c917a;letter-spacing:.04em}
.num{font-size:260px;line-height:.9;font-weight:800;color:#f0c14b;letter-spacing:-.04em;margin-bottom:36px}
.foot{position:absolute;bottom:64px;left:96px;right:96px;display:flex;justify-content:space-between;font-size:28px;color:#9c917a}
.swipe{color:#f0c14b;font-weight:600}
.take{font-size:70px;line-height:1.12;font-weight:700;letter-spacing:-.02em}
.cta{margin-top:84px;padding:48px 52px;border:2px solid rgba(240,193,75,.55);border-radius:28px;background:rgba(240,193,75,.07)}
.cta .q{font-size:36px;color:#c9b98f}
.cta .a{font-size:52px;font-weight:700;margin-top:12px}
.cta .u{font-size:44px;font-weight:700;color:#f0c14b;margin-top:18px}
.biglogo{position:absolute;right:-60px;bottom:-40px;width:520px;opacity:.13}
`;

function slide(p, i, total, inner, foot) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&display=block" rel="stylesheet">
<style>${css}</style></head><body><div class="s">
<div class="top"><div class="brand"><img src="${logo}">EVOGENCY</div><div class="count">${i}/${total}</div></div>
${inner}${foot ? `<div class="foot">${foot}</div>` : ''}</div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const p of week.posts) {
    const dir = path.join(ROOT, 'public/social', p.date);
    if ([1, 2, 3, 4, 5, 6].every(k => fs.existsSync(path.join(dir, `slide-${k}.png`)))) continue;
    fs.mkdirSync(dir, { recursive: true });
    const total = 6;
    const slides = [
      slide(p, 1, total, `<div class="mid"><div class="kicker">${esc(p.topic)}</div><div class="hook">${esc(p.hook)}</div><div class="bar"></div></div>`,
        `<span>3 free fixes inside</span><span class="swipe">Swipe →</span>`),
      slide(p, 2, total, `<div class="mid"><div class="kicker">Why it matters</div><div class="body">${esc(p.why)}</div>${p.src ? `<div class="src">Source · ${esc(p.src)}</div>` : ''}</div>`,
        `<span></span><span class="swipe">Swipe →</span>`),
      ...p.steps.map((s, k) => slide(p, k + 3, total,
        `<div class="mid"><div class="kicker">Do this today</div><div class="num">${k + 1}</div><div class="body">${esc(s)}</div></div>`,
        `<span></span><span class="swipe">${k < 2 ? 'Swipe →' : ''}</span>`)),
      slide(p, 6, total, `<img class="biglogo" src="${logo}"><div class="mid"><div class="take">${esc(p.take)}</div>
<div class="cta"><div class="q">Want a second set of eyes?</div><div class="a">Get a free audit</div><div class="u">evogencyglobal.com/contact</div></div></div>`, ''),
    ];
    for (let k = 0; k < slides.length; k++) {
      await page.setContent(slides[k], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(dir, `slide-${k + 1}.png`) });
    }
    console.log('rendered', p.date);
  }
  await browser.close();
})();
