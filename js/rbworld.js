// KANJŪ · rbworld.js — El escenario del santuario, portado tal cual de Rebyters
// (app/src/components/world/island.ts, sky.ts, assets/meadow.ts, habitat-materials.ts,
// admin/habitat/world.ts y lib/world/rig.ts). Unidades de Rebyters: 1 baldosa = 1 m.
// Quien lo usa escala el grupo por el tamaño de baldosa propio.
import * as THREE from './vendor/three.module.min.js';

// ---------- Períodos y paletas (meadow.ts / useWorldClock.ts / twilight.ts) ----------
export const PERIODS = ['Night', 'Morning', 'Day', 'Evening'];
export const periodOf = h => PERIODS[Math.floor((((h % 24) + 24) % 24) / 6)];
export function nightBlend(period, h) {
  if (period === 'Night') return 1;
  if (period !== 'Evening') return 0;
  const t = Math.max(0, Math.min(1, (h - 19.5) / 3.5));
  return t * t * (3 - 2 * t);
}
export const PALETTES = {
  Night: { sky: 0x0b2459, horizon: 0x315c91, light: 0xa9cfff, intensity: 1.35 },
  Morning: { sky: 0x80b9df, horizon: 0xffdfbd, light: 0xffe2b5, intensity: 1.72 },
  Day: { sky: 0x559fda, horizon: 0xd2edf0, light: 0xffefd5, intensity: 1.62 },
  Evening: { sky: 0x656fa6, horizon: 0xf1bc9d, light: 0xffc58f, intensity: 1.48 },
};
const MOTE = { Night: 0xffeb99, Morning: 0xfff0cf, Day: 0xffffff, Evening: 0xffd9b0 };
const LIGHT_LIFT = 1.45;

function seeded(seed) { let s = seed >>> 0; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
function random(seed) { return seeded(seed); }
const texCache = new Map();
function texture(key, w, h, paint) {
  if (texCache.has(key)) return texCache.get(key);
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t); return t;
}

// ---------- Texturas (habitat-materials.ts) ----------
export function meadowTexture() {
  const map = texture('meadow-ground', 512, 512, ctx => {
    const rand = random(7419);
    ctx.fillStyle = '#6fb12f'; ctx.fillRect(0, 0, 512, 512);
    const wrapped = (x, y, draw) => { for (const dx of [-512, 0, 512]) for (const dy of [-512, 0, 512]) { ctx.save(); ctx.translate(x + dx, y + dy); draw(); ctx.restore(); } };
    for (let i = 0; i < 58; i++) {
      const x = rand() * 512, y = rand() * 512, radius = 20 + rand() * 48;
      const tint = i % 3 === 0 ? '46,128,36' : i % 3 === 1 ? '170,214,62' : '104,176,40';
      wrapped(x, y, () => { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius); g.addColorStop(0, 'rgba(' + tint + ',0.42)'); g.addColorStop(1, 'rgba(' + tint + ',0)'); ctx.fillStyle = g; ctx.fillRect(-radius, -radius, radius * 2, radius * 2); });
    }
    const shades = ['#8cc83c', '#a6d84a', '#5ea52e', '#3f8a2c', '#c4e266', '#79bb35'];
    ctx.lineCap = 'round';
    for (let i = 0; i < 5200; i++) {
      const x = rand() * 512, y = rand() * 512, length = 4 + rand() * 11, lean = (rand() - 0.5) * 8;
      const shade = shades[Math.floor(rand() * shades.length)], angle = rand() * Math.PI * 2;
      wrapped(x, y, () => { ctx.rotate(angle); ctx.strokeStyle = shade; ctx.lineWidth = 0.7 + (i % 3) * 0.45; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(lean * 0.25, -length * 0.55, lean, -length); ctx.stroke(); });
    }
  });
  map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(40, 40); map.anisotropy = 4;
  return map;
}
export function moonTexture() {
  return texture('meadow-moon', 128, 128, ctx => {
    const rand = random(711);
    ctx.fillStyle = '#e5efff'; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 30; i++) { const x = rand() * 128, y = rand() * 128, r = 3 + rand() * 12, g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(111,142,188,0.22)'); g.addColorStop(1, 'rgba(111,142,188,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  });
}

// ---------- Cielo degradado (meadow.ts, rango del mundo del jugador [-0.6, 0.14]) ----------
export function createSkyDome(scene, range = [-0.6, 0.14]) {
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false, toneMapped: false,
    uniforms: { topColor: { value: new THREE.Color() }, horizonColor: { value: new THREE.Color() }, range: { value: new THREE.Vector2(...range) } },
    vertexShader: 'varying vec3 vSkyDirection;\nvoid main(){ vSkyDirection = position; vec3 direction = mat3(viewMatrix) * position; gl_Position = projectionMatrix * vec4(direction, 1.0); gl_Position.z = gl_Position.w * 0.9999; }',
    fragmentShader: 'uniform vec3 topColor; uniform vec3 horizonColor; uniform vec2 range;\nvarying vec3 vSkyDirection;\nvoid main(){ float height = normalize(vSkyDirection).y; float blend = smoothstep(range.x, range.y, height); gl_FragColor = vec4(mix(horizonColor, topColor, blend), 1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
  }));
  sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  return sky;
}

