// KANJŪ · scene3d.js — Escenas 3D con criaturas de papel 2D: Santuario y Arena.
// Un solo renderer se mueve entre pantallas; cada escena tiene su cámara, luz y actualización.
// En el santuario la grilla de tiles (world.js) manda: cada ítem va al centro de sus casillas y la
// grilla sólo se dibuja en modo construcción.
import * as THREE from './vendor/three.module.min.js';

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
  const el = renderer.domElement; let down = null;
  el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, moved: false }; el.setPointerCapture(e.pointerId); E.W?.dragStart?.(); });
  el.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.hypot(dx, dy) > 8) down.moved = true; E.W?.drag?.(dx, dy); });
  el.addEventListener('pointerup', e => { if (down && !down.moved) tap(e); down = null; E.W?.dragEnd?.(); });
  el.addEventListener('pointercancel', () => { down = null; E.W?.dragEnd?.(); });
  addEventListener('resize', () => E.host && resize());
  return E;
}
function attach(host, W) {
  engine(); E.W = W; E.active = W.name; E.host = host; E.ovEl = host.querySelector('.stage-ov');
  host.prepend(E.renderer.domElement); resize();
  if (!E.raf) loop();
}
function resize() {
  const w = E.host.clientWidth || 360, h = E.host.clientHeight || 600;
  E.renderer.setSize(w, h, false); E.w = w; E.h = h;
  Object.values(E.worlds).forEach(W => { W.camera.aspect = w / h; W.camera.updateProjectionMatrix(); });
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
function screenOf(id, W = E?.W, foot = false) {
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
  E.renderer.render(E.W.scene, E.W.camera);
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

function sanctuary() {
  if (E.worlds.sanct) return E.worlds.sanct;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, .1, 160);
  scene.fog = new THREE.Fog('#2A2148', 26, 70);
  const sky = makeSky(scene);
  const orb = new THREE.Mesh(new THREE.CircleGeometry(1.8, 40), new THREE.MeshBasicMaterial({ color: '#FFE7B0', fog: false }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.05, 40), new THREE.MeshBasicMaterial({ color: CREAM, fog: false }));
  const halo = new THREE.Mesh(new THREE.CircleGeometry(6, 32), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, opacity: .45, depthWrite: false, fog: false, color: '#FFE3A3' }));
  scene.add(halo, orb, ring);
  const layers = makeLayers(scene, [
    { seed: 9, peaks: 7, base: 230, amp: 150, fill: '#8C93C0', w: 110, y: 0, z: -60, fade: .45 },
    { seed: 2, peaks: 12, base: 250, amp: 70, fill: '#3F6B5A', w: 70, y: -5, z: -34, fade: .2, extras: 'trees' },
  ]);
  const clouds = [];
  for (let i = 0; i < 34; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, depthWrite: false, opacity: .95, fog: false }));
    const a = Math.random() * Math.PI * 2, rr = 6 + Math.random() * 9, rim = i < 12;
    m.userData = rim ? { x: (i % 2 ? 1 : -1) * (5.6 + Math.random() * 2), z: -4 + Math.random() * 9, y: -1.2 - Math.random() * .8, s: 2.2 + Math.random() * 2, v: .02 + Math.random() * .04, rim } : { x: Math.cos(a) * rr, z: Math.sin(a) * rr * .7 - 2, y: -3.2 - Math.random() * 2, s: 4 + Math.random() * 5, v: .05 + Math.random() * .1 };
    m.scale.set(m.userData.s * 1.6, m.userData.s, 1); scene.add(m); clouds.push(m);
  }
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#4A3B2A', 1), sun = new THREE.DirectionalLight('#FFFFFF', 2);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -.0008; sun.shadow.normalBias = .02;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 50 });
  scene.add(hemi, sun, sun.target);
  const world = new THREE.Group(), ov = new THREE.Group(); scene.add(world); world.add(ov);
  // Luciérnagas / polen
  const N = 50, pg = new THREE.BufferGeometry(), seeds = [];
  for (let i = 0; i < N; i++) seeds.push({ x: (Math.random() - .5) * 10, y: .3 + Math.random() * 2.6, z: (Math.random() - .5) * 9, p: Math.random() * 7, s: .3 + Math.random() * .7 });
  pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const pm = new THREE.PointsMaterial({ map: dotTex(), size: .22, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: '#FFE08A', fog: false });
  scene.add(new THREE.Points(pg, pm));
  // Hojas o pétalos que caen
  const F = 36, fg = new THREE.BufferGeometry(), falls = [];
  for (let i = 0; i < F; i++) falls.push({ x: (Math.random() - .5) * 10, y: Math.random() * 4, z: (Math.random() - .5) * 8, v: .25 + Math.random() * .3, p: Math.random() * 7 });
  fg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(F * 3), 3));
  const fm = new THREE.PointsMaterial({ map: dotTex(), size: .14, transparent: true, depthWrite: false, color: '#C8D86A' });
  scene.add(new THREE.Points(fg, fm));
  const lights = [0, 1, 2, 3, 4].map(() => { const p = new THREE.PointLight('#FFB35A', 0, 5, 1.5); scene.add(p); return p; });

  const W = { name: 'sanct', scene, camera, world, ov, items: new Map(), opts: {}, cols: 0, rows: 0, stage: -1, yaw: 0, panZ: 0, dragging: false, platform: null, dress: { lights: [], banners: [], trees: [], smoke: [] }, geo: { rx: 5, rz: 4, zc: -1 } };
  let drag0 = null;
  W.dragStart = () => { drag0 = { yaw: W.yaw, pan: W.panZ }; W.dragging = true; };
  W.drag = (dx, dy) => { if (!drag0) return; const lim = Math.max(0, W.geo.rz - (W.geo.elev ? 1.6 : 2.6)); W.yaw = Math.max(-.3, Math.min(.3, drag0.yaw + dx * .004)); W.panZ = Math.max(-lim, Math.min(lim * .6, drag0.pan - dy * .014)); };
  W.dragEnd = () => { drag0 = null; W.dragging = false; };
  W.tap = ray => {
    const { mode, onTap, onCell } = W.opts;
    if (mode === 'placing') {
      const hit = new THREE.Vector3(); if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -.22), hit)) return;
      const x = Math.floor(hit.x / T + W.cols / 2), y = Math.floor(hit.z / T + W.rows / 2);
      if (x >= 0 && y >= 0 && x < W.cols && y < W.rows) onCell?.(x, y); return;
    }
    const id = hitItem(W, ray); if (id) { poke(id); onTap?.(id); }
  };
  W.update = (t, dt) => {
    const sk = skyAt(hourNow()), night = sk.night, h = hourNow();
    sky.material.uniforms.top.value.copy(sk.top); sky.material.uniforms.bot.value.copy(sk.bot);
    scene.fog.color.copy(sk.bot);
    hemi.intensity = sk.amb; hemi.color.copy(sk.top).lerp(new THREE.Color('#FFFFFF'), .65);
    sun.color.copy(sk.sun); sun.intensity = sk.si;
    const ang = ((h - 6) / 12) * Math.PI, isN = night > .6;
    sun.position.set(isN ? 5 : -Math.cos(ang) * 8, isN ? 10 : Math.max(4, Math.sin(ang) * 10), 7);
    orb.material.color.set(isN ? '#E8ECFF' : '#FFE7B0'); halo.material.color.set(isN ? '#C8D0FF' : '#FFE3A3');
    const ox = isN ? 9 : -Math.cos(ang) * 16, oy = isN ? 12 : 4 + Math.max(0, Math.sin(ang)) * 9;
    [orb, ring, halo].forEach((m, i) => { m.position.set(ox, oy, -70 - i * .1); m.lookAt(camera.position); });
    layers.forEach(m => m.material.color.copy(sk.tint).lerp(sk.bot, m.userData.fade));
    const cc = sk.bot.clone().lerp(new THREE.Color('#FFFFFF'), .5 - night * .3);
    clouds.forEach(m => { const u = m.userData; u.x += u.v * dt * (u.rim ? (u.x > 0 ? 1 : -1) * .3 : 1); if (!u.rim && u.x > 16) u.x = -16; if (u.rim && Math.abs(u.x) > 9) u.x = Math.sign(u.x) * 5.6; m.position.set(u.x, u.y, u.z); m.quaternion.copy(camera.quaternion); m.material.color.copy(cc); });
    // Cámara 3/4 que encuadra la isla entera
    const g = W.geo, hf = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect);
    if (!W.dragging) W.yaw += (0 - W.yaw) * Math.min(1, dt * 2.5);
    let dist = (g.rx * 1.06) / Math.tan(hf / 2), elev = g.elev ?? .72, tx = 0, ty = .3, tz = g.zc + (g.lookZ || 0) + W.panZ;
    const fo = W.focus && W.items.get(W.focus);
    if (fo?.sprite) { // primer plano: la cámara baja y se acerca a la criatura
      const v = new THREE.Vector3(); fo.sprite.getWorldPosition(v);
      dist = 3.2 + fo.size * 1.4; elev = .3; tx = v.x; ty = v.y + fo.size * .45; tz = v.z;
    }
    scene.fog.near = dist + 10; scene.fog.far = dist + 55;
    const want = new THREE.Vector3(tx + Math.sin(W.yaw) * Math.cos(elev) * dist, ty + Math.sin(elev) * dist, tz + Math.cos(W.yaw) * Math.cos(elev) * dist);
    const look = new THREE.Vector3(tx, ty, tz - (fo ? 0 : .3));
    W.cam ??= { p: want.clone(), l: look.clone() };
    const k = Math.min(1, dt * 3.2); W.cam.p.lerp(want, k); W.cam.l.lerp(look, k);
    camera.position.copy(W.cam.p); camera.lookAt(W.cam.l);
    W.floaters?.forEach(m => { m.position.y = m.userData.y + Math.sin(t * .7 + m.userData.p) * .15; m.rotation.y += dt * .2; });
    // Escenario animado
    W.dress.trees.forEach(tr => { tr.userData.canopy.rotation.z = Math.sin(t * .8 + tr.userData.ph) * .03; });
    W.dress.banners.forEach((b, i) => { b.rotation.y = Math.sin(t * 1.3 + i) * .18; });
    W.dress.smoke.forEach(sm => { const u = sm.userData; u.k = (u.k + dt * .28) % 1; sm.position.set(u.x + Math.sin(u.k * 6 + u.p) * .12, u.y + u.k * 1.6, u.z); sm.scale.setScalar(.25 + u.k * .7); sm.material.opacity = Math.sin(u.k * Math.PI) * .45; sm.quaternion.copy(camera.quaternion); });
    // Criaturas
    const lit = [...W.dress.lights];
    W.items.forEach(o => {
      const d = o.d;
      if (o.sprite) {
        const w = o.wander;
        if (d.kind === 'mon' && t > w.next) { const ax = Math.max(.15, (d.w * T) / 2 - .45), az = Math.max(.12, (d.h * T) / 2 - .45); w.tx = (Math.random() * 2 - 1) * ax; w.tz = (Math.random() * 2 - 1) * az; w.next = t + 2 + Math.random() * 4; }
        const vx = (w.tx - w.x) * 1.2 * dt, vz = (w.tz - w.z) * 1.2 * dt; w.x += vx; w.z += vz;
        const moving = Math.hypot(vx, vz) > .002; if (Math.abs(vx) > .0015) o.flip = vx > 0 ? 1 : -1;
        animSprite(o, t, dt, moving);
        o.sprite.position.x = w.x; o.sprite.position.z = w.z; o.sprite.position.y += .22; o.sprite.rotation.y = W.yaw;
        o.blob.position.set(w.x, .235, w.z);
        o.sprite.material.emissiveIntensity = (d.insp ? .62 : .42) - night * .14 + (d.insp ? Math.sin(t * 4) * .08 : 0);
      }
      if (o.u?.flame) o.u.flame.forEach((f, i) => f.scale.set(1 + Math.sin(t * 13 + i) * .08, 1 + Math.sin(t * 9 + i * 2) * .15, 1));
      if (o.u?.canopy) o.u.canopy.rotation.z = Math.sin(t * .8 + o.ph0) * .03;
      if (o.u?.banner) o.u.banner.rotation.y = Math.sin(t * 1.3 + o.ph0) * .2;
      if (o.u?.smoke) o.u.smoke.forEach(sm => { const u = sm.userData; u.k = (u.k + dt * .28) % 1; sm.position.set(u.x + Math.sin(u.k * 6 + u.p) * .12, u.y + u.k * 1.5, u.z); sm.scale.setScalar(.22 + u.k * .6); sm.material.opacity = Math.sin(u.k * Math.PI) * .45; sm.quaternion.copy(camera.quaternion); });
      if (o.u?.light && (night > .2 || o.u.light.always)) { const p = o.group.position; lit.push({ x: p.x, y: o.u.light.y + .2, z: p.z + (o.u.light.z || 0), color: o.u.light.color, power: o.u.light.power, always: o.u.light.always }); }
    });
    lights.forEach((p, i) => {
      const L0 = lit[i]; if (!L0 || (night < .2 && !L0.always)) { p.intensity = 0; return; }
      p.color.set(L0.color); p.position.set(L0.x, L0.y, L0.z);
      p.intensity = L0.power * (L0.always ? .6 + night * 1.6 : night * 2.2) * (1 + Math.sin(t * 7 + i) * .06);
    });
    const P = pg.attributes.position;
    seeds.forEach((s, i) => P.setXYZ(i, s.x + Math.sin(t * s.s + s.p) * .5, s.y + Math.sin(t * s.s * 1.3 + s.p) * .3, g.zc + s.z * .8 + Math.cos(t * s.s + s.p) * .4));
    P.needsUpdate = true;
    pm.color.set(night > .5 ? '#FFE08A' : '#FFF4DC'); pm.size = night > .5 ? .28 : .1; pm.opacity = night > .5 ? .5 + Math.sin(t * 3) * .4 : .4;
    const FP = fg.attributes.position;
    falls.forEach((f, i) => { f.y -= f.v * dt; if (f.y < .1) { f.y = 3.5 + Math.random(); f.x = (Math.random() - .5) * 2 * g.rx; } FP.setXYZ(i, f.x + Math.sin(t * 1.5 + f.p) * .4, f.y, g.zc + f.z * .7 + Math.cos(t + f.p) * .2); });
    FP.needsUpdate = true; fm.color.set([...W.items.values()].some(o => o.d?.t === 'sakura') ? '#FFB8C8' : '#D8E07A');
  };
  return E.worlds.sanct = W;
}

