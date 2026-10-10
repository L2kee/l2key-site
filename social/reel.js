// Renders each post as an Instagram Reel with motion: public/social/<post id>/reel.mp4 plus cover.jpg.
// Usage: node social/reel.js social/<week>.json [more week files] [--budget <minutes>] [--only <post id>]
// Needs the playwright package, Chromium, and ffmpeg (or FFMPEG=<path>). Reels that already exist are skipped.
//
// Same 6 slides as the carousel (render.js), played in order with motion from the EVOGENCY Motion Catalog.
// Every part of a post (hook, why, step numbers, step text, closing card, slide change, background) has its
// own list of motions, and the post's place in the schedule picks one from each list, so consecutive posts
// rotate through the whole catalog. A week file can force a pick with "motion": {"hook": "type", ...}.
//
// The video is 1080x1920 (9:16 for the Reels tab) with the 4:5 design band in the middle, so the feed's
// 4:5 crop and the grid's 3:4 crop both show the full design.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, logo, esc, font, css, ending, rotation, themeOf } = require('./style');

const FPS = 30;
const MOTIONS = {
  hook: ['rise', 'words', 'type', 'mark', 'wipe', 'letters', 'decode', 'curtain'],
  why: ['lightup', 'rise', 'mark', 'wipe'],
  num: ['odometer', 'stamp', 'spring', 'pop'],
  step: ['words', 'lightup', 'rise'],
  cta: ['trace', 'shine', 'orbit', 'pulse', 'nudge'],
  change: ['fade', 'slide', 'up', 'blur', 'zoom'],
  scene: ['aurora', 'particles', 'glow'],
};

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1]; };
const budget = +(flag('--budget') || 0) * 60000;
const only = flag('--only');

// Words become spans (and each letter its own span) so every word and letter can move on its own.
const wordsHtml = text => text.split(/\s+/).filter(Boolean)
  .map(w => `<span class="w">${[...w].map(c => `<span class="l">${esc(c)}</span>`).join('')}</span>`).join(' ');

function plan(post, slot) {
  // Offset by 3 from the look rotation (style.js), so a look doesn't always come with the same motions.
  const n = rotation(post, slot) + 3;
  const pick = {};
  for (const [part, list] of Object.entries(MOTIONS)) {
    const forced = post.motion && post.motion[part];
    pick[part] = list.includes(forced) ? forced : list[((n % list.length) + list.length) % list.length];
  }
  return pick;
}