// ---------- Isla flotante (island.ts) ----------
const SIDES = 40, RADIUS = 3.1, SQUARENESS = 3.2;
const outline = a => { const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)); const base = RADIUS / Math.pow(Math.pow(c, SQUARENESS) + Math.pow(s, SQUARENESS), 1 / SQUARENESS); return base + 0.11 * Math.sin(a * 3 + 1.3) + 0.08 * Math.sin(a * 5 + 0.4) + 0.05 * Math.sin(a * 9 + 2.1); };
const RINGS = [
  { k: 1.0, y: 0, colour: 0x6cae38 }, { k: 0.98, y: -0.16, colour: 0x6f6a3c }, { k: 0.88, y: -0.7, colour: 0x7a5a3b },
  { k: 0.7, y: -1.4, colour: 0x68503a }, { k: 0.46, y: -2.1, colour: 0x5b4b40 }, { k: 0.2, y: -2.75, colour: 0x4f4549 },
];
const TIP = { y: -3.15, colour: 0x453f45 };
export function createIsland(parent, scale = 1) {
  const rand = seeded(2718), group = new THREE.Group(); group.name = 'island'; group.scale.setScalar(scale);
  const ring = (r, index) => Array.from({ length: SIDES }, (_, n) => { const a = (n / SIDES) * Math.PI * 2, jitter = index === 0 ? 1 : 1 + (rand() - 0.5) * (0.12 + index * 0.05), radius = outline(a) * r.k * jitter, dy = index === 0 ? 0 : (rand() - 0.5) * 0.3; return new THREE.Vector3(Math.cos(a) * radius, r.y + dy, Math.sin(a) * radius); });
  const rings = RINGS.map(ring), tip = new THREE.Vector3(0, TIP.y, 0);
  const positions = [], colours = [], colour = new THREE.Color();
  const push = (v, hex) => { positions.push(v.x, v.y, v.z); colour.setHex(hex); colours.push(colour.r, colour.g, colour.b); };
  for (let n = 0; n < SIDES; n++) {
    const m = (n + 1) % SIDES;
    for (let r = 0; r < RINGS.length - 1; r++) { const a = rings[r][n], b = rings[r][m], c = rings[r + 1][m], d = rings[r + 1][n], top = RINGS[r].colour, bottom = RINGS[r + 1].colour; push(a, top); push(d, bottom); push(b, top); push(b, top); push(d, bottom); push(c, bottom); }
    const last = RINGS.length - 1; push(rings[last][n], RINGS[last].colour); push(tip, TIP.colour); push(rings[last][m], RINGS[last].colour);
  }
  const body = new THREE.BufferGeometry();
  body.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); body.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3)); body.computeVertexNormals();
  const bodyMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, side: THREE.DoubleSide });
  const underside = new THREE.Mesh(body, bodyMaterial); underside.receiveShadow = true;
  const lawn = [], uvs = [], uv = (x, z) => uvs.push((x + 60) / 120, (60 - z) / 120);
  for (let n = 0; n < SIDES; n++) { const a = rings[0][n], b = rings[0][(n + 1) % SIDES]; lawn.push(0, 0, 0, b.x, 0, b.z, a.x, 0, a.z); uv(0, 0); uv(b.x, b.z); uv(a.x, a.z); }
  const lawnGeometry = new THREE.BufferGeometry();
  lawnGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lawn, 3)); lawnGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  lawnGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(Array.from({ length: lawn.length / 3 }, () => [0, 1, 0]).flat(), 3));
  const lawnMaterial = new THREE.MeshStandardMaterial({ map: meadowTexture(), roughness: 0.96 });
  const top = new THREE.Mesh(lawnGeometry, lawnMaterial); top.receiveShadow = true;
  group.add(underside, top);
  const rockGeometry = new THREE.IcosahedronGeometry(1, 0), rockMaterial = new THREE.MeshStandardMaterial({ color: 0x6a5642, flatShading: true, roughness: 1 });
  const rocks = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => {
    const mesh = new THREE.Mesh(rockGeometry, rockMaterial), angle = 0.7 + n * 1.65 + rand() * 0.4, radius = 3.9 + rand() * 3.2, size = 0.14 + rand() * (n % 3 === 0 ? 0.3 : 0.2);
    mesh.scale.set(size * 1.2, size, size); mesh.rotation.set(rand() * 3, rand() * 3, rand() * 3); group.add(mesh);
    return { mesh, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, y: -0.6 - rand() * 3.8, phase: rand() * 6 };
  });
  const islets = [{ angle: 0.5, radius: 13, y: -3.5, size: 0.34 }, { angle: 2.5, radius: 17, y: -6.5, size: 0.26 }, { angle: 4.3, radius: 15, y: -2.2, size: 0.22 }, { angle: 5.6, radius: 21, y: -8, size: 0.4 }].map((spec, n) => {
    const islet = new THREE.Group(); islet.add(new THREE.Mesh(body, bodyMaterial), new THREE.Mesh(lawnGeometry, lawnMaterial)); islet.scale.setScalar(spec.size); islet.rotation.y = n * 1.9; group.add(islet); return { islet, ...spec };
  });
  parent.add(group);
  return {
    group,
    update(seconds) {
      for (const r of rocks) { r.mesh.position.set(r.x, r.y + Math.sin(seconds * 0.6 + r.phase) * 0.12, r.z); r.mesh.rotation.y += 0.002; }
      islets.forEach((s, n) => s.islet.position.set(Math.cos(s.angle) * s.radius, s.y + Math.sin(seconds * 0.35 + n * 2) * 0.3, Math.sin(s.angle) * s.radius));
    },
    dispose() { group.removeFromParent(); body.dispose(); bodyMaterial.dispose(); lawnGeometry.dispose(); lawnMaterial.dispose(); rockGeometry.dispose(); rockMaterial.dispose(); },
  };
}

