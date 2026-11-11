// KANJŪ · paper.js — Arte de papel del santuario: recortes dibujados por código (borde blanco de
// cartulina, sombra corrida y grano), texturas para la escena 3D y miniaturas para la Tienda.
import * as THREE from './vendor/three.module.min.js';

// ---------- Grano del papel (Configuración › Papel con grano; por defecto, fuerte) ----------
const GKEY = 'kanjuu.grain';
export const grainOn = () => { try { return localStorage.getItem(GKEY) !== '0'; } catch { return true; } };
function noiseCanvas(n, lo, hi) {
  const c = document.createElement('canvas'); c.width = c.height = n;
  const x = c.getContext('2d'), d = x.createImageData(n, n);
  for (let i = 0; i < d.data.length; i += 4) { const v = lo + Math.random() * (hi - lo); d.data[i] = v; d.data[i + 1] = v * .985; d.data[i + 2] = v * .955; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0); return c;
}
const grainSmall = noiseCanvas(96, 0, 255);
export const grainCSS = noiseCanvas(160, 215, 255).toDataURL();
let _gt = null;
export function grainTex() {
  if (_gt) return _gt;
  _gt = new THREE.CanvasTexture(noiseCanvas(64, 214, 255)); _gt.wrapS = _gt.wrapT = THREE.RepeatWrapping; _gt.colorSpace = THREE.SRGBColorSpace;
  return _gt;
}
const listeners = new Set();
export const onGrain = fn => listeners.add(fn);
export function setGrain(on) {
  try { localStorage.setItem(GKEY, on ? '1' : '0'); } catch {}
  for (const id in TEXO) { CNV[id] = bake(id); TEXO[id].image = CNV[id]; TEXO[id].needsUpdate = true; delete URLS[id]; }
  listeners.forEach(fn => fn(on));
}

