// Renders each post's 6 carousel slides into public/social/<post id>/slide-N.png.
// Usage: node social/render.js social/<week>.json   (needs the playwright package and Chromium)
// Slides that already exist are skipped, so reruns are cheap. Posts dated before today are skipped too, so media
// removed by the weekly cleanup (schedule.py cleanup) is never rendered again.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { ROOT, logo, esc, font, css, ending, slotOf, themeOf } = require('./style');
const week = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

function slide(p, i, total, inner, foot) {
  return `<!doctype html><html><head><meta charset="utf-8">
${font}
<style>${css}.s{background:var(--bg)}</style></head><body class="t-${themeOf(p, slotOf(week, p))}"><div class="s">
<div class="top"><div class="brand"><img src="${logo}">EVOGENCY</div><div class="count">${i}/${total}</div></div>
${inner}${foot ? `<div class="foot">${foot}</div>` : ''}</div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  for (const p of week.posts) {
    if (p.date < today) continue;
    // One folder per post id, so a rewritten post never reuses (or gets served from cache as) old slides.
    const dir = path.join(ROOT, 'public/social', p.id || p.date);
    if ([1, 2, 3, 4, 5, 6].every(k => fs.existsSync(path.join(dir, `slide-${k}.png`)))) continue;
    fs.mkdirSync(dir, { recursive: true });
    const total = 6;
    const promo = p.kind === 'promo';
    const slides = [
      slide(p, 1, total, `<div class="mid"><div class="kicker">${esc(p.topic)}</div><div class="hook">${esc(p.hook)}</div><div class="bar"></div></div>`,
        `<span>${promo ? '3 things we check' : 'Save this for later'}</span><span class="swipe">Swipe →</span>`),
      slide(p, 2, total, `<div class="mid"><div class="kicker">Why it matters</div><div class="body">${esc(p.why)}</div>${p.src ? `<div class="src">Source · ${esc(p.src)}</div>` : ''}</div>`,
        `<span></span><span class="swipe">Swipe →</span>`),
      ...p.steps.map((s, k) => slide(p, k + 3, total,
        `<div class="mid"><div class="kicker">${promo ? 'What we check' : 'Do this today'}</div><div class="num">${k + 1}</div><div class="body">${esc(s)}</div></div>`,
        `<span></span><span class="swipe">${k < 2 ? 'Swipe →' : ''}</span>`)),
      slide(p, 6, total, `<img class="biglogo" src="${logo}"><div class="mid"><div class="take">${esc(p.take)}</div><div class="cta">${ending(promo)}</div></div>`, ''),
    ];
    for (let k = 0; k < slides.length; k++) {
      await page.setContent(slides[k], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(dir, `slide-${k + 1}.png`) });
    }
    console.log('rendered', p.id || p.date);
  }
  await browser.close();
})();
