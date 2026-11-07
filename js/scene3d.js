// KANJŪ · scene3d.js — Santuario en 3D: diorama con luz, sombras, día/noche y partículas.
// Las criaturas son láminas de papel 2D dentro de la escena. La grilla de tiles (world.js) sigue
// siendo la fuente de verdad: cada ítem se ubica en el centro de las casillas que ocupa, y la grilla
// sólo se dibuja en modo construcción.
import * as THREE from './vendor/three.module.min.js';

const CREAM = '#FFF4DC';
let R = null; // escena única: persiste entre renders del santuario

export const webgl = (() => { let ok; return () => ok ??= (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })(); })();

// ---------- Hora del día ----------
// Paleta por hora: cielo arriba/abajo, color e intensidad del sol, luz ambiente y "noche" (0–1)
const KEYS = [
  { h: 0, top: '#0B0A1E', bot: '#1E1A40', sun: '#8FA3FF', si: .45, amb: .7, night: 1 },
  { h: 5, top: '#141233', bot: '#3A2C5E', sun: '#9AA8FF', si: .5, amb: .7, night: .9 },
  { h: 6.5, top: '#3B2C6B', bot: '#F2A65A', sun: '#FFB27A', si: 1.4, amb: .8, night: .3 },
  { h: 9, top: '#5FA8E8', bot: '#CFE8F0', sun: '#FFF1D6', si: 2.4, amb: 1.1, night: 0 },
  { h: 16, top: '#5A9FE0', bot: '#E8E0C8', sun: '#FFE6B8', si: 2.3, amb: 1.05, night: 0 },
  { h: 18.5, top: '#43296A', bot: '#F2A65A', sun: '#FF9A5A', si: 1.6, amb: .8, night: .25 },
  { h: 20, top: '#1A1438', bot: '#B85A78', sun: '#C07AFF', si: .6, amb: .55, night: .75 },
  { h: 21.5, top: '#0B0A1E', bot: '#2A2148', sun: '#8FA3FF', si: .45, amb: .7, night: 1 },
  { h: 24, top: '#0B0A1E', bot: '#1E1A40', sun: '#8FA3FF', si: .45, amb: .7, night: 1 },
];
export function hourNow() {
  const q = new URLSearchParams(location.search).get('hora');
  if (q !== null && !isNaN(+q)) return +q;
  const d = new Date(); return d.getHours() + d.getMinutes() / 60;
}
function skyAt(h) {
  const i = KEYS.findIndex(k => k.h > h), a = KEYS[i - 1], b = KEYS[i], t = (h - a.h) / (b.h - a.h);
  const mix = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), t);
  const n = x => a[x] + (b[x] - a[x]) * t;
  return { top: mix(a.top, b.top), bot: mix(a.bot, b.bot), sun: mix(a.sun, b.sun), si: n('si'), amb: n('amb'), night: n('night') };
}