// ---------- Sol, luna, estrellas y nubes facetadas (sky.ts) ----------
const SUN_AZIMUTH = Math.atan2(7, -8), MOON_AZIMUTH = Math.atan2(-4.5, -5), RANGE = 88;
const TINT = {
  Morning: { cloud: 0xffe9d9, glow: 0xffc98a, disc: 0xffdca8 }, Day: { cloud: 0xffffff, glow: 0xffe2a0, disc: 0xfff1c4 },
  Evening: { cloud: 0xffcfb4, glow: 0xff8c55, disc: 0xffa860 }, Night: { cloud: 0x8ba3d2, glow: 0xb9d3ff, disc: 0xe2eeff },
};
const NIGHT_CLOUD = new THREE.Color(0x8ba3d2);
const direction = (az, el, out) => out.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
function cloudGeometry(variant) {
  const rand = seeded(4177 + variant * 911), lumps = 4 + (variant % 3), pos = [];
  for (let n = 0; n < lumps; n++) {
    const t = lumps === 1 ? 0.5 : n / (lumps - 1), hump = Math.sin(t * Math.PI), r = 0.5 + hump * 0.42 + rand() * 0.16;
    const lump = new THREE.IcosahedronGeometry(r, 1); lump.scale(1.18, 0.82, 1); lump.rotateY(rand() * Math.PI); lump.translate((t - 0.5) * 2.7 + (rand() - 0.5) * 0.2, r * 0.38, (rand() - 0.5) * 0.45);
    const nl = lump.index ? lump.toNonIndexed() : lump; pos.push(...nl.attributes.position.array); lump.dispose();
  }
  for (let i = 1; i < pos.length; i += 3) pos[i] = Math.max(pos[i], 0.02);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
}
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const ctx = c.getContext('2d'), g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.3, 'rgba(255,255,255,0.2)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
export function createSky(scene, parent) {
  let period = 'Day';
  const rand = seeded(99), dome = new THREE.Group(); dome.name = 'world-sky';
  const sunMaterial = new THREE.MeshBasicMaterial({ color: TINT.Day.disc, toneMapped: false, fog: false, transparent: true });
  const sun = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4, 1), sunMaterial);
  const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xe6efff, map: moonTexture(), toneMapped: false, fog: false, transparent: true });
  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(2.7, 1), moonMaterial);
  const glowMap = glowTexture();
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: TINT.Day.glow, transparent: true, depthWrite: false, fog: false, toneMapped: false }));
  const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: TINT.Night.glow, transparent: true, depthWrite: false, fog: false, toneMapped: false }));
  sunGlow.scale.setScalar(24); moonGlow.scale.setScalar(17);
  const starPositions = [], v = new THREE.Vector3();
  for (let i = 0; i < 150; i++) { const az = rand() * Math.PI * 2, el = Math.asin(-0.85 + rand() * 1.2); direction(az, el, v).multiplyScalar(RANGE + 4); starPositions.push(v.x, v.y, v.z); }
  const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xeaf2ff, size: 0.5, toneMapped: false, fog: false, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const stars = new THREE.Points(starGeometry, starMaterial); stars.frustumCulled = false;
  dome.add(stars, sunGlow, moonGlow, sun, moon);
  for (const o of [sun, moon, sunGlow, moonGlow]) o.frustumCulled = false;
  scene.add(dome);
  const cloudMaterial = new THREE.MeshStandardMaterial({ color: TINT.Day.cloud, emissive: TINT.Day.cloud, emissiveIntensity: 0.5, roughness: 1, flatShading: true, fog: false });
  const geometries = [0, 1, 2].map(cloudGeometry);
  const clouds = new THREE.Group(); clouds.name = 'world-clouds';
  const drifting = [];
  const COUNT = 14;
  for (let n = 0; n < COUNT; n++) {
    const mesh = new THREE.Mesh(geometries[n % 3], cloudMaterial), radius = 12 + rand() * 14, angle = (n / COUNT) * Math.PI * 2 + rand() * 0.4;
    mesh.position.set(0, -6.4 + rand() * 4.4, 0); const scale = 1.2 + rand() * 0.9; mesh.scale.set(scale * (1 + rand() * 0.3), scale * (0.85 + rand() * 0.3), scale); mesh.rotation.y = rand() * Math.PI * 2;
    drifting.push({ mesh, radius, angle, speed: (0.006 + rand() * 0.008) * (n % 2 ? 1 : -1) }); clouds.add(mesh);
  }
  for (let n = 0; n < 11; n++) {
    const mesh = new THREE.Mesh(geometries[n % 3], cloudMaterial), radius = 5 + rand() * 30, angle = (n / 11) * Math.PI * 2 + rand() * 0.5;
    mesh.position.set(0, -15 + rand() * 6.5, 0); const scale = 1.8 + rand() * 1.3; mesh.scale.set(scale * (1 + rand() * 0.3), scale * (0.8 + rand() * 0.3), scale); mesh.rotation.y = rand() * Math.PI * 2;
    drifting.push({ mesh, radius, angle, speed: (0.004 + rand() * 0.006) * (n % 2 ? 1 : -1) }); clouds.add(mesh);
  }
  parent.add(clouds);
  const sunDir = new THREE.Vector3(), smooth = THREE.MathUtils.smoothstep;
  let blend = 0, lift = 0.3, lastKey = '';
  const colours = () => {
    const t = TINT[period]; sunMaterial.color.setHex(t.disc); sunGlow.material.color.setHex(t.glow);
    cloudMaterial.color.setHex(t.cloud).lerp(NIGHT_CLOUD, period === 'Evening' ? blend : 0); cloudMaterial.emissive.copy(cloudMaterial.color);
    cloudMaterial.emissiveIntensity = period === 'Night' ? 0.55 : 0.5 + (period === 'Evening' ? blend * 0.05 : 0);
  };
  return {
    update(dt, camera, p, b) {
      if (p + b.toFixed(3) !== lastKey) {
        lastKey = p + b.toFixed(3); period = p; blend = b; colours();
        const dusk = period === 'Evening';
        const sunUp = period === 'Night' ? 0 : dusk ? 1 - smooth(blend, 0.3, 0.8) : 1, moonUp = period === 'Night' ? 1 : dusk ? smooth(blend, 0.55, 0.95) : 0;
        lift = period === 'Morning' ? 0.2 : dusk ? THREE.MathUtils.lerp(0.22, 0.04, blend) : 0.3;
        sun.visible = sunGlow.visible = sunUp > 0.01; moon.visible = moonGlow.visible = moonUp > 0.01;
        sunMaterial.opacity = sunUp; sunGlow.material.opacity = sunUp; moonMaterial.opacity = moonUp; moonGlow.material.opacity = moonUp;
        starMaterial.opacity = smooth(period === 'Night' ? 1 : dusk ? blend : 0, 0.2, 0.85); stars.visible = starMaterial.opacity > 0.01;
      }
      dome.position.copy(camera.position);
      const look = Math.asin(THREE.MathUtils.clamp(camera.getWorldDirection(sunDir).y, -1, 1)), high = Math.min(look + lift, 0.45);
      direction(SUN_AZIMUTH, high, sunDir).multiplyScalar(RANGE); sun.position.copy(sunDir); sunGlow.position.copy(sunDir);
      moon.position.copy(direction(MOON_AZIMUTH, Math.min(look + 0.28, 0.45), v).multiplyScalar(RANGE)); moonGlow.position.copy(moon.position);
      for (const c of drifting) { c.angle += c.speed * dt; c.mesh.position.x = Math.sin(c.angle) * c.radius; c.mesh.position.z = Math.cos(c.angle) * c.radius; }
    },
  };
}

