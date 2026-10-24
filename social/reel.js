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
//
// Engine 2 (2026-10-16) adds motions from the Motion Catalog's round five, the Claude Motion Tips open source list:
// a bristle brush marker (the p5.brush idea), hand drawn pen loops (Rough.js), words that drop and bounce (Matter.js),
// a dot grid ripple and a brush swipe between slides (Anime.js stagger), and a dotted orb or rippling dot grid behind
// (thinking orbs). The brush starts at the very first frame, so a Reel is never still while a thumb decides to stay.
// reel.json records the engine, and a Reel made by an older engine is re-rendered (and swapped in Buffer).
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, logo, esc, font, css, ending, stepLabel, footLabel, rotation, themeOf, formatOf } = require('./style');

const FPS = 30;
const ENGINE = 2;
// The hook only rotates through entrances that are readable within about a second, because the first second decides
// whether a stranger keeps watching. Type, decode, and curtain hold the words back longer, so they stay available
// only when a week file forces one ("motion": {"hook": "type"}).
const HOOK_EXTRA = ['type', 'decode', 'curtain'];
const MOTIONS = {
  hook: ['brush', 'rise', 'drop', 'words', 'circle', 'mark', 'wipe', 'letters'],
  why: ['lightup', 'brush', 'rise', 'circle', 'mark', 'wipe'],
  num: ['odometer', 'drawn', 'stamp', 'drop', 'spring', 'pop'],
  step: ['words', 'brush', 'lightup', 'circle', 'rise'],
  cta: ['trace', 'scribble', 'shine', 'brush', 'orbit', 'pulse', 'nudge'],
  change: ['fade', 'ripple', 'slide', 'up', 'ink', 'blur', 'zoom'],
  scene: ['aurora', 'orb', 'particles', 'grid', 'glow'],
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
    const allowed = part === 'hook' ? [...list, ...HOOK_EXTRA] : list;
    pick[part] = allowed.includes(forced) ? forced : list[((n % list.length) + list.length) % list.length];
  }
  return pick;
}

// Narration from social/voice.py (Kokoro, the Job Site Studio voice), if it was made for this post.
const VOICE_DIR = process.env.VOICE_DIR || '/tmp/voice';
// When each slide's line starts, counted from the start of that slide: after the hook lands, or after the slide change.
const VO_LEAD = [0.4, 0.5, 0.7, 0.7, 0.7, 0.5];
function voiceOf(id) {
  const f = path.join(VOICE_DIR, id, 'voice.json');
  if (!fs.existsSync(f)) return null;
  const v = JSON.parse(fs.readFileSync(f, 'utf8'));
  return { ...v, files: v.seconds.map((_, i) => path.join(VOICE_DIR, id, `${i}.wav`)) };
}

// Music bed under every Reel (Moe, 2026-10-12: silent Reels felt dead). CC0 tracks in social/music, one per post,
// rotating in schedule order. A week file can force one with "music": "eat" (the file name without .mp3).
const MUSIC_DIR = path.join(__dirname, 'music');
const TRACKS = fs.existsSync(MUSIC_DIR) ? fs.readdirSync(MUSIC_DIR).filter(f => f.endsWith('.mp3')).sort() : [];
function musicOf(p, slot) {
  if (!TRACKS.length) return null;
  const forced = p.music && TRACKS.find(f => f === p.music + '.mp3');
  // Offset by 5 from the look rotation, so a look doesn't always come with the same track.
  return path.join(MUSIC_DIR, forced || TRACKS[(((rotation(p, slot) + 5) % TRACKS.length) + TRACKS.length) % TRACKS.length]);
}