// PROPUESTA (rama propuesta-suelo): en vez de isla, un terreno rectangular que llena la pantalla.
//   ?suelo=patio → jardín rectangular con borde de piedra y cerco de bosque alrededor
//   ?suelo=campo → pasto hasta el horizonte, sin bordes; la grilla sólo se ve al construir
const SUELO = new URLSearchParams(location.search).get('suelo');
// Pasto que se repite sin costuras: cada mancha y brizna se dibuja también del otro lado del borde
let _seam;
function seamlessGrass() {
  if (_seam) return _seam;
  const S0 = 512, c = canvas(S0, S0), x = c.getContext('2d'), rnd = mulberry(11);
  const wrap = (f) => { for (const dx of [-S0, 0, S0]) for (const dy of [-S0, 0, S0]) { x.save(); x.translate(dx, dy); f(); x.restore(); } };
  x.fillStyle = '#76A95C'; x.fillRect(0, 0, S0, S0);
  for (let i = 0; i < 260; i++) { const px = rnd() * S0, py = rnd() * S0, a = 12 + rnd() * 30, b = 6 + rnd() * 14, r = rnd() * 3, col = rnd() < .5 ? 'rgba(140,192,110,.5)' : 'rgba(86,140,72,.4)';
    wrap(() => { x.fillStyle = col; x.beginPath(); x.ellipse(px, py, a, b, r, 0, 7); x.fill(); }); }
  x.strokeStyle = 'rgba(170,216,128,.75)'; x.lineWidth = 3; x.lineCap = 'round';
  for (let i = 0; i < 420; i++) { const px = rnd() * S0, py = rnd() * S0, ex = (rnd() - .5) * 8, ey = 10 + rnd() * 6; wrap(() => { x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 2, py - 6, px + ex, py - ey); x.stroke(); }); }
  for (let i = 0; i < 22; i++) { const px = rnd() * S0, py = rnd() * S0, col = rnd() < .5 ? '#E8452C' : '#F2B544'; wrap(() => { x.fillStyle = CREAM; x.beginPath(); x.arc(px, py, 4.5, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(px, py, 2, 0, 7); x.fill(); }); }
  return _seam = c;
}
const grassRep = (w, h) => repTex(tex(seamlessGrass()), w / 5, h / 5);
function repTex(t, rx, ry) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t; }
function buildField(W, cols, rows, kind) {
  if (W.platform) W.world.remove(W.platform);
  W.dress = { lights: [], banners: [], trees: [], smoke: [] };
  const g = new THREE.Group(), pw = cols * T, pd = rows * T, seed = cols * 7 + rows, rnd = mulberry(seed * 5);
  // Encuadre: el rectángulo jugable ocupa casi todo el ancho; cámara más alta (se ve más piso, menos cielo)
  W.geo = { rx: pw / 2 + (kind === 'patio' ? .55 : .2), rz: pd / 2 + .4, zc: 0, elev: +(new URLSearchParams(location.search).get('ang') || 28) * Math.PI / 180, lookZ: -pd * +(new URLSearchParams(location.search).get('lz') || .4) };
  // Piso enorme: llega hasta los bordes de la pantalla y al horizonte
  const BW = pw + 40, BD = pd + 60;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(BW, BD), new THREE.MeshLambertMaterial({ map: grassRep(BW, BD), color: kind === 'patio' ? '#B9CFA0' : '#FFFFFF' }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, .2, -BD / 2 + pd / 2 + 14); ground.receiveShadow = true; g.add(ground);
  if (kind === 'patio') {
    // Césped cuidado dentro del rectángulo, un poco más claro y elevado 2 cm
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(pw + .5, pd + .5), new THREE.MeshLambertMaterial({ map: grassRep(pw + .5, pd + .5) }));
    lawn.rotation.x = -Math.PI / 2; lawn.position.y = .215; lawn.receiveShadow = true; g.add(lawn);
    // Bordillo de piedra alrededor
    const stone = new THREE.MeshLambertMaterial({ color: '#B8AE98' }), sw = .22;
    [[0, -(pd / 2 + .25 + sw / 2), pw + .5 + sw * 2, sw], [0, pd / 2 + .25 + sw / 2, pw + .5 + sw * 2, sw], [-(pw / 2 + .25 + sw / 2), 0, sw, pd + .5], [pw / 2 + .25 + sw / 2, 0, sw, pd + .5]]
      .forEach(([x, z, w, d]) => g.add(mesh(new THREE.BoxGeometry(w, .12, d), stone, x, .26, z)));
    // Seto bajo detrás y a los costados (el frente queda abierto)
    for (let x = -pw / 2 - .4; x <= pw / 2 + .4; x += .55) { const b = bush(1.15, seed + x * 10); b.position.set(x, .2, -pd / 2 - .75); g.add(b); }
    for (const sx of [-1, 1]) for (let z = -pd / 2 - .4; z <= pd / 2 + .2; z += .6) { const b = bush(1, seed + z * 13 + sx); b.position.set(sx * (pw / 2 + .8), .2, z); g.add(b); }
  }
  // Árboles: cerco de bosque detrás y a los lados, cada vez más denso hacia el fondo
  const ring = kind === 'patio' ? 1.6 : 2.4;
  for (let i = 0; i < 90; i++) {
    const side = rnd(), x = side < .5 ? (rnd() - .5) * (pw + 22) : (rnd() < .5 ? -1 : 1) * (pw / 2 + ring + rnd() * 9);
    const z = side < .5 ? -pd / 2 - ring - rnd() * 14 : (rnd() - .6) * (pd + 14);
    if (Math.abs(x) < pw / 2 + ring - .3 && z > -pd / 2 - ring + .3) continue;
    const t = tree(rnd() < .08 ? 'sakura' : 'pine', 1.1 + rnd() * .9, seed + i); t.position.set(x, .2, z); g.add(t); W.dress.trees.push(t);
  }
  if (kind === 'campo') for (let i = 0; i < 26; i++) { const b = bush(.8 + rnd() * .5, seed + i * 3); b.position.set((rnd() - .5) * (pw + 6), .2, -pd / 2 - .8 - rnd() * 2); g.add(b); }
  W.floaters = [];
  W.world.add(g); W.platform = g; W.cols = cols; W.rows = rows;
}

