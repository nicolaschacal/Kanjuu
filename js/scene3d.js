// KANJŪ · scene3d.js — Escenas 3D con criaturas de papel 2D: Santuario y Arena.
// Un solo renderer se mueve entre pantallas; cada escena tiene su cámara, luz y actualización.
// En el santuario la grilla de tiles (world.js) manda: cada ítem va al centro de sus casillas y la
// grilla sólo se dibuja en modo construcción.
import * as THREE from './vendor/three.module.min.js';
import * as paper from './paper.js';

const CREAM = '#FFF4DC';
let E = null; // motor compartido

export const webgl = (() => { let ok; return () => ok ??= (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })(); })();

// ---------- Hora del día ----------
const KEYS = [
  { h: 0, top: '#0B0A1E', bot: '#2A2148', sun: '#8FA3FF', si: .5, amb: .75, night: 1, tint: '#5A5A9A' },
  { h: 5, top: '#141233', bot: '#3A2C5E', sun: '#9AA8FF', si: .55, amb: .75, night: .9, tint: '#6A5F9A' },
  { h: 6.5, top: '#3B2C6B', bot: '#F2A65A', sun: '#FFB27A', si: 1.5, amb: .85, night: .3, tint: '#C99AA8' },
  { h: 9, top: '#3F7FD0', bot: '#BFD9E8', sun: '#FFF1D6', si: 2.3, amb: 1.05, night: 0, tint: '#FFFFFF' },
  { h: 16, top: '#4A86D0', bot: '#F0D2A6', sun: '#FFE2B0', si: 2.2, amb: 1, night: 0, tint: '#FFF0DC' },
  { h: 18.5, top: '#43296A', bot: '#F2A65A', sun: '#FF9A5A', si: 1.7, amb: .85, night: .25, tint: '#D89AA0' },
  { h: 20, top: '#1A1438', bot: '#B85A78', sun: '#C07AFF', si: .7, amb: .7, night: .75, tint: '#8A6A9A' },
  { h: 21.5, top: '#0B0A1E', bot: '#2A2148', sun: '#8FA3FF', si: .5, amb: .75, night: 1, tint: '#5A5A9A' },
  { h: 24, top: '#0B0A1E', bot: '#2A2148', sun: '#8FA3FF', si: .5, amb: .75, night: 1, tint: '#5A5A9A' },
];
export function hourNow() {
  const q = new URLSearchParams(location.search).get('hora');
  if (q !== null && !isNaN(+q)) return +q;
  const d = new Date(); return d.getHours() + d.getMinutes() / 60;
}
function skyAt(h) {
  const i = KEYS.findIndex(k => k.h > h), a = KEYS[i - 1], b = KEYS[i], t = (h - a.h) / (b.h - a.h);
  const mix = x => new THREE.Color(a[x]).lerp(new THREE.Color(b[x]), t);
  const n = x => a[x] + (b[x] - a[x]) * t;
  return { top: mix('top'), bot: mix('bot'), sun: mix('sun'), tint: mix('tint'), si: n('si'), amb: n('amb'), night: n('night') };
}

// ---------- Texturas pintadas ----------
const canvas = (w, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function tex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const fontReady = document.fonts?.load('64px "Yuji Syuku"').catch(() => {}) || Promise.resolve();

// SVG procedural → recorte de papel (borde crema) con el kanji pintado con pincel
const texCache = new Map();
function paperTexture(svg) {
  if (texCache.has(svg)) return texCache.get(svg);
  const S = 256, M = 12, c = canvas(S), t = tex(c);
  texCache.set(svg, t);
  const texts = [];
  const s = svg.replace(/<text([^>]*)>([^<]*)<\/text>/g, (_, a, txt) => {
    const g = n => +(a.match(new RegExp(`\\b${n}="([\\d.]+)"`)) || [])[1];
    texts.push({ x: g('x'), y: g('y'), fs: g('font-size'), txt }); return '';
  }).replace(/<ellipse[^>]*kj-shadow[^>]*\/>/g, '')
    .replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" `);
  const img = new Image();
  img.onload = async () => {
    await fontReady;
    const base = canvas(S), b = base.getContext('2d'), k = (S - 2 * M) / 120;
    b.drawImage(img, M, M, S - 2 * M, S - 2 * M);
    b.fillStyle = '#2B1D16'; b.textAlign = 'center'; b.textBaseline = 'middle';
    texts.forEach(x => { b.font = `${x.fs * k}px "Yuji Syuku", serif`; b.fillText(x.txt, M + x.x * k, M + x.y * k + 1); });
    const o = c.getContext('2d'), r = 3;
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; o.drawImage(base, Math.cos(a) * r, Math.sin(a) * r); }
    o.globalCompositeOperation = 'source-in'; o.fillStyle = CREAM; o.fillRect(0, 0, S, S);
    o.globalCompositeOperation = 'source-over'; o.drawImage(base, 0, 0);
    t.needsUpdate = true;
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  return t;
}
function radialTex(stops) {
  const c = canvas(64), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(c);
}
let _blob, _dot;
const blobTex = () => _blob ??= radialTex([[0, 'rgba(20,12,30,.5)'], [.6, 'rgba(20,12,30,.22)'], [1, 'rgba(20,12,30,0)']]);
const dotTex = () => _dot ??= radialTex([[0, 'rgba(255,255,255,1)'], [.35, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]);

function grassTexture(w, h) {
  const P = 96, c = canvas(w * P, h * P), x = c.getContext('2d'), rnd = mulberry(7);
  x.fillStyle = '#76A95C'; x.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < w * h * 16; i++) {
    x.fillStyle = rnd() < .5 ? 'rgba(140,192,110,.5)' : 'rgba(86,140,72,.4)';
    x.beginPath(); x.ellipse(rnd() * c.width, rnd() * c.height, 12 + rnd() * 30, 6 + rnd() * 14, rnd() * 3, 0, 7); x.fill();
  }
  x.strokeStyle = 'rgba(170,216,128,.75)'; x.lineWidth = 3; x.lineCap = 'round';
  for (let i = 0; i < w * h * 26; i++) { const px = rnd() * c.width, py = rnd() * c.height; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 2, py - 6, px + (rnd() - .5) * 8, py - 10 - rnd() * 6); x.stroke(); }
  for (let i = 0; i < w * h * 1.4; i++) { const px = rnd() * c.width, py = rnd() * c.height; x.fillStyle = CREAM; x.beginPath(); x.arc(px, py, 4.5, 0, 7); x.fill(); x.fillStyle = rnd() < .5 ? '#E8452C' : '#F2B544'; x.beginPath(); x.arc(px, py, 2, 0, 7); x.fill(); }
  return tex(c);
}
function strataTexture() {
  const c = canvas(256, 128), x = c.getContext('2d');
  ['#7A5038', '#6B4632', '#5C3D2A', '#4F3224'].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, i * 30 + 4); for (let px = 0; px <= 256; px += 16) x.lineTo(px, i * 30 + 4 + Math.sin(px * .07 + i * 2) * 5); x.lineTo(256, 128); x.lineTo(0, 128); x.fill(); });
  x.fillStyle = 'rgba(30,18,12,.3)'; const r = mulberry(4); for (let i = 0; i < 50; i++) { x.beginPath(); x.arc(r() * 256, 20 + r() * 108, 1.5 + r() * 3, 0, 7); x.fill(); }
  const t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function plankTexture() {
  const c = canvas(512, 384), x = c.getContext('2d'), r = mulberry(11);
  for (let i = 0; i < 8; i++) { x.fillStyle = ['#9A6644', '#8A5A3A', '#A06C48', '#93613F'][i % 4]; x.fillRect(i * 64, 0, 64, 384); x.fillStyle = '#5C3A26'; x.fillRect(i * 64, 0, 3, 384); for (let j = 0; j < 6; j++) { x.strokeStyle = 'rgba(60,36,22,.25)'; x.lineWidth = 1.5; x.beginPath(); const px = i * 64 + 8 + r() * 48; x.moveTo(px, 0); x.bezierCurveTo(px + 6, 120, px - 6, 260, px + 3, 384); x.stroke(); } if (r() < .7) { x.fillStyle = '#5C3A26'; x.fillRect(i * 64, 100 + r() * 180, 64, 3); } }
  return tex(c);
}
// Capa de fondo: recorte de papel con borde crema y siluetas (torii, pagoda, copas de árbol)
function ridge({ seed, peaks, base = 140, amp = 90, fill, extras = '' }) {
  const W = 1024, H = 384, c = canvas(W, H), x = c.getContext('2d'), rnd = mulberry(seed);
  const pts = []; for (let i = 0; i <= peaks; i++) pts.push([i / peaks * W, base - rnd() * amp]);
  const path = () => {
    x.beginPath(); x.moveTo(0, H); x.lineTo(0, pts[0][1]);
    for (let i = 1; i < pts.length; i++) { const [px, py] = pts[i], [qx, qy] = pts[i - 1]; x.quadraticCurveTo((px + qx) / 2, Math.min(py, qy) - 18 * rnd(), px, py); }
    x.lineTo(W, H); x.closePath();
  };
  if (extras.includes('trees')) for (let i = 0; i < 22; i++) { const px = rnd() * W, py = base - 10 - rnd() * 40, rr = 18 + rnd() * 26; x.fillStyle = CREAM; x.beginPath(); x.arc(px, py, rr + 4, 0, 7); x.fill(); x.fillStyle = fill; x.beginPath(); x.arc(px, py, rr, 0, 7); x.fill(); }
  path(); x.globalAlpha = .55; x.strokeStyle = CREAM; x.lineWidth = 5; x.stroke(); x.globalAlpha = 1; path(); x.fillStyle = fill; x.fill();
  if (extras.includes('torii')) { const tx = W * .7, ty = base - 70; x.fillStyle = '#E8452C'; x.fillRect(tx, ty, 10, 72); x.fillRect(tx + 58, ty, 10, 72); x.fillRect(tx - 12, ty - 10, 92, 11); x.fillRect(tx - 2, ty + 10, 72, 6); }
  if (extras.includes('pagoda')) { const px = W * .2, py = base - 30; x.fillStyle = '#2A2350'; for (let i = 0; i < 4; i++) { const w = 70 - i * 14, y = py - i * 26; x.beginPath(); x.moveTo(px - w / 2 - 10, y); x.lineTo(px + w / 2 + 10, y); x.lineTo(px + w / 2 - 4, y - 12); x.lineTo(px - w / 2 + 4, y - 12); x.fill(); x.fillRect(px - w / 2 + 8, y - 26, w - 16, 14); } x.fillRect(px - 2, py - 124, 4, 22); }
  if (extras.includes('temple')) { x.fillStyle = '#200D18'; x.beginPath(); x.moveTo(W * .25, base); x.lineTo(W * .3, base - 60); x.lineTo(W * .7, base - 60); x.lineTo(W * .75, base); x.fill(); x.beginPath(); x.moveTo(W * .2, base - 56); x.quadraticCurveTo(W * .5, base - 76, W * .8, base - 56); x.lineTo(W * .72, base - 100); x.lineTo(W * .28, base - 100); x.fill(); }
  return tex(c);
}