function page(p, pick, look) {
  const promo = p.kind === 'promo';
  const wc = s => s.split(/\s+/).filter(Boolean).length;
  // Seconds on screen: the change in, the entrance, then reading time at a relaxed pace.
  const read = w => 1 + w * 0.26;
  // The typewriter takes longer to land than the other hooks, so its slide stays up longer.
  const typing = pick.hook === 'type' ? Math.max(0, p.hook.length * 0.045 - 1) : 0;
  const dur = [
    0.6 + 1.6 + typing + Math.max(1.6, wc(p.hook) * 0.2),
    0.6 + 1.2 + read(wc(p.why)),
    ...p.steps.map(s => 0.6 + 1.2 + read(wc(s))),
    0.6 + 1.4 + read(wc(p.take)) + 2.4,
  ];
  const slides = [
    `<div class="mid"><div class="kicker">${esc(p.topic)}</div><div class="hook">${wordsHtml(p.hook)}</div><div class="bar"></div></div>
     <div class="foot"><span>${promo ? '3 things we check' : 'Save this for later'}</span><span></span></div>`,
    `<div class="mid"><div class="kicker">Why it matters</div><div class="body why">${wordsHtml(p.why)}</div>${p.src ? `<div class="src">Source · ${esc(p.src)}</div>` : ''}</div>`,
    ...p.steps.map((s, k) => `<div class="mid"><div class="kicker">${promo ? 'What we check' : 'Do this today'}</div>
      <div class="num"><span class="roll">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, k + 1].map(d => `<b>${d}</b>`).join('')}</span></div>
      <div class="body step">${wordsHtml(s)}</div></div>`),
    `<img class="biglogo" src="${logo}"><div class="mid"><div class="take">${wordsHtml(p.take)}</div>
      <div class="cta"><div class="orb"></div><div class="clip"><div class="sh"></div></div>
      <svg class="trace"><rect x="1.5" y="1.5" rx="27" ry="27" pathLength="1"/></svg>${ending(promo)}</div></div>`,
  ];
  return { dur, typing, html: `<!doctype html><html><head><meta charset="utf-8">${font}<style>${css}
html,body{width:1080px;height:1920px;overflow:hidden}
#stage{position:relative;width:1080px;height:1920px;background:var(--bg);overflow:hidden}
#scene{position:absolute;inset:0}
#scene i{position:absolute;border-radius:50%;filter:blur(110px)}
#scene canvas{position:absolute;inset:0}
.band{position:absolute;left:0;top:285px;width:1080px;height:1350px}
.band>.top{z-index:3}
.prog{position:absolute;top:118px;left:96px;right:96px;height:4px;border-radius:2px;background:color-mix(in srgb,var(--fg) 10%,transparent);z-index:3}
.prog i{position:absolute;inset:0;background:linear-gradient(90deg,var(--accent),#3fc8d8);transform-origin:left;transform:scaleX(0);border-radius:2px}
.s{position:absolute;inset:0;background:none;padding-top:150px}
.w{display:inline-block;white-space:nowrap}
.l{display:inline-block;white-space:pre}
.hook .w,.body .w,.take .w{--hl:color-mix(in srgb,var(--accent) 42%,transparent);background:linear-gradient(var(--hl),var(--hl)) no-repeat 0 88%/0% 38%}
.num{height:234px;overflow:hidden}
.roll{display:block}
.roll b{display:block;height:234px}
.cta .orb{position:absolute;inset:-2px;border-radius:28px;padding:3px;opacity:0;
 -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.cta .clip{position:absolute;inset:0;border-radius:26px;overflow:hidden;pointer-events:none}
.cta .sh{position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(100deg,transparent,rgba(255,248,225,.55),transparent);transform:translateX(-120%)}
.cta .trace{position:absolute;inset:-2px;width:calc(100% + 4px);height:calc(100% + 4px);overflow:visible;filter:drop-shadow(0 0 6px rgba(240,193,75,.7))}
.cta .trace rect{width:calc(100% - 3px);height:calc(100% - 3px);fill:none;stroke:var(--accent);stroke-width:3;stroke-dasharray:1;stroke-dashoffset:1;opacity:0}
.caret::after{content:"";position:absolute;width:6px;height:.9em;margin-left:6px;margin-top:.1em;background:var(--accent)}
.l{position:relative}
.curtain{position:absolute;left:96px;right:96px;top:40%;height:20%;background:var(--accent);transform:scaleX(0);z-index:2}
</style></head><body class="t-${look}"><div id="stage"><div id="scene"></div><div class="band">
<div class="top"><div class="brand"><img src="${logo}">EVOGENCY</div><div class="count">1/6</div></div>
<div class="prog"><i></i></div>
${slides.map((s, i) => `<div class="s" id="s${i}">${s}</div>`).join('')}
</div></div></body></html>` };
}