// ---------- Texturas ----------
const canvas = (w, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function tex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const fontReady = document.fonts?.load('64px "Yuji Syuku"').catch(() => {}) || Promise.resolve();

// Convierte el SVG procedural en un recorte de papel: borde crema, kanji pintado con pincel y sin sombra plana
const texCache = new Map();
function paperTexture(svg) {
  if (texCache.has(svg)) return texCache.get(svg);
  const S = 256, M = 14, c = canvas(S), t = tex(c);
  texCache.set(svg, t);
  const texts = [];
  let s = svg.replace(/<text([^>]*)>([^<]*)<\/text>/g, (_, a, txt) => {
    const g = n => +(a.match(new RegExp(`\\b${n}="([\\d.]+)"`)) || [])[1];
    texts.push({ x: g('x'), y: g('y'), fs: g('font-size'), txt }); return '';
  }).replace(/<ellipse[^>]*kj-shadow[^>]*\/>/g, '').replace(/<ellipse[^>]*fill="#0003"[^>]*\/>/g, '')
    .replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" `);
  const img = new Image();
  img.onload = async () => {
    await fontReady;
    const base = canvas(S), b = base.getContext('2d'), k = (S - 2 * M) / 120;
    b.drawImage(img, M, M, S - 2 * M, S - 2 * M);
    b.fillStyle = '#2B1D16'; b.textAlign = 'center'; b.textBaseline = 'middle';
    texts.forEach(x => { b.font = `${x.fs * k * 1.15}px "Yuji Syuku", serif`; b.fillText(x.txt, M + x.x * k, M + x.y * k + 1); });
    const o = c.getContext('2d'), r = 7;
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; o.drawImage(base, Math.cos(a) * r, Math.sin(a) * r); }
    o.globalCompositeOperation = 'source-in'; o.fillStyle = CREAM; o.fillRect(0, 0, S, S);
    o.globalCompositeOperation = 'source-over'; o.drawImage(base, 0, 0);
    t.needsUpdate = true;
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  return t;
}
function blobTexture() {
  const c = canvas(64), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(20,12,30,.55)'); g.addColorStop(.6, 'rgba(20,12,30,.25)'); g.addColorStop(1, 'rgba(20,12,30,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(c);
}
function dotTexture() {
  const c = canvas(32), x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 32, 32); return tex(c);
}
// Pasto pintado a mano: manchas y trazos, sin cuadrícula
function grassTexture(w, h) {
  const P = 96, c = canvas(w * P, h * P), x = c.getContext('2d');
  x.fillStyle = '#6FA35A'; x.fillRect(0, 0, c.width, c.height);
  const rnd = mulberry(7);
  for (let i = 0; i < w * h * 14; i++) {
    x.fillStyle = rnd() < .5 ? 'rgba(130,184,106,.55)' : 'rgba(84,140,72,.45)';
    x.beginPath(); x.ellipse(rnd() * c.width, rnd() * c.height, 10 + rnd() * 26, 5 + rnd() * 12, rnd() * 3, 0, 7); x.fill();
  }
  x.strokeStyle = 'rgba(160,210,120,.7)'; x.lineWidth = 2.5; x.lineCap = 'round';
  for (let i = 0; i < w * h * 30; i++) { const px = rnd() * c.width, py = rnd() * c.height; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (rnd() - .5) * 6, py - 6 - rnd() * 8); x.stroke(); }
  for (let i = 0; i < w * h * 1.2; i++) { x.fillStyle = rnd() < .5 ? '#FFF4DC' : '#F2B544'; x.beginPath(); x.arc(rnd() * c.width, rnd() * c.height, 3.2, 0, 7); x.fill(); }
  return tex(c);
}
function earthTexture() {
  const c = canvas(256, 128), x = c.getContext('2d');
  const bands = ['#6B4632', '#5C3D2A', '#4F3224', '#43291D'];
  bands.forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, i * 32); for (let px = 0; px <= 256; px += 16) x.lineTo(px, i * 32 + Math.sin(px * .08 + i) * 4); x.lineTo(256, 128); x.lineTo(0, 128); x.fill(); });
  x.fillStyle = 'rgba(30,18,12,.35)'; for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(Math.random() * 256, 30 + Math.random() * 98, 2 + Math.random() * 3, 0, 7); x.fill(); }
  const t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