// ---------- Polen (meadow.ts) ----------
export function createMotes(parent) {
  const mobile = matchMedia('(pointer: coarse)').matches || innerWidth <= 700;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = reduced ? 0 : mobile ? 22 : 46, box = { x: 9, yMin: 0.35, yMax: 3.6, zMin: -6.5, zMax: 5 }, rand = random(5150);
  const pos = new Float32Array(count * 3), seed = [];
  for (let i = 0; i < count; i++) { pos[i * 3] = (rand() * 2 - 1) * box.x; pos[i * 3 + 1] = box.yMin + rand() * (box.yMax - box.yMin); pos[i * 3 + 2] = box.zMin + rand() * (box.zMax - box.zMin); seed.push(rand() * Math.PI * 2); }
  const dot = document.createElement('canvas'); dot.width = dot.height = 32; const d = dot.getContext('2d'), g = d.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); d.fillStyle = g; d.fillRect(0, 0, 32, 32);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: MOTE.Day, size: 0.045, map: new THREE.CanvasTexture(dot), transparent: true, opacity: 0.6, depthWrite: false });
  const motes = new THREE.Points(geo, mat); motes.frustumCulled = false; parent.add(motes);
  return {
    update(time, dt, period) {
      mat.color.setHex(MOTE[period]); mat.size = period === 'Night' ? 0.065 : 0.045; mat.opacity = period === 'Night' ? 0.5 : 0.6;
      for (let i = 0; i < count; i++) {
        const s = seed[i]; let x = pos[i * 3] + (0.3 + Math.sin(time * 0.45 + s) * 0.12) * dt; if (x > box.x) x = -box.x;
        pos[i * 3] = x; pos[i * 3 + 1] += Math.sin(time * 0.8 + s * 3) * 0.1 * dt; pos[i * 3 + 2] += Math.cos(time * 0.55 + s * 2) * 0.08 * dt;
      }
      geo.attributes.position.needsUpdate = true;
    },
  };
}