// ---------- Utilería ----------
const L = (col, extra = {}) => new THREE.MeshLambertMaterial({ color: col, ...extra });
function mesh(geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
function roundedShape(W, D, r) {
  const s = new THREE.Shape(), x0 = -W / 2, z0 = -D / 2;
  s.moveTo(x0 + r, z0); s.lineTo(x0 + W - r, z0); s.quadraticCurveTo(x0 + W, z0, x0 + W, z0 + r); s.lineTo(x0 + W, z0 + D - r);
  s.quadraticCurveTo(x0 + W, z0 + D, x0 + W - r, z0 + D); s.lineTo(x0 + r, z0 + D); s.quadraticCurveTo(x0, z0 + D, x0, z0 + D - r); s.lineTo(x0, z0 + r); s.quadraticCurveTo(x0, z0, x0 + r, z0);
  return s;
}
function slab(W, D, r, depth, mats) { const g = new THREE.ExtrudeGeometry(roundedShape(W, D, r), { depth, bevelEnabled: false, curveSegments: 8 }); g.rotateX(Math.PI / 2); const m = new THREE.Mesh(g, mats); m.receiveShadow = true; return m; }
function topUV(m, W, D) { const p = m.geometry.attributes.position, uv = m.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) if (Math.abs(p.getY(i)) < .001) uv.setXY(i, (p.getX(i) + W / 2) / W, 1 - (p.getZ(i) + D / 2) / D); }

function prop(t, w, h) {
  const g = new THREE.Group(), u = { light: null, flame: null };
  const stone = L('#B8AE9C'), dark = L('#3A2F2A'), red = L('#E8452C'), wood = L('#7A4E32');
  if (t === 'lantern') {
    g.add(mesh(new THREE.BoxGeometry(.42, .1, .42), stone, 0, .05), mesh(new THREE.CylinderGeometry(.07, .09, .32, 8), stone, 0, .26), mesh(new THREE.BoxGeometry(.3, .24, .3), stone, 0, .52));
    const win = new THREE.Mesh(new THREE.BoxGeometry(.32, .12, .2), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); win.position.y = .52; g.add(win);
    const roof = mesh(new THREE.ConeGeometry(.3, .16, 4), L('#8B8273'), 0, .72); roof.rotation.y = Math.PI / 4; g.add(roof, mesh(new THREE.SphereGeometry(.04, 8, 6), stone, 0, .82));
    u.light = { y: .55, color: '#FFB35A', power: 1.8 };
  } else if (t === 'pine') {
    g.add(mesh(new THREE.CylinderGeometry(.06, .09, .4, 6), wood, 0, .2));
    [[.42, .4, .45], [.34, .36, .7], [.24, .3, .92]].forEach(([r, hh, y]) => g.add(mesh(new THREE.ConeGeometry(r, hh, 7), L('#2F6B3A'), 0, y)));
  } else if (t === 'pond') {
    const water = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .04, 32), new THREE.MeshPhongMaterial({ color: '#2F7DC0', shininess: 90, specular: '#BFE3FF' }));
    water.scale.set(w * .9, 1, h * .85); water.position.y = .02; water.receiveShadow = true; g.add(water);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.5, .04, 6, 32), L(CREAM)); rim.rotation.x = Math.PI / 2; rim.scale.set(w * .9, h * .85, 1); rim.position.y = .04; g.add(rim);
    const rnd = mulberry(3); for (let i = 0; i < 6; i++) { const a = rnd() * 7; g.add(mesh(new THREE.DodecahedronGeometry(.07 + rnd() * .05), L('#8E8778'), Math.cos(a) * w * .47, .05, Math.sin(a) * h * .44)); }
  } else if (t === 'shrine') {
    const hd = honden(); hd.scale.setScalar(1.05); g.add(hd);
    u.light = { y: .7, z: .7, color: '#FFB35A', power: 1.2 };
  } else if (t === 'bell') {
    g.add(mesh(new THREE.BoxGeometry(.08, .9, .08), wood, -.32, .45), mesh(new THREE.BoxGeometry(.08, .9, .08), wood, .32, .45), mesh(new THREE.BoxGeometry(.85, .08, .12), dark, 0, .92));
    g.add(mesh(new THREE.LatheGeometry([[0, 0], [.2, .02], [.19, .12], [.15, .3], [.08, .38], [0, .4]].map(([x, y]) => new THREE.Vector2(x, y)), 16), L('#D9A93A'), 0, .45));
  } else if (t === 'torii') {
    g.add(mesh(new THREE.CylinderGeometry(.06, .07, 1.2, 10), red, -.62, .6), mesh(new THREE.CylinderGeometry(.06, .07, 1.2, 10), red, .62, .6));
    g.add(mesh(new THREE.BoxGeometry(1.7, .1, .16), dark, 0, 1.24), mesh(new THREE.BoxGeometry(1.5, .08, .12), red, 0, 1.15), mesh(new THREE.BoxGeometry(1.36, .07, .09), red, 0, .96));
  } else if (t === 'brazier') {
    [0, 2.1, 4.2].forEach(a => g.add(mesh(new THREE.CylinderGeometry(.025, .025, .3, 5), dark, Math.cos(a) * .16, .15, Math.sin(a) * .16)));
    g.add(mesh(new THREE.CylinderGeometry(.3, .16, .18, 12), L('#4A4038'), 0, .38));
    const f = new THREE.Mesh(new THREE.ConeGeometry(.17, .42, 8), new THREE.MeshBasicMaterial({ color: '#FFA24A' })); f.position.y = .66;
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(.09, .26, 8), new THREE.MeshBasicMaterial({ color: '#FFE08A' })); f2.position.y = .6; g.add(f, f2);
    u.flame = [f, f2]; u.light = { y: .7, color: '#FF7A3A', power: 1.4, always: true };
  } else if (t === 'stone') {
    const r = mulberry(w * 13 + 5); for (let i = 0; i < 3; i++) g.add(mesh(new THREE.CylinderGeometry(.24 + r() * .08, .26 + r() * .08, .05, 8), L(['#C2BAA8', '#B3AB98', '#CBC4B2'][i]), (r() - .5) * .5, .025, (r() - .5) * .5));
  } else if (t === 'rock') {
    g.add(mesh(new THREE.DodecahedronGeometry(.32, 0), new THREE.MeshLambertMaterial({ color: '#8E8778', flatShading: true }), 0, .2), mesh(new THREE.DodecahedronGeometry(.18, 0), new THREE.MeshLambertMaterial({ color: '#7A7468', flatShading: true }), .3, .1, .15));
    g.add(mesh(new THREE.SphereGeometry(.2, 8, 6), new THREE.MeshLambertMaterial({ color: '#6E9A4A', flatShading: true }), -.05, .42, 0)).children; g.children[g.children.length - 1].scale.set(1.2, .35, 1);
  } else if (t === 'shrub') { g.add(bush(1.3, 7));
  } else if (t === 'flowers') {
    const fm = new THREE.MeshLambertMaterial({ map: flowerTex(), alphaTest: .5, side: THREE.DoubleSide, emissive: '#FFFFFF', emissiveMap: flowerTex(), emissiveIntensity: .35 });
    g.add(mesh(new THREE.CylinderGeometry(.42, .44, .08, 10), L('#6B4A32'), 0, .04));
    [[-.18, -.1], [.18, -.05], [0, .15], [-.05, -.2], [.2, .18]].forEach(([x, z]) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(.38, .38), fm); f.position.set(x, .26, z); g.add(f); });
  } else if (t === 'fence') { g.add(fence(1.1));
  } else if (t === 'bamboo') {
    const r = mulberry(4); for (let i = 0; i < 6; i++) { const h = 1 + r() * .8, m = mesh(new THREE.CylinderGeometry(.04, .045, h, 6), L(['#7FB04A', '#6E9E3E', '#8CBF56'][i % 3]), (r() - .5) * .5, h / 2, (r() - .5) * .5); m.rotation.z = (r() - .5) * .12; g.add(m); g.add(mesh(new THREE.ConeGeometry(.12, .25, 4), L('#6E9E3E'), m.position.x, h, m.position.z)); }
  } else if (t === 'tree') { const tr = tree('pine', 1.25, 21); g.add(tr); u.canopy = tr.userData.canopy;
  } else if (t === 'sakura') { const tr = tree('sakura', 1.9, 9); g.add(tr); u.canopy = tr.userData.canopy;
  } else if (t === 'altar') {
    g.add(hokora()); u.smoke = [];
    for (let i = 0; i < 5; i++) { const sm = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, depthWrite: false, color: '#E8E4F0' })); sm.userData = { x: .18, y: .3, z: .3, k: i / 5, p: i }; g.add(sm); u.smoke.push(sm); }
    u.light = { y: .45, z: .3, color: '#FFC27A', power: .8 };
  } else if (t === 'banner') {
    g.add(mesh(new THREE.CylinderGeometry(.03, .03, 1.9, 6), L('#3A2418'), 0, .95));
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(.36, 1.08), new THREE.MeshLambertMaterial({ map: bannerTex('漢獣'.charAt(w % 2)), side: THREE.DoubleSide })); ban.geometry.translate(.2, 0, 0); ban.position.y = 1.25; g.add(ban); u.banner = ban;
  } else if (t === 'house') { g.add(house(3)); g.scale.setScalar(1.35); u.light = { y: .5, z: .6, color: '#FFC27A', power: 1 };
  } else if (t === 'pagoda') { g.add(pagoda()); g.scale.setScalar(1.05); u.light = { y: .4, z: .6, color: '#FFB35A', power: 1 };
  } else {
    g.add(mesh(new THREE.BoxGeometry(.62, .12, .46), L('#3A3F4B'), 0, .06));
    const well = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .02, 16), new THREE.MeshPhongMaterial({ color: '#0E0C1C', shininess: 120 })); well.position.set(0, .125, .05); g.add(well);
    g.add(mesh(new THREE.BoxGeometry(.08, .08, .3), L('#16132A'), .22, .16, 0));
  }
  return { g, u };
}
function sign(text) {
  const g = new THREE.Group(), wood = L('#8B5A3A'), c = canvas(128, 80), x = c.getContext('2d'), t = tex(c);
  x.fillStyle = '#C9A27A'; x.fillRect(0, 0, 128, 80); x.strokeStyle = '#7A4E32'; x.lineWidth = 6; x.strokeRect(3, 3, 122, 74);
  fontReady.then(() => { x.fillStyle = '#2B1D16'; x.font = '52px "Yuji Syuku", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 42); t.needsUpdate = true; });
  g.add(mesh(new THREE.BoxGeometry(.07, .6, .07), wood, 0, .3), mesh(new THREE.BoxGeometry(.5, .32, .05), [wood, wood, wood, wood, new THREE.MeshLambertMaterial({ map: t }), wood], 0, .55));
  return g;
}
// Mata de pasto de papel (billboard) para decorar los bordes
let _tuft;
function tuftTex() {
  if (_tuft) return _tuft;
  const c = canvas(64), x = c.getContext('2d');
  const blades = () => { x.beginPath(); [[14, 56, 8, 18], [24, 58, 22, 8], [32, 58, 34, 4], [40, 58, 46, 10], [50, 56, 58, 20]].forEach(([a, b, cx, cy]) => { x.moveTo(a - 4, b); x.quadraticCurveTo(cx - 2, cy + 20, cx, cy); x.quadraticCurveTo(cx + 4, cy + 22, a + 4, b); }); x.closePath(); };
  blades(); x.strokeStyle = CREAM; x.lineWidth = 6; x.lineJoin = 'round'; x.stroke(); blades(); x.fillStyle = '#5E9A4A'; x.fill();
  return _tuft = tex(c);
}

// Lámina de papel (criatura) con sombra real + sombra de contacto
function makeSprite(svg, size, id) {
  const map = paperTexture(svg), geo = new THREE.PlaneGeometry(1, 1); geo.translate(0, .5, 0);
  const mat = new THREE.MeshLambertMaterial({ map, alphaTest: .5, side: THREE.DoubleSide, emissive: '#FFFFFF', emissiveMap: map, emissiveIntensity: .42 });
  const sp = new THREE.Mesh(geo, mat); sp.castShadow = true;
  sp.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: .5 });
  sp.scale.setScalar(size); sp.position.y = -.05 * size; sp.userData.id = id;
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; blob.position.y = .01; blob.scale.set(size * .62, size * .3, 1);
  const group = new THREE.Group(); group.add(blob, sp);
  return { group, sprite: sp, blob, size, ph: Math.random() * 7, squash: 0, hop: 0, flip: 1, flash: 0, base: new THREE.Vector3() };
}
// Animación común: respirar, aplastarse al tocarla, saltar
function animSprite(o, t, dt, moving = false) {
  o.squash = Math.max(0, o.squash - dt * 3); o.hop = Math.max(0, o.hop - dt * 2.2); o.flash = Math.max(0, o.flash - dt * 2.5);
  const s = o.size, breath = Math.sin(t * 2.4 + o.ph) * .025, step = moving ? Math.abs(Math.sin(t * 9 + o.ph)) * .06 : 0;
  const sq = Math.sin(o.squash * Math.PI) * .22, jump = Math.sin(o.hop * Math.PI) * .35 * s;
  o.sprite.scale.set(s * (1 - breath + sq) * o.flip, s * (1 + breath - sq), 1);
  o.sprite.position.y = -.05 * s + step * s + jump;
  o.sprite.rotation.z = moving ? Math.sin(t * 9 + o.ph) * .05 : 0;
  o.blob.material.opacity = 1 - jump * .7;
  return jump;
}