// Capas de fondo: recortes de papel con borde crema arriba (se tiñen según la hora)
function ridgeTexture(seed, peaks, torii) {
  const W = 1024, H = 256, c = canvas(W, H), x = c.getContext('2d'), rnd = mulberry(seed);
  const pts = []; for (let i = 0; i <= peaks; i++) pts.push([i / peaks * W, 60 + rnd() * 110]);
  const path = () => { x.beginPath(); x.moveTo(0, H); pts.forEach(([px, py], i) => i ? x.quadraticCurveTo(pts[i - 1][0] + (px - pts[i - 1][0]) / 2, Math.min(py, pts[i - 1][1]) - 30 * rnd(), px, py) : x.lineTo(px, py)); x.lineTo(W, H); x.closePath(); };
  path(); x.strokeStyle = '#FFFFFF'; x.lineWidth = 10; x.stroke();
  path(); x.fillStyle = '#B0B0B0'; x.fill();
  if (torii) { x.fillStyle = '#E8452C'; const tx = W * .72, ty = 70; x.fillRect(tx, ty, 9, 70); x.fillRect(tx + 52, ty, 9, 70); x.fillRect(tx - 10, ty - 8, 81, 10); x.fillRect(tx - 2, ty + 10, 65, 6); }
  return tex(c);
}
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- Utilería 3D simple (formas casi de bloque, estilo maqueta) ----------
const L = (col, extra = {}) => new THREE.MeshLambertMaterial({ color: col, ...extra });
function mesh(geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
function prop(t, w, h) {
  const g = new THREE.Group(), u = { light: null, flame: null };
  const stone = L('#B8AE9C'), dark = L('#3A2F2A'), red = L('#E8452C'), wood = L('#7A4E32');
  if (t === 'lantern') {
    g.add(mesh(new THREE.BoxGeometry(.42, .1, .42), stone, 0, .05), mesh(new THREE.CylinderGeometry(.07, .09, .32, 8), stone, 0, .26));
    g.add(mesh(new THREE.BoxGeometry(.3, .24, .3), stone, 0, .52));
    const win = new THREE.Mesh(new THREE.BoxGeometry(.32, .12, .2), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); win.position.y = .52; g.add(win);
    const roof = mesh(new THREE.ConeGeometry(.3, .16, 4), L('#8B8273'), 0, .72); roof.rotation.y = Math.PI / 4; g.add(roof, mesh(new THREE.SphereGeometry(.04, 8, 6), stone, 0, .82));
    u.light = { y: .55, color: '#FFB35A', power: 1.6 };
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
    u.light = { y: .5, z: .6, color: '#FFB35A', power: .8 };
  } else if (t === 'bell') {
    g.add(mesh(new THREE.BoxGeometry(.08, .9, .08), wood, -.32, .45), mesh(new THREE.BoxGeometry(.08, .9, .08), wood, .32, .45), mesh(new THREE.BoxGeometry(.85, .08, .12), dark, 0, .92));
    const pts = [[.0, .0], [.2, .02], [.19, .12], [.15, .3], [.08, .38], [0, .4]].map(([x, y]) => new THREE.Vector2(x, y));
    g.add(mesh(new THREE.LatheGeometry(pts, 16), L('#D9A93A'), 0, .45));
  } else if (t === 'torii') {
    g.add(mesh(new THREE.CylinderGeometry(.06, .07, 1.2, 10), red, -.62, .6), mesh(new THREE.CylinderGeometry(.06, .07, 1.2, 10), red, .62, .6));
    g.add(mesh(new THREE.BoxGeometry(1.7, .1, .16), dark, 0, 1.24), mesh(new THREE.BoxGeometry(1.5, .08, .12), red, 0, 1.15), mesh(new THREE.BoxGeometry(1.36, .07, .09), red, 0, .96));
  } else if (t === 'brazier') {
    [0, 2.1, 4.2].forEach(a => g.add(mesh(new THREE.CylinderGeometry(.025, .025, .3, 5), dark, Math.cos(a) * .16, .15, Math.sin(a) * .16)));
    g.add(mesh(new THREE.CylinderGeometry(.3, .16, .18, 12), L('#4A4038'), 0, .38));
    const f = new THREE.Mesh(new THREE.ConeGeometry(.17, .42, 8), new THREE.MeshBasicMaterial({ color: '#FFA24A' })); f.position.y = .66; g.add(f);
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(.09, .26, 8), new THREE.MeshBasicMaterial({ color: '#FFE08A' })); f2.position.y = .6; g.add(f2);
    u.flame = [f, f2]; u.light = { y: .7, color: '#FF7A3A', power: 1.3, always: true };
  } else { // suzuri: piedra de tinta
    g.add(mesh(new THREE.BoxGeometry(.62, .12, .46), L('#3A3F4B'), 0, .06));
    const well = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .02, 16), new THREE.MeshPhongMaterial({ color: '#0E0C1C', shininess: 120 })); well.position.set(0, .125, .05); g.add(well);
    g.add(mesh(new THREE.BoxGeometry(.08, .08, .3), L('#16132A'), .22, .16, 0));
  }
  return { g, u };
}
function sign(text) {
  const g = new THREE.Group(), wood = L('#8B5A3A');
  g.add(mesh(new THREE.BoxGeometry(.07, .6, .07), wood, 0, .3));
  const c = canvas(128, 80), x = c.getContext('2d');
  x.fillStyle = '#C9A27A'; x.fillRect(0, 0, 128, 80); x.strokeStyle = '#7A4E32'; x.lineWidth = 6; x.strokeRect(3, 3, 122, 74);
  fontReady.then(() => { x.fillStyle = '#2B1D16'; x.font = '52px "Yuji Syuku", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 42); t.needsUpdate = true; });
  const t = tex(c);
  const board = mesh(new THREE.BoxGeometry(.5, .32, .05), [wood, wood, wood, wood, new THREE.MeshLambertMaterial({ map: t }), wood], 0, .55);
  g.add(board); return g;
}

// ---------- Escena ----------
function create() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.domElement.className = 'stage-canvas';
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#2A2148', 14, 40);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 120);

  const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 24, 12), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } },
    vertexShader: 'varying float vy; void main(){ vy = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bot; varying float vy; void main(){ float t = smoothstep(-.25,.55,vy); gl_FragColor = vec4(mix(bot, top, t),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
  }));
  scene.add(sky);
  const orb = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshBasicMaterial({ color: '#FFE7B0', fog: false }));
  const halo = new THREE.Mesh(new THREE.CircleGeometry(4.5, 32), new THREE.MeshBasicMaterial({ map: dotTexture(), transparent: true, opacity: .5, depthWrite: false, fog: false, color: '#FFE3A3' }));
  scene.add(halo, orb);

  const layers = [[-9, 3.6, 22, 2, 9, '#3B2F63'], [-15, 5.4, 34, 5, 11, '#5A3E7A', true], [-24, 7.5, 50, 9, 13, '#6B4785']].map(([z, hgt, wid, seed, peaks, col, torii]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(wid, hgt * 2), new THREE.MeshBasicMaterial({ map: ridgeTexture(seed, peaks, torii), transparent: true, depthWrite: false, color: col }));
    m.position.set(0, hgt - 4.2, z); m.userData.base = new THREE.Color(col); scene.add(m); return m;
  });

  // Mar de nubes bajo la isla: puffs suaves que derivan despacio
  const puffT = dotTexture(), clouds = [];
  for (let i = 0; i < 34; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: puffT, transparent: true, depthWrite: false, opacity: .85, fog: false }));
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 9;
    m.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r * .8 - 1, y: -2.4 - Math.random() * 1.6, s: 3 + Math.random() * 4, v: .05 + Math.random() * .1 };
    m.scale.set(m.userData.s * 1.6, m.userData.s, 1); scene.add(m); clouds.push(m);
  }
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#4A3B2A', 1);
  const sun = new THREE.DirectionalLight('#FFFFFF', 2);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -.0008; sun.shadow.normalBias = .02;
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 });
  scene.add(hemi, sun, sun.target);

  const world = new THREE.Group(); scene.add(world);
  const ov = new THREE.Group(); world.add(ov); // grilla del editor

  // Partículas: luciérnagas de noche, polen de día
  const N = 46, pg = new THREE.BufferGeometry(), pos = new Float32Array(N * 3), seeds = [];
  for (let i = 0; i < N; i++) seeds.push({ x: (Math.random() - .5) * 9, y: .2 + Math.random() * 2.4, z: (Math.random() - .5) * 8, p: Math.random() * 7, s: .3 + Math.random() * .7 });
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pm = new THREE.PointsMaterial({ map: dotTexture(), size: .22, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: '#FFE08A', fog: false });
  const points = new THREE.Points(pg, pm); scene.add(points);

  const lights = [0, 1, 2].map(() => { const p = new THREE.PointLight('#FFB35A', 0, 4.5, 1.6); scene.add(p); return p; });

  R = { renderer, scene, camera, sky, clouds, orb, halo, layers, hemi, sun, world, ov, points, seeds, pm, lights,
    items: new Map(), blob: blobTexture(), grassKey: '', platform: null, rows: 0, cols: 0,
    yaw: 0, yawV: 0, panZ: 0, t0: performance.now(), raf: 0, opts: {}, ray: new THREE.Raycaster(), anchors: [] };
  bindInput();
  return R;
}