function page(p, pick, look, vo) {
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
  // With narration, the voice sets the pace (Moe, 2026-10-12: the old reading time floor made Reels drag): every
  // slide stays up until its line is said plus a breath (a longer one on the last card), and never less than its
  // entrance needs (the hook's typewriter, or 2 seconds).
  if (vo) vo.seconds.forEach((s, i) => {
    const floor = i === 0 ? 0.6 + 1.2 + typing : 2;
    dur[i] = Math.max(floor, VO_LEAD[i] + s + (i === dur.length - 1 ? 1.4 : 0.25));
  });
  const slides = [
    `<div class="mid"><div class="kicker">${esc(p.topic)}</div><div class="hook">${wordsHtml(p.hook)}</div><div class="bar"></div></div>
     <div class="foot"><span>${footLabel(p)}</span><span></span></div>`,
    `<div class="mid"><div class="kicker">Why it matters</div><div class="body why">${wordsHtml(p.why)}</div>${p.src ? `<div class="src">Source · ${esc(p.src)}</div>` : ''}</div>`,
    ...p.steps.map((s, k) => `<div class="mid"><div class="kicker">${stepLabel(p)}</div>
      <div class="num"><span class="roll">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, k + 1].map(d => `<b>${d}</b>`).join('')}</span></div>
      <div class="body step">${wordsHtml(s)}</div></div>`),
    `<img class="biglogo" src="${logo}"><div class="mid"><div class="take">${wordsHtml(p.take)}</div>
      <div class="cta"><div class="orb"></div><div class="clip"><div class="sh"></div></div>
      <svg class="trace"><rect x="1.5" y="1.5" rx="27" ry="27" pathLength="1"/></svg>${ending(p)}</div></div>`,
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
.s .paint,.s .ink{position:absolute;left:0;top:0;width:1080px;height:1350px;pointer-events:none}
.s .paint{z-index:0}
.s .ink{z-index:2;overflow:visible}
.s .ink path{fill:none;stroke:var(--accent);stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}
.s .mid{position:relative;z-index:1}
#fx{position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:5;pointer-events:none}
.cta .a,.cta .u{width:fit-content}
</style></head><body class="t-${look}"><div id="stage"><div id="scene"></div><div class="band">
<div class="top"><div class="brand"><img src="${logo}">EVOGENCY</div><div class="count">1/6</div></div>
<div class="prog"><i></i></div>
${slides.map((s, i) => `<div class="s" id="s${i}"><canvas class="paint" width="1080" height="1350"></canvas>${s}<svg class="ink" viewBox="0 0 1080 1350"></svg></div>`).join('')}
</div><canvas id="fx" width="1080" height="1920"></canvas></div></body></html>` };
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

  const css = getComputedStyle(document.body);
  const accent = css.getPropertyValue('--accent').trim(), fg = css.getPropertyValue('--fg').trim();
  // The gold look's accent is near black, so its marker goes lighter to keep the words on top readable.
  const ink = document.body.classList.contains('t-gold') ? 0.38 : 0.62;
  const bounce = x => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; };
  // Where an element sits inside its slide, ignoring every transform, so motion never moves the marks it lays down.
  const box = el => { let x = 0, y = 0, e = el; const root = el.closest('.s'); while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
  // The words that carry the line: after its last comma, or its last 3 words.
  const keyFrom = ws => { const text = ws.map(w => w.textContent); let from = text.findLastIndex((w, i) => i < ws.length - 1 && /,$/.test(w)) + 1; if (from === 0 || ws.length - from > 6) from = Math.max(0, ws.length - 3); return from; };
  // Words grouped into the lines they sit on, each line one stretch for a marker or a pen loop.
  const lines = ws => { const out = []; ws.forEach(w => { const b = box(w), l = out[out.length - 1]; if (l && Math.abs(l.y - b.y) < b.h / 2) { l.x1 = b.x + b.w; } else out.push({ x0: b.x, x1: b.x + b.w, y: b.y, h: b.h }); }); return out; };
  // Bristle brush (the p5.brush idea): one stroke per bristle, each with its own ink, length, wobble, and dry gap.
  const bristles = (k, n) => Array.from({ length: n }, (_, i) => ({ off: i / (n - 1) - 0.5 + (rnd(k + i) - 0.5) * 0.03, a: 0.35 + rnd(k + i + 101) * 0.6, len: 0.82 + rnd(k + i + 202) * 0.18, w: 2 + rnd(k + i + 303) * 3.5, ph: rnd(k + i + 404) * 6, gap: rnd(k + i + 505) < 0.15 ? 0.15 + rnd(k + i + 606) * 0.65 : 2 }));
  const sweep = (ctx, segs, p, k, color, thick, alpha = 1) => {
    const L = segs.reduce((a, s) => a + s.x1 - s.x0 + 30, 0), br = bristles(k, 44);
    let done = 0;
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = color;
    segs.forEach((s, si) => {
      const len = s.x1 - s.x0 + 30, q = clamp((p * L - done) / len); done += len;
      if (q <= 0) return;
      for (const b of br) {
        const end = Math.min(q, b.len); if (end <= 0) continue;
        ctx.globalAlpha = b.a * alpha; ctx.lineWidth = b.w; ctx.beginPath();
        let pen = false;
        for (let u = 0; u <= end + 1e-4; u += 0.02) {
          const x = s.x0 - 15 + u * len, y = s.y + b.off * thick * (0.75 + 0.25 * Math.sin(Math.PI * u)) + Math.sin(u * 5 + b.ph + si) * 1.6 - u * 4;
          if (u > b.gap && u < b.gap + 0.05) { pen = false; continue; }
          pen ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), pen = true);
        }
        ctx.stroke();
      }
    });
    ctx.restore();
  };
  // Hand drawn pen (the Rough.js idea): a loose loop that overshoots its start, drawn twice like a real pen.
  const smooth = p => { let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`; for (let i = 0; i < p.length - 1; i++) { const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2; d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; } return d; };
  const loop = (b, k, pad) => { const cx = b.x + b.w / 2, cy = b.y + b.h / 2, rx = b.w / 2 + pad, ry = b.h / 2 + pad * 0.55, a0 = rnd(k) * 6.28, turn = 1.1 + rnd(k + 1) * 0.12, n = 26; return smooth(Array.from({ length: n + 1 }, (_, i) => { const t = a0 + i / n * turn * 6.28, j = 1 + (rnd(k + i + 7) - 0.5) * 0.07; return [cx + Math.cos(t) * rx * j, cy + Math.sin(t) * ry * j]; })); };
  const pen = (svg, id, d, x, opacity = 1) => {
    let p = svg.querySelector(`[data-id="${id}"]`);
    if (!p) { p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.dataset.id = id; p.setAttribute('pathLength', '1'); svg.appendChild(p); }
    p.setAttribute('d', d); p.style.strokeDashoffset = 1 - x; p.style.opacity = x > 0 ? opacity : 0;
  };
  const span = rows => rows.reduce((a, r) => ({ x: Math.min(a.x, r.x0), y: Math.min(a.y, r.y), w: Math.max(a.x + a.w, r.x1) - Math.min(a.x, r.x0), h: Math.max(a.y + a.h, r.y + r.h) - Math.min(a.y, r.y) }), { x: rows[0].x0, y: rows[0].y, w: 0, h: 0 });

  // Background scene
  const scene = document.getElementById('scene');
  let draw = () => {};
  if (pick.scene === 'orb' || pick.scene === 'grid') {
    // Orb (the thinking orbs idea): a big dotted sphere turning slowly behind the text. Grid: a field of dots,
    // and every slide change sends a ripple ring out from the middle (the Anime.js stagger idea).
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; scene.appendChild(c);
    const ctx = c.getContext('2d');
    const N = 520, sphere = Array.from({ length: N }, (_, i) => { const y = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; return [Math.cos(th) * r, y, Math.sin(th) * r]; });
    draw = t => {
      ctx.clearRect(0, 0, 1080, 1920);
      if (pick.scene === 'orb') {
        const sp = t * 0.16, R = 500 * (1 + 0.025 * Math.sin(t * 1.3)), glint = Math.sin(t * 0.7);
        for (const [x0, y0, z0] of sphere) {
          const X = x0 * Math.cos(sp) - z0 * Math.sin(sp), Z = x0 * Math.sin(sp) + z0 * Math.cos(sp);
          const Y = y0 * Math.cos(0.42) - Z * Math.sin(0.42), D = (y0 * Math.sin(0.42) + Z * Math.cos(0.42) + 1) / 2;
          const g = Math.max(0, 1 - Math.abs(X - glint) * 4);
          ctx.globalAlpha = 0.05 + 0.2 * D + 0.25 * g * D; ctx.fillStyle = g > 0.4 ? accent : fg;
          ctx.beginPath(); ctx.arc(540 + X * R, 960 + Y * R, 1.8 + 3 * D, 0, 7); ctx.fill();
        }
      } else {
        const since = t - starts.filter(s => s <= t).pop();
        for (let gy = 30; gy < 1920; gy += 60) for (let gx = 30; gx < 1080; gx += 60) {
          const d = Math.hypot(gx - 540, gy - 960), w = Math.exp(-Math.pow((d - since * 1500) / 90, 2)) * clamp(1.6 - since);
          ctx.globalAlpha = 0.09 + 0.55 * w; ctx.fillStyle = w > 0.15 ? accent : fg;
          ctx.beginPath(); ctx.arc(gx, gy, 2.4 + 3.5 * w, 0, 7); ctx.fill();
        }
      }
    };
  } else if (pick.scene === 'aurora' || pick.scene === 'glow') {
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
    // Letters fall into their word's slot, bounce, and settle straight (the Matter.js idea, solved in closed form so any
    // frame renders alone). Each word clips its own letters, so a falling line never crosses the one above it.
    drop(el, t, a = 0.7) {
      words(el).forEach((w, i) => {
        w.style.clipPath = 'inset(-0.15em -0.2em -0.3em -0.2em)';
        [...w.children].forEach((l, j) => { const x = P(t, a + i * 0.06 + j * 0.012, 0.7), r = (rnd(seed + i * 17 + j) - 0.5) * 24; l.style.opacity = x > 0 ? 1 : 0; l.style.transform = `translateY(${(1 - bounce(x)) * -1.2}em) rotate(${r * (1 - out(x))}deg)`; });
      });
    },
    // A bristle marker sweeps under the key words first, then the words rise onto it (brush at 0s, words land by 0.35s).
    brush(el, t, a = 0.7) {
      const ws = words(el), from = keyFrom(ws), ctx = el.closest('.s').querySelector('.paint').getContext('2d');
      textIn.rise(el, t, a + 0.05);
      const segs = lines(ws.slice(from)).map(l => ({ x0: l.x0, x1: l.x1, y: l.y + l.h * 0.84 }));
      sweep(ctx, segs, out(P(t, a - 0.35, 0.3 + 0.2 * segs.length)), seed + 77, accent, ws[0].offsetHeight * 0.3, ink);
    },
    // The words rise, then a pen loops around the key words, twice.
    circle(el, t, a = 0.7) {
      const ws = words(el), from = keyFrom(ws), svg = el.closest('.s').querySelector('.ink');
      textIn.rise(el, t, a);
      const b = span(lines(ws.slice(from))), at = a + 0.55 + ws.length * 0.06;
      pen(svg, el.className + 1, loop(b, seed + 11, 26), inout(P(t, at, 0.65)));
      pen(svg, el.className + 2, loop(b, seed + 23, 34), inout(P(t, at + 0.45, 0.45)), 0.55);
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
    drop(el, t) { const r = el.querySelector('.roll'), x = P(t, 0.4, 0.9); r.style.transform = `translateY(${-10 * 234}px)`; el.style.opacity = x > 0 ? 1 : 0; el.style.transform = `translateY(${(1 - bounce(x)) * -520}px)`; },
    drawn(el, t) {
      const r = el.querySelector('.roll'), x = P(t, 0.35, 0.4);
      r.style.transform = `translateY(${-10 * 234}px)`; el.style.opacity = out(x);
      // The digit strip is slid by a transform, so measure the number's window, not the digit
      const nb = box(el), g = { x: nb.x - 4, y: nb.y + 14, w: 170, h: 206 };
      pen(el.closest('.s').querySelector('.ink'), 'num', loop(g, seed + 31, 34), inout(P(t, 0.55, 0.6)));
    },
  };
  const ctaFx = {
    trace(c, t) { const r = c.querySelector('rect'), x = P(t, 0.3, 1.8); r.style.opacity = x <= 0 ? 0 : x < 1 ? 1 : 1 - 0.55 * P(t, 2.1, 0.5); r.style.strokeDashoffset = 1 - inout(x); },
    shine(c, t) { const x = P((t - 0.4) % 2.6, 0, 0.9); c.querySelector('.sh').style.transform = `translateX(${-120 + x * 360}%)`; },
    orbit(c, t) { const o = c.querySelector('.orb'); o.style.opacity = P(t, 0.2, 0.5); o.style.background = `conic-gradient(from ${t * 120}deg,transparent 0 68%,var(--accent) 84%,#3fc8d8 92%,transparent 100%)`; },
    pulse(c, t) { const x = (Math.max(0, t - 0.3) % 1.6) / 1.6; c.style.boxShadow = `0 0 0 ${x * 34}px rgba(240,193,75,${0.4 * (1 - x)}), 0 20px 60px -20px rgba(240,193,75,.5)`; },
    scribble(c, t) { const a = c.querySelector('.a'); pen(c.closest('.s').querySelector('.ink'), 'cta1', loop(box(a), seed + 41, 22), inout(P(t, 0.3, 0.7))); pen(c.closest('.s').querySelector('.ink'), 'cta2', loop(box(a), seed + 53, 30), inout(P(t, 0.85, 0.5)), 0.55); },
    brush(c, t) { const u = c.querySelector('.u'), b = box(u); sweep(c.closest('.s').querySelector('.paint').getContext('2d'), [{ x0: b.x, x1: b.x + b.w, y: b.y + b.h * 0.86 }], out(P(t, 0.3, 0.6)), seed + 61, accent, b.h * 0.3, ink); },
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
    ripple: (el, x, dir) => { el.style.opacity = dir ? clamp((x - 0.5) / 0.2) : 1 - clamp((x - 0.3) / 0.2); },
    ink: (el, x, dir) => { el.style.opacity = dir ? clamp((x - 0.45) / 0.15) : 1 - clamp((x - 0.25) / 0.2); },
  };
  const fx = document.getElementById('fx'), fxc = fx.getContext('2d');
  const cover = (x, k) => {
    fxc.clearRect(0, 0, 1080, 1920);
    if (x <= 0 || x >= 1) return;
    if (pick.change === 'ripple') {
      // Dots swell out from one corner across the band and shrink away again, one beat after their neighbours.
      const ox = k % 2 ? 1080 : 0, far = Math.hypot(1080, 1920);
      fxc.fillStyle = accent;
      for (let gy = 45; gy < 1920; gy += 90) for (let gx = 45; gx < 1080; gx += 90) {
        const q = clamp((x - Math.hypot(gx - ox, gy) / far * 0.5) / 0.5), r = Math.sin(Math.PI * q) * 54;
        if (r > 0.5) { fxc.beginPath(); fxc.arc(gx, gy, r, 0, 7); fxc.fill(); }
      }
    } else if (pick.change === 'ink') {
      // One giant brush stroke wipes across the band, and its tail drags off the far side.
      const head = out(clamp(x / 0.55)), tail = clamp((x - 0.45) / 0.55), br = bristles(seed + k * 7, 90);
      fxc.lineCap = 'round'; fxc.strokeStyle = accent;
      for (const b of br) {
        fxc.globalAlpha = Math.min(1, b.a + 0.35); fxc.lineWidth = 26 + b.w * 4; fxc.beginPath();
        const y = 960 + b.off * 2150, x0 = -150 + tail * 1400 * b.len, x1 = -150 + head * 1400;
        if (x1 > x0) { fxc.moveTo(x0, y + Math.sin(b.ph) * 8); fxc.lineTo(x1, y - 60 + Math.sin(b.ph + 2) * 8); fxc.stroke(); }
      }
      fxc.globalAlpha = 1;
    }
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
    cover(cur > 0 ? (t - starts[cur]) / TR : 0, cur);
    slides.forEach((el, i) => {
      reset(el);
      const paint = el.querySelector('.paint');
      paint.getContext('2d').clearRect(0, 0, 1080, 1350);
      el.querySelectorAll('.ink path').forEach(p => { p.style.opacity = 0; });
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
          curtain.style.top = box(hook).y + 'px'; curtain.style.height = hook.offsetHeight + 'px';
          curtain.style.transformOrigin = y > 0 ? 'right' : 'left';
          curtain.style.transform = `scaleX(${y > 0 ? 1 - inout(y) : inout(x)})`;
          hook.style.opacity = y > 0 ? 1 : 0;
        } else {
          curtain.style.transform = 'scaleX(0)';
          textIn[m](hook, T, 0.3);
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

function ffmpeg(file, vo, dur, music) {
  const bin = process.env.FFMPEG || 'ffmpeg';
  // Narration: each slide's clip delayed to where its slide starts and mixed. Music: the post's track looped to the
  // video's length, faded out at the end, and ducked under the voice (sidechain) so every word stays clear. The result
  // is loudness normalized for phones and padded to the end of the video. Neither one: a silent track, as before.
  const total = dur.reduce((a, d) => a + d, 0);
  const out = 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100,aformat=channel_layouts=stereo,apad[aout]';
  let audio = ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo'], map = [];
  const bed = n => `[${n}:a]aformat=channel_layouts=stereo,atrim=0:${total.toFixed(2)},volume=0.32,`
    + `afade=t=out:st=${Math.max(0, total - 1.8).toFixed(2)}:d=1.8`;
  if (vo) {
    const starts = dur.reduce((a, d) => (a.push(a[a.length - 1] + d), a), [0]);
    audio = vo.files.flatMap(f => ['-i', f]);
    const parts = vo.files.map((_, i) => `[${i + 1}:a]adelay=${Math.round((starts[i] + VO_LEAD[i]) * 1000)}:all=1[a${i}]`);
    const voice = `${vo.files.map((_, i) => `[a${i}]`).join('')}amix=inputs=${vo.files.length}:normalize=0:dropout_transition=0,`
      + 'aformat=channel_layouts=stereo,aresample=44100';
    let chain;
    if (music) {
      const n = vo.files.length + 1;
      audio.push('-stream_loop', '-1', '-i', music);
      chain = [`${voice},asplit=2[v1][v2]`, `${bed(n)},aresample=44100[m]`,
        '[m][v2]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[md]',
        `[v1][md]amix=inputs=2:normalize=0:duration=first,${out}`];
    } else chain = [`${voice},${out}`];
    map = ['-filter_complex', [...parts, ...chain].join(';'), '-map', '0:v', '-map', '[aout]'];
  } else if (music) {
    audio = ['-stream_loop', '-1', '-i', music];
    map = ['-filter_complex', `${bed(1)},${out}`, '-map', '0:v', '-map', '[aout]'];
  }
  const p = spawn(bin, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    ...audio, ...map, '-shortest',
    // Screenshots are full range JPEGs; Instagram expects TV range H.264, or blacks and golds wash out.
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv',
    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'stillimage', '-crf', '26', '-profile:v', 'high', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', vo || music ? '128k' : '64k', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => p.on('close', code => code ? rej(new Error('ffmpeg exited ' + code)) : res()));
  return { write: buf => new Promise(r => p.stdin.write(buf) ? r() : p.stdin.once('drain', r)), end: () => (p.stdin.end(), done) };
}

(async () => {
  const t0 = Date.now();
  // Every post from every week file given, soonest first, skipping ones that already went out.
  const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).slice(0, 16); // "YYYY-MM-DD HH:MM"
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
  for (const { p, slot, when } of posts) {
    const id = p.id || p.date;
    if (only ? id !== only : when <= now) continue;
    // Stick figure and mascot Reels come from Moe's laptop (Content Crew), never from here, so nothing overwrites them.
    if (formatOf(p, slot) !== 'slides') continue;
    const dir = path.join(ROOT, 'public/social', id);
    const file = path.join(dir, 'reel.mp4');
    const vo = voiceOf(id);
    // A reel that exists is skipped, unless new narration is ready for it (it was silent, or voiced in another voice),
    // or an older engine made it. An old voiced reel waits for its new narration, so it never comes back silent.
    if (fs.existsSync(file)) {
      const info = JSON.parse(fs.readFileSync(path.join(dir, 'reel.json'), 'utf8'));
      const current = (info.engine || 1) === ENGINE;
      if (current && (!vo || info.voice === vo.voice)) continue;
      if (!current && info.voice && !vo) continue;
    }
    if (budget && Date.now() - t0 > budget) { console.log('time budget used, the rest render on the next run'); break; }
    fs.mkdirSync(dir, { recursive: true });
    const pick = plan(p, slot);
    const look = themeOf(p, slot);
    // Soft glows band into visible rings on the light looks once compressed, so those get the particles.
    if ((look === 'cream' || look === 'gold') && (pick.scene === 'aurora' || pick.scene === 'glow')) pick.scene = 'particles';
    const { dur, typing, html } = page(p, pick, look, vo);
    await tab.setContent(html, { waitUntil: 'networkidle' });
    await tab.evaluate(() => document.fonts.ready);
    const seed = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
    const { total, cover } = await tab.evaluate(`(${setup})(${JSON.stringify({ dur, typing, pick, seed })})`);
    const tmp = file + '.part.mp4';
    const music = musicOf(p, slot);
    const enc = ffmpeg(tmp, vo, dur, music);
    for (let f = 0; f < Math.ceil(total * FPS); f++) {
      await tab.evaluate(t => window.frame(t), f / FPS);
      await enc.write(await tab.screenshot({ type: 'jpeg', quality: 92 }));
    }
    await enc.end();
    fs.renameSync(tmp, file);
    await tab.evaluate(t => window.frame(t), cover);
    await tab.screenshot({ path: path.join(dir, 'cover.jpg'), type: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(dir, 'reel.json'), JSON.stringify({ seconds: +total.toFixed(2), cover_ms: Math.round(cover * 1000), engine: ENGINE, look, motion: pick, voice: vo ? vo.voice : null, music: music ? path.basename(music, '.mp3') : null }, null, 2) + '\n');
    console.log(`reel ${id} (${total.toFixed(1)}s) look=${look} voice=${vo ? vo.voice : 'none'} music=${music ? path.basename(music, '.mp3') : 'none'} ${Object.entries(pick).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
