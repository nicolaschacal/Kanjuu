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
    g.add(mesh(new THREE.BoxGeometry(1.5, .14, 1.4), stone, 0, .07), mesh(new THREE.BoxGeometry(1.1, .62, .9), L('#C9A27A'), 0, .45));
    [[-.5, -.42], [.5, -.42], [-.5, .42], [.5, .42]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(.05, .05, .7, 8), red, x, .49, z)));
    const roof = mesh(new THREE.ConeGeometry(1.05, .5, 4), L('#3A2F4A'), 0, 1.02); roof.rotation.y = Math.PI / 4; roof.scale.z = .85; g.add(roof);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(.34, .4), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); door.position.set(0, .4, .452); g.add(door);
    u.light = { y: .5, z: .6, color: '#FFB35A', power: 1.2 };
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
// SANTUARIO
// =====================================================================
function sanctuary() {
  if (E.worlds.sanct) return E.worlds.sanct;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, .1, 140);
  scene.fog = new THREE.Fog('#2A2148', 20, 60);
  const sky = makeSky(scene);
  const orb = new THREE.Mesh(new THREE.CircleGeometry(1.8, 40), new THREE.MeshBasicMaterial({ color: '#FFE7B0', fog: false }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.05, 40), new THREE.MeshBasicMaterial({ color: CREAM, fog: false }));
  const halo = new THREE.Mesh(new THREE.CircleGeometry(6, 32), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, opacity: .45, depthWrite: false, fog: false, color: '#FFE3A3' }));
  scene.add(halo, orb, ring);
  const layers = makeLayers(scene, [
    { seed: 9, peaks: 7, base: 230, amp: 150, fill: '#8C93C0', w: 90, y: 2, z: -48, fade: .45 },
    { seed: 5, peaks: 9, base: 220, amp: 110, fill: '#6A70A6', w: 64, y: -.5, z: -32, fade: .3, extras: 'torii pagoda' },
    { seed: 2, peaks: 12, base: 250, amp: 70, fill: '#3F6B5A', w: 46, y: -3.2, z: -20, fade: .12, extras: 'trees' },
  ]);
  // Mar de nubes
  const clouds = [];
  for (let i = 0; i < 30; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: dotTex(), transparent: true, depthWrite: false, opacity: .9, fog: false }));
    const a = Math.random() * Math.PI * 2, r = 4 + Math.random() * 10;
    m.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r * .7 - 2, y: -2.6 - Math.random() * 1.8, s: 3 + Math.random() * 4, v: .05 + Math.random() * .1 };
    m.scale.set(m.userData.s * 1.7, m.userData.s, 1); scene.add(m); clouds.push(m);
  }
  // Islotes flotantes en el fondo
  const islets = [[-6.2, -.6, -6, 1.6], [6.8, -1.1, -9, 2.1], [-3.5, -1.8, -13, 1.3]].map(([x, y, z, s], i) => {
    const g = new THREE.Group(), cap = slab(1.6, 1.2, .4, .14, [new THREE.MeshLambertMaterial({ color: '#76A95C' }), L(CREAM)]), body = slab(1.5, 1.1, .4, .6, [L('#5C3D2A'), L('#6B4632')]);
    body.position.y = -.14; g.add(cap, body);
    const tr = new THREE.Group(); tr.add(mesh(new THREE.CylinderGeometry(.05, .07, .4, 6), L('#6B4430'), 0, .2)); [[.4, .55], [.3, .8]].forEach(([r, y]) => tr.add(mesh(new THREE.ConeGeometry(r, .45, 7), L('#2F6B3A'), 0, y))); tr.position.x = i % 2 ? .3 : -.3; g.add(tr);
    g.position.set(x, y, z); g.scale.setScalar(s); g.userData.y = y; scene.add(g); return g;
  });
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#4A3B2A', 1), sun = new THREE.DirectionalLight('#FFFFFF', 2);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -.0008; sun.shadow.normalBias = .02;
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 });
  scene.add(hemi, sun, sun.target);
  const world = new THREE.Group(), ov = new THREE.Group(); scene.add(world); world.add(ov);
  // Partículas
  const N = 50, pg = new THREE.BufferGeometry(), seeds = [];
  for (let i = 0; i < N; i++) seeds.push({ x: (Math.random() - .5) * 9, y: .2 + Math.random() * 2.6, z: (Math.random() - .5) * 8, p: Math.random() * 7, s: .3 + Math.random() * .7 });
  pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const pm = new THREE.PointsMaterial({ map: dotTex(), size: .22, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: '#FFE08A', fog: false });
  scene.add(new THREE.Points(pg, pm));
  const lights = [0, 1, 2].map(() => { const p = new THREE.PointLight('#FFB35A', 0, 5, 1.5); scene.add(p); return p; });

  const W = { name: 'sanct', scene, camera, world, ov, items: new Map(), opts: {}, cols: 0, rows: 0, yaw: 0, panZ: 0, dragging: false, platform: null };
  let drag0 = null;
  W.dragStart = () => { drag0 = { yaw: W.yaw, pan: W.panZ }; W.dragging = true; };
  W.drag = (dx, dy) => { if (!drag0) return; W.yaw = Math.max(-.3, Math.min(.3, drag0.yaw + dx * .004)); W.panZ = Math.max(-W.rows / 2 + 1.2, Math.min(W.rows / 2 - 1.2, drag0.pan - dy * .012)); };
  W.dragEnd = () => { drag0 = null; W.dragging = false; };
  W.tap = ray => {
    const { mode, onTap, onCell } = W.opts;
    if (mode === 'placing') {
      const hit = new THREE.Vector3(); if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -.14), hit)) return;
      const x = Math.floor(hit.x + W.cols / 2), y = Math.floor(hit.z + W.rows / 2);
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
    sun.position.set(isN ? 5 : -Math.cos(ang) * 8, isN ? 9 : Math.max(3, Math.sin(ang) * 9), 6);
    orb.material.color.set(isN ? '#E8ECFF' : '#FFE7B0'); halo.material.color.set(isN ? '#C8D0FF' : '#FFE3A3');
    const ox = isN ? 9 : -Math.cos(ang) * 16, oy = isN ? 11 : 3 + Math.max(0, Math.sin(ang)) * 9;
    [orb, ring, halo].forEach((m, i) => { m.position.set(ox, oy, -60 - i * .1); m.lookAt(camera.position); });
    layers.forEach(m => m.material.color.copy(sk.tint).lerp(sk.bot, m.userData.fade));
    const cc = sk.bot.clone().lerp(new THREE.Color('#FFFFFF'), .3 - night * .18);
    clouds.forEach(m => { const u = m.userData; u.x += u.v * dt; if (u.x > 14) u.x = -14; m.position.set(u.x, u.y, u.z); m.quaternion.copy(camera.quaternion); m.material.color.copy(cc); });
    islets.forEach((g, i) => { g.position.y = g.userData.y + Math.sin(t * .6 + i * 2) * .12; });
    // Cámara más baja: se ve el cielo y el fondo, como una maqueta sobre una mesa
    const hf = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect);
    const dist = (W.cols / 2 + .5) / Math.tan(hf / 2), elev = .52;
    if (!W.dragging) W.yaw += (0 - W.yaw) * Math.min(1, dt * 2.5);
    scene.fog.near = dist + 6; scene.fog.far = dist + 40;
    const tz = W.panZ + .2;
    camera.position.set(Math.sin(W.yaw) * Math.cos(elev) * dist, Math.sin(elev) * dist + .3, tz + Math.cos(W.yaw) * Math.cos(elev) * dist);
    camera.lookAt(0, 1.15, tz - .4);
    // Criaturas
    const lit = [];
    W.items.forEach(o => {
      const d = o.d;
      if (o.sprite) {
        const w = o.wander;
        if (d.kind === 'mon' && t > w.next) { const ax = Math.max(.12, d.w / 2 - .4), az = Math.max(.1, d.h / 2 - .4); w.tx = (Math.random() * 2 - 1) * ax; w.tz = (Math.random() * 2 - 1) * az; w.next = t + 2 + Math.random() * 4; }
        const vx = (w.tx - w.x) * 1.2 * dt, vz = (w.tz - w.z) * 1.2 * dt; w.x += vx; w.z += vz;
        const moving = Math.hypot(vx, vz) > .002; if (Math.abs(vx) > .0015) o.flip = vx > 0 ? 1 : -1;
        animSprite(o, t, dt, moving);
        o.sprite.position.x = w.x; o.sprite.position.z = w.z; o.sprite.rotation.y = W.yaw;
        o.blob.position.set(w.x, .15, w.z);
        o.sprite.material.emissiveIntensity = (d.insp ? .62 : .42) - night * .14 + (d.insp ? Math.sin(t * 4) * .08 : 0);
      }
      if (o.u?.flame) o.u.flame.forEach((f, i) => f.scale.set(1 + Math.sin(t * 13 + i) * .08, 1 + Math.sin(t * 9 + i * 2) * .15, 1));
      if (o.u?.light && (night > .2 || o.u.light.always)) lit.push(o);
    });
    lights.forEach((p, i) => {
      const o = lit[i]; if (!o) { p.intensity = 0; return; }
      const L0 = o.u.light; p.color.set(L0.color); p.position.set(o.group.position.x, L0.y + .14, o.group.position.z + (L0.z || 0));
      p.intensity = L0.power * (L0.always ? .6 + night * 1.6 : night * 2.2) * (1 + Math.sin(t * 7 + i) * .06);
    });
    const P = pg.attributes.position;
    seeds.forEach((s, i) => P.setXYZ(i, s.x + Math.sin(t * s.s + s.p) * .5, s.y + Math.sin(t * s.s * 1.3 + s.p) * .3, s.z + Math.cos(t * s.s + s.p) * .4 + W.panZ * .5));
    P.needsUpdate = true;
    pm.color.set(night > .5 ? '#FFE08A' : '#FFF4DC'); pm.size = night > .5 ? .26 : .12; pm.opacity = night > .5 ? .5 + Math.sin(t * 3) * .4 : .5;
  };
  return E.worlds.sanct = W;
}