function buildPlatform(cols, rows) {
  if (R.platform) { R.world.remove(R.platform); R.platform.traverse(o => o.geometry?.dispose()); }
  const g = new THREE.Group(), r = .45, pad = .35, W = cols + pad * 2, D = rows + pad * 2;
  const shape = new THREE.Shape(); const x0 = -W / 2, z0 = -D / 2;
  shape.moveTo(x0 + r, z0); shape.lineTo(x0 + W - r, z0); shape.quadraticCurveTo(x0 + W, z0, x0 + W, z0 + r); shape.lineTo(x0 + W, z0 + D - r);
  shape.quadraticCurveTo(x0 + W, z0 + D, x0 + W - r, z0 + D); shape.lineTo(x0 + r, z0 + D); shape.quadraticCurveTo(x0, z0 + D, x0, z0 + D - r); shape.lineTo(x0, z0 + r); shape.quadraticCurveTo(x0, z0, x0 + r, z0);
  const mk = (depth, mats, y) => { const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 8 }); geo.rotateX(Math.PI / 2); const m = new THREE.Mesh(geo, mats); m.position.y = y; m.receiveShadow = true; return m; };
  const grass = grassTexture(Math.ceil(W), Math.ceil(D));
  // UV del tope: mapear coordenadas del shape (x,z) a [0,1]
  const cap = mk(.14, [new THREE.MeshLambertMaterial({ map: grass }), L(CREAM)], 0);
  const uv = cap.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) { const px = cap.geometry.attributes.position.getX(i), pz = cap.geometry.attributes.position.getZ(i); if (Math.abs(cap.geometry.attributes.position.getY(i)) < .001) uv.setXY(i, (px - x0) / W, 1 - (pz - z0) / D); }
  const et = earthTexture(); et.repeat.set(W / 3, 1);
  const body = mk(1.1, [L('#4F3224'), new THREE.MeshLambertMaterial({ map: et })], -.14);
  body.scale.set(.985, 1, .985);
  g.add(cap, body);
  // raíces colgando y piedritas bajo la isla
  const rnd = mulberry(rows * 13);
  for (let i = 0; i < 10; i++) { const a = rnd() * Math.PI * 2; const m = mesh(new THREE.ConeGeometry(.08 + rnd() * .1, .4 + rnd() * .6, 5), L('#3A241A'), Math.cos(a) * W * .4, -1.4 - rnd() * .3, Math.sin(a) * D * .4); m.rotation.x = Math.PI; g.add(m); }
  const under = mesh(new THREE.ConeGeometry(Math.min(W, D) * .42, 1.4, 9), L('#43291D'), 0, -1.9); under.rotation.x = Math.PI; under.scale.x = W / Math.min(W, D); under.scale.z = D / Math.min(W, D); g.add(under);
  R.world.add(g); R.platform = g; R.cols = cols; R.rows = rows;
}