// ---------- Luces del hábitat (admin/habitat/world.ts + meadow.ts) ----------
export function createLights(scene, mobile) {
  const ambient = new THREE.HemisphereLight(0xd9efff, 0x3b5c42, 2.3);
  const key = new THREE.DirectionalLight(0xffffff, 2.5), fill = new THREE.DirectionalLight(0xffefd9, 0.45);
  const moon = new THREE.DirectionalLight(0xcfe2ff, 0), rim = new THREE.DirectionalLight(0x88dbff, 0);
  key.castShadow = true; key.shadow.mapSize.setScalar(mobile ? 768 : 1024);
  key.shadow.camera.near = 0.5; key.shadow.camera.far = 45; key.shadow.bias = -0.0003; key.shadow.normalBias = 0.04;
  key.position.set(7, 10, -8); fill.position.set(-3, 2, 4); moon.position.set(-4.5, 7, -5); rim.position.set(0, 3.8, -7);
  scene.add(ambient, key, key.target, fill, moon, rim);
  const c = new THREE.Color(), night = new THREE.Color(PALETTES.Night.light);
  return {
    key,
    setShadowHalf(half) { const s = key.shadow.camera; s.left = s.bottom = -half; s.right = s.top = half; s.updateProjectionMatrix(); },
    apply(renderer, period, blend) {
      const tw = period === 'Evening' ? blend : 0, lerp = THREE.MathUtils.lerp;
      renderer.toneMappingExposure = period === 'Night' ? 0.98 : period === 'Evening' ? 1.01 : period === 'Morning' ? 1.07 : 1.05;
      fill.color.setHex(period === 'Evening' ? 0xffd9b3 : period === 'Night' ? 0xaecbff : 0xffefd9);
      rim.color.setHex(period === 'Evening' ? 0xffd1ad : period === 'Night' ? 0x8fcaff : 0xccecff);
      ambient.color.setHex(period === 'Night' ? 0xa9c7ff : 0xd9efff);
      key.color.copy(c.setHex(PALETTES[period].light)).lerp(night, tw);
      key.intensity = lerp(PALETTES[period].intensity, PALETTES.Night.intensity, tw);
      ambient.intensity = lerp(period === 'Night' ? 0.72 : period === 'Evening' ? 0.82 : 0.94, 0.72, tw) * LIGHT_LIFT;
      fill.intensity = lerp(period === 'Night' ? 0.38 : period === 'Evening' ? 0.30 : 0.26, 0.38, tw) * LIGHT_LIFT;
      moon.intensity = (period === 'Night' ? 0.52 : 0.52 * tw) * LIGHT_LIFT;
      rim.intensity = lerp(period === 'Night' ? 0.42 : period === 'Evening' ? 0.18 : 0.08, 0.42, tw);
    },
  };
}
export function hazeOf(period) { return period === 'Night' ? 0x315888 : period === 'Evening' ? 0x8896b2 : 0xb2d4e2; }

// ---------- Cámara (lib/world/rig.ts): FOV 42, vista girada 35°, distancia que encuadra la isla ----------
export const FOV = 42;
export const HOME = { yaw: 0.62, pitch: 0.62, y: 0.35 };
export function fitDistance(halfWidth, aspect, fov = FOV) { return halfWidth / (Math.tan(THREE.MathUtils.degToRad(fov / 2)) * Math.min(aspect, 1.6)); }
export function homeDist(half, aspect) {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), scale = Math.max(1, half / 2.9);
  const maxDist = clamp(fitDistance(half + 0.6, aspect), aspect >= 1 ? 11 * 1.5 : 8, 17 * scale);
  const trim = half > 3.5 ? 0.6 : half > 3 ? 0.8 : 0.9, reach = half > 3 ? (half - trim) * 1.22 : half - trim;
  const wide = aspect >= 1 ? 11 * Math.max(1, half / 2.9) : 0;
  return clamp(Math.max(fitDistance(reach, aspect), wide), 3.2 + 1.5, maxDist);
}