// Runs inside the page. Draws the frame at time t (seconds) from scratch, so any frame can be rendered in any
// order and the output never depends on how fast the machine is.
function setup({ dur, typing, pick, seed }) {
  const clamp = v => Math.max(0, Math.min(1, v));
  const P = (t, a, d) => clamp((t - a) / d);
  const out = x => 1 - Math.pow(1 - x, 3);
  const inout = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const back = x => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const rnd = s => { s = (s + 0x6d2b79f5) | 0; let x = Math.imul(s ^ (s >>> 15), 1 | s); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  const TR = 0.6;
  const starts = dur.reduce((a, d) => (a.push(a[a.length - 1] + d), a), [0]);
  const total = starts.pop();
  const slides = [...document.querySelectorAll('.s')];
  const count = document.querySelector('.count');
  const prog = document.querySelector('.prog i');
  const $ = (s, sel) => [...s.querySelectorAll(sel)];

  // Background scene
  const scene = document.getElementById('scene');
  let draw = () => {};
  if (pick.scene === 'aurora' || pick.scene === 'glow') {
    const blobs = (pick.scene === 'aurora'
      ? [['#f0c14b', 700, .30], ['#3fc8d8', 640, .22], ['#c9922c', 520, .22]]
      : [['#f0c14b', 900, .16], ['#c9922c', 760, .12]]).map(([c, s, o]) => {
      const i = document.createElement('i');
      Object.assign(i.style, { background: c, width: s + 'px', height: s + 'px', opacity: o });
      scene.appendChild(i); return i;
    });
    draw = t => blobs.forEach((b, k) => {
      const a = t * (pick.scene === 'aurora' ? 0.2 : 0.14) + k * 2.1;
      b.style.left = (540 + Math.cos(a) * 340 - b.offsetWidth / 2) + 'px';
      b.style.top = (960 + Math.sin(a * 1.3) * (pick.scene === 'aurora' ? 620 : 420) - b.offsetHeight / 2) + 'px';
      b.style.transform = `scale(${1 + 0.15 * Math.sin(a * 0.7)})`;
    });
  } else {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; scene.appendChild(c);
    const ctx = c.getContext('2d');
    const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    const pts = Array.from({ length: 90 }, (_, k) => ({ x: rnd(seed + k) * 1080, y: rnd(seed + k + 999) * 1920,
      vx: (rnd(seed + k + 1999) - .5) * 24, vy: -8 - rnd(seed + k + 2999) * 22, r: 1.5 + rnd(seed + k + 3999) * 2.5, g: rnd(seed + k + 4999) < .65 }));
    draw = t => {
      ctx.clearRect(0, 0, 1080, 1920);
      for (const p of pts) {
        const x = ((p.x + p.vx * t) % 1080 + 1080) % 1080, y = ((p.y + p.vy * t) % 1920 + 1920) % 1920;
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 1.5 + p.x);
        ctx.fillStyle = p.g ? accent : '#3fc8d8';
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, 7); ctx.fill();
      }
    };
  }

  // Entrances. Each takes the element and the time since its slide started, and sets the frame.
  const words = el => $(el, '.w');
  const letters = el => $(el, '.l');
  const reset = el => { el.style.cssText = ''; };
  const textIn = {
    rise(el, t, a = 0.7) { words(el).forEach((w, i) => { const x = out(P(t, a + i * 0.06, 0.7)); w.style.opacity = x; w.style.transform = `translateY(${(1 - x) * 30}px)`; w.style.filter = `blur(${(1 - x) * 12}px)`; }); },
    words(el, t, a = 0.7) { words(el).forEach((w, i) => { const x = out(P(t, a + i * 0.11, 0.5)); w.style.opacity = x; w.style.transform = `translateY(${(1 - x) * 60}%) rotate(${(1 - x) * 4}deg)`; }); },
    wipe(el, t, a = 0.7) { const x = inout(P(t, a, 1.1)); el.style.clipPath = `inset(-10% ${(1 - x) * 100}% -10% 0)`; },
    type(el, t, a = 0.7) {
      const ls = letters(el), n = Math.floor(Math.max(0, t - a) / 0.045);
      ls.forEach((l, i) => { l.style.opacity = i < n ? 1 : 0; l.classList.toggle('caret', i === Math.min(n, ls.length) - 1 && (n < ls.length || Math.floor(t * 2) % 2 === 0)); });
    },
    letters(el, t, a = 0.7) { letters(el).forEach((l, i) => { const x = P(t, a + i * 0.025, 0.6); l.style.opacity = clamp(x * 3); l.style.transform = `translateY(${(1 - back(x)) * -80}px) scale(${0.6 + 0.4 * back(x)})`; }); },
    decode(el, t, a = 0.7) {
      // Scrambled letters keep the original's case so the line width barely moves while it decodes.
      const pool = c => /[a-z]/.test(c) ? 'abcdefghkmnopqrsuvwxyz' : /[A-Z]/.test(c) ? 'ABCDEFGHKMNOPQRSUVXYZ' : /[0-9]/.test(c) ? '0123456789' : c;
      letters(el).forEach((l, i) => {
        l.dataset.c = l.dataset.c || l.textContent;
        const lock = a + 0.15 + i * 0.03;
        l.style.opacity = t < a ? 0 : 1;
        const chars = pool(l.dataset.c);
        l.textContent = t >= lock ? l.dataset.c : chars[Math.floor(rnd(seed + i * 131 + Math.floor(t * 20)) * chars.length)];
        l.style.color = t >= lock ? '' : 'var(--accent)';
      });
    },
    lightup(el, t, a = 0.7, span = 3) { const ws = words(el); ws.forEach((w, i) => { const x = clamp((t - a) / span * ws.length - i); w.style.opacity = 0.18 + 0.82 * x; }); },
    mark(el, t, a = 0.7) {
      textIn.rise(el, t, a);
      const ws = words(el), text = ws.map(w => w.textContent);
      let from = text.findLastIndex((w, i) => i < ws.length - 1 && /,$/.test(w)) + 1;
      if (from === 0 || ws.length - from > 6) from = Math.max(0, ws.length - 3);
      const k = ws.length - from, x = P(t, a + 0.5 + ws.length * 0.06, 0.25 * k);
      ws.forEach((w, i) => { w.style.backgroundSize = `${i < from ? 0 : clamp(x * k - (i - from)) * 100}% 38%`; });
    },
  };
  const numIn = {
    odometer(el, t) { const r = el.querySelector('.roll'), x = inout(P(t, 0.5, 1.2)); r.style.transform = `translateY(${-x * 10 * 234}px)`; },
    stamp(el, t) { const r = el.querySelector('.roll'), x = P(t, 0.5, 0.5); r.style.transform = `translateY(${-10 * 234}px)`; el.style.transformOrigin = '0 50%'; el.style.opacity = clamp(x * 3); el.style.transform = `scale(${2.2 - 1.2 * out(x)}) rotate(${-25 * (1 - out(x))}deg)`; },
    spring(el, t) { const r = el.querySelector('.roll'), x = P(t, 0.5, 0.7); r.style.transform = `translateY(${-10 * 234}px)`; el.style.opacity = clamp(x * 4); el.style.transform = `translateY(${(1 - back(x)) * -160}px)`; },
    pop(el, t) { const r = el.querySelector('.roll'), x = P(t, 0.5, 0.6); r.style.transform = `translateY(${-10 * 234}px)`; el.style.transformOrigin = '0 50%'; el.style.opacity = clamp(x * 3); el.style.transform = `scale(${0.3 + 0.7 * back(x)})`; },
  };
  const ctaFx = {
    trace(c, t) { const r = c.querySelector('rect'), x = P(t, 0.3, 1.8); r.style.opacity = x <= 0 ? 0 : x < 1 ? 1 : 1 - 0.55 * P(t, 2.1, 0.5); r.style.strokeDashoffset = 1 - inout(x); },
    shine(c, t) { const x = P((t - 0.4) % 2.6, 0, 0.9); c.querySelector('.sh').style.transform = `translateX(${-120 + x * 360}%)`; },
    orbit(c, t) { const o = c.querySelector('.orb'); o.style.opacity = P(t, 0.2, 0.5); o.style.background = `conic-gradient(from ${t * 120}deg,transparent 0 68%,var(--accent) 84%,#3fc8d8 92%,transparent 100%)`; },
    pulse(c, t) { const x = (Math.max(0, t - 0.3) % 1.6) / 1.6; c.style.boxShadow = `0 0 0 ${x * 34}px rgba(240,193,75,${0.4 * (1 - x)}), 0 20px 60px -20px rgba(240,193,75,.5)`; },
    nudge(c, t) { const x = (Math.max(0, t - 0.8) % 2.4) / 2.4, k = x < 0.25 ? x / 0.25 : 0; c.style.transform = `rotate(${Math.sin(k * Math.PI * 4) * 2.5 * (1 - k)}deg) scale(${1 + 0.03 * Math.sin(k * Math.PI)})`; },
  };
  // Slide changes. The outgoing slide clears out in the first half so two slides of text never sit on top of each other.
  const gone = x => 1 - clamp(x * 2);
  const change = {
    fade: (el, x, dir) => { el.style.opacity = dir ? x : gone(x); },
    slide: (el, x, dir) => { el.style.opacity = dir ? 1 : gone(x); el.style.transform = dir ? `translateX(${(1 - out(x)) * 100}%)` : `translateX(${-out(x) * 30}%)`; },
    up: (el, x, dir) => { el.style.opacity = dir ? x : gone(x); el.style.transform = `translateY(${dir ? (1 - out(x)) * 140 : -out(x) * 140}px)`; },
    blur: (el, x, dir) => { el.style.opacity = dir ? x : gone(x); el.style.filter = `blur(${(dir ? 1 - x : x) * 24}px)`; },
    zoom: (el, x, dir) => { el.style.opacity = dir ? x : gone(x); el.style.transform = `scale(${dir ? 0.9 + 0.1 * out(x) : 1 + 0.1 * out(x)})`; },
  };

  // The curtain variant needs a panel over the hook.
  const curtain = document.createElement('div'); curtain.className = 'curtain'; slides[0].appendChild(curtain);

  window.frame = t => {
    t = Math.min(t, total - 1 / 60);
    draw(t);
    prog.style.transform = `scaleX(${t / total})`;
    let cur = 0;
    starts.forEach((s, i) => { if (t >= s) cur = i; });
    count.textContent = `${cur + 1}/${slides.length}`;
    slides.forEach((el, i) => {
      reset(el);
      const local = t - starts[i];
      if (i !== cur && !(i === cur - 1 && local < dur[i] + TR)) { el.style.visibility = 'hidden'; return; }
      if (i === cur && i > 0 && local < TR) change[pick.change](el, local / TR, 1);
      if (i === cur - 1) change[pick.change](el, (t - starts[cur]) / TR, 0);
      const T = i === 0 ? local + 0.3 : local; // the first slide starts a beat in, so frame one is not empty
      const kicker = el.querySelector('.kicker');
      if (kicker) { const x = out(P(T, 0.2, 0.6)); kicker.style.opacity = x; kicker.style.transform = `translateX(${(1 - x) * -40}px)`; }
      if (i === 0) {
        const hook = el.querySelector('.hook'), bar = el.querySelector('.bar'), m = pick.hook;
        [hook, ...words(hook), ...letters(hook)].forEach(reset); letters(hook).forEach(l => l.classList.remove('caret'));
        if (m === 'curtain') {
          const x = P(T, 0.5, 0.5), y = P(T, 1.0, 0.5);
          curtain.style.top = hook.offsetTop + 'px'; curtain.style.height = hook.offsetHeight + 'px';
          curtain.style.transformOrigin = y > 0 ? 'right' : 'left';
          curtain.style.transform = `scaleX(${y > 0 ? 1 - inout(y) : inout(x)})`;
          hook.style.opacity = y > 0 ? 1 : 0;
        } else {
          curtain.style.transform = 'scaleX(0)';
          textIn[m](hook, T, 0.5);
        }
        const b = out(P(T, 1.6 + typing, 0.6));
        bar.style.width = 140 * b + 'px';
        const sh = P((T - 2.2 - typing) % 3, 0, 0.8);
        bar.style.background = `linear-gradient(100deg,var(--accent) ${sh * 140 - 40}%,#fff7de ${sh * 140 - 20}%,var(--accent) ${sh * 140}%)`;
        el.querySelector('.foot').style.opacity = P(T, 2 + typing, 0.6);
      } else if (i === 1) {
        const why = el.querySelector('.why');
        [why, ...words(why)].forEach(reset);
        if (pick.why === 'lightup') textIn.lightup(why, T, 0.6, dur[1] - 2.4);
        else textIn[pick.why](why, T, 0.6);
        const src = el.querySelector('.src'); if (src) src.style.opacity = P(T, 1.8, 0.6);
      } else if (i < slides.length - 1) {
        const num = el.querySelector('.num'), step = el.querySelector('.step');
        [num, num.querySelector('.roll'), step, ...words(step)].forEach(reset);
        numIn[pick.num](num, T);
        if (pick.step === 'lightup') textIn.lightup(step, T, 1.1, dur[i] - 2.6);
        else textIn[pick.step](step, T, 1.1);
      } else {
        const take = el.querySelector('.take'), cta = el.querySelector('.cta'), logoEl = el.querySelector('.biglogo');
        [take, ...words(take), cta].forEach(reset);
        textIn.rise(take, T, 0.5);
        const c = out(P(T, 1.4, 0.7));
        if (c > 0) ctaFx[pick.cta](cta, T - 1.4);
        cta.style.opacity = c; cta.style.transform = `translateY(${(1 - c) * 40}px) ${cta.style.transform}`;
        logoEl.style.transform = `rotate(${T * 4}deg) scale(${1 + T * 0.01})`;
      }
    });
  };
  return { total, cover: Math.min(dur[0] - 0.4, 3.4 + typing) };
}