// Coordenada de mundo del centro de un rectángulo de la grilla
const center = (x, y, w, h) => [x + w / 2 - R.cols / 2, y + h / 2 - R.rows / 2];

function addItem(d) {
  const o = { d, group: new THREE.Group(), key: '', wander: { x: 0, z: 0, tx: 0, tz: 0, next: 0 }, ph: Math.random() * 7, squash: 0, hop: 0, flip: 1, light: null };
  R.world.add(o.group); R.items.set(d.id, o); updateItem(o, d); return o;
}
function updateItem(o, d) {
  const key = `${d.kind}|${d.svg || d.t}|${d.w}x${d.h}|${d.lv || 0}`;
  if (key !== o.key) {
    o.group.clear(); o.sprite = o.blobM = o.u = null; o.key = key;
    if (d.kind === 'mon' || d.kind === 'egg') {
      const map = paperTexture(d.svg), size = 1.45 * (1 + .32 * (Math.max(d.w, d.h) - 1) + .12 * (Math.min(d.w, d.h) - 1));
      const geo = new THREE.PlaneGeometry(1, 1); geo.translate(0, .5, 0);
      const mat = new THREE.MeshLambertMaterial({ map, alphaTest: .5, side: THREE.DoubleSide, emissive: '#FFE08A', emissiveMap: map, emissiveIntensity: 0 });
      const sp = new THREE.Mesh(geo, mat); sp.castShadow = true;
      sp.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: .5 });
      sp.scale.setScalar(size); sp.position.y = -.06 * size; sp.userData.id = d.id;
      const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: R.blob, transparent: true, depthWrite: false }));
      blob.rotation.x = -Math.PI / 2; blob.position.y = .145; blob.scale.set(size * .62, size * .3, 1);
      o.group.add(blob, sp); o.sprite = sp; o.size = size; o.blobM = blob;
    } else if (d.kind === 'away') {
      const s = sign('旅'); s.traverse(m => m.userData.id = d.id); o.group.add(s); o.size = .8;
    } else {
      const { g, u } = prop(d.t, d.w, d.h); g.position.y = .14; g.scale.setScalar(1 + (d.lv - 1) * .05);
      g.traverse(m => m.userData.id = d.id); o.group.add(g); o.u = u; o.size = d.h > 1 ? 1.4 : 1;
    }
  }
  o.d = d;
  const [cx, cz] = center(d.x, d.y, d.w, d.h); o.group.position.set(cx, .0, cz);
  if (o.sprite) o.sprite.material.emissiveIntensity = d.insp ? .18 : 0;
}

