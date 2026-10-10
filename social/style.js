// Shared look for the carousel slides (render.js) and the reels (reel.js).
// Every post gets one of 7 looks, rotating in schedule order, so no post looks like the one before or after it,
// and with 7 looks the posts above and below it in a 3 (phone) or 6 (desktop) column grid never match either.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'public/evogency-logo-512.png')).toString('base64');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const font = '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&family=Geist+Mono:wght@500&family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">';

const FIRST_DAY = Date.UTC(2026, 9, 5); // the first week of posts; every rotation counts from here
// The post's place in the schedule: 3 posts a day, slot 0, 1, 2 by time.
const rotation = (p, slot) => Math.round((Date.parse(p.date) - FIRST_DAY) / 864e5) * 3 + slot;
const slotOf = (week, p) => week.posts.filter(q => q.date === p.date)
  .map(q => q.time || week.time || '').sort().indexOf(p.time || week.time || '');

const THEMES = ['noir', 'gold', 'teal', 'cream', 'editorial', 'blueprint', 'spotlight'];
const themeOf = (p, slot) => THEMES.includes(p.look) ? p.look : THEMES[((rotation(p, slot) % 7) + 7) % 7];

const css = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#000;font-family:'Geist',system-ui,sans-serif}
body{--fg:#f3ede0;--accent:#f0c14b;--muted:#9c917a;--top:#c9b98f;--line:rgba(240,193,75,.55);--card:rgba(240,193,75,.07);
 --bg:radial-gradient(900px 700px at 85% 8%,rgba(240,193,75,.16),transparent 60%),radial-gradient(700px 600px at 0% 100%,rgba(201,146,44,.10),transparent 60%),#000;color:var(--fg)}
.s{position:relative;width:1080px;height:1350px;padding:110px 96px;display:flex;flex-direction:column;overflow:hidden}
.top{position:absolute;top:56px;left:96px;right:96px;display:flex;align-items:center;justify-content:space-between;font-size:26px;letter-spacing:.32em;color:var(--top)}
.brand{display:flex;align-items:center;gap:16px;font-weight:600}
.brand img{width:46px;height:46px}
.count{letter-spacing:.1em;font-variant-numeric:tabular-nums}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center}
.kicker{font-size:28px;letter-spacing:.28em;color:var(--accent);font-weight:600;margin-bottom:40px;text-transform:uppercase}
.hook{font-size:96px;line-height:1.05;font-weight:700;letter-spacing:-.025em}
.bar{width:140px;height:8px;background:var(--accent);border-radius:4px;margin-top:56px}
.body{font-size:62px;line-height:1.2;font-weight:600;letter-spacing:-.015em}
.src{margin-top:44px;font-size:28px;color:var(--muted);letter-spacing:.04em}
.num{font-size:260px;line-height:.9;font-weight:800;color:var(--accent);letter-spacing:-.04em;margin-bottom:36px}
.foot{position:absolute;bottom:64px;left:96px;right:96px;display:flex;justify-content:space-between;font-size:28px;color:var(--muted)}
.swipe{color:var(--accent);font-weight:600}
.take{font-size:70px;line-height:1.12;font-weight:700;letter-spacing:-.02em}
.cta{position:relative;margin-top:84px;padding:48px 52px;border:2px solid var(--line);border-radius:28px;background:var(--card)}
.cta .q{font-size:36px;color:var(--top)}
.cta .a{font-size:52px;font-weight:700;margin-top:12px}
.cta .u{font-size:44px;font-weight:700;color:var(--accent);margin-top:18px}
.biglogo{position:absolute;right:-60px;bottom:-40px;width:520px;opacity:.13}