function ffmpeg(file) {
  const bin = process.env.FFMPEG || 'ffmpeg';
  const p = spawn(bin, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
    // Screenshots are full range JPEGs; Instagram expects TV range H.264, or blacks and golds wash out.
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv',
    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'stillimage', '-crf', '26', '-profile:v', 'high', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => p.on('close', code => code ? rej(new Error('ffmpeg exited ' + code)) : res()));
  return { write: buf => new Promise(r => p.stdin.write(buf) ? r() : p.stdin.once('drain', r)), end: () => (p.stdin.end(), done) };
}

(async () => {
  const t0 = Date.now();
  // Every post from every week file given, soonest first, skipping ones that already went out.
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const posts = [];
  for (const f of args) {
    const week = JSON.parse(fs.readFileSync(f, 'utf8'));
    const byDay = {};
    for (const p of week.posts) (byDay[p.date] ||= []).push(p);
    for (const day of Object.values(byDay)) {
      day.sort((a, b) => (a.time || week.time || '').localeCompare(b.time || week.time || ''));
      day.forEach((p, slot) => posts.push({ p, slot, when: `${p.date} ${p.time || week.time || '11:15'}` }));
    }
  }
  posts.sort((a, b) => a.when.localeCompare(b.when));
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const { p, slot } of posts) {
    const id = p.id || p.date;
    if (only ? id !== only : p.date < today) continue;
    const dir = path.join(ROOT, 'public/social', id);
    const file = path.join(dir, 'reel.mp4');
    if (fs.existsSync(file)) continue;
    if (budget && Date.now() - t0 > budget) { console.log('time budget used, the rest render on the next run'); break; }
    fs.mkdirSync(dir, { recursive: true });
    const pick = plan(p, slot);
    const look = themeOf(p, slot);
    // Soft glows band into visible rings on the light looks once compressed, so those get the particles.
    if (look === 'cream' || look === 'gold') pick.scene = 'particles';
    const { dur, typing, html } = page(p, pick, look);
    await tab.setContent(html, { waitUntil: 'networkidle' });
    await tab.evaluate(() => document.fonts.ready);
    const seed = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
    const { total, cover } = await tab.evaluate(`(${setup})(${JSON.stringify({ dur, typing, pick, seed })})`);
    const tmp = file + '.part.mp4';
    const enc = ffmpeg(tmp);
    for (let f = 0; f < Math.ceil(total * FPS); f++) {
      await tab.evaluate(t => window.frame(t), f / FPS);
      await enc.write(await tab.screenshot({ type: 'jpeg', quality: 92 }));
    }
    await enc.end();
    fs.renameSync(tmp, file);
    await tab.evaluate(t => window.frame(t), cover);
    await tab.screenshot({ path: path.join(dir, 'cover.jpg'), type: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(dir, 'reel.json'), JSON.stringify({ seconds: +total.toFixed(2), cover_ms: Math.round(cover * 1000), look, motion: pick }, null, 2) + '\n');
    console.log(`reel ${id} (${total.toFixed(1)}s) look=${look} ${Object.entries(pick).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