function mk(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function dilate(art, R){
  const c = mk(art.width + R*2, art.height + R*2), x = c.getContext('2d');
  for (let a = 0; a < 24; a++){ const t = a / 24 * Math.PI * 2; x.drawImage(art, R + Math.cos(t)*R, R + Math.sin(t)*R); }
  x.drawImage(art, R, R);
  x.globalCompositeOperation = 'source-in'; x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  return c;
}
function tint(src, col){
  const c = mk(src.width, src.height), x = c.getContext('2d');
  x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height);
  return c;
}
function paperize(art, R){
  R = R || 9; const pad = R + 12;
  const out = mk(art.width + pad*2, art.height + pad*2), o = out.getContext('2d');
  const D = dilate(art, R);
  o.drawImage(tint(D, 'rgba(70,48,28,0.28)'), pad - R + 5, pad - R + 7);
  o.drawImage(D, pad - R, pad - R);
  o.drawImage(art, pad, pad);
  const g = grainOn() ? .12 : 0;
  if (g > 0){ o.globalCompositeOperation = 'source-atop'; o.globalAlpha = g; o.fillStyle = o.createPattern(grainSmall, 'repeat'); o.fillRect(0, 0, out.width, out.height); }
  return out;
}
function circ(x, cx, cy, r, col){ x.fillStyle = col; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI*2); x.fill(); }
function ell(x, cx, cy, rx, ry, rot, col){ x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, Math.PI*2); x.fill(); }
function poly(x, pts, col){ x.fillStyle = col; x.beginPath(); x.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) x.lineTo(pts[i], pts[i+1]); x.closePath(); x.fill(); }
let CLOSED = false;
function face(x, cx, cy, sp){
  for (const s of [-1, 1]){
    if (CLOSED){ x.strokeStyle = '#2A221D'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.arc(cx + s*sp, cy - 2, 10, .25*Math.PI, .75*Math.PI); x.stroke(); }
    else { circ(x, cx + s*sp, cy, 14, '#fff'); circ(x, cx + s*sp + 2, cy + 2, 8, '#2A221D'); circ(x, cx + s*sp + 4, cy - 1, 3, '#fff'); }
    ell(x, cx + s*(sp + 14), cy + 20, 10, 6, 0, 'rgba(240,120,130,.55)');
  }
}
function tag(x, cx, cy, r, k){
  circ(x, cx, cy, r, '#F7F0DC');
  x.fillStyle = '#2A221D'; x.font = Math.round(r*1.35) + 'px "Yuji Syuku", serif';
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(k, cx, cy + r*0.06);
}
function bubble(sym, col){
  return x => {
    x.fillStyle = '#FFFDF6'; x.beginPath(); x.roundRect ? x.roundRect(6, 6, 108, 78, 26) : x.rect(6, 6, 108, 78); x.fill();
    poly(x, [44,80, 60,104, 70,80], '#FFFDF6');
    x.fillStyle = col; x.font = '900 52px "Zen Maru Gothic", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(sym, 60, 48);
  };
}
/* Castillo estilo Osaka: muralla de piedra (ishigaki), torre blanca de 5 niveles, techos de cobre verde, adornos dorados */
function drawCastle(x){
  const W = 540, GREEN = '#4E8C82', GREEN_D = '#3B6E66', WHITE = '#F4EFE4', GOLD = '#D9A53A', DARK = '#2B2320';
  // muralla
  poly(x, [24,650, 516,650, 470,500, 70,500], '#9A9388');
  x.fillStyle = '#B2AB9E';
  for (let r = 0; r < 6; r++){ const y = 508 + r*24, inset = 70 - (r+1)*7.5; for (let c = 0; c < 9; c++){ const bw = (W - inset*2)/9; x.fillRect(inset + c*bw + (r%2)*bw*.5 + 3, y, bw - 8, 16); } }
  poly(x, [24,650, 516,650, 506,636, 34,636], '#7E776C');
  // base blanca sobre la muralla
  x.fillStyle = WHITE; x.fillRect(96, 440, 348, 64);
  x.fillStyle = DARK; for (let i = 0; i < 7; i++) x.fillRect(120 + i*44, 460, 16, 22);
  const roof = (x1, x2, yb, h, inset) => {
    poly(x, [x1-22,yb+2, x1+inset,yb-h, x2-inset,yb-h, x2+22,yb+2, x2+6,yb+12, x1-6,yb+12], GREEN);
    poly(x, [x1-22,yb+2, x2+22,yb+2, x2+6,yb+12, x1-6,yb+12], GREEN_D);
    x.fillStyle = GOLD; x.fillRect(x1 - 4, yb + 12, x2 - x1 + 8, 4);
  };
  const gable = (cx, yb, w, h) => { poly(x, [cx - w,yb, cx,yb - h, cx + w,yb], GREEN); poly(x, [cx - w*.62,yb - 4, cx,yb - h*.7, cx + w*.62,yb - 4], WHITE); circ(x, cx, yb - h*.42, 5, GOLD); };
  roof(90, 450, 448, 34, 26);
  // nivel 2
  x.fillStyle = WHITE; x.fillRect(126, 360, 288, 80);
  x.fillStyle = DARK; for (let i = 0; i < 6; i++) x.fillRect(146 + i*44, 382, 16, 22);
  roof(116, 424, 368, 34, 24); gable(270, 334, 56, 40);
  // nivel 3
  x.fillStyle = WHITE; x.fillRect(158, 280, 224, 64);
  x.fillStyle = DARK; for (let i = 0; i < 5; i++) x.fillRect(178 + i*42, 298, 14, 20);
  roof(148, 392, 288, 32, 22); gable(196, 256, 34, 30); gable(344, 256, 34, 30);
  // nivel 4 con karahafu
  x.fillStyle = WHITE; x.fillRect(184, 206, 172, 56);
  x.fillStyle = DARK; for (let i = 0; i < 4; i++) x.fillRect(204 + i*40, 222, 14, 20);
  roof(176, 364, 214, 30, 20);
  x.fillStyle = GREEN; x.beginPath(); x.moveTo(226, 186); x.quadraticCurveTo(270, 140, 314, 186); x.closePath(); x.fill();
  x.strokeStyle = GOLD; x.lineWidth = 4; x.beginPath(); x.moveTo(230, 184); x.quadraticCurveTo(270, 146, 310, 184); x.stroke();
  // nivel 5 superior con paneles dorados
  x.fillStyle = DARK; x.fillRect(206, 120, 128, 56);
  x.fillStyle = GOLD; for (let i = 0; i < 4; i++){ x.fillRect(214 + i*30, 130, 22, 14); x.fillRect(214 + i*30, 152, 22, 12); }
  roof(196, 344, 128, 40, 34);
  x.fillStyle = GREEN_D; x.fillRect(222, 82, 96, 8);
  // shachihoko
  for (const [sx, d] of [[222, -1], [318, 1]]){ ell(x, sx, 70, 9, 16, d*.5, GOLD); poly(x, [sx + d*4,56, sx + d*18,44, sx + d*8,62], GOLD); }
}
const DRAW = {
  ki: x => {
    ell(x, 82, 228, 20, 12, 0, '#4E8E37'); ell(x, 138, 228, 20, 12, 0, '#4E8E37');
    ell(x, 82, 52, 22, 46, -0.6, '#4E8E37'); ell(x, 138, 48, 22, 46, 0.6, '#8CCB62');
    ell(x, 110, 145, 88, 84, 0, '#6FAE4F'); ell(x, 92, 118, 50, 40, -0.4, '#7DBB5B');
    face(x, 110, 108, 30); tag(x, 110, 172, 40, '木');
  },
  hi: x => {
    const flame = (s, col) => { x.save(); x.translate(110, 240); x.scale(s, s); x.translate(-110, -240);
      x.fillStyle = col; x.beginPath(); x.moveTo(112, 8);
      x.bezierCurveTo(150, 70, 205, 110, 196, 165); x.bezierCurveTo(190, 218, 146, 240, 110, 240);
      x.bezierCurveTo(68, 240, 24, 214, 26, 162); x.bezierCurveTo(28, 122, 58, 106, 68, 66);
      x.bezierCurveTo(84, 92, 98, 84, 112, 8); x.fill(); x.restore(); };
    flame(1, '#E2652F'); flame(.78, '#F28C3E'); flame(.5, '#F9B95A');
    face(x, 110, 128, 30); tag(x, 110, 188, 36, '火');
  },
  mizu: x => {
    x.fillStyle = '#3F8FCB'; x.beginPath(); x.moveTo(110, 8);
    x.bezierCurveTo(140, 70, 198, 110, 198, 162); x.bezierCurveTo(198, 212, 158, 240, 110, 240);
    x.bezierCurveTo(62, 240, 22, 212, 22, 162); x.bezierCurveTo(22, 110, 80, 70, 110, 8); x.fill();
    ell(x, 74, 120, 16, 30, 0.35, 'rgba(255,255,255,.45)');
    face(x, 110, 132, 30); tag(x, 110, 190, 36, '水');
  },
  torii: x => {
    x.fillStyle = '#C8412E'; x.fillRect(48, 70, 26, 222); x.fillRect(186, 70, 26, 222);
    x.fillStyle = '#2B2320'; x.fillRect(44, 276, 34, 18); x.fillRect(182, 276, 34, 18);
    x.fillStyle = '#C8412E'; x.fillRect(26, 112, 208, 18);
    poly(x, [0,26, 130,40, 260,26, 246,58, 130,66, 14,58], '#2B2320');
    x.fillStyle = '#C8412E'; x.fillRect(16, 58, 228, 16);
    x.fillStyle = '#2B2320'; x.fillRect(116, 74, 28, 38);
  },
  farol: x => {
    x.fillStyle = '#8F8A80'; x.fillRect(36, 196, 68, 26); x.fillStyle = '#A7A296'; x.fillRect(56, 120, 28, 78);
    x.fillStyle = '#B9B4A8'; x.fillRect(26, 70, 88, 54);
    x.fillStyle = '#FFD36A'; x.fillRect(46, 80, 48, 34); x.fillStyle = '#FFE9A8'; x.fillRect(56, 86, 28, 22);
    poly(x, [6,74, 70,22, 134,74], '#7E796F'); circ(x, 70, 20, 11, '#7E796F');
  },
  refugio: x => {
    x.fillStyle = '#8A5A34'; x.fillRect(38, 88, 16, 140); x.fillRect(186, 88, 16, 140);
    x.fillStyle = '#B07A4A'; x.fillRect(44, 176, 152, 14); x.fillRect(56, 190, 10, 36); x.fillRect(174, 190, 10, 36);
    poly(x, [0,104, 120,16, 240,104, 222,116, 18,116], '#6E4A35');
    poly(x, [30,96, 120,30, 210,96], '#87603F');
    x.fillStyle = '#C8412E'; x.fillRect(108, 46, 24, 34);
  },
  cerezo: x => {
    x.fillStyle = '#7A4E32'; x.beginPath(); x.moveTo(112, 300); x.lineTo(124, 170); x.lineTo(90, 120); x.lineTo(104, 116);
    x.lineTo(132, 150); x.lineTo(168, 108); x.lineTo(178, 116); x.lineTo(140, 176); x.lineTo(146, 300); x.fill();
    for (const [cx, cy, r, c] of [[70,110,56,'#E58AAB'],[130,72,64,'#F2A7C0'],[196,110,56,'#E58AAB'],[100,150,50,'#F7C4D4'],[170,152,48,'#F2A7C0'],[136,120,46,'#F7C4D4']]) circ(x, cx, cy, r, c);
  },
  pino: x => {
    x.fillStyle = '#7A4E32'; x.fillRect(88, 232, 24, 58);
    poly(x, [20,240, 100,120, 180,240], '#3D7347'); poly(x, [34,180, 100,64, 166,180], '#4C8A53'); poly(x, [50,120, 100,8, 150,120], '#5C9E5E');
  },
  arbusto: x => {
    circ(x, 58, 92, 48, '#4F8B3C'); circ(x, 150, 94, 44, '#4F8B3C'); circ(x, 104, 70, 58, '#5E9C47');
    circ(x, 84, 58, 22, '#76B55A'); circ(x, 130, 66, 16, '#76B55A');
  },
  flores: x => {
    for (let i = 0; i < 7; i++){ const px = 18 + i*21; x.fillStyle = '#4F8B3C'; x.fillRect(px, 50 + (i%2)*12, 5, 60); }
    const cols = ['#FFFFFF','#F6C445','#F29BB6','#FFFFFF','#F6C445','#F29BB6','#FFFFFF'];
    cols.forEach((c, i) => { const px = 20 + i*21, py = 46 + (i%2)*12; for (let p = 0; p < 5; p++){ const t = p/5*Math.PI*2; circ(x, px + Math.cos(t)*9, py + Math.sin(t)*9, 7, c); } circ(x, px, py, 6, '#E2852F'); });
  },
  bambu: x => {
    const stalk = (bx, top, c) => { x.fillStyle = c; x.fillRect(bx, top, 18, 300 - top); x.fillStyle = 'rgba(0,0,0,.18)'; for (let y = top + 50; y < 300; y += 56) x.fillRect(bx - 2, y, 22, 5); };
    stalk(22, 40, '#7FB04E'); stalk(66, 6, '#6AA043'); stalk(110, 60, '#8CBD58');
    ell(x, 46, 60, 26, 9, -0.5, '#5C9A3E'); ell(x, 100, 30, 28, 9, 0.5, '#5C9A3E'); ell(x, 134, 90, 24, 8, 0.4, '#5C9A3E');
  },
  roca: x => { poly(x, [10,104, 30,40, 92,8, 156,30, 174,104], '#9E998F'); poly(x, [30,40, 92,8, 110,60, 60,70], '#BAB5AB'); },
  /* --- edificios --- */
  pagoda: x => {
    x.fillStyle = '#9A9388'; x.fillRect(66, 488, 168, 30); x.fillStyle = '#B2AB9E'; x.fillRect(74, 492, 152, 8);
    for (let i = 0; i < 5; i++){
      const ww = 112 - i*13, yb = 488 - i*80, rw = ww + 76;
      x.fillStyle = '#B33A28'; x.fillRect(150 - ww/2, yb - 44, ww, 44);
      x.fillStyle = '#F2E8D5'; x.fillRect(150 - ww/2 + 8, yb - 34, ww - 16, 14);
      x.fillStyle = '#2B2320'; for (let k = 0; k < 3; k++) x.fillRect(150 - ww/2 + 14 + k*(ww - 28)/2 - 3, yb - 34, 6, 14);
      poly(x, [150 - rw/2 - 10,yb - 40, 150 - rw/2 + 18,yb - 66, 150 + rw/2 - 18,yb - 66, 150 + rw/2 + 10,yb - 40, 150 + rw/2 - 6,yb - 32, 150 - rw/2 + 6,yb - 32], '#4A4440');
      x.fillStyle = '#66605A'; x.fillRect(150 - rw/2 + 18, yb - 66, rw - 36, 6);
    }
    x.fillStyle = '#C9A23A'; x.fillRect(146, 40, 8, 132);
    for (let r = 0; r < 6; r++) ell(x, 150, 80 + r*14, 13, 4, 0, '#D9B44A');
    circ(x, 150, 34, 11, '#E3BE52');
  },
  templo: x => {
    x.fillStyle = '#A7A296'; x.fillRect(16, 316, 388, 56); x.fillStyle = '#BDB8AC'; x.fillRect(16, 316, 388, 10);
    poly(x, [160,372, 260,372, 248,330, 172,330], '#93907F');
    x.fillStyle = '#C79A5E'; x.fillRect(56, 196, 308, 124);
    x.fillStyle = '#F4EFE4'; for (let i = 0; i < 5; i++) x.fillRect(74 + i*58, 214, 44, 74);
    x.fillStyle = '#C8412E'; for (let i = 0; i < 6; i++) x.fillRect(56 + i*58, 186, 14, 134);
    poly(x, [0,206, 70,96, 350,96, 420,206, 396,220, 24,220], '#3E4A52');
    poly(x, [70,96, 210,30, 350,96], '#4D5A63');
    x.fillStyle = '#2B3338'; x.fillRect(150, 22, 120, 14);
    x.fillStyle = '#D9A53A'; x.fillRect(24, 218, 372, 6); circ(x, 210, 70, 12, '#D9A53A');
    x.fillStyle = '#4D5A63'; x.beginPath(); x.moveTo(150, 206); x.quadraticCurveTo(210, 130, 270, 206); x.closePath(); x.fill();
  },
  minka: x => {
    x.fillStyle = '#9A9388'; x.fillRect(48, 314, 324, 22);
    x.fillStyle = '#EFE7D6'; x.fillRect(60, 196, 300, 120);
    x.fillStyle = '#5A3E2B'; x.fillRect(60, 196, 300, 10); for (let i = 0; i < 6; i++) x.fillRect(60 + i*58, 196, 10, 120); x.fillRect(60, 252, 300, 8);
    x.fillStyle = '#E8DCC0'; x.fillRect(176, 262, 68, 52); x.fillStyle = '#5A3E2B'; x.fillRect(208, 262, 4, 52); x.fillRect(176, 286, 68, 3);
    poly(x, [14,214, 120,36, 300,36, 406,214], '#B79A5E');
    x.save(); x.beginPath(); x.moveTo(14,214); x.lineTo(120,36); x.lineTo(300,36); x.lineTo(406,214); x.closePath(); x.clip();
    x.fillStyle = 'rgba(90,62,43,.22)'; for (let i = 0; i < 14; i++) x.fillRect(30 + i*27, 40, 6, 176); x.restore();
    x.fillStyle = '#7A6340'; x.fillRect(112, 26, 196, 16);
    x.fillStyle = '#5A3E2B'; x.fillRect(150, 10, 10, 22); x.fillRect(262, 10, 10, 22);
  },
  casate: x => {
    x.fillStyle = '#9A9388'; x.fillRect(26, 206, 208, 18);
    x.fillStyle = '#D9C9A8'; x.fillRect(40, 116, 180, 92);
    circ(x, 92, 156, 26, '#5A3E2B'); circ(x, 92, 156, 20, '#EFE7D6'); x.fillStyle = '#5A3E2B'; x.fillRect(90, 136, 4, 40); x.fillRect(72, 154, 40, 4);
    x.fillStyle = '#EFE7D6'; x.fillRect(140, 146, 58, 62); x.fillStyle = '#5A3E2B'; x.fillRect(168, 146, 3, 62); x.fillRect(140, 170, 58, 3);
    poly(x, [6,128, 70,30, 190,30, 254,128, 240,138, 20,138], '#6E5A44');
    x.fillStyle = '#5A4936'; x.fillRect(70, 24, 120, 10);
  },
  puente: x => {
    x.strokeStyle = '#8F3022'; x.lineWidth = 22; x.lineCap = 'round'; x.beginPath(); x.moveTo(14, 128); x.quadraticCurveTo(150, 30, 286, 128); x.stroke();
    x.strokeStyle = '#C8412E'; x.lineWidth = 14; x.beginPath(); x.moveTo(14, 118); x.quadraticCurveTo(150, 22, 286, 118); x.stroke();
    x.fillStyle = '#C8412E'; for (let i = 0; i <= 8; i++){ const u = i/8, px = (1-u)*(1-u)*14 + 2*(1-u)*u*150 + u*u*286, py = (1-u)*(1-u)*118 + 2*(1-u)*u*22 + u*u*118; x.fillRect(px - 4, py - 44, 8, 40); circ(x, px, py - 46, 6, '#D9A53A'); }
    x.strokeStyle = '#C8412E'; x.lineWidth = 7; x.beginPath(); x.moveTo(14, 78); x.quadraticCurveTo(150, -18, 286, 78); x.stroke();
  },
  /* --- adornos de templo --- */
  komainu: x => {
    x.fillStyle = '#8F8A80'; x.fillRect(30, 160, 140, 36); x.fillStyle = '#A7A296'; x.fillRect(40, 150, 120, 14);
    ell(x, 100, 118, 52, 36, 0, '#B9B4A8'); circ(x, 118, 72, 40, '#B9B4A8');
    for (const [cx, cy] of [[86,44],[104,34],[126,32],[146,44],[154,64],[150,86],[80,64]]) circ(x, cx, cy, 13, '#9E998F');
    circ(x, 106, 70, 6, '#2B2320'); circ(x, 134, 70, 6, '#2B2320'); ell(x, 122, 92, 14, 6, 0, '#7E796F');
    ell(x, 58, 112, 16, 22, -0.5, '#9E998F'); x.fillStyle = '#9E998F'; x.fillRect(70, 136, 20, 18); x.fillRect(118, 136, 20, 18);
  },
  campana: x => {
    x.fillStyle = '#8A5A34'; x.fillRect(32, 70, 14, 186); x.fillRect(154, 70, 14, 186);
    poly(x, [0,82, 100,10, 200,82, 186,92, 14,92], '#4A4440');
    x.fillStyle = '#2B2320'; x.fillRect(98, 92, 4, 20);
    x.fillStyle = '#5D6B5A'; x.beginPath(); x.moveTo(72, 120); x.quadraticCurveTo(72, 108, 100, 108); x.quadraticCurveTo(128, 108, 128, 120); x.lineTo(132, 190); x.lineTo(68, 190); x.closePath(); x.fill();
    x.fillStyle = '#4B5848'; x.fillRect(66, 184, 68, 10); x.fillStyle = '#7A8A76'; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) circ(x, 82 + c*12, 126 + r*12, 3, '#7A8A76');
    x.fillStyle = '#9A9388'; x.fillRect(20, 250, 160, 10);
  },
  incienso: x => {
    x.fillStyle = '#4E4232'; x.fillRect(46, 170, 12, 30); x.fillRect(122, 170, 12, 30);
    ell(x, 90, 150, 62, 32, 0, '#6B5B3E'); x.fillStyle = '#6B5B3E'; x.fillRect(28, 110, 124, 40); ell(x, 90, 110, 62, 12, 0, '#847150');
    x.fillStyle = '#4E4232'; x.fillRect(84, 66, 12, 44); poly(x, [40,70, 90,36, 140,70], '#4E4232'); circ(x, 90, 34, 8, '#D9A53A');
    for (const [cx, cy, r] of [[70,30,12],[84,16,10],[104,8,8]]) circ(x, cx, cy, r, 'rgba(230,226,218,.85)');
  },
  ema: x => {
    x.fillStyle = '#8A5A34'; x.fillRect(16, 40, 12, 156); x.fillRect(192, 40, 12, 156); x.fillRect(10, 36, 200, 12); x.fillRect(16, 110, 188, 8);
    poly(x, [0,40, 110,6, 220,40], '#5A3E2B');
    const plaque = (px, py) => { poly(x, [px,py+8, px+12,py, px+24,py+8, px+24,py+26, px,py+26], '#E8D2A6'); x.fillStyle = '#C8412E'; x.fillRect(px+11, py-6, 2, 8); };
    for (let i = 0; i < 6; i++) plaque(30 + i*27, 58 + (i%2)*6); for (let i = 0; i < 6; i++) plaque(30 + i*27, 128 + ((i+1)%2)*6);
  },
  nobori: x => {
    x.fillStyle = '#3B2F26'; x.fillRect(16, 4, 8, 292); x.fillRect(16, 20, 64, 6);
    x.fillStyle = '#C8412E'; x.fillRect(26, 26, 54, 232); x.fillStyle = '#F4EFE4'; x.fillRect(26, 26, 54, 18); x.fillRect(26, 240, 54, 18);
    x.fillStyle = '#F4EFE4'; x.font = '40px "Yuji Syuku", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('祭', 53, 100); x.fillText('礼', 53, 170);
  },
  sagrada: x => {
    poly(x, [10,170, 24,90, 70,30, 140,20, 186,70, 194,170], '#8E897F'); poly(x, [70,30, 140,20, 150,70, 80,84], '#A7A296');
    x.strokeStyle = '#D8C08A'; x.lineWidth = 14; x.beginPath(); x.moveTo(14, 112); x.quadraticCurveTo(100, 140, 192, 108); x.stroke();
    x.fillStyle = '#FFFDF6'; for (const px of [56, 100, 146]){ const py = px === 100 ? 132 : 126; poly(x, [px-6,py, px+6,py, px+2,py+12, px+8,py+12, px+4,py+26, px-6,py+26, px-2,py+12, px-8,py+12], '#FFFDF6'); }
  },
  chochin: x => {
    x.fillStyle = '#5A3E2B'; x.fillRect(48, 20, 10, 236); x.fillRect(48, 20, 52, 8);
    x.fillStyle = '#2B2320'; x.fillRect(84, 28, 4, 22);
    ell(x, 86, 98, 30, 46, 0, '#D9533B'); ell(x, 80, 90, 12, 26, 0, '#F08A5C');
    x.fillStyle = '#2B2320'; x.fillRect(66, 50, 40, 8); x.fillRect(66, 138, 40, 8);
    x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2; for (let r = 0; r < 5; r++){ x.beginPath(); x.ellipse(86, 66 + r*16, 30, 3, 0, 0, Math.PI*2); x.stroke(); }
    x.fillStyle = '#9A9388'; x.fillRect(30, 246, 46, 12);
  },
  castillo: drawCastle,
  sol: x => { for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2, a1 = a - .13, a2 = a + .13; poly(x, [110 + Math.cos(a1)*70,110 + Math.sin(a1)*70, 110 + Math.cos(a)*106,110 + Math.sin(a)*106, 110 + Math.cos(a2)*70,110 + Math.sin(a2)*70], i % 2 ? '#F39A2E' : '#F6B73C'); }
    circ(x, 110, 110, 72, '#F6B73C'); circ(x, 110, 110, 54, '#FFD36A'); ell(x, 92, 92, 18, 12, -0.6, 'rgba(255,255,255,.5)'); },
  luna: x => { circ(x, 100, 100, 84, '#F5EBC8'); circ(x, 70, 120, 10, '#E6D9AE'); circ(x, 96, 150, 7, '#E6D9AE'); x.globalCompositeOperation = 'destination-out'; circ(x, 140, 76, 74, '#000'); x.globalCompositeOperation = 'source-over'; },
  estrella: x => { const p = []; for (let i = 0; i < 10; i++){ const a = -Math.PI/2 + i*Math.PI/5, r = i % 2 ? 13 : 32; p.push(35 + Math.cos(a)*r, 37 + Math.sin(a)*r); } poly(x, p, '#FFE9A8'); },
  espuma: x => { for (const [cx, cy, r, c] of [[40,70,30,'#FFFFFF'],[80,52,36,'#FFFFFF'],[124,66,30,'#FFFFFF'],[62,84,24,'#DDEFF8'],[104,86,24,'#DDEFF8'],[148,82,18,'#FFFFFF'],[20,86,16,'#DDEFF8']]) circ(x, cx, cy, r, c); },
  nube: x => { for (const [cx, cy, r] of [[60,90,48],[130,64,62],[206,84,52],[256,100,36],[100,104,40],[180,108,40]]) circ(x, cx, cy, r, '#FDFAF3'); },
  mata: x => { poly(x, [6,80, 18,10, 30,80], '#6FA84B'); poly(x, [24,80, 42,0, 56,80], '#83BD5A'); poly(x, [48,80, 70,18, 80,80], '#5E9A40'); },
  matam: x => { poly(x, [6,80, 18,14, 30,80], '#4E8238'); poly(x, [24,80, 42,4, 56,80], '#5F9447'); poly(x, [48,80, 70,22, 80,80], '#477A33'); },
  florcita: x => { x.fillStyle = '#5E9A40'; x.fillRect(22, 26, 6, 40); for (let p = 0; p < 5; p++){ const t = p/5*Math.PI*2; circ(x, 25 + Math.cos(t)*10, 22 + Math.sin(t)*10, 8, '#FFFFFF'); } circ(x, 25, 22, 7, '#F2B33D'); },
  mariposa: x => { ell(x, 34, 34, 30, 26, -0.4, '#F29A3E'); ell(x, 86, 34, 30, 26, 0.4, '#F29A3E'); ell(x, 40, 70, 20, 16, 0.3, '#F7C76A'); ell(x, 80, 70, 20, 16, -0.3, '#F7C76A'); ell(x, 60, 52, 6, 30, 0, '#2B2320'); },
  e_nota: bubble('♪', '#3E8E5A'), e_cora: bubble('♥', '#D9533B'), e_pts: bubble('…', '#2E2620'), e_zz: bubble('z', '#4E6E9A'), e_gota: bubble('☂', '#3F8FCB'), e_ex: bubble('!', '#E9A93A')
};
const SIZE = { ki:[220,250], hi:[220,250], mizu:[220,250], torii:[260,300], farol:[140,226], refugio:[240,232], cerezo:[260,300], pino:[200,292], arbusto:[208,144], flores:[166,120], bambu:[150,300], roca:[180,110], castillo:[540,656], espuma:[170,110], pagoda:[300,520], templo:[420,376], minka:[420,340], casate:[260,226], puente:[300,140], komainu:[200,200], campana:[200,262], incienso:[180,204], ema:[220,200], nobori:[100,300], sagrada:[204,176], chochin:[110,262], sol:[220,220], luna:[200,200], estrella:[70,72], nube:[300,160], mata:[86,82], matam:[86,82], florcita:[50,70], mariposa:[120,92], e_nota:[120,108], e_cora:[120,108], e_pts:[120,108], e_zz:[120,108], e_gota:[120,108], e_ex:[120,108] };
const RAD = { mata:5, matam:5, florcita:4, mariposa:6, e_nota:4, e_cora:4, e_pts:4, e_zz:4, e_gota:4, e_ex:4, castillo:12, estrella:5, sol:8 };