// Cielo degradado + capas de papel de fondo
function makeSky(scene) {
  const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 24, 12), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } },
    vertexShader: 'varying float vy; void main(){ vy = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bot; varying float vy; void main(){ float t = smoothstep(-.15,.45,vy); gl_FragColor = vec4(mix(bot, top, t),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
  }));
  scene.add(sky); return sky;
}
function makeLayers(scene, defs) {
  return defs.map(d => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(d.w, d.w * .375), new THREE.MeshBasicMaterial({ map: ridge(d), transparent: true, depthWrite: false, fog: false }));
    m.position.set(d.x || 0, d.y, d.z); m.userData.fade = d.fade || 0; scene.add(m); return m;
  });
}

// ---------- Motor ----------
function engine() {
  if (E) return E;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.domElement.className = 'stage-canvas';
  E = { renderer, ray: new THREE.Raycaster(), raf: 0, worlds: {}, active: null, t0: performance.now() };
  const el = renderer.domElement; let down = null; const pts = new Map(); let pinch0 = 0;
  const rayAt = e => { const r = el.getBoundingClientRect(); E.ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), E.W.camera); return E.ray; };
  const gap = () => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  el.addEventListener('pointerdown', e => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); el.setPointerCapture(e.pointerId);
    if (pts.size === 2) { pinch0 = gap(); E.W?.pinchStart?.(); if (down) { clearTimeout(down.lp); if (down.grab) E.W.grabEnd(); down.grab = false; down.moved = true; down.pinch = true; } E.W?.dragEnd?.(); return; }
    down = { x: e.clientX, y: e.clientY, moved: false }; E.W?.dragStart?.();
    if (E.W?.paintMode) E.W.paint(rayAt(e));
    else if (E.W?.grab?.(rayAt(e))) down.grab = true;
    else if (E.W?.longPress) { const ev = { clientX: e.clientX, clientY: e.clientY }; down.lp = setTimeout(() => { if (down && !down.moved && pts.size === 1) { down.long = true; E.W.longPress(rayAt(ev)); } }, 480); }
  });
  el.addEventListener('pointermove', e => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size >= 2) { if (pinch0) E.W?.pinch?.(gap() / pinch0); return; }
    if (!down || down.pinch) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.hypot(dx, dy) > 8) down.moved = true;
    if (down.moved) clearTimeout(down.lp);
    if (down.grab) { if (down.moved) E.W.grabMove(rayAt(e)); return; }
    if (E.W?.paintMode) { if (down.moved) E.W.paint(rayAt(e)); return; }
    E.W?.drag?.(dx, dy);
  });
  const up = e => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch0 = 0; if (pts.size) return;
    if (down) clearTimeout(down.lp);
    if (down?.grab) { if (down.moved) E.W.grabEnd(); else { E.W.grabbing = null; if (e.type === 'pointerup') tap(e); } }
    else if (e.type === 'pointerup' && down && !down.moved && !down.long) tap(e);
    down = null; E.W?.dragEnd?.();
  };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('wheel', e => { if (!E.W?.zoomBy) return; e.preventDefault(); E.W.zoomBy(e.deltaY < 0 ? 1.1 : 1 / 1.1); }, { passive: false });
  addEventListener('resize', () => E.host && resize());
  return E;
}
function attach(host, W) {
  engine(); E.W = W; E.active = W.name; E.host = host; E.ovEl = host.querySelector('.stage-ov');
  if (host.firstChild !== E.renderer.domElement) host.prepend(E.renderer.domElement); resize();
  if (!E.raf) loop();
}
function resize() {
  const w = E.host.clientWidth || 360, h = E.host.clientHeight || 600;
  E.renderer.setSize(w, h, false); E.w = w; E.h = h;
  Object.values(E.worlds).forEach(W => { W.camera.aspect = w / h; W.camera.updateProjectionMatrix(); W.onResize?.(w, h); });
}
function tap(e) {
  const r = E.renderer.domElement.getBoundingClientRect();
  E.ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), E.W.camera);
  E.W.tap(E.ray);
}
function hitItem(W, ray) {
  const hits = ray.intersectObjects([...W.items.values()].map(o => o.group), true).filter(h => h.object.userData.id);
  return hits[0]?.object.userData.id;
}
export function screenOf(id, W = E?.W, foot = false) {
  const o = W?.items.get(id); if (!o) return null;
  const v = new THREE.Vector3(); o.sprite ? o.sprite.getWorldPosition(v) : o.group.getWorldPosition(v);
  v.y += foot ? 0 : (o.size || 1) * .95; v.project(W.camera);
  return { x: (v.x + 1) / 2 * E.w, y: (1 - v.y) / 2 * E.h };
}
function loop() {
  E.raf = requestAnimationFrame(loop);
  if (!E.renderer.domElement.isConnected) { cancelAnimationFrame(E.raf); E.raf = 0; return; }
  if (document.hidden) return;
  const t = (performance.now() - E.t0) / 1000, dt = Math.min(.05, t - (E.last || t)); E.last = t;
  E.W.update(t, dt);
  E.ovEl?.querySelectorAll('[data-anchor]').forEach(el => {
    const foot = 'foot' in el.dataset, p = screenOf(el.dataset.anchor, E.W, foot); if (!p) return el.style.display = 'none';
    el.style.display = ''; el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, ${foot ? '4px' : '-100%'})`;
  });
  if (E.W.bg) { const r = E.renderer; r.autoClear = false; r.clear(); r.render(E.W.bg.scene, E.W.bg.cam); r.clearDepth(); r.render(E.W.scene, E.W.camera); r.autoClear = true; }
  else E.renderer.render(E.W.scene, E.W.camera);
}
export function poke(id) { const o = E?.W?.items.get(id); if (o) o.squash = 1; }
export function hopAll(p = .3) { E?.W?.items.forEach(o => o.sprite && Math.random() < p && (o.hop = 1)); }
export function emoteAt(id, text, cls = 'emote3d', ms = 1600) {
  if (!E?.ovEl) return; const b = document.createElement('div'); b.className = cls; b.textContent = text; b.dataset.anchor = id;
  E.ovEl.append(b); setTimeout(() => b.remove(), ms);
}

// =====================================================================
// SANTUARIO · una isla habitable que crece por etapas
// =====================================================================
const T = 1.25; // tamaño de una casilla en el mundo
function cliffTexture() {
  const c = canvas(256, 128), x = c.getContext('2d'), r = mulberry(31);
  x.fillStyle = '#5E584E'; x.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 46; i++) { const w = 22 + r() * 40, h = 14 + r() * 26, px = r() * 256, py = r() * 128; x.fillStyle = ['#7A7468', '#6E685C', '#857E70', '#68625A'][i % 4]; x.beginPath(); x.roundRect(px - w / 2, py - h / 2, w, h, 6); x.fill(); x.strokeStyle = 'rgba(30,26,22,.35)'; x.lineWidth = 2; x.stroke(); }
  x.fillStyle = '#5E8A48'; x.fillRect(0, 0, 256, 7); for (let px = 0; px < 256; px += 8) { x.beginPath(); x.moveTo(px, 6); x.lineTo(px + 4, 12 + r() * 8); x.lineTo(px + 8, 6); x.fill(); }
  const t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function plazaTexture(w, h, wild) {
  const P = 100, c = canvas(Math.round(w * P), Math.round(h * P)), x = c.getContext('2d'), r = mulberry(17), W0 = c.width, H0 = c.height;
  // base de tierra con borde irregular (círculos superpuestos): se funde con el pasto
  x.fillStyle = wild ? '#A49A6E' : '#BDB29A';
  x.beginPath(); x.roundRect(W0 * .1, H0 * .12, W0 * .8, H0 * .76, 60); x.fill();
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, px = W0 / 2 + Math.cos(a) * W0 * (.36 + r() * .08), py = H0 / 2 + Math.sin(a) * H0 * (.34 + r() * .08); x.beginPath(); x.arc(px, py, 20 + r() * 34, 0, 7); x.fill(); }
  x.globalCompositeOperation = 'source-atop';
  const n = Math.round(w * h * (wild ? 3 : 8));
  for (let i = 0; i < n; i++) {
    const px = r() * W0, py = r() * H0, rr = 16 + r() * 20, k = 5 + (r() * 3 | 0);
    x.beginPath(); for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2 + r() * .4, d = rr * (.75 + r() * .3); x[j ? 'lineTo' : 'moveTo'](px + Math.cos(a) * d, py + Math.sin(a) * d * .8); } x.closePath();
    x.fillStyle = ['#D8D0BE', '#CCC4B0', '#E2DBCA', '#C4BCA8'][i % 4]; x.fill(); x.strokeStyle = 'rgba(90,78,60,.35)'; x.lineWidth = 3; x.stroke();
  }
  x.fillStyle = wild ? 'rgba(110,160,80,.6)' : 'rgba(110,160,80,.28)';
  for (let i = 0; i < w * h * (wild ? 16 : 5); i++) { x.beginPath(); x.ellipse(r() * W0, r() * H0, 10 + r() * 20, 6 + r() * 10, r() * 3, 0, 7); x.fill(); }
  return tex(c);
}
let _flower;
function flowerTex() {
  if (_flower) return _flower;
  const c = canvas(64), x = c.getContext('2d'), r = mulberry(5);
  const spots = [[20, 40, '#FFFFFF'], [36, 30, '#FFB8C8'], [46, 44, '#F2D45A'], [28, 50, '#FFFFFF'], [40, 52, '#FFB8C8']];
  spots.forEach(([px, py]) => { x.fillStyle = CREAM; x.beginPath(); x.arc(px, py, 9, 0, 7); x.fill(); });
  spots.forEach(([px, py, col]) => { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; x.fillStyle = col; x.beginPath(); x.arc(px + Math.cos(a) * 3.5, py + Math.sin(a) * 3.5, 3.4, 0, 7); x.fill(); } x.fillStyle = '#E8A23A'; x.beginPath(); x.arc(px, py, 2, 0, 7); x.fill(); });
  return _flower = tex(c);
}
function bannerTex(k) {
  const c = canvas(64, 192), x = c.getContext('2d'), t = tex(c);
  x.fillStyle = '#2A2F5A'; x.fillRect(0, 0, 64, 192); x.fillStyle = CREAM; x.fillRect(0, 0, 64, 8); x.fillRect(0, 184, 64, 8);
  fontReady.then(() => { x.fillStyle = CREAM; x.font = '44px "Yuji Syuku", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; [...k].forEach((ch, i) => x.fillText(ch, 32, 56 + i * 64)); t.needsUpdate = true; });
  return t;
}
function islandShape(rx, rz, zc, k = 1, seed = 1) {
  const s = new THREE.Shape(), N = 56, r = mulberry(seed), ph = [r() * 7, r() * 7, r() * 7];
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2, n = 1 + Math.sin(a * 3 + ph[0]) * .04 + Math.sin(a * 5 + ph[1]) * .03 + Math.sin(a * 9 + ph[2]) * .015;
    const px = Math.cos(a) * rx * k * n, pz = zc + Math.sin(a) * rz * k * n;
    i ? s.lineTo(px, pz) : s.moveTo(px, pz);
  }
  return s;
}
function extrudeShape(shape, depth, mats) { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 4 }); g.rotateX(Math.PI / 2); const m = new THREE.Mesh(g, mats); m.receiveShadow = true; m.castShadow = false; return m; }
function uvTop(m, x0, x1, z0, z1) { const p = m.geometry.attributes.position, uv = m.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) if (Math.abs(p.getY(i)) < .001) uv.setXY(i, (p.getX(i) - x0) / (x1 - x0), 1 - (p.getZ(i) - z0) / (z1 - z0)); }
function uvSide(m, per) { const p = m.geometry.attributes.position, uv = m.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) if (Math.abs(p.getY(i)) > .001) uv.setXY(i, (Math.atan2(p.getZ(i), p.getX(i)) + Math.PI) * per, -p.getY(i)); }

function tree(kind, s = 1, seed = 1) {
  const g = new THREE.Group(), r = mulberry(seed);
  const greens = kind === 'sakura' ? ['#F4A7B9', '#F7C1CE', '#E98AA3'] : kind === 'old' ? ['#6E7A3E', '#7D8A48'] : ['#3F7A45', '#4E8F4A', '#2F6B3A', '#5A9A50'];
  g.add(mesh(new THREE.CylinderGeometry(.07, .12, .9, 7), L(kind === 'sakura' ? '#5A3A2E' : '#6B4430'), 0, .45));
  const canopy = new THREE.Group(); canopy.position.y = .95;
  const n = kind === 'old' ? 2 : 4;
  for (let i = 0; i < n; i++) {
    const m = mesh(new THREE.IcosahedronGeometry(.32 + r() * .2, 1), new THREE.MeshLambertMaterial({ color: greens[i % greens.length], flatShading: true }), (r() - .5) * .55, r() * .35, (r() - .5) * .45);
    canopy.add(m);
  }
  g.add(canopy); g.scale.setScalar(s); g.userData.canopy = canopy; g.userData.ph = r() * 7;
  return g;
}
function hokora() {
  const g = new THREE.Group(), stone = L('#A9A292');
  g.add(mesh(new THREE.BoxGeometry(.7, .22, .52), stone, 0, .11), mesh(new THREE.BoxGeometry(.42, .36, .34), L('#8B5A3A'), 0, .4));
  const roof = mesh(new THREE.ConeGeometry(.38, .22, 4), L('#3A3A4A'), 0, .69); roof.rotation.y = Math.PI / 4; g.add(roof);
  g.add(mesh(new THREE.CylinderGeometry(.06, .05, .08, 10), L('#C8392A'), .18, .26, .3));
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(.18, .16), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); glow.position.set(0, .42, .171); g.add(glow);
  return g;
}
function honden() {
  const g = new THREE.Group(), wood = L('#8B5A3A'), dark = L('#3A3A4A');
  g.add(mesh(new THREE.BoxGeometry(1.7, .26, 1.3), L('#A9A292'), 0, .13), mesh(new THREE.BoxGeometry(1.4, .8, 1), wood, 0, .66));
  [[-.62, .46], [.62, .46]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(.05, .05, .8, 8), L('#C8392A'), x, .66, z)));
  const win = new THREE.Mesh(new THREE.PlaneGeometry(.5, .32), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); win.position.set(0, .7, .502); g.add(win);
  const prof = new THREE.Shape(); prof.moveTo(-1.05, 0); prof.lineTo(0, .62); prof.lineTo(1.05, 0); prof.lineTo(.95, -.06); prof.lineTo(0, .5); prof.lineTo(-.95, -.06); prof.closePath();
  const rg = new THREE.ExtrudeGeometry(prof, { depth: 1.5, bevelEnabled: false }); rg.translate(0, 0, -.75);
  const roof = new THREE.Mesh(rg, dark); roof.position.y = 1.06; roof.castShadow = true; g.add(roof);
  g.add(mesh(new THREE.BoxGeometry(.5, .06, .3), L('#A9A292'), 0, .03, .75));
  return g;
}
function house(seed) {
  const g = new THREE.Group(), r = mulberry(seed);
  g.add(mesh(new THREE.BoxGeometry(.9, .6, .7), L(['#C9A27A', '#B8946C'][seed % 2]), 0, .3));
  const roof = mesh(new THREE.ConeGeometry(.75, .45, 4), L('#4A3A3A'), 0, .82); roof.rotation.y = Math.PI / 4; roof.scale.z = .8; g.add(roof);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(.2, .18), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); win.position.set(r() < .5 ? -.2 : .2, .34, .352); g.add(win);
  return g;
}
function pagoda() {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const w = 1 - i * .18, y = .1 + i * .5;
    g.add(mesh(new THREE.BoxGeometry(w * .7, .32, w * .7), L('#B8392A'), 0, y + .16));
    const roof = mesh(new THREE.ConeGeometry(w * .75, .2, 4), L('#2E2A3A'), 0, y + .42); roof.rotation.y = Math.PI / 4; g.add(roof);
  }
  g.add(mesh(new THREE.CylinderGeometry(.02, .02, .5, 6), L('#D9A93A'), 0, 2.4));
  return g;
}
function fence(len) {
  const g = new THREE.Group(), wood = L('#7A4E32'), n = Math.max(2, Math.round(len / .55));
  for (let i = 0; i < n; i++) g.add(mesh(new THREE.BoxGeometry(.09, .42, .09), wood, -len / 2 + i * len / (n - 1), .21, 0));
  g.add(mesh(new THREE.BoxGeometry(len, .06, .06), wood, 0, .32, 0), mesh(new THREE.BoxGeometry(len, .06, .06), wood, 0, .16, 0));
  return g;
}
function bush(s, seed) {
  const g = new THREE.Group(), r = mulberry(seed);
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.IcosahedronGeometry(.18 + r() * .1, 1), new THREE.MeshLambertMaterial({ color: ['#4E8F4A', '#3F7A45', '#5A9A50'][i], flatShading: true }), (r() - .5) * .35, .12, (r() - .5) * .2));
  g.scale.setScalar(s); return g;
}

// =====================================================================
// SANTUARIO DE PAPEL · isla de casillas 3D simples con recortes de papel 2D encima.
// Vista maqueta (perspectiva de lente angosta), giro libre y zoom. Cielo de papel según la hora,
// lluvia de vez en cuando. La grilla (world.js) manda: cada casilla tiene tipo, altura y rampa.
// =====================================================================
const LV = .42, SLAB = .24, TIER_H = 1.25, FOV = 24, ELEV = .58;
// Ancho en casillas del recorte de cada pieza de papel
const ART_W = { farol: .5, pino: .74, bambu: .52, arbusto: .72, flores: .56, roca: .56, torii: 1.0, cerezo: 1.08, minka: .95, pagoda: .74, templo: .93, castillo: .92, casate: .96, komainu: .6, campana: .62, incienso: .5, ema: .64, nobori: .32, sagrada: .6, chochin: .42, refugio: .95, suzuri: .6, brasero: .55, cerca: .9, arbol: .9 };
const GLOW = { farol: { c: '#FFB45A', p: 1.6 }, chochin: { c: '#FF8A5A', p: 1.3 }, brasero: { c: '#FF7A3A', p: 1.4, always: true }, incienso: { c: '#FFC27A', p: .8 } };
const GROUND_C = { grass: '#8DBF5E', moss: '#5F9447', dirt: '#B98D5A', sand: '#E2CE97', slate: '#AAA59B', snow: '#F3F0EA', water: '#5AA5D2' };
const STRATA = ['#A47D55', '#93704C', '#8A8075'];
// Cielo de papel: madrugada, amanecer, mañana, tarde, atardecer, noche
const PK = [
  { h: 0, in: '#3B4272', out: '#171A33', sun: '#9FB3FF', si: 1.1, amb: 1.15, night: 1 },
  { h: 5, in: '#4A4A7A', out: '#262B4F', sun: '#9FB3FF', si: 1.1, amb: 1.15, night: .9 },
  { h: 6.5, in: '#FFE2C2', out: '#E8A88A', sun: '#FFC690', si: 2.1, amb: 1.6, night: .25 },
  { h: 9, in: '#FFF6E4', out: '#E3D2B4', sun: '#FFF0D2', si: 2.8, amb: 2.0, night: 0 },
  { h: 16, in: '#FFF2DC', out: '#E6CDA8', sun: '#FFE6C0', si: 2.7, amb: 1.95, night: 0 },
  { h: 18.5, in: '#FFD9B0', out: '#D98E7A', sun: '#FFB27A', si: 2.2, amb: 1.7, night: .2 },
  { h: 20, in: '#5A4A7A', out: '#2A2550', sun: '#B0A0FF', si: 1.3, amb: 1.25, night: .75 },
  { h: 21.5, in: '#3B4272', out: '#171A33', sun: '#9FB3FF', si: 1.1, amb: 1.15, night: 1 },
  { h: 24, in: '#3B4272', out: '#171A33', sun: '#9FB3FF', si: 1.1, amb: 1.15, night: 1 },
];
function paperSky(h) {
  const i = PK.findIndex(k => k.h > h), a = PK[i - 1], b = PK[i], t = (h - a.h) / (b.h - a.h);
  const mix = k => new THREE.Color(a[k]).lerp(new THREE.Color(b[k]), t), n = k => a[k] + (b[k] - a[k]) * t;
  return { in: mix('in'), out: mix('out'), sun: mix('sun'), si: n('si'), amb: n('amb'), night: n('night') };
}
function hash(i, j, s = 0) { const v = Math.sin(i * 127.1 + j * 311.7 + s * 71.3) * 43758.5453; return v - Math.floor(v); }
// Proyección de caja: el grano queda a la misma escala en tapas, costados, rampas y esquinas
function boxUV(g) {
  if (g.index) g = g.toNonIndexed();
  g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v; if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u + .5; uv[i * 2 + 1] = v + .5;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}
function roundSquare(w, d, rr) { // rr: radio por esquina [(-,-),(+,-),(+,+),(-,+)] en coordenadas de la forma
  const a = w / 2, b = d / 2, s = new THREE.Shape();
  s.moveTo(-a + rr[0], -b); s.lineTo(a - rr[1], -b); if (rr[1]) s.quadraticCurveTo(a, -b, a, -b + rr[1]);
  s.lineTo(a, b - rr[2]); if (rr[2]) s.quadraticCurveTo(a, b, a - rr[2], b);
  s.lineTo(-a + rr[3], b); if (rr[3]) s.quadraticCurveTo(-a, b, -a, b - rr[3]);
  s.lineTo(-a, -b + rr[0]); if (rr[0]) s.quadraticCurveTo(-a, -b, -a + rr[0], -b);
  return s;
}
function extrudeY(shape, h) { const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 6 }); g.rotateX(-Math.PI / 2); g.translate(0, -h / 2, 0); return boxUV(g); }

// Recorte de papel parado (siempre mira a la cámara): Lambert para que tome la luz del día y la noche
const propMats = new Map();
function propMat(id) {
  if (propMats.has(id)) return propMats.get(id);
  const map = paper.artTex(id);
  const m = { front: new THREE.MeshLambertMaterial({ map, transparent: true, alphaTest: .04, side: THREE.DoubleSide, emissive: '#FFFFFF', emissiveMap: map, emissiveIntensity: .32 }),
    depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: .5 }) };
  propMats.set(id, m); return m;
}
function paperProp(id, w, shadow = true) {
  const h = w * paper.artAspect(id), geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2 - w * .07, 0);
  const M = propMat(id), m = new THREE.Mesh(geo, M.front);
  if (shadow) { m.castShadow = true; m.customDepthMaterial = M.depth; }
  m.rotation.order = 'YXZ';
  return m;
}
let _wmat, _fallMat, _foamMat;
const waterMat = () => _wmat ??= new THREE.MeshLambertMaterial({ color: GROUND_C.water, emissive: '#1F5E86', emissiveIntensity: .25 });
const fallMat = () => _fallMat ??= new THREE.MeshLambertMaterial({ color: GROUND_C.water, emissive: '#1F5E86', emissiveIntensity: .18, side: THREE.DoubleSide });
const foamMat = () => _foamMat ??= new THREE.MeshLambertMaterial({ map: paper.artTex('espuma'), transparent: true, alphaTest: .04, side: THREE.DoubleSide, emissive: '#FFFFFF', emissiveMap: paper.artTex('espuma'), emissiveIntensity: .6 });
const groundMats = new Map();
function gMat(col) {
  if (!groundMats.has(col)) groundMats.set(col, new THREE.MeshLambertMaterial({ color: col, map: paper.grainOn() ? paper.grainTex() : null }));
  return groundMats.get(col);
}
paper.onGrain(on => { groundMats.forEach(m => { m.map = on ? paper.grainTex() : null; m.needsUpdate = true; }); E?.host?.classList.toggle('grain', on); });
const edgeMat = new THREE.LineBasicMaterial({ color: '#3B2F26', transparent: true, opacity: .4 });
function edges(m, parent) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 25), edgeMat); e.position.copy(m.position); e.rotation.copy(m.rotation); parent.add(e); }

function sanctuary() {
  if (E.worlds.sanct) return E.worlds.sanct;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(FOV, 1, .5, 220);
  // Fondo: degradado de papel + sol, luna, estrellas y nubes en el plano de la pantalla
  const bgScene = new THREE.Scene(), bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
  const grad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false, uniforms: { cin: { value: new THREE.Color() }, cout: { value: new THREE.Color() } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: 'uniform vec3 cin; uniform vec3 cout; varying vec2 vUv; void main(){ float d = length((vUv - vec2(.5, .62)) * vec2(1.15, 1.)); gl_FragColor = vec4(mix(cin, cout, smoothstep(0., .78, d)), 1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
  }));
  grad.frustumCulled = false; bgScene.add(grad);
  const skyBit = (id, w, order) => { const h = w * paper.artAspect(id); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: paper.artTex(id), transparent: true, depthTest: false, depthWrite: false })); m.renderOrder = order; bgScene.add(m); return m; };
  const stars = Array.from({ length: 24 }, () => { const s = skyBit('estrella', .045 + Math.random() * .05, 1); s.userData = { x: Math.random() * 2 - 1, y: .05 + Math.random() * .8, p: Math.random() * 6 }; return s; });
  const sunM = skyBit('sol', .44, 2), moonM = skyBit('luna', .36, 2);
  const skyClouds = Array.from({ length: 7 }, (_, i) => { const c = skyBit('nube', .24 + Math.random() * .18, 3); c.userData = { x: Math.random() * 2.4 - 1.2, y: .1 + Math.random() * .5, v: .012 + Math.random() * .02, extra: i >= 3 }; return c; });

  const hemi = new THREE.HemisphereLight('#FFF3E0', '#7D6A58', 2), sun = new THREE.DirectionalLight('#FFF0D2', 2.6);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0008; sun.shadow.normalBias = .03; sun.shadow.radius = 3;
  scene.add(hemi, sun, sun.target);
  const world = new THREE.Group(), island = new THREE.Group(), ov = new THREE.Group(), fx = new THREE.Group();
  scene.add(world); world.add(island, ov, fx);
  const lights = Array.from({ length: 6 }, () => { const p = new THREE.PointLight('#FFB45A', 0, 3.6, 2); scene.add(p); return p; });
  // Mar de nubes debajo de la isla
  const seaClouds = Array.from({ length: 8 }, (_, i) => { const m = paperProp('nube', 1.1 + Math.random() * .8, false); m.userData = { a: i / 8 * Math.PI * 2, v: .05 + Math.random() * .08, y: Math.random() }; scene.add(m); return m; });
  // Luciérnagas de noche
  const FF = 28, fg = new THREE.BufferGeometry(), fseeds = Array.from({ length: FF }, () => Math.random() * 20);
  fg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FF * 3), 3));
  const fmat = new THREE.PointsMaterial({ map: dotTex(), size: .2, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: '#FFE27A', opacity: 0 });
  scene.add(new THREE.Points(fg, fmat));
  // Pétalos del cerezo
  const petals = Array.from({ length: 24 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.06, .045), new THREE.MeshLambertMaterial({ color: i % 2 ? '#F7C4D4' : '#EFA0BC', side: THREE.DoubleSide, emissive: '#FFFFFF', emissiveIntensity: .3 })); p.visible = false; p.userData.life = 0; fx.add(p); return p; });
  // Lluvia
  const RN = 520, rpos = new Float32Array(RN * 6), rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rpos, 3));
  const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#6E93AE', transparent: true, opacity: .55 })); rain.visible = false; scene.add(rain);
  const drop = (i, any) => { const s = (W.N || 5) / 2 + 1.5, x = (Math.random() * 2 - 1) * s, z = (Math.random() * 2 - 1) * s, y = any ? Math.random() * 7 : 7; rpos.set([x, y, z, x + .04, y - .28, z], i * 6); };
  // Ondas de papel en el agua
  const ringTex = (() => { const c = canvas(64), x = c.getContext('2d'); x.strokeStyle = 'rgba(255,253,246,.95)'; x.lineWidth = 5; x.beginPath(); x.arc(32, 32, 26, 0, 7); x.stroke(); return tex(c); })();
  const rings = Array.from({ length: 8 }, () => { const r = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, depthWrite: false })); r.rotation.x = -Math.PI / 2; r.visible = false; r.userData.life = 0; fx.add(r); return r; });

  const W = { name: 'sanct', scene, camera, world, ov, island, fx, items: new Map(), opts: {}, cols: 0, rows: 0, N: 5, sig: '', tops: new Map(), tufts: [], foams: [], az: Math.PI / 4, azT: Math.PI / 4, zoom: 1, rainK: 0, nightK: 0,
    bg: { scene: bgScene, cam: bgCam }, onResize(w, h) { const a = w / h; bgCam.left = -a; bgCam.right = a; bgCam.updateProjectionMatrix(); } };
  for (let i = 0; i < RN; i++) drop(i, true);
  let az0 = 0;
  W.dragStart = () => { az0 = W.az; W.dragging = true; };
  W.drag = dx => { if (W.paintMode || W.focus || W.grabbing) return; W.az = W.azT = az0 - dx * .009; };
  W.dragEnd = () => { W.dragging = false; };
  W.pinchStart = () => { W.z0 = W.zoom; };
  W.pinch = k => { W.zoom = Math.min(2.6, Math.max(.6, (W.z0 || 1) * k)); };
  W.zoomBy = k => { W.zoom = Math.min(2.6, Math.max(.6, W.zoom * k)); };
  const tileHit = ray => { const h = ray.intersectObjects([...W.tops.values()], false)[0]; return h ? h.object.userData : null; };
  W.paint = ray => { const t = tileHit(ray); if (t) W.opts.onTile?.(t.x, t.y); };
  W.tap = ray => {
    const { mode, onTap, onCell, tool, onTile } = W.opts;
    if (mode === 'placing') { const t = tileHit(ray); if (t) onCell?.(t.x, t.y); return; }
    if (tool && tool !== 'move') { if (W.paintMode) return; const t = tileHit(ray); if (t) onTile?.(t.x, t.y); return; }
    const id = hitItem(W, ray); if (id) { poke(id); onTap?.(id); return; }
    if (mode === 'build') { const t = tileHit(ray); if (t) onCell?.(t.x, t.y); }
  };
  // Construir: se agarra un objeto o KANJŪ y se arrastra; la huella se pinta verde (entra) o roja (no entra)
  const ghost = new THREE.Group(); world.add(ghost);
  const gq = (col) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.94, .94), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .55, depthWrite: false, depthTest: false })); m.rotation.x = -Math.PI / 2; m.renderOrder = 5; return m; };
  W.grab = ray => {
    const { mode, tool } = W.opts; if (mode !== 'build' || (tool && tool !== 'move')) return false;
    const id = hitItem(W, ray), o = id && W.items.get(id); if (!o || o.d.kind === 'away') return false;
    const t = tileHit(ray), d = o.d;
    W.grabbing = { id, o, ox: t ? Math.min(d.w - 1, Math.max(0, t.x - d.x)) : 0, oy: t ? Math.min(d.h - 1, Math.max(0, t.y - d.y)) : 0, x: d.x, y: d.y, ok: true, moved: false };
    return true;
  };
  W.grabMove = ray => {
    const g = W.grabbing, t = g && tileHit(ray); if (!t) return;
    const d = g.o.d, x = Math.min(W.cols - d.w, Math.max(0, t.x - g.ox)), y = Math.min(W.rows - d.h, Math.max(0, t.y - g.oy));
    if (x === g.x && y === g.y && g.moved) return;
    g.x = x; g.y = y; g.moved = x !== d.x || y !== d.y; g.ok = !g.moved || !!W.opts.canPlace?.(g.id, x, y);
    const [cx, cy, cz] = toWorld(W, { ...d, x, y }); g.o.group.position.set(cx, cy + .18, cz);
    ghost.clear(); const ox = (W.cols - 1) / 2, oz = (W.rows - 1) / 2;
    for (let j = 0; j < d.h; j++) for (let i = 0; i < d.w; i++) { const q = gq(g.ok ? '#5DB84F' : '#E8452C'); q.position.set(x + i - ox, W.tY(x + i, y + j) + .05, y + j - oz); ghost.add(q); }
  };
  W.grabEnd = () => {
    const g = W.grabbing; W.grabbing = null; ghost.clear(); if (!g) return;
    const [cx, cy, cz] = toWorld(W, g.o.d); g.o.group.position.set(cx, cy, cz);
    if (g.moved) W.opts.onMove?.(g.id, g.ok ? g.x : null, g.ok ? g.y : null);
  };
  W.longPress = ray => { const id = hitItem(W, ray); if (id && W.opts.mode === 'play') W.opts.onLong?.(id); };

  const tmp = new THREE.Vector3();
  W.update = (t, dt) => {
    const h = hourNow(), sk = paperSky(h), R0 = W.opts.rain;
    if (!(t < W.rainCheck)) { W.rainCheck = t + 2; W.rainNow = !!(typeof R0 === 'function' ? R0() : R0); } const rainNow = W.rainNow;
    W.rainK += ((rainNow ? 1 : 0) - W.rainK) * Math.min(1, dt * 1.2); const rk = W.rainK, night = sk.night; W.nightK = night;
    // cielo
    const dayRainIn = new THREE.Color('#CDD3D6'), dayRainOut = new THREE.Color('#AEB8BF'), nRainIn = new THREE.Color('#2A2F3F'), nRainOut = new THREE.Color('#1B1E2B');
    grad.material.uniforms.cin.value.copy(sk.in).lerp(dayRainIn.lerp(nRainIn, night), rk * .85);
    grad.material.uniforms.cout.value.copy(sk.out).lerp(dayRainOut.lerp(nRainOut, night), rk * .85);
    const asp = bgCam.right, cl = v => Math.min(1, Math.max(0, v));
    // El sol sólo existe de 5:30 a 19:30 y se hunde al ponerse; la luna sale de 18:30 a 6:30
    const dp = cl((h - 5.5) / 14), mt = (h - 18.5 + 24) % 24, np = cl(mt / 12), sunVis = cl((h - 5.5) / .8) * cl((19.5 - h) / .8), moonVis = cl(mt / .8) * cl((12 - mt) / .8);
    sunM.position.set(-asp * .7 + dp * asp * 1.4, .1 + Math.sin(dp * Math.PI) * .66, 0); sunM.rotation.z = t * .04; sunM.material.opacity = sunVis * (1 - rk * .92); sunM.visible = sunVis > .01;
    moonM.position.set(-asp * .7 + np * asp * 1.4, .15 + Math.sin(np * Math.PI) * .6, 0); moonM.material.opacity = moonVis * (1 - rk * .85); moonM.visible = moonVis > .01;
    stars.forEach(s => { const u = s.userData; s.position.set(u.x * asp, u.y, 0); s.material.opacity = night * (1 - rk) * (.55 + .45 * Math.sin(t * 2 + u.p)); });
    const cc = new THREE.Color('#FFFFFF').lerp(new THREE.Color('#9AA3AB'), rk).lerp(new THREE.Color('#5D6592'), night * .8);
    skyClouds.forEach(c => { const u = c.userData; u.x += u.v * dt * (1 + rk); if (u.x * asp > asp + .5) u.x = -(asp + .5) / asp; c.position.set(u.x * asp, u.y, 0); c.material.color.copy(cc); c.material.opacity = u.extra ? rk : 1; });
    // luz
    hemi.intensity = sk.amb * (1 - rk * .15); hemi.color.set('#FFF3E0').lerp(new THREE.Color('#7D8CC8'), night); hemi.groundColor.set('#7D6A58').lerp(new THREE.Color('#2C2C48'), night);
    sun.color.copy(sk.sun); sun.intensity = sk.si * (1 - rk * .5);
    const c0 = W.center || 0; sun.position.set(c0 - 6, 12, c0 + 5); sun.target.position.set(c0, 0, c0);
    waterMat().emissiveIntensity = .22 + Math.sin(t * 1.4) * .06;
    // cámara maqueta: perspectiva angosta, giro libre, zoom
    W.az += (W.azT - W.az) * Math.min(1, dt * 7);
    const bd = baseDepth(W.N), hf = Math.tan(FOV * Math.PI / 360), asp3 = camera.aspect;
    let halfH = Math.max(W.N * .62 + 1.1 + bd * .32, (W.N * .8 + .3) / asp3) / W.zoom, el = ELEV;
    let tx = c0, ty = -.6 - bd * .3 - (W.opts.mode === 'play' ? 0 : W.N * .12), tz = c0;
    const fo = W.focus && W.items.get(W.focus);
    if (fo?.sprite) { fo.sprite.getWorldPosition(tmp); halfH = fo.size * 1.25; el = .32; tx = tmp.x; ty = tmp.y + fo.size * .45; tz = tmp.z; }
    const a = W.az + (W.dragging ? 0 : Math.sin(t * .22) * .02), D = halfH / hf * 1.02;
    const want = new THREE.Vector3(tx + Math.sin(a) * Math.cos(el) * D, ty + Math.sin(el) * D, tz + Math.cos(a) * Math.cos(el) * D), look = new THREE.Vector3(tx, ty, tz);
    W.cam ??= { p: want.clone(), l: look.clone() };
    const k = Math.min(1, dt * (fo ? 3.2 : 6)); W.cam.p.lerp(want, k); W.cam.l.lerp(look, k);
    camera.position.copy(W.cam.p); camera.lookAt(W.cam.l); camera.far = D * 3 + 60; camera.updateProjectionMatrix();
    const camAz = Math.atan2(camera.position.x - W.cam.l.x, camera.position.z - W.cam.l.z);
    // recortes: miran a la cámara y se mecen con el viento
    W.wind = .35 + .25 * Math.sin(t * .5) + rk * .5;
    W.tufts.forEach(m => { m.rotation.y = camAz; m.rotation.z = Math.sin(t * 2.3 + m.userData.p) * .14 * (.5 + W.wind) - W.wind * .1; });
    W.foams.forEach(f => { const s = 1 + Math.round(Math.sin(t * 5 + f.userData.p) * 2) * .06; f.scale.set(1, s, 1); });
    seaClouds.forEach(m => { const u = m.userData; u.a += u.v * dt * .1; const R = W.N * .9 + 3; m.position.set(c0 + Math.cos(u.a) * R, -bd * .75 - 1 - u.y * 1.4, c0 + Math.sin(u.a) * R); m.rotation.y = camAz; m.material.color.copy(cc); });
    const lit = [];
    W.items.forEach(o => {
      const d = o.d;
      if (o.mon) {
        const w = o.wander;
        if (d.kind === 'mon' && t > w.next) { const ax = Math.max(.1, d.w / 2 - .32), az2 = Math.max(.1, d.h / 2 - .32); w.tx = (Math.random() * 2 - 1) * ax; w.tz = (Math.random() * 2 - 1) * az2; w.next = t + 2 + Math.random() * 4; }
        const vx = (w.tx - w.x) * 1.2 * dt, vz = (w.tz - w.z) * 1.2 * dt; w.x += vx; w.z += vz;
        const moving = Math.hypot(vx, vz) > .002, side = vx * Math.cos(camAz) - vz * Math.sin(camAz); if (Math.abs(side) > .0015) o.flip = side > 0 ? 1 : -1;
        animSprite(o, t, dt, moving);
        o.sprite.position.x = w.x; o.sprite.position.z = w.z; o.sprite.rotation.y = camAz;
        o.blob.position.set(w.x, .012, w.z);
        o.sprite.material.emissiveIntensity = (d.insp ? .62 : .42) - night * .14 + (d.insp ? Math.sin(t * 4) * .08 : 0);
      } else if (o.sprite && !o.flat) {
        o.sprite.rotation.y = camAz; if (o.amp) o.sprite.rotation.z = (Math.sin(t * 2.3 + o.ph0) * o.amp * (.5 + W.wind) - W.wind * o.amp * .7);
      }
      const gl = o.glow; if (gl && (night > .15 || gl.always)) { o.group.getWorldPosition(tmp); lit.push({ x: tmp.x, y: tmp.y + .7, z: tmp.z, ...gl }); }
    });
    lights.forEach((p, i) => { const L0 = lit[i]; if (!L0) { p.intensity = 0; return; } p.color.set(L0.c); p.position.set(L0.x, L0.y, L0.z); p.intensity = L0.p * (L0.always ? .6 + night * 1.6 : night * 2.2) * (1 + Math.sin(t * 8 + i) * .06); });
    // luciérnagas
    fmat.opacity = night * (1 - rk * .7);
    if (fmat.opacity > .01) { const P = fg.attributes.position, R = W.N * .42; fseeds.forEach((s, i) => P.setXYZ(i, c0 + Math.sin(t * .23 * (1 + s % 1) + s) * R, .4 + .45 * (.5 + .5 * Math.sin(t * .9 + s * 3)), c0 + Math.cos(t * .19 * (1 + s % 1) + s * 1.7) * R)); P.needsUpdate = true; }
    // pétalos
    const sak = [...W.items.values()].filter(o => o.d.t === 'sakura'); W.petalT = (W.petalT || 0) - dt;
    if (sak.length && W.petalT <= 0) { W.petalT = .3 / Math.max(.4, W.wind); const p = petals.find(p => !p.visible); if (p) { sak[Math.random() * sak.length | 0].group.getWorldPosition(tmp); p.position.set(tmp.x + (Math.random() - .5) * 1.2, tmp.y + 1.3 + Math.random() * .4, tmp.z + (Math.random() - .5) * 1); p.userData = { life: 1, s: Math.random() * 6 }; p.visible = true; } }
    petals.forEach(p => { if (!p.visible) return; p.userData.life -= dt * .28; p.position.y -= dt * .32; p.position.x += dt * W.wind * .45; p.rotation.set(t * 2 + p.userData.s, t * 1.3, t * 1.7); if (p.userData.life <= 0) p.visible = false; });
    // ondas y lluvia
    W.ringT = (W.ringT || 0) - dt;
    if (W.ringT <= 0 && W.waters?.length) { W.ringT = (rk > .5 ? .12 : .7) + Math.random() * .4; const r = rings.find(r => !r.visible); if (r) { const [x, y, z] = W.waters[Math.random() * W.waters.length | 0]; r.position.set(x + (Math.random() - .5) * .7, y + .02, z + (Math.random() - .5) * .7); r.userData.life = 1; r.visible = true; } }
    rings.forEach(r => { if (!r.visible) return; r.userData.life -= dt * .7; const s = .08 + (1 - r.userData.life) * .42; r.scale.set(s, s, s); r.material.opacity = Math.max(0, r.userData.life) * .8; if (r.userData.life <= 0) r.visible = false; });
    rain.visible = rk > .05; rain.material.opacity = .55 * rk;
    if (rain.visible) { for (let i = 0; i < RN; i++) { const o = i * 6; rpos[o] += dt * W.wind * .4; rpos[o + 3] += dt * W.wind * .4; rpos[o + 1] -= dt * 9; rpos[o + 4] -= dt * 9; if (rpos[o + 4] < -.2) drop(i, false); } rg.attributes.position.needsUpdate = true; rain.position.set(c0, 0, c0); }
  };
  return E.worlds.sanct = W;
}
const baseDepth = N => { let n = 0; for (let j = 1; N - 2 * j >= 5; j++) n++; return .66 + n * TIER_H; };

// Isla de casillas: cada una con su tipo, altura y rampa; cascadas donde el agua cae; base escalonada
function buildIsland(W, cols, rows, tiles, items) {
  const { island } = W;
  island.traverse(o => { if (o.geometry && !o.userData.keepGeo) o.geometry.dispose?.(); });
  island.clear(); W.tops.clear(); W.tufts = []; W.foams = []; W.waters = [];
  W.cols = cols; W.rows = rows; W.N = Math.max(cols, rows);
  const ox = (cols - 1) / 2, oz = (rows - 1) / 2; W.center = 0;
  const T = (x, y) => ({ g: 'grass', h: 0, r: null, ...(tiles[x + ',' + y] || {}) });
  const tY = (x, y) => { const t = T(x, y); return t.g === 'water' ? t.h * LV - .12 : t.h * LV + (t.r ? LV / 2 : (hash(x, y, 13) - .5) * .06); };
  W.tY = tY;
  const occ = new Set(); items.forEach(d => { if (d.kind === 'obj') for (let j = 0; j < d.h; j++) for (let i = 0; i < d.w; i++) occ.add((d.x + i) + ',' + (d.y + j)); });
  const slab = new THREE.BoxGeometry(1, SLAB, 1), wSlab = new THREE.BoxGeometry(.985, SLAB, .985), lvBox = new THREE.BoxGeometry(1, LV, 1);
  const corner = (x, y) => { const sx = x === 0 ? -1 : x === cols - 1 ? 1 : 0, sz = y === 0 ? -1 : y === rows - 1 ? 1 : 0; return sx && sz ? [sx, sz] : null; };
  const cornerGeo = (h, c) => extrudeY(roundSquare(1, 1, [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([px, py]) => px === c[0] && py === c[1] ? .32 : 0)), h);
  let rampGeo = null;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const t = T(x, y), wx = x - ox, wz = y - oz, c = corner(x, y);
    if (t.r) { const n = T(x + t.r[0], y + t.r[1]); if (x + t.r[0] < 0 || y + t.r[1] < 0 || x + t.r[0] >= cols || y + t.r[1] >= rows || n.g === 'water' || n.h !== t.h + 1) t.r = null; }
    const base = tY(x, y) - SLAB / 2, mat = t.g === 'water' ? waterMat() : gMat(GROUND_C[t.g] || GROUND_C.grass);
    let top;
    if (t.r) {
      if (!rampGeo) { const s = new THREE.Shape(); s.moveTo(-.5, -SLAB); s.lineTo(.5, -SLAB); s.lineTo(.5, LV); s.lineTo(-.5, 0); s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); g.translate(0, 0, -.5); rampGeo = boxUV(g); }
      top = new THREE.Mesh(rampGeo, mat); top.rotation.y = Math.atan2(-t.r[1], t.r[0]); top.position.set(wx, t.h * LV, wz); edges(top, island);
    } else { top = new THREE.Mesh(c ? cornerGeo(SLAB, c) : t.g === 'water' ? wSlab : slab, mat); top.position.set(wx, base, wz); if (c && t.g === 'water') top.scale.set(.985, 1, .985); }
    top.castShadow = top.receiveShadow = true; top.userData = { x, y, base, water: t.g === 'water' }; island.add(top); W.tops.set(x + ',' + y, top);
    if (t.g === 'water') W.waters.push([wx, tY(x, y), wz]);
    for (let l = 0; l < t.h; l++) { const m = new THREE.Mesh(c ? cornerGeo(LV, c) : lvBox, gMat(STRATA[Math.min(l, 2)])); m.position.set(wx, -SLAB + l * LV + LV / 2, wz); m.castShadow = m.receiveShadow = true; island.add(m); edges(m, island); }
    // cascadas: el agua alta cae hacia el agua más baja o por el borde de la isla
    if (t.g === 'water' && t.h > 0) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, out = nx < 0 || ny < 0 || nx >= cols || ny >= rows, n = out ? null : T(nx, ny);
      let bottom = null; if (out) bottom = -SLAB - .7; else if (n.g === 'water' && n.h < t.h) bottom = tY(nx, ny);
      if (bottom === null) continue;
      const topY = tY(x, y) - .02, hh = topY - bottom, fm = new THREE.Mesh(new THREE.PlaneGeometry(.84, hh), fallMat());
      fm.position.set(wx + dx * .51, (topY + bottom) / 2, wz + dy * .51); fm.rotation.y = Math.atan2(dx, dy); fm.castShadow = true; island.add(fm); edges(fm, island);
      if (!out) { const fw = .98, fh = fw * paper.artAspect('espuma'), fg2 = new THREE.PlaneGeometry(fw, fh); fg2.translate(0, fh * .3, 0); const f = new THREE.Mesh(fg2, foamMat()); f.position.set(wx + dx * .53, bottom - .04, wz + dy * .53); f.rotation.y = Math.atan2(dx, dy); f.userData.p = Math.random() * 6; island.add(f); W.foams.push(f); }
    }
    // matas de pasto de papel
    if ((t.g === 'grass' || t.g === 'moss') && !t.r && !occ.has(x + ',' + y)) {
      const n = 2 + Math.floor(hash(x, y, 21) * 3);
      for (let i = 0; i < n; i++) {
        const id = hash(x, y, 40 + i) > .86 && t.g === 'grass' ? 'florcita' : t.g === 'moss' ? 'matam' : 'mata';
        const offx = (hash(x, y, 30 + i) - .5) * .8, offz = (hash(x, y, 60 + i) - .5) * .8;
        if (c && offx * c[0] > .1 && offz * c[1] > .1) continue;
        const m = paperProp(id, id === 'florcita' ? .13 : .2 + hash(x, y, 50 + i) * .08, false); m.position.set(wx + offx, tY(x, y), wz + offz); m.userData.p = hash(x, y, 70 + i) * 6; island.add(m); W.tufts.push(m);
      }
    }
  }
  // base: meseta invertida, cada escalón un anillo más chico
  let yy = -SLAB + .04;
  const tiers = [{ w: cols - .06, d: rows - .06, h: .34, c: '#9A7550' }, { w: cols - .1, d: rows - .1, h: .32, c: '#8E857A' }];
  for (let j = 1; Math.min(cols, rows) - 2 * j >= 5; j++) tiers.push({ w: cols - 2 * j, d: rows - 2 * j, h: TIER_H, c: j % 2 ? '#857C71' : '#8E857A' });
  tiers.forEach(tr => { const r = Math.min(.32, Math.min(tr.w, tr.d) * .3), m = new THREE.Mesh(extrudeY(roundSquare(tr.w, tr.d, [r, r, r, r]), tr.h), gMat(tr.c)); m.position.set(0, yy - tr.h / 2, 0); m.castShadow = m.receiveShadow = true; island.add(m); edges(m, island); yy -= tr.h; });
  const s = W.scene.children.find(o => o.isDirectionalLight)?.shadow.camera; if (s) { const r = W.N / 2 + 3.5; Object.assign(s, { left: -r, right: r, top: r, bottom: -r, near: .5, far: 45 }); s.updateProjectionMatrix(); }
}
const toWorld = (W, d) => {
  const ox = (W.cols - 1) / 2, oz = (W.rows - 1) / 2, cx = d.x + (d.w - 1) / 2 - ox, cz = d.y + (d.h - 1) / 2 - oz;
  let y = -1; for (let j = 0; j < d.h; j++) for (let i = 0; i < d.w; i++) y = Math.max(y, W.tY(d.x + i, d.y + j));
  return [cx, y, cz];
};
function updateItem(W, o, d, OBJ) {
  const key = `${d.kind}|${d.svg || d.t}|${d.w}x${d.h}|${d.lv || 0}`;
  if (key !== o.key) {
    o.group.clear(); o.sprite = o.blob = null; o.mon = false; o.flat = false; o.glow = null; o.amp = 0; o.key = key;
    if (d.kind === 'mon' || d.kind === 'egg') {
      const size = 1.0 * (1 + .34 * (Math.max(d.w, d.h) - 1) + .12 * (Math.min(d.w, d.h) - 1));
      const s = makeSprite(d.svg, size, d.id); Object.assign(o, { sprite: s.sprite, blob: s.blob, size, ph: s.ph, squash: 0, hop: 0, flip: 1, flash: 0, mon: true });
      o.group.add(s.group);
    } else if (d.kind === 'away') { const s = sign('旅'); s.scale.setScalar(.8); s.traverse(m => m.userData.id = d.id); o.group.add(s); o.size = .7; }
    else {
      const def = OBJ?.[d.t] || {}, id = def.art || 'roca', lvK = 1 + ((d.lv || 1) - 1) * .05;
      if (def.flat) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(d.w * .96, d.h * .96 * (d.h > d.w ? 1 : .96)), propMat(id).front); m.rotation.x = -Math.PI / 2; m.position.y = .015; m.receiveShadow = true;
        if (d.w < d.h) m.rotation.z = Math.PI / 2;
        m.userData.id = d.id; o.group.add(m); o.sprite = m; o.flat = true; o.size = .3;
      } else {
        const art = paper.art(id), w = d.t === 'bridge' ? 2 * art.width / (art.width - 42) : (ART_W[id] || .9) * Math.max(d.w, 1) * lvK;
        const m = paperProp(id, w); m.userData.id = d.id; o.group.add(m); o.sprite = m; o.size = w * paper.artAspect(id) * .9;
        const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false })); blob.rotation.x = -Math.PI / 2; blob.position.y = .012; blob.scale.set(w * .8, w * .42, 1); o.group.add(blob);
        o.amp = { pino: .03, bambu: .06, arbusto: .025, flores: .07, cerezo: .035, arbol: .03, nobori: .06, chochin: .03 }[id] || 0;
      }
      o.glow = GLOW[id] || null; o.ph0 = Math.random() * 7;
    }
  }
  o.d = d;
  const [cx, cy, cz] = toWorld(W, d); o.group.position.set(cx, cy, cz);
}
export function setFocus(id) { const W = E?.worlds.sanct; if (W) W.focus = id; }
export function rotateCam(dir) { const W = E?.worlds.sanct; if (!W) return; W.azT = Math.round((W.azT - Math.PI / 4) / (Math.PI / 2)) * (Math.PI / 2) + Math.PI / 4 + dir * Math.PI / 2; }
export function zoomCam(k) { E?.worlds.sanct?.zoomBy(k); }
export function mountScene(host, opts) {
  if (!webgl()) return false;
  engine(); const W = sanctuary(); W.opts = opts;
  host.classList.add('paper'); host.classList.toggle('grain', paper.grainOn()); host.style.setProperty('--grain', `url(${paper.grainCSS})`);
  W.paintMode = !!(opts.tool && opts.paints);
  const sig = `${opts.cols}x${opts.rows}|${JSON.stringify(opts.tiles || {})}|${opts.items.filter(d => d.kind === 'obj').map(d => `${d.x},${d.y},${d.w},${d.h}`).join(';')}`;
  if (sig !== W.sig) { W.sig = sig; buildIsland(W, opts.cols, opts.rows, opts.tiles || {}, opts.items); }
  W.focus = opts.focus || null;
  const seen = new Set();
  opts.items.forEach(d => {
    seen.add(d.id); let o = W.items.get(d.id);
    if (!o) { o = { group: new THREE.Group(), key: '', wander: { x: 0, z: 0, tx: 0, tz: 0, next: 0 } }; W.world.add(o.group); W.items.set(d.id, o); }
    updateItem(W, o, d, opts.OBJS);
  });
  [...W.items.keys()].forEach(id => { if (!seen.has(id)) { W.world.remove(W.items.get(id).group); W.items.delete(id); } });
  drawEditor(W);
  attach(host, W);
  return true;
}
function drawEditor(W) {
  W.ov.clear();
  const { mode, valid, items } = W.opts; if (mode === 'play') return;
  const ox = (W.cols - 1) / 2, oz = (W.rows - 1) / 2, sq = new THREE.BufferGeometry().setFromPoints([[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5], [-.5, -.5]].map(([a, b]) => new THREE.Vector3(a, 0, b)));
  const lm = new THREE.LineBasicMaterial({ color: '#FFFDF6', transparent: true, opacity: .85 });
  for (let y = 0; y < W.rows; y++) for (let x = 0; x < W.cols; x++) { const l = new THREE.Line(sq, lm); l.position.set(x - ox, W.tY(x, y) + .03, y - oz); W.ov.add(l); }
  const quad = (x, y, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.92, .92), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(x - ox, W.tY(x, y) + .04, y - oz); W.ov.add(m); };
  if (mode === 'build') items.forEach(d => { const sel = d.id === W.opts.selected; for (let j = 0; j < d.h; j++) for (let i = 0; i < d.w; i++) quad(d.x + i, d.y + j, sel ? '#F2B544' : '#FFFFFF', sel ? .7 : .14); });
  (valid || []).forEach(([x, y]) => quad(x, y, '#FFFFFF', .42));
}
// =====================================================================
// ARENA · patio de templo de noche con faroles
// =====================================================================
const SLOT = { m: [[-2.05, 1.55], [0, 1.85], [2.05, 1.55]], e: [[-1.9, -1.35], [0, -1.6], [1.9, -1.35]] };
function arena() {
  if (E.worlds.arena) return E.worlds.arena;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 120);
  scene.fog = new THREE.Fog('#3A1630', 16, 50);
  const sky = makeSky(scene); sky.material.uniforms.top.value.set('#1C0F24'); sky.material.uniforms.bot.value.set('#7A2E3A');
  const moon = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40), new THREE.MeshBasicMaterial({ color: '#FFE7C8', fog: false })); moon.position.set(-7, 9, -40); scene.add(moon);
  const mh = new THREE.Mesh(new THREE.CircleGeometry(5, 32), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, opacity: .35, color: '#FFC8A8', depthWrite: false, fog: false })); mh.position.set(-7, 9, -40.1); scene.add(mh);
  const layers = makeLayers(scene, [
    { seed: 21, peaks: 8, base: 230, amp: 140, fill: '#4A1E3A', w: 80, y: 3, z: -42 },
    { seed: 23, peaks: 10, base: 260, amp: 40, fill: '#2A1020', w: 52, y: .4, z: -24, extras: 'temple' },
  ]);
  layers.forEach(m => m.material.color.set('#FFFFFF'));
  // Escenario de madera con borde de papel
  const stage = new THREE.Group();
  const top = slab(7.4, 5.6, .35, .22, [new THREE.MeshLambertMaterial({ map: plankTexture() }), L(CREAM)]); topUV(top, 7.4, 5.6);
  const base = slab(7.2, 5.4, .35, .6, [L('#3A2418'), L('#4A2C1E')]); base.position.y = -.22;
  stage.add(top, base); stage.position.y = 0; scene.add(stage);
  // Piso de piedra alrededor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), L('#2A1A22')); floor.rotation.x = -Math.PI / 2; floor.position.y = -.8; floor.receiveShadow = true; scene.add(floor);
  // Torii grande detrás
  const red = L('#C8392A'), dark = L('#24141C'), torii = new THREE.Group();
  torii.add(mesh(new THREE.CylinderGeometry(.16, .19, 4.4, 12), red, -2.4, 1.4), mesh(new THREE.CylinderGeometry(.16, .19, 4.4, 12), red, 2.4, 1.4));
  torii.add(mesh(new THREE.BoxGeometry(6.4, .32, .5), dark, 0, 3.75), mesh(new THREE.BoxGeometry(5.8, .26, .38), red, 0, 3.48), mesh(new THREE.BoxGeometry(5.2, .2, .3), red, 0, 2.85), mesh(new THREE.BoxGeometry(.3, .7, .2), red, 0, 3.15));
  torii.position.set(0, -.8, -4.6); scene.add(torii);
  // Faroles de piedra a los lados
  const lan = [-3.3, 3.3].map(x => { const { g } = prop('lantern'); g.scale.setScalar(1.7); g.position.set(x, .22, -2.2); scene.add(g); return g; });
  // Guirnalda de faroles de papel
  const rope = new THREE.CatmullRomCurve3([new THREE.Vector3(-4.2, 4.6, -2.6), new THREE.Vector3(-2, 4, -2.6), new THREE.Vector3(0, 3.8, -2.6), new THREE.Vector3(2, 4, -2.6), new THREE.Vector3(4.2, 4.6, -2.6)]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(rope, 40, .02, 4), new THREE.MeshBasicMaterial({ color: '#120810' })));
  const paperL = [.12, .3, .5, .7, .88].map((f, i) => {
    const p = rope.getPoint(f), g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(.26, 16, 12), new THREE.MeshBasicMaterial({ color: '#E8452C' })); body.scale.y = 1.3; body.position.y = -.42;
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, opacity: .45, color: '#FFB45A', depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.position.y = -.42; g.add(body, glow); g.position.copy(p); g.userData.ph = i; scene.add(g); return g;
  });
  const hemi = new THREE.HemisphereLight('#9A7AC8', '#2A1418', .8), moonL = new THREE.DirectionalLight('#C8D0FF', 1.1);
  moonL.position.set(-4, 9, 6); moonL.castShadow = true; moonL.shadow.mapSize.set(1024, 1024); moonL.shadow.bias = -.0008;
  Object.assign(moonL.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  const warm = [-3.3, 3.3].map(x => { const p = new THREE.PointLight('#FFA24A', 3, 8, 1.4); p.position.set(x, 1.3, -1.9); scene.add(p); return p; });
  const front = new THREE.PointLight('#FFB06A', 2.2, 10, 1.2); front.position.set(0, 3.4, 2.6);
  scene.add(hemi, moonL, front);
  // Pétalos que caen
  const N = 60, pg = new THREE.BufferGeometry(), seeds = [];
  for (let i = 0; i < N; i++) seeds.push({ x: (Math.random() - .5) * 10, y: Math.random() * 6, z: (Math.random() - .5) * 7, v: .3 + Math.random() * .4, p: Math.random() * 7 });
  pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const pm = new THREE.PointsMaterial({ map: dotTex(), size: .16, transparent: true, depthWrite: false, color: '#FFB8C8', fog: false });
  scene.add(new THREE.Points(pg, pm));
  // Anillo del objetivo
  const ring = new THREE.Mesh(new THREE.RingGeometry(.55, .7, 40), new THREE.MeshBasicMaterial({ color: '#E8452C', transparent: true, opacity: .85, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = .24; scene.add(ring);
  // Efectos: proyectil y onda de impacto
  const shot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); shot.visible = false; scene.add(shot);
  const wave = new THREE.Mesh(new THREE.RingGeometry(.4, .55, 40), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide })); wave.visible = false; scene.add(wave);

  const W = { name: 'arena', scene, camera, items: new Map(), opts: {}, fx: [] };
  W.tap = ray => { const id = hitItem(W, ray); if (id) W.opts.onTap?.(id); };
  W.update = (t, dt) => {
    const hf = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect), dist = 3.35 / Math.tan(hf / 2);
    camera.position.set(Math.sin(t * .15) * .25, dist * .58, dist * .8); camera.lookAt(0, 2.1, -.2);
    lan.forEach((g, i) => { warm[i].intensity = 3 * (1 + Math.sin(t * 6 + i) * .08); });
    paperL.forEach(g => { g.rotation.z = Math.sin(t * 1.2 + g.userData.ph) * .08; });
    const P = pg.attributes.position;
    seeds.forEach((s, i) => { s.y -= s.v * dt; if (s.y < -.5) s.y = 6; P.setXYZ(i, s.x + Math.sin(t + s.p) * .6, s.y, s.z + Math.cos(t * .7 + s.p) * .3); }); P.needsUpdate = true;
    let tgt = null;
    W.items.forEach(o => {
      animSprite(o, t, dt);
      const d = o.d, [bx, bz] = SLOT[d.side][d.slot];
      const lg = o.lunge || 0; o.lunge = Math.max(0, lg - dt * 2.2);
      const k = Math.sin(lg * Math.PI);
      o.group.position.set(bx + (o.lx || 0) * k, .22, bz + (o.lz || 0) * k);
      o.sprite.position.x = o.flash ? Math.sin(t * 60) * .06 * o.flash : 0;
      o.sprite.material.emissive.set(o.flash > 0 ? '#FF3A2A' : '#FFFFFF');
      o.sprite.material.emissiveIntensity = o.flash > 0 ? .5 + o.flash * .6 : .4;
      const down = d.down; o.dn = Math.min(1, Math.max(0, (o.dn || 0) + (down ? dt * 2 : -dt * 4)));
      o.sprite.rotation.z = -o.dn * 1.35; o.sprite.material.color.setScalar(1 - o.dn * .55); o.blob.material.opacity = 1 - o.dn * .6;
      if (d.target && !down) tgt = o;
    });
    ring.visible = !!tgt; if (tgt) { ring.position.x = tgt.group.position.x; ring.position.z = tgt.group.position.z; ring.scale.setScalar(tgt.size * (1 + Math.sin(t * 5) * .06)); }
    W.fx = W.fx.filter(f => f(t, dt));
  };
  W.shot = shot; W.wave = wave;
  return E.worlds.arena = W;
}
export function mountArena(host, { items, onTap }) {
  if (!webgl()) return false;
  engine(); const W = arena(); W.opts = { onTap };
  const seen = new Set();
  items.forEach(d => {
    seen.add(d.id); let o = W.items.get(d.id);
    const size = d.side === 'm' ? 1.7 : 1.45;
    if (!o || o.svg !== d.svg) {
      if (o) W.scene.remove(o.group);
      const s = makeSprite(d.svg, size, d.id); o = { ...s, svg: d.svg, lunge: o?.lunge, dn: o?.dn }; W.scene.add(o.group); W.items.set(d.id, o);
    }
    o.d = d; o.flip = d.side === 'e' ? -1 : 1;
  });
  [...W.items.keys()].forEach(id => { if (!seen.has(id)) { W.scene.remove(W.items.get(id).group); W.items.delete(id); } });
  attach(host, W);
  return true;
}
// Ataque: el atacante embiste, un proyectil del color de su tipo cruza y el objetivo tiembla
export function arenaHit(fromId, toId, color = '#FFD27A') {
  const W = E?.worlds.arena; if (!W) return Promise.resolve();
  const a = W.items.get(fromId), b = W.items.get(toId); if (!a || !b) return Promise.resolve();
  const pa = a.group.position.clone(), pb = b.group.position.clone();
  a.lx = (pb.x - pa.x) * .35; a.lz = (pb.z - pa.z) * .35; a.lunge = 1; a.hop = 1;
  return new Promise(res => {
    const t0 = performance.now(); W.shot.material.color.set(color); W.shot.visible = true;
    W.fx.push(() => {
      const k = Math.min(1, (performance.now() - t0) / 420);
      const p = pa.clone().lerp(pb, k); p.y = .22 + a.size * .55 + Math.sin(k * Math.PI) * 1.1;
      W.shot.position.copy(p); W.shot.quaternion.copy(W.camera.quaternion); W.shot.scale.setScalar(.9 + Math.sin(k * 20) * .1);
      if (k < 1) return true;
      W.shot.visible = false; b.flash = 1; b.squash = 1;
      const w0 = performance.now(); W.wave.visible = true; W.wave.material.color.set(color); W.wave.position.set(pb.x, .25, pb.z); W.wave.rotation.x = -Math.PI / 2;
      W.fx.push(() => { const q = Math.min(1, (performance.now() - w0) / 450); W.wave.scale.setScalar(1 + q * 3); W.wave.material.opacity = 1 - q; if (q >= 1) { W.wave.visible = false; return false; } return true; });
      res(); return false;
    });
  });
}