// Isla básica (siempre igual): pasto, acantilados y rocas que flotan. La decoración la pone el jugador.
function buildIsland(W, cols, rows) {
  if (SUELO === 'patio' || SUELO === 'campo') return buildField(W, cols, rows, SUELO);
  if (W.platform) W.world.remove(W.platform);
  W.dress = { lights: [], banners: [], trees: [], smoke: [] };
  const g = new THREE.Group(), pw = cols * T, pd = rows * T;
  const rx = pw / 2 + .95, rz = pd / 2 + .95, zc = 0;
  W.geo = { rx, rz, zc };
  const seed = cols * 7 + rows;
  const sq = (k, sd) => { // cuadrado redondeado con bultos suaves (como la isla de Rebyters)
    const s2 = new THREE.Shape(), N = 64, r = mulberry(sd), ph = [r() * 7, r() * 7];
    for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2, c = Math.abs(Math.cos(a)), si = Math.abs(Math.sin(a)), base = 1 / Math.pow(Math.pow(c, 3.4) + Math.pow(si, 3.4), 1 / 3.4), n = base * (1 + Math.sin(a * 3 + ph[0]) * .025 + Math.sin(a * 7 + ph[1]) * .015);
      const px = Math.cos(a) * rx * k * n, pz = Math.sin(a) * rz * k * n; i ? s2.lineTo(px, pz) : s2.moveTo(px, pz); }
    return s2;
  };
  const top = extrudeShape(sq(1, seed), .22, [new THREE.MeshLambertMaterial({ map: grassTexture(Math.ceil(rx * 2), Math.ceil(rz * 2)) }), L('#5E8A48')]);
  uvTop(top, -rx * 1.1, rx * 1.1, -rz * 1.1, rz * 1.1); top.position.y = .22;
  const ct = cliffTexture();
  const c1 = extrudeShape(sq(.985, seed), 1, [L('#4F4A42'), new THREE.MeshLambertMaterial({ map: ct })]); uvSide(c1, 1.2);
  const c2 = extrudeShape(sq(.78, seed + 1), .9, [L('#3E3A34'), new THREE.MeshLambertMaterial({ map: ct, color: '#9A9488' })]); uvSide(c2, 1); c2.position.y = -1;
  const c3 = extrudeShape(sq(.46, seed + 2), .9, [L('#34302B'), new THREE.MeshLambertMaterial({ map: ct, color: '#7A7468' })]); uvSide(c3, .8); c3.position.y = -1.9;
  g.add(top, c1, c2, c3);
  const rnd = mulberry(seed * 3);
  for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, m = mesh(new THREE.ConeGeometry(.12 + rnd() * .18, .5 + rnd() * .7, 5), L('#4A443C'), Math.cos(a) * rx * .4, -2.9 - rnd() * .3, Math.sin(a) * rz * .4); m.rotation.x = Math.PI; g.add(m); }
  // rocas que flotan alrededor
  W.floaters = [];
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + rnd(), rr = Math.max(rx, rz) + 1 + rnd() * 1.5, m = mesh(new THREE.DodecahedronGeometry(.18 + rnd() * .25, 0), new THREE.MeshLambertMaterial({ color: '#6A5A48', flatShading: true }), Math.cos(a) * rr, -1 - rnd() * 1.5, Math.sin(a) * rr); m.userData = { y: m.position.y, p: rnd() * 7 }; g.add(m); W.floaters.push(m); }
  W.world.add(g); W.platform = g; W.cols = cols; W.rows = rows;
}
const cellCenter = (W, x, y, w, h) => [(x + w / 2 - W.cols / 2) * T, (y + h / 2 - W.rows / 2) * T];
function updateItem(W, o, d) {
  const key = `${d.kind}|${d.svg || d.t}|${d.w}x${d.h}|${d.lv || 0}`;
  if (key !== o.key) {
    o.group.clear(); o.sprite = o.blob = o.u = null; o.key = key;
    if (d.kind === 'mon' || d.kind === 'egg') {
      const size = 1.45 * (1 + .34 * (Math.max(d.w, d.h) - 1) + .12 * (Math.min(d.w, d.h) - 1));
      const s = makeSprite(d.svg, size, d.id); Object.assign(o, { sprite: s.sprite, blob: s.blob, size, ph: s.ph, squash: 0, hop: 0, flip: 1, flash: 0 });
      o.group.add(s.group);
    } else if (d.kind === 'away') { const s = sign('旅'); s.position.y = .22; s.traverse(m => m.userData.id = d.id); o.group.add(s); o.size = .8; }
    else { const { g, u } = prop(d.t, d.w * T, d.h * T); g.position.y = .22; g.scale.setScalar(1.1 + (d.lv - 1) * .05); g.traverse(m => m.userData.id = d.id); o.group.add(g); o.u = u; o.ph0 = Math.random() * 7; o.size = d.h > 1 ? 1.8 : 1.1; }
  }
  o.d = d;
  const [cx, cz] = cellCenter(W, d.x, d.y, d.w, d.h); o.group.position.set(cx, 0, cz);
}
export function setFocus(id) { const W = E?.worlds.sanct; if (W) W.focus = id; }
export function mountScene(host, opts) {
  if (!webgl()) return false;
  engine(); const W = sanctuary(); W.opts = opts;
  if (W.cols !== opts.cols || W.rows !== opts.rows) buildIsland(W, opts.cols, opts.rows);
  W.focus = opts.focus || null;
  const seen = new Set();
  opts.items.forEach(d => {
    seen.add(d.id); let o = W.items.get(d.id);
    if (!o) { o = { group: new THREE.Group(), key: '', wander: { x: 0, z: 0, tx: 0, tz: 0, next: 0 } }; W.world.add(o.group); W.items.set(d.id, o); }
    updateItem(W, o, d);
  });
  [...W.items.keys()].forEach(id => { if (!seen.has(id)) { W.world.remove(W.items.get(id).group); W.items.delete(id); } });
  drawEditor(W);
  attach(host, W);
  return true;
}
function drawEditor(W) {
  W.ov.clear();
  const { mode, valid, cols, rows, items } = W.opts; if (mode === 'play') return;
  const pts = [], y = .24;
  for (let x = 0; x <= cols; x++) pts.push((x - cols / 2) * T, y, -rows / 2 * T, (x - cols / 2) * T, y, rows / 2 * T);
  for (let z = 0; z <= rows; z++) pts.push(-cols / 2 * T, y, (z - rows / 2) * T, cols / 2 * T, y, (z - rows / 2) * T);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  W.ov.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: .7 })));
  const quad = (x, z, w, h, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w * T - .1, h * T - .1), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; const [cx, cz] = cellCenter(W, x, z, w, h); m.position.set(cx, y + .003, cz); W.ov.add(m); };
  if (mode === 'build') items.forEach(d => quad(d.x, d.y, d.w, d.h, '#F2B544', .38));
  (valid || []).forEach(([x, z]) => quad(x, z, 1, 1, '#FFFFFF', .42));
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