/* --- piezas nuevas para objetos que ya existían en el juego --- */
Object.assign(DRAW, {
  suzuri: x => {
    poly(x, [16,120, 30,60, 170,60, 184,120], '#2F343F'); poly(x, [30,60, 170,60, 160,40, 40,40], '#454B58');
    ell(x, 70, 52, 30, 9, 0, '#1A1D26'); ell(x, 70, 50, 22, 6, 0, '#3E5F86');
    x.fillStyle = '#7A4E32'; x.fillRect(120, 34, 50, 12); x.fillStyle = '#2B2320'; x.fillRect(164, 34, 12, 12);
  },
  brasero: x => {
    x.fillStyle = '#2B2320'; x.fillRect(46, 120, 10, 60); x.fillRect(124, 120, 10, 60); x.fillRect(86, 124, 10, 56);
    ell(x, 90, 112, 74, 26, 0, '#4A4038'); ell(x, 90, 104, 66, 16, 0, '#2B2320');
    for (const [cx, s, col] of [[90, 1, '#E2652F'], [90, .7, '#F28C3E'], [90, .42, '#F9D45A']]) { x.save(); x.translate(cx, 104); x.scale(s, s); x.fillStyle = col; x.beginPath(); x.moveTo(-46, 0); x.quadraticCurveTo(-40, -60, -6, -96); x.quadraticCurveTo(0, -56, 18, -70); x.quadraticCurveTo(48, -40, 46, 0); x.closePath(); x.fill(); x.restore(); }
  },
  cerca: x => {
    x.fillStyle = '#7A4E32'; for (let i = 0; i < 5; i++) x.fillRect(10 + i*46, 20, 14, 110);
    x.fillStyle = '#8A5A34'; x.fillRect(0, 44, 220, 12); x.fillRect(0, 88, 220, 12);
    for (let i = 0; i < 5; i++) poly(x, [10 + i*46,20, 17 + i*46,8, 24 + i*46,20], '#7A4E32');
  },
  arbol: x => {
    x.fillStyle = '#6B4430'; x.fillRect(92, 180, 26, 110); poly(x, [92,220, 60,190, 70,184, 96,206], '#6B4430');
    for (const [cx, cy, r, c] of [[70,130,58,'#3F7A45'],[140,120,62,'#4E8F4A'],[104,74,66,'#5A9A50'],[60,90,40,'#4E8F4A'],[150,70,40,'#3F7A45'],[105,150,50,'#3F7A45']]) circ(x, cx, cy, r, c);
    circ(x, 86, 62, 18, '#76B55A'); circ(x, 130, 92, 14, '#76B55A');
  },
  estanque: x => {
    ell(x, 200, 100, 194, 92, 0, '#8E8778'); ell(x, 200, 98, 176, 80, 0, '#3F8FCB'); ell(x, 170, 86, 90, 30, 0, '#6FB3DE');
    for (const [cx, cy, r] of [[40,70,16],[350,120,18],[300,40,12],[90,160,14]]) circ(x, cx, cy, r, '#A7A296');
    ell(x, 250, 120, 26, 16, 0, '#5E9A40'); circ(x, 250, 112, 7, '#F7C4D4');
  },
  losa: x => {
    for (const [cx, cy, rx, ry, c] of [[60,64,44,34,'#C9C1AE'],[150,50,40,30,'#D6CFBD'],[110,136,46,32,'#BDB5A2'],[190,130,30,24,'#CFC8B6']]) ell(x, cx, cy, rx, ry, (cx % 7) * .1, c);
  }
});
Object.assign(SIZE, { suzuri:[200,130], brasero:[180,186], cerca:[220,134], arbol:[220,290], estanque:[400,200], losa:[230,170] });