function buildIsland(W, cols, rows) {
  if (W.platform) W.world.remove(W.platform);
  const g = new THREE.Group(), pad = .4, Wd = cols + pad * 2, D = rows + pad * 2;
  const cap = slab(Wd, D, .5, .16, [new THREE.MeshLambertMaterial({ map: grassTexture(Math.ceil(Wd), Math.ceil(D)) }), L(CREAM)]);
  topUV(cap, Wd, D);
  const st = strataTexture(); st.repeat.set(Wd / 2.5, 1);
  // Cuerpo en terrazas: estratos de tierra que se angostan hacia abajo
  const layers = [[1, .7, '#6B4632'], [.9, .55, '#5C3D2A'], [.72, .5, '#4F3224'], [.48, .55, '#43291D']];
  let y = -.16;
  layers.forEach(([k, dep, col], i) => { const m = slab(Wd * k, D * k, .5 * k, dep, [L(col), i === 0 ? new THREE.MeshLambertMaterial({ map: st }) : L(col)]); m.position.y = y; g.add(m); y -= dep; });
  const rnd = mulberry(rows * 13 + cols);
  for (let i = 0; i < 12; i++) { const a = rnd() * Math.PI * 2, m = mesh(new THREE.ConeGeometry(.05 + rnd() * .07, .5 + rnd() * .7, 5), L('#3A241A'), Math.cos(a) * Wd * .38, -1.6 - rnd() * .6, Math.sin(a) * D * .36); m.rotation.x = Math.PI; g.add(m); }
  // Matas de pasto y piedritas sólo en el borde (fuera de las casillas)
  const tm = new THREE.MeshLambertMaterial({ map: tuftTex(), alphaTest: .5, side: THREE.DoubleSide, emissive: '#FFFFFF', emissiveMap: tuftTex(), emissiveIntensity: .3 });
  for (let i = 0; i < 18; i++) {
    const side = i % 4, f = rnd();
    const x = side < 2 ? (f - .5) * Wd * .94 : (side === 2 ? -1 : 1) * (Wd / 2 - .18), z = side < 2 ? (side ? 1 : -1) * (D / 2 - .18) : (f - .5) * D * .9;
    const tf = new THREE.Mesh(new THREE.PlaneGeometry(.42, .42), tm); tf.position.set(x, .16 + .19, z); tf.userData.billboard = true; g.add(tf);
  }
  for (let i = 0; i < 8; i++) { const f = rnd(), x = (f - .5) * Wd * .9, z = (rnd() < .5 ? -1 : 1) * (D / 2 - .15); g.add(mesh(new THREE.DodecahedronGeometry(.06 + rnd() * .06), L('#9C9384'), x, .2, z)); }
  W.world.add(g); W.platform = g; W.cols = cols; W.rows = rows;
}
const cellCenter = (W, x, y, w, h) => [x + w / 2 - W.cols / 2, y + h / 2 - W.rows / 2];
function updateItem(W, o, d) {
  const key = `${d.kind}|${d.svg || d.t}|${d.w}x${d.h}|${d.lv || 0}`;
  if (key !== o.key) {
    o.group.clear(); o.sprite = o.blob = o.u = null; o.key = key;
    if (d.kind === 'mon' || d.kind === 'egg') {
      const size = 1.45 * (1 + .32 * (Math.max(d.w, d.h) - 1) + .12 * (Math.min(d.w, d.h) - 1));
      const s = makeSprite(d.svg, size, d.id); Object.assign(o, { sprite: s.sprite, blob: s.blob, size, ph: s.ph, squash: 0, hop: 0, flip: 1, flash: 0 });
      s.sprite.position.y += .16; o.group.add(s.group);
    } else if (d.kind === 'away') { const s = sign('旅'); s.position.y = .16; s.traverse(m => m.userData.id = d.id); o.group.add(s); o.size = .8; }
    else { const { g, u } = prop(d.t, d.w, d.h); g.position.y = .16; g.scale.setScalar(1 + (d.lv - 1) * .05); g.traverse(m => m.userData.id = d.id); o.group.add(g); o.u = u; o.size = d.h > 1 ? 1.4 : 1; }
  }
  o.d = d;
  const [cx, cz] = cellCenter(W, d.x, d.y, d.w, d.h); o.group.position.set(cx, 0, cz);
}
export function mountScene(host, opts) {
  if (!webgl()) return false;
  engine(); const W = sanctuary(); W.opts = opts;
  if (W.cols !== opts.cols || W.rows !== opts.rows) buildIsland(W, opts.cols, opts.rows);
  const seen = new Set();
  opts.items.forEach(d => {
    seen.add(d.id); let o = W.items.get(d.id);
    if (!o) { o = { group: new THREE.Group(), key: '', wander: { x: 0, z: 0, tx: 0, tz: 0, next: 0 } }; W.world.add(o.group); W.items.set(d.id, o); }
    updateItem(W, o, d);
  });
  [...W.items.keys()].forEach(id => { if (!seen.has(id)) { W.world.remove(W.items.get(id).group); W.items.delete(id); } });
  drawEditor(W);
  attach(host, W);
  // las matas miran a cámara
  W.platform.children.forEach(m => m.userData.billboard && (m.rotation.y = 0));
  return true;
}
function drawEditor(W) {
  W.ov.clear();
  const { mode, valid, cols, rows, items } = W.opts; if (mode === 'play') return;
  const pts = [];
  for (let x = 0; x <= cols; x++) pts.push(x - cols / 2, .17, -rows / 2, x - cols / 2, .17, rows / 2);
  for (let z = 0; z <= rows; z++) pts.push(-cols / 2, .17, z - rows / 2, cols / 2, .17, z - rows / 2);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  W.ov.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: .6 })));
  const quad = (x, y, w, h, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w - .08, h - .08), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; const [cx, cz] = cellCenter(W, x, y, w, h); m.position.set(cx, .172, cz); W.ov.add(m); };
  if (mode === 'build') items.forEach(d => quad(d.x, d.y, d.w, d.h, '#F2B544', .35));
  (valid || []).forEach(([x, y]) => quad(x, y, 1, 1, '#FFFFFF', .38));
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