// Sincroniza la escena con la grilla
export function mountScene(host, opts) {
  if (!webgl()) return false;
  if (!R) create();
  R.opts = opts;
  host.prepend(R.renderer.domElement); R.host = host; R.ovEl = host.querySelector('.stage-ov');
  if (R.cols !== opts.cols || R.rows !== opts.rows) buildPlatform(opts.cols, opts.rows);
  const seen = new Set();
  opts.items.forEach(d => { seen.add(d.id); const o = R.items.get(d.id); o ? updateItem(o, d) : addItem(d); });
  [...R.items.keys()].forEach(id => { if (!seen.has(id)) { R.world.remove(R.items.get(id).group); R.items.delete(id); } });
  drawEditor();
  resize();
  if (!R.raf) loop();
  return true;
}

// Grilla visible sólo en el editor: líneas de casillas, huella de cada ítem y casillas válidas al colocar
function drawEditor() {
  R.ov.clear();
  const { mode, valid, cols, rows, items } = R.opts; if (mode === 'play') return;
  const pts = [];
  for (let x = 0; x <= cols; x++) pts.push(x - cols / 2, .15, -rows / 2, x - cols / 2, .15, rows / 2);
  for (let z = 0; z <= rows; z++) pts.push(-cols / 2, .15, z - rows / 2, cols / 2, .15, z - rows / 2);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  R.ov.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: .55 })));
  const quad = (x, y, w, h, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w - .08, h - .08), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; const [cx, cz] = center(x, y, w, h); m.position.set(cx, .152, cz); R.ov.add(m); };
  if (mode === 'build') items.forEach(d => quad(d.x, d.y, d.w, d.h, '#F2B544', .32));
  (valid || []).forEach(([x, y]) => quad(x, y, 1, 1, '#FFFFFF', .35));
}

function resize() {
  const w = R.host.clientWidth || 360, h = R.host.clientHeight || 600;
  R.renderer.setSize(w, h, false); R.camera.aspect = w / h; R.camera.updateProjectionMatrix(); R.w = w; R.h = h;
}

// ---------- Entrada: tocar, arrastrar para inclinar la cámara ----------
function bindInput() {
  const el = R.renderer.domElement; let down = null;
  el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, yaw: R.yaw, pan: R.panZ, moved: false }; el.setPointerCapture(e.pointerId); R.dragging = true; });
  el.addEventListener('pointermove', e => {
    if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.hypot(dx, dy) > 8) down.moved = true;
    R.yaw = Math.max(-.32, Math.min(.32, down.yaw + dx * .004));
    R.panZ = Math.max(-R.rows / 2 + 1.2, Math.min(R.rows / 2 - 1.2, down.pan - dy * .012));
  });
  el.addEventListener('pointerup', e => { if (down && !down.moved) tap(e); down = null; R.dragging = false; });
  el.addEventListener('pointercancel', () => { down = null; R.dragging = false; });
  addEventListener('resize', () => R.host && resize());
}
function tap(e) {
  const r = R.renderer.domElement.getBoundingClientRect();
  const p = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
  R.ray.setFromCamera(p, R.camera);
  const { mode, onTap, onCell } = R.opts;
  if (mode === 'placing') {
    const hit = new THREE.Vector3(); if (!R.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -.15), hit)) return;
    const x = Math.floor(hit.x + R.cols / 2), y = Math.floor(hit.z + R.rows / 2);
    if (x >= 0 && y >= 0 && x < R.cols && y < R.rows) onCell?.(x, y);
    return;
  }
  const hits = R.ray.intersectObjects([...R.items.values()].map(o => o.group), true).filter(h => h.object.userData.id);
  if (hits[0]) { const id = hits[0].object.userData.id; poke(id); onTap?.(id, screenOf(id)); }
}