/* --- MAQUETA Zoo 動物園: granero con techo de paja, corral y alguien que se asoma --- */
Object.assign(DRAW, {
  zoo: x => {
    x.fillStyle = '#9A9388'; x.fillRect(36, 352, 368, 24); x.fillStyle = '#B2AB9E'; x.fillRect(44, 352, 352, 6);
    // paredes con vigas
    x.fillStyle = '#EFE7D6'; x.fillRect(70, 206, 300, 148);
    x.fillStyle = '#5A3E2B'; x.fillRect(70, 206, 300, 10); for (const px of [70, 130, 310, 360]) x.fillRect(px, 206, 10, 148); x.fillRect(70, 270, 70, 8); x.fillRect(300, 270, 70, 8);
    // portón abierto y alguien que se asoma
    x.fillStyle = '#5A3E2B'; x.fillRect(158, 226, 124, 128);
    x.fillStyle = '#2B2320'; x.beginPath(); x.moveTo(168, 354); x.lineTo(168, 262); x.quadraticCurveTo(220, 214, 272, 262); x.lineTo(272, 354); x.fill();
    ell(x, 220, 330, 46, 40, 0, '#D39A62'); poly(x, [182,306, 188,262, 210,296], '#D39A62'); poly(x, [258,306, 252,262, 230,296], '#D39A62');
    ell(x, 220, 344, 30, 18, 0, '#E9C79C'); face(x, 220, 318, 17);
    // hojas del portón abiertas
    poly(x, [158,226, 158,354, 128,364, 128,236], '#7A5236'); poly(x, [282,226, 282,354, 312,364, 312,236], '#7A5236');
    x.fillStyle = '#5A3E2B'; x.fillRect(132, 290, 24, 6); x.fillRect(284, 290, 24, 6);
    // ventana con un pájaro
    x.fillStyle = '#5A3E2B'; x.fillRect(82, 222, 50, 44); x.fillStyle = '#A9D3E2'; x.fillRect(88, 228, 38, 32);
    circ(x, 107, 250, 14, '#7FD6F2'); poly(x, [118,248, 130,252, 118,256], '#F2B544'); circ(x, 111, 245, 4, '#2A221D');
    // techo de paja (como la minka) con cumbrera
    poly(x, [20,224, 124,52, 316,52, 420,224], '#B79A5E');
    x.save(); x.beginPath(); x.moveTo(20,224); x.lineTo(124,52); x.lineTo(316,52); x.lineTo(420,224); x.closePath(); x.clip();
    x.fillStyle = 'rgba(90,62,43,.22)'; for (let i = 0; i < 15; i++) x.fillRect(32 + i*27, 56, 6, 172); x.restore();
    x.fillStyle = '#7A6340'; x.fillRect(114, 42, 212, 16); x.fillStyle = '#5A3E2B'; x.fillRect(150, 26, 10, 22); x.fillRect(280, 26, 10, 22);
    // cartel rojo 動物園
    x.fillStyle = '#5A3E2B'; x.fillRect(150, 112, 140, 60); x.fillStyle = '#C8412E'; x.fillRect(156, 118, 128, 48);
    x.fillStyle = '#F4EFE4'; x.font = '38px "Yuji Syuku", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('動物園', 220, 144);
    // corral bajo adelante, con la entrada libre
    x.fillStyle = '#7A4E32'; for (const px of [24, 64, 104, 316, 356, 396]) { x.fillRect(px, 318, 12, 62); poly(x, [px,318, px + 6,308, px + 12,318], '#7A4E32'); }
    x.fillStyle = '#8A5A34'; x.fillRect(18, 334, 104, 9); x.fillRect(18, 358, 104, 9); x.fillRect(312, 334, 104, 9); x.fillRect(312, 358, 104, 9);
    // plazas ocupadas: tablilla colgada del alero
    x.fillStyle = '#5A3E2B'; x.fillRect(352, 190, 4, 22); x.fillRect(396, 190, 4, 22);
    x.fillStyle = '#F4EFE4'; x.fillRect(340, 208, 72, 40); x.fillStyle = '#2A221D'; x.font = '800 28px "M PLUS Rounded 1c", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('4/6', 376, 229);
    // fardo de paja
    ell(x, 364, 372, 36, 18, 0, '#D9B44A'); x.fillStyle = '#B8902E'; x.fillRect(344, 360, 4, 24); x.fillRect(380, 360, 4, 24);
  },
  // Interior en corte: pared del fondo, viga, ventana, piso de paja y un rincón de agua
  zooFondo: x => {
    x.fillStyle = '#C08A58'; x.fillRect(0, 30, 720, 540);
    x.fillStyle = 'rgba(90,62,43,.28)'; for (let i = 0; i < 16; i++) x.fillRect(i*46, 30, 4, 540);
    x.fillStyle = '#5A3E2B'; x.fillRect(0, 30, 720, 16); x.fillRect(0, 200, 720, 12); x.fillRect(0, 30, 16, 540); x.fillRect(704, 30, 16, 540);
    poly(x, [0,40, 360,0, 720,40, 720,52, 0,52], '#B79A5E');
    x.fillStyle = '#5A3E2B'; x.fillRect(470, 84, 150, 104); x.fillStyle = '#A9D3E2'; x.fillRect(480, 94, 130, 84); x.fillStyle = '#5A3E2B'; x.fillRect(542, 94, 6, 84);
    circ(x, 580, 120, 14, '#FFF7E3');
    x.fillStyle = '#7A4E32'; x.fillRect(60, 150, 220, 14);
    x.fillStyle = '#DCC07F'; x.fillRect(16, 400, 688, 170);
    x.fillStyle = 'rgba(122,82,54,.18)'; for (let i = 0; i < 60; i++) x.fillRect((i * 97) % 680 + 16, 412 + (i * 37) % 150, 22, 3);
    ell(x, 600, 520, 140, 52, 0, '#8E8778'); ell(x, 600, 516, 124, 42, 0, '#3F8FCB'); ell(x, 580, 506, 64, 16, 0, '#6FB3DE');
  },
  fardo: x => { x.fillStyle = '#E2C35A'; x.fillRect(6, 20, 148, 70); x.fillStyle = '#C9A23A'; x.fillRect(36, 20, 8, 70); x.fillRect(116, 20, 8, 70); x.fillStyle = 'rgba(122,82,54,.2)'; for (let i = 0; i < 9; i++) x.fillRect(10 + i*16, 26, 3, 58); },
  nido: x => { ell(x, 70, 40, 66, 26, 0, '#9A6B3E'); ell(x, 70, 30, 52, 14, 0, '#6E4A35'); for (let i = 0; i < 8; i++) { x.fillStyle = '#B98A55'; x.fillRect(12 + i*15, 44, 14, 3); } },
});
Object.assign(SIZE, { zoo:[440,400], zooFondo:[720,570], fardo:[160,100], nido:[140,70] });