/* Gold: a solid gold tile with black type. The loudest look in the grid. */
.t-gold{--fg:#140f04;--accent:#140f04;--muted:rgba(20,15,4,.62);--top:rgba(20,15,4,.75);--line:rgba(20,15,4,.5);--card:rgba(255,255,255,.18);
 --bg:radial-gradient(800px 600px at 80% 0%,#ffe9a8,transparent 60%),linear-gradient(155deg,#f6d27a,#f0c14b 45%,#c9922c)}
.t-gold .brand img,.t-gold .biglogo{filter:brightness(0)}
.t-gold .biglogo{opacity:.1}

/* Teal: deep teal night, everything centered. */
.t-teal{--accent:#3fc8d8;--top:#9fd9df;--muted:#7fa9ad;--line:rgba(63,200,216,.55);--card:rgba(63,200,216,.08);
 --bg:radial-gradient(900px 800px at 15% 100%,rgba(63,200,216,.28),transparent 60%),radial-gradient(700px 500px at 90% 0%,rgba(240,193,75,.10),transparent 60%),linear-gradient(#04181b,#020a0c)}
.t-teal .mid{align-items:center;text-align:center}

/* Cream: a light tile with ink type, breaks up the dark grid. */
.t-cream{--fg:#16120a;--accent:#a97412;--muted:#7a6f5c;--top:#6b5f49;--line:rgba(169,116,18,.5);--card:rgba(169,116,18,.07);
 --bg:radial-gradient(1100px 900px at 85% 8%,rgba(240,193,75,.22),transparent 65%),#f4eee1}
.t-cream .biglogo{opacity:.2}

/* Editorial: black with a thin gold frame and big serif headlines, like a magazine cover. */
.t-editorial{--bg:radial-gradient(800px 600px at 50% 0%,rgba(240,193,75,.10),transparent 60%),#050403}
.t-editorial .s::before{content:"";position:absolute;inset:30px;border:2px solid rgba(240,193,75,.45);border-radius:6px;pointer-events:none}
.t-editorial .hook{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:124px;line-height:.98;letter-spacing:-.01em}
.t-editorial .take{font-family:'Instrument Serif',serif;font-weight:400;font-size:92px;line-height:1.02;letter-spacing:0}
.t-editorial .num{font-family:'Instrument Serif',serif;font-weight:400;font-style:italic}

/* Blueprint: navy with a faint grid and mono labels, the engineering look. */
.t-blueprint{--accent:#3fc8d8;--top:#8fb4c9;--muted:#7d97ab;--line:rgba(63,200,216,.5);--card:rgba(63,200,216,.06);
 --bg:linear-gradient(rgba(63,200,216,.07) 2px,transparent 2px) 0 0/90px 90px,linear-gradient(90deg,rgba(63,200,216,.07) 2px,transparent 2px) 0 0/90px 90px,radial-gradient(900px 700px at 85% 10%,rgba(63,200,216,.16),transparent 60%),#07101d}
.t-blueprint .kicker,.t-blueprint .count,.t-blueprint .src{font-family:'Geist Mono',monospace;letter-spacing:.14em}
.t-blueprint .bar{width:220px;height:6px;border-radius:0}

/* Spotlight: one beam of gold light from the top, the lotus large behind, gold headline, centered. */
.t-spotlight{--bg:radial-gradient(520px 900px at 50% -10%,rgba(240,193,75,.32),transparent 70%),#000}
.t-spotlight .mid{align-items:center;text-align:center}
.t-spotlight .hook,.t-spotlight .take{color:#f6cf6a}
.t-spotlight .biglogo{right:auto;left:50%;bottom:auto;top:50%;width:880px;margin:-440px 0 0 -440px;opacity:.07}
`;

// Value posts end with a follow ask; only the weekly promo post carries the free audit.
const ending = promo => promo
  ? `<div class="q">Want a second set of eyes?</div><div class="a">Get a free audit</div><div class="u">evogencyglobal.com/contact</div>`
  : `<div class="q">Want one of these every day?</div><div class="a">Follow EVOGENCY</div><div class="u">Save this so you have it later</div>`;

module.exports = { ROOT, logo, esc, font, css, ending, rotation, slotOf, themeOf, THEMES };