// ---------- API para el santuario ----------
export function poke(id) { const o = R?.items.get(id); if (o) o.squash = 1; }
export function hopAll(p = .3) { R?.items.forEach(o => o.sprite && Math.random() < p && (o.hop = 1)); }
export function screenOf(id) {
  const o = R?.items.get(id); if (!o) return null;
  const v = o.group.position.clone(); v.y += (o.size || 1) * .95; v.project(R.camera);
  return { x: (v.x + 1) / 2 * R.w, y: (1 - v.y) / 2 * R.h };
}
export function emoteAt(id, text) {
  if (!R?.ovEl) return; const b = document.createElement('div'); b.className = 'emote3d'; b.textContent = text; b.dataset.anchor = id;
  R.ovEl.append(b); setTimeout(() => b.remove(), 1600);
}

// ---------- Bucle ----------
function loop() {
  R.raf = requestAnimationFrame(loop);
  if (!R.renderer.domElement.isConnected) { cancelAnimationFrame(R.raf); R.raf = 0; return; }
  if (document.hidden) return;
  const t = (performance.now() - R.t0) / 1000, dt = Math.min(.05, t - (R.last || t)); R.last = t;
  const sk = skyAt(hourNow()), night = sk.night;

  // Luz y cielo según la hora
  R.sky.material.uniforms.top.value.copy(sk.top); R.sky.material.uniforms.bot.value.copy(sk.bot);
  R.scene.fog.color.copy(sk.bot).lerp(sk.top, .35);
  R.hemi.intensity = sk.amb; R.hemi.color.copy(sk.top).lerp(new THREE.Color('#FFFFFF'), .6); R.hemi.groundColor.set('#4A3B2A');
  R.sun.color.copy(sk.sun); R.sun.intensity = sk.si;
  const h = hourNow(), ang = ((h - 6) / 12) * Math.PI; // el sol cruza de izquierda a derecha
  const sx = -Math.cos(ang) * 8, sy = Math.max(2.5, Math.sin(ang) * 9);
  R.sun.position.set(night > .6 ? 5 : sx, night > .6 ? 9 : sy, 6); R.sun.target.position.set(0, 0, 0);
  R.orb.material.color.set(night > .6 ? '#E8ECFF' : '#FFE7B0');
  const ox = night > .6 ? 7 : -Math.cos(ang) * 14, oy = night > .6 ? 9 : 2 + Math.max(0, Math.sin(ang)) * 8;
  R.orb.position.set(ox, oy, -38); R.halo.position.set(ox, oy, -38.1); R.orb.lookAt(R.camera.position); R.halo.lookAt(R.camera.position);
  R.layers.forEach((m, i) => m.material.color.copy(m.userData.base).lerp(sk.top, .25 + i * .12).multiplyScalar(.75 + (1 - night) * .55));

  const cloudCol = sk.bot.clone().lerp(new THREE.Color('#FFFFFF'), .45 - night * .3);
  R.clouds.forEach(m => { const u = m.userData; u.x += u.v * dt; if (u.x > 12) u.x = -12; m.position.set(u.x, u.y, u.z); m.quaternion.copy(R.camera.quaternion); m.material.color.copy(cloudCol); });
  // Cámara: encuadra el ancho de la isla en vertical; arrastrar la inclina y vuelve sola
  const cam = R.camera, hf = 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect);
  const dist = (R.cols / 2 + .55) / Math.tan(hf / 2), elev = .6;
  if (!R.dragging) R.yaw += (0 - R.yaw) * Math.min(1, dt * 2.5);
  R.scene.fog.near = dist + 3; R.scene.fog.far = dist + 34;
  const tz = R.panZ + .2;
  cam.position.set(Math.sin(R.yaw) * Math.cos(elev) * dist, Math.sin(elev) * dist + .4, tz + Math.cos(R.yaw) * Math.cos(elev) * dist);
  cam.lookAt(0, 1.1, tz - .3);

  // Criaturas: respiran, deambulan dentro de sus casillas, se dan vuelta al caminar
  const lit = [];
  R.items.forEach(o => {
    const d = o.d;
    if (o.sprite) {
      const w = o.wander;
      if (d.kind === 'mon' && t > w.next) { const ax = Math.max(.12, d.w / 2 - .4), az = Math.max(.1, d.h / 2 - .4); w.tx = (Math.random() * 2 - 1) * ax; w.tz = (Math.random() * 2 - 1) * az; w.next = t + 2 + Math.random() * 4; }
      const vx = (w.tx - w.x) * 1.2 * dt, vz = (w.tz - w.z) * 1.2 * dt; w.x += vx; w.z += vz;
      const moving = Math.hypot(vx, vz) > .002;
      if (Math.abs(vx) > .0015) o.flip = vx > 0 ? 1 : -1;
      o.squash = Math.max(0, o.squash - dt * 3); o.hop = Math.max(0, o.hop - dt * 2.2);
      const breath = Math.sin(t * 2.4 + o.ph) * .025, step = moving ? Math.abs(Math.sin(t * 9 + o.ph)) * .06 : 0;
      const sq = Math.sin(o.squash * Math.PI) * .22, jump = Math.sin(o.hop * Math.PI) * .35 * o.size;
      const s = o.size;
      o.sprite.scale.set(s * (1 - breath + sq) * o.flip, s * (1 + breath - sq), 1);
      o.sprite.position.set(w.x, -.06 * s + step * s + jump, w.z);
      o.sprite.rotation.y = R.yaw; o.sprite.rotation.z = moving ? Math.sin(t * 9 + o.ph) * .05 : 0;
      o.blobM.position.set(w.x, .145, w.z); o.blobM.material.opacity = 1 - jump * .8;
    }
    if (o.u?.flame) o.u.flame.forEach((f, i) => { f.scale.set(1 + Math.sin(t * 13 + i) * .08, 1 + Math.sin(t * 9 + i * 2) * .15, 1); });
    if (o.u?.light && (night > .2 || o.u.light.always)) lit.push(o);
  });
  // Hasta 3 luces puntuales: faroles y braseros se encienden de noche
  R.lights.forEach((p, i) => {
    const o = lit[i]; if (!o) { p.intensity = 0; return; }
    const L0 = o.u.light; p.color.set(L0.color); p.position.set(o.group.position.x, L0.y + .14, o.group.position.z + (L0.z || 0));
    p.intensity = L0.power * (L0.always ? .6 + night * 1.6 : night * 2.2) * (1 + Math.sin(t * 7 + i) * .06);
  });

  // Partículas
  const P = R.points.geometry.attributes.position;
  R.seeds.forEach((s, i) => P.setXYZ(i, s.x + Math.sin(t * s.s + s.p) * .5, s.y + Math.sin(t * s.s * 1.3 + s.p) * .3 + (night > .5 ? 0 : Math.sin(t * .2 + s.p) * .2), s.z + Math.cos(t * s.s + s.p) * .4 + R.panZ * .5));
  P.needsUpdate = true;
  R.pm.color.set(night > .5 ? '#FFE08A' : '#FFF4DC'); R.pm.size = night > .5 ? .26 : .12; R.pm.opacity = night > .5 ? .5 + Math.sin(t * 3) * .4 : .55;

  // Burbujas y emotes HTML siguen a su ítem
  R.ovEl?.querySelectorAll('[data-anchor]').forEach(el => {
    const p = screenOf(el.dataset.anchor); if (!p) return el.style.display = 'none';
    el.style.display = ''; el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
  });

  R.renderer.render(R.scene, cam);
}