/* ---------- Texturas y miniaturas ---------- */
const CNV = {}, TEXO = {}, URLS = {};
function bake(id) { const s = SIZE[id], c = mk(s[0], s[1]); DRAW[id](c.getContext('2d')); return paperize(c, RAD[id]); }

/* --- arenas: monumentos y adornos de cada escenario --- */
const R_ = (x, a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
Object.assign(DRAW, {
  fuji: x => {
    poly(x, [0,420, 300,40, 340,40, 640,420], '#5E7FA6'); poly(x, [300,40, 340,40, 640,420, 470,420], '#4E6E95');
    poly(x, [300,40, 340,40, 420,140, 392,128, 372,158, 350,132, 326,170, 304,136, 282,160, 262,130, 236,148], '#F7F4EC');
    poly(x, [340,40, 420,140, 392,128, 372,158, 350,132, 330,60], '#E1E6EE');
    for (const [cx, cy, r] of [[60,400,46],[150,384,58],[250,404,44],[360,392,56],[470,402,50],[570,388,52],[620,410,30]]) circ(x, cx, cy, r, '#FBF6EC');
  },
  reloj: x => {
    R_(x, 40, 250, 360, 150, '#F4F1EA'); x.fillStyle = '#D9D3C6'; for (let r = 0; r < 9; r++) x.fillRect(40, 262 + r*16, 360, 3);
    poly(x, [20,256, 220,170, 420,256], '#C8412E'); poly(x, [20,256, 420,256, 410,268, 30,268], '#A83526');
    for (const px of [70, 140, 270, 340]){ R_(x, px, 290, 34, 56, '#5A6E80'); R_(x, px + 4, 294, 26, 48, '#9FB5C6'); R_(x, px + 15, 294, 4, 48, '#F4F1EA'); }
    R_(x, 200, 320, 40, 80, '#7A4E32');
    R_(x, 168, 92, 104, 110, '#F4F1EA'); poly(x, [156,96, 220,40, 284,96], '#C8412E');
    circ(x, 220, 146, 36, '#2B2320'); circ(x, 220, 146, 31, '#FFFDF6');
    x.strokeStyle = '#2B2320'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(220, 146); x.lineTo(220, 124); x.moveTo(220, 146); x.lineTo(236, 150); x.stroke();
    R_(x, 214, 18, 12, 24, '#2B2320'); poly(x, [208,22, 232,22, 220,6], '#C8412E');
    poly(x, [150,98, 290,98, 286,88, 154,88], '#FFFFFF'); poly(x, [16,258, 424,258, 410,246, 30,246], '#FFFFFF');
  },
  muneco: x => { circ(x, 70, 150, 54, '#FFFFFF'); circ(x, 70, 74, 40, '#FFFFFF'); ell(x, 92, 150, 22, 40, 0, '#E3EAF2'); ell(x, 86, 76, 14, 28, 0, '#E3EAF2');
    circ(x, 56, 68, 5, '#2B2320'); circ(x, 82, 68, 5, '#2B2320'); poly(x, [66,80, 86,84, 66,88], '#F08A3C');
    R_(x, 34, 104, 74, 14, '#C8412E'); R_(x, 84, 104, 14, 40, '#C8412E'); poly(x, [40,40, 100,40, 92,20, 48,20], '#3B6E66'); },
  pinoNieve: x => { R_(x, 88, 232, 24, 58, '#7A4E32');
    poly(x, [20,240, 100,120, 180,240], '#3D7347'); poly(x, [34,180, 100,64, 166,180], '#4C8A53'); poly(x, [50,120, 100,8, 150,120], '#5C9E5E');
    poly(x, [60,170, 100,120, 140,170, 120,162, 100,176, 80,162], '#FFFFFF'); poly(x, [70,108, 100,64, 130,108, 112,100, 100,112, 88,100], '#FFFFFF'); poly(x, [80,52, 100,8, 120,52, 100,44], '#FFFFFF');
    poly(x, [30,236, 100,184, 170,236, 150,228, 128,240, 100,226, 72,240, 50,228], '#FFFFFF'); },
  kitsune: x => { R_(x, 30, 196, 140, 30, '#8F8A80'); R_(x, 40, 186, 120, 14, '#A7A296');
    ell(x, 100, 140, 46, 52, 0, '#F7F4EC'); poly(x, [70,90, 76,40, 96,80], '#F7F4EC'); poly(x, [130,90, 124,40, 104,80], '#F7F4EC');
    poly(x, [78,80, 80,52, 92,76], '#E9A4A0'); poly(x, [122,80, 120,52, 108,76], '#E9A4A0');
    ell(x, 100, 98, 34, 30, 0, '#F7F4EC'); poly(x, [86,104, 114,104, 100,124], '#F7F4EC'); circ(x, 100, 120, 4, '#2B2320');
    poly(x, [80,92, 94,96, 82,98], '#C8412E'); poly(x, [120,92, 106,96, 118,98], '#C8412E');
    poly(x, [72,130, 128,130, 100,170], '#C8412E'); ell(x, 150, 168, 18, 40, -.5, '#F7F4EC'); ell(x, 160, 140, 8, 14, -.5, '#F2B544'); },
  momiji: x => { R_(x, 92, 200, 22, 90, '#6E4A35'); poly(x, [102,220, 60,160, 72,156, 104,200], '#6E4A35');
    for (const [cx, cy, r, c] of [[60,120,48,'#D9533B'],[130,80,58,'#E8743A'],[180,128,48,'#C8412E'],[100,150,46,'#F29B3E'],[150,160,40,'#D9533B'],[110,108,42,'#F2B544']]) circ(x, cx, cy, r, c); },
  // Arashiyama: cañas altas y el torii de madera oscura de Nonomiya
  bambuAlto: x => { const st = (bx, c) => { R_(x, bx, 0, 16, 600, c); x.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 40; y < 600; y += 70) x.fillRect(bx - 2, y, 20, 5); };
    st(14, '#7FB04E'); st(52, '#6AA043'); st(92, '#8CBD58'); st(128, '#76A94A');
    for (const [cx, cy, r] of [[30,30,0.5],[80,12,-0.4],[120,46,0.6],[60,70,-0.6]]) ell(x, cx, cy, 30, 9, r, '#5C9A3E'); },
  toriiNegro: x => { R_(x, 48, 70, 26, 222, '#4A3626'); R_(x, 186, 70, 26, 222, '#4A3626'); R_(x, 44, 276, 34, 18, '#2B2320'); R_(x, 182, 276, 34, 18, '#2B2320');
    R_(x, 26, 112, 208, 18, '#5A4230'); poly(x, [0,26, 130,40, 260,26, 246,58, 130,66, 14,58], '#3A2A1E'); R_(x, 16, 58, 228, 16, '#5A4230');
    x.strokeStyle = '#E8D9B0'; x.lineWidth = 6; x.beginPath(); x.moveTo(60, 150); x.quadraticCurveTo(130, 176, 200, 150); x.stroke();
    x.fillStyle = '#FFFDF6'; for (const px of [96, 130, 164]) poly(x, [px - 5,162, px + 5,162, px + 2,172, px + 7,172, px + 3,186, px - 5,186, px - 1,172, px - 6,172], '#FFFDF6'); },
  solPalido: x => { circ(x, 110, 110, 70, '#FFF7E3'); circ(x, 110, 110, 56, '#FFFDF4'); },
  chispa: x => { const s = []; for (let i = 0; i < 16; i++){ const a = i/16*Math.PI*2 - Math.PI/2, r = i % 2 ? 26 : 62; s.push(70 + Math.cos(a)*r, 70 + Math.sin(a)*r); } poly(x, s, '#F6B73C'); circ(x, 70, 70, 22, '#FFF4C9'); },
});
Object.assign(SIZE, { fuji:[640,440], reloj:[440,404], muneco:[140,210], pinoNieve:[200,292], kitsune:[200,230], momiji:[230,290], bambuAlto:[160,600], toriiNegro:[260,300], solPalido:[220,220], chispa:[140,140] });
Object.assign(RAD, { fuji:12, reloj:10 });

export const has = id => !!DRAW[id];
export function art(id) { return CNV[id] || (CNV[id] = bake(id)); }
export function artTex(id) {
  if (TEXO[id]) return TEXO[id];
  const t = new THREE.CanvasTexture(art(id)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return TEXO[id] = t;
}
export const artThumb = id => URLS[id] || (URLS[id] = art(id).toDataURL());
export const artAspect = id => { const c = art(id); return c.height / c.width; };
// Las piezas que usan el pincel japonés se vuelven a hornear cuando la fuente termina de cargar
document.fonts?.load('40px "Yuji Syuku"').then(() => { ['nobori', 'zoo'].forEach(id => { if (TEXO[id]) { CNV[id] = bake(id); TEXO[id].image = CNV[id]; TEXO[id].needsUpdate = true; delete URLS[id]; } }); }).catch(() => {});
