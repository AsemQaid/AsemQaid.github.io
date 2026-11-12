// Interactive 3D model of the Smart Electrical Panel Protection build (AAQ-P05).
// Modelled on the photo of the finished PCB. It acts out the documented state machine
// (Normal → Warning → Emergency → recovery); it is an animation of the logic, not live data.
import * as THREE from "three";

type V3 = THREE.Vector3;
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export interface BenchOpts {
  root: HTMLElement;          // the sticky stage (holds canvas + labels)
  section: HTMLElement;       // the tall scroll section (drives the explode)
  canvas: HTMLCanvasElement;
  labels: HTMLElement;        // container with [data-k] label elements
  onState: (s: "normal" | "warning" | "emergency") => void;
  reduced: boolean;
  toggle?: HTMLElement | null;
}

export function initBench(o: BenchOpts) {
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const target = v(0, 0, -2.6);

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight(0xdfe9ea, 0x0b1012, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-8, 18, 10); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
  key.shadow.bias = -0.0008; key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fd3dd, 0.9); rim.position.set(10, 6, -12); scene.add(rim);

  // ---------- helpers ----------
  const mats = new Map<string, THREE.Material>();
  const M = (c: number, rough = 0.6, metal = 0, emissive = 0) => {
    const k = `${c}-${rough}-${metal}-${emissive}`;
    if (!mats.has(k)) mats.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal, emissive: emissive || 0x000000 }));
    return mats.get(k)!;
  };
  const shade = (m: THREE.Mesh) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const box = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = shade(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)); m.position.set(x, y + h / 2, z); return m;
  };
  const cyl = (r: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 28) => {
    const m = shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat)); m.position.set(x, y + h / 2, z); return m;
  };
  const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  };

  // ---------- ground shadow ----------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.38 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.55; ground.receiveShadow = true; scene.add(ground);

  const world = new THREE.Group(); scene.add(world);

  // ---------- the perfboard ----------
  const BW = 17.3, BD = 10;
  const boardTex = canvasTex(2048, 1184, (g) => {
    g.fillStyle = "#1d6e3a"; g.fillRect(0, 0, 2048, 1184);
    const p = 37, ox = 40, oy = 44;
    for (let i = 0; ox + i * p < 2010; i++) for (let j = 0; oy + j * p < 1150; j++) {
      const x = ox + i * p, y = oy + j * p;
      g.fillStyle = "#c9a24a"; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill();
      g.fillStyle = "#0c2416"; g.beginPath(); g.arc(x, y, 5.5, 0, 7); g.fill();
    }
    g.strokeStyle = "rgba(235,245,238,.55)"; g.lineWidth = 3;
    for (let i = 0; ox + i * p * 5 < 2010; i++) { const x = ox + i * p * 5 - p / 2; g.beginPath(); g.moveTo(x, 20); g.lineTo(x, 1164); g.stroke(); }
    for (let j = 0; oy + j * p * 5 < 1150; j++) { const y = oy + j * p * 5 - p / 2; g.beginPath(); g.moveTo(20, y); g.lineTo(2028, y); g.stroke(); }
    g.fillStyle = "rgba(240,248,242,.85)"; g.font = "600 22px monospace";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => g.fillText(c, ox - 7 + i * p, 30));
    g.fillStyle = "rgba(255,255,255,.9)"; g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.strokeRect(8, 8, 2032, 1168);
  });
  const boardMat = [M(0x175c30, 0.7), M(0x175c30, 0.7), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.55, metalness: 0.08 }), M(0x123f22, 0.8), M(0x175c30, 0.7), M(0x175c30, 0.7)];
  const board = shade(new THREE.Mesh(new THREE.BoxGeometry(BW, 0.2, BD), boardMat)); board.position.y = -0.1; world.add(board);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => world.add(cyl(0.22, 0.45, M(0xd8d8d0, 0.4, 0.6), a * (BW / 2 - 0.5), -0.55, b * (BD / 2 - 0.5))));

  // ---------- parts ----------
  type Part = { g: THREE.Group; base: V3; lift: number; out: V3; anchor: V3 };
  const parts: Record<string, Part> = {};
  const part = (k: string, x: number, z: number, lift: number, anchorY: number, out = v(0, 0, 0), y = 0) => {
    const g = new THREE.Group(); g.position.set(x, y, z); world.add(g);
    parts[k] = { g, base: v(x, y, z), lift, out, anchor: v(0, anchorY, 0) }; return g;
  };
  const BLUE = M(0x1f56b8, 0.5, 0.05), DARK = M(0x16181b, 0.45, 0.1), METAL = M(0xc9ced2, 0.28, 0.85), GOLD = M(0xd9b14a, 0.3, 0.9);

  // pin header strips (instanced pins)
  const pinGeo = new THREE.BoxGeometry(0.12, 0.5, 0.12);
  const pins = (g: THREE.Group, n: number, x0: number, z: number, step = 0.254 * 1.45, y = 0) => {
    const im = new THREE.InstancedMesh(pinGeo, GOLD, n); const m4 = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { m4.makeTranslation(x0 + i * step, y + 0.25, z); im.setMatrixAt(i, m4); }
    im.castShadow = true; g.add(im);
  };

  // Arduino Nano (controller)
  {
    const g = part("nano", 5.6, -0.1, 2.3, 0.9, v(0.4, 0, 0.4));
    g.add(box(5.2, 0.14, 1.75, BLUE, 0, 0.32, 0));
    const chip = box(0.95, 0.12, 0.95, DARK, 0.4, 0.46, 0); chip.rotation.y = Math.PI / 4; g.add(chip);
    g.add(box(0.75, 0.32, 0.85, METAL, 2.4, 0.46, 0));
    g.add(box(0.32, 0.18, 0.32, M(0xe8e4dc, 0.5), -0.9, 0.46, 0.2));
    g.add(box(0.5, 0.1, 0.32, M(0xb0b4b8, 0.3, 0.7), -1.6, 0.46, -0.45));
    g.add(box(5.0, 0.32, 0.22, DARK, 0, 0, 0.72)); g.add(box(5.0, 0.32, 0.22, DARK, 0, 0, -0.72));
    pins(g, 15, -2.35, 0.72, 0.335, 0.1); pins(g, 15, -2.35, -0.72, 0.335, 0.1);
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.1), new THREE.MeshStandardMaterial({ color: 0x223322, emissive: 0x29ff6a, emissiveIntensity: 1.6 }));
    led.position.set(1.4, 0.5, 0.55); g.add(led);
  }
  // SIM800L GSM module
  let antenna: THREE.Mesh;
  {
    const g = part("sim", -6.45, -2.9, 2.8, 1.0, v(-0.6, 0, -0.3));
    g.add(box(3.7, 0.14, 2.7, BLUE, 0, 0.3, 0));
    const lbl = canvasTex(256, 256, (c) => {
      c.fillStyle = "#cfd4d8"; c.fillRect(0, 0, 256, 256); c.fillStyle = "#1a1d20"; c.font = "700 38px sans-serif"; c.fillText("SIM800L", 34, 88);
      c.font = "500 18px monospace"; c.fillText("GSM/GPRS  QUAD", 40, 126); c.fillText("SIMCOM  CE", 60, 154);
      for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) if ((i * 7 + j * 13) % 3) c.fillRect(150 + i * 7, 168 + j * 7, 6, 6);
    });
    const shield = shade(new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.26, 1.75), [METAL, METAL, new THREE.MeshStandardMaterial({ map: lbl, roughness: 0.35, metalness: 0.6 }), METAL, METAL, METAL]));
    shield.position.set(0.55, 0.57, 0.1); g.add(shield);
    g.add(box(0.5, 0.22, 0.32, M(0xe39b1c, 0.5), -1.1, 0.44, 0.8));
    g.add(cyl(0.22, 0.05, GOLD, -1.45, 0.44, -0.95)); g.add(cyl(0.22, 0.05, GOLD, -1.45, 0.44, 0.95));
    const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 60 }, (_, i) => v(Math.cos(i * 0.9) * 0.16, i * 0.022, Math.sin(i * 0.9) * 0.16))), 240, 0.03, 6), GOLD);
    coil.position.set(-1.45, 0.48, -0.95); coil.castShadow = true; g.add(coil); antenna = coil;
  }
  // 1000 µF buffer capacitor
  {
    const g = part("cap", -2.25, -2.9, 1.8, 1.55);
    g.add(cyl(0.6, 1.3, M(0x1a1c1f, 0.35, 0.1), 0, 0, 0, 36));
    g.add(cyl(0.58, 0.03, METAL, 0, 1.3, 0, 36));
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.605, 0.605, 1.2, 36, 1, true, 0, 0.9), M(0x8d96a0, 0.5)); stripe.position.set(0, 0.65, 0); g.add(stripe);
  }
  // terminal block
  {
    const g = part("term", -0.6, -2.5, 1.5, 1.1);
    g.add(box(1.15, 0.85, 1.6, M(0x2d6fd0, 0.45), 0, 0, 0));
    [-0.48, 0, 0.48].forEach((z) => g.add(cyl(0.17, 0.08, METAL, 0, 0.85, z)));
  }
  // relay module (load disconnect)
  let relayLed: THREE.MeshStandardMaterial, relayArm: THREE.Mesh;
  {
    const g = part("relay", 2.5, -2.55, 2.1, 1.55, v(0.2, 0, -0.4));
    g.add(box(2.5, 0.12, 1.9, BLUE, 0, 0.25, 0));
    g.add(box(1.55, 1.15, 1.15, M(0x2c64c9, 0.35), -0.2, 0.37, 0));
    relayLed = new THREE.MeshStandardMaterial({ color: 0x3a0d0d, emissive: 0xff2d2d, emissiveIntensity: 0 });
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), relayLed); l.position.set(0.95, 0.5, 0.55); g.add(l);
    relayArm = box(0.5, 0.06, 0.12, M(0xffffff, 0.4), -0.2, 1.53, 0); g.add(relayArm);
  }
  // USB-C power module
  { const g = part("usb", 7.25, -3.4, 1.3, 0.6); g.add(box(1.7, 0.1, 1.5, M(0x1f7a46, 0.55), 0, 0.2, 0)); g.add(box(0.7, 0.3, 0.75, METAL, 0.35, 0.3, 0)); pins(g, 4, -0.7, -0.4, 0.3, 0.05); }
  // buzzer
  let buzzerTop: THREE.MeshStandardMaterial;
  {
    const g = part("buzzer", -3.1, 1.9, 1.4, 1.0);
    g.add(cyl(0.58, 0.75, DARK, 0, 0, 0, 32));
    buzzerTop = new THREE.MeshStandardMaterial({ color: 0x0b0c0d, emissive: 0xffb02e, emissiveIntensity: 0 });
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), buzzerTop); t.position.y = 0.76; g.add(t);
  }
  // resistors + transistor
  {
    const g = part("passive", -6.4, 1.0, 0.9, 0.5);
    [[0, -0.5], [0.3, 0.05], [1.0, 0.75]].forEach(([x, z]) => {
      const r = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.55, 4, 10), M(0xd8c39a, 0.6)); r.rotation.z = Math.PI / 2; r.position.set(x, 0.2, z); shade(r); g.add(r);
      [-0.15, 0, 0.15].forEach((d, i) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 12), M([0x7a3b12, 0x111111, 0xd9661a][i], 0.6)); b.rotation.z = Math.PI / 2; b.position.set(x + d, 0.2, z); g.add(b); });
    });
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 20, 1, false, 0, Math.PI), DARK); tr.position.set(0.2, 0.3, 1.5); shade(tr); g.add(tr);
  }
  // long female header strip on the board (where the sensor wires land)
  { const g = part("header", -0.6, 0.55, 0, 0.4); g.add(box(7.6, 0.42, 0.34, DARK, 0, 0, 0)); }

  // off-board sensors and outputs (lie on the mat above the board)
  let flameGlow: THREE.Sprite, heatGlow: THREE.Sprite;
  const ledMats: Record<string, THREE.MeshStandardMaterial> = {};
  {
    const g = part("mq2", -6.6, -8.3, 1.4, 1.1, v(-1.2, 0, -0.6), -0.4); g.rotation.set(-0.18, 0.35, 0);
    g.add(box(1.7, 0.1, 2.1, BLUE, 0, 0, 0));
    const meshTex = canvasTex(128, 128, (c) => { c.fillStyle = "#b8bec4"; c.fillRect(0, 0, 128, 128); c.fillStyle = "#6e757c"; for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) c.fillRect(i * 8 + 2, j * 8 + 2, 4, 4); });
    const can = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.75, 32), [new THREE.MeshStandardMaterial({ color: 0xc4c9ce, metalness: 0.8, roughness: 0.3 }), new THREE.MeshStandardMaterial({ map: meshTex, metalness: 0.6, roughness: 0.4 }), METAL]));
    can.position.set(0, 0.47, -0.25); g.add(can);
    g.add(cyl(0.2, 0.25, M(0x2f6fe0, 0.4), 0.45, 0.1, 0.75));
  }
  {
    const g = part("flame", -4.4, -7.9, 1.6, 1.0, v(-0.4, 0, -0.9), -0.4); g.rotation.set(-0.18, 0.2, 0);
    g.add(box(0.95, 0.1, 2.3, BLUE, 0, 0, 0));
    const dome = shade(new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 12), M(0x0d0d10, 0.15, 0.2))); dome.position.set(0, 0.4, -1.25); g.add(dome);
    g.add(cyl(0.2, 0.3, M(0x0d0d10, 0.2), 0, 0.1, -1.25));
    g.add(cyl(0.18, 0.22, M(0x2f6fe0, 0.4), 0.15, 0.1, 0.3));
  }
  {
    const g = part("dht", -1.3, -9.3, 1.8, 1.0, v(0, 0, -1.2), -0.4); g.rotation.set(-0.12, -0.1, 0);
    g.add(box(1.25, 0.1, 1.9, DARK, 0, 0, 0.25));
    const gridTex = canvasTex(128, 160, (c) => { c.fillStyle = "#57b7e8"; c.fillRect(0, 0, 128, 160); c.fillStyle = "#2a7fb3"; for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) c.fillRect(10 + i * 19, 12 + j * 21, 12, 14); });
    const body = shade(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.5, 1.4), [M(0x57b7e8, 0.6), M(0x57b7e8, 0.6), new THREE.MeshStandardMaterial({ map: gridTex, roughness: 0.6 }), M(0x57b7e8, 0.6), M(0x57b7e8, 0.6), M(0x57b7e8, 0.6)]));
    body.position.set(0, 0.35, -0.1); g.add(body);
  }
  {
    const g = part("lights", 1.9, -8.8, 2.0, 1.1, v(0.4, 0, -1.2), -0.4); g.rotation.set(-0.14, -0.25, 0);
    g.add(box(0.95, 0.1, 2.9, DARK, 0, 0, 0));
    ([["red", 0xff3030, -1.0], ["yellow", 0xffd21e, -0.25], ["green", 0x29d64f, 0.5]] as const).forEach(([k, c, z]) => {
      const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(c).multiplyScalar(0.35), emissive: c, emissiveIntensity: 0.05, roughness: 0.25 });
      ledMats[k] = m;
      const s = shade(new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), m)); s.position.set(0, 0.3, z); g.add(s);
      g.add(cyl(0.3, 0.2, m, 0, 0.1, z));
    });
  }
  let fanRotor: THREE.Group;
  {
    const g = part("fan", 5.6, -7.6, 1.6, 1.2, v(1.2, 0, -0.8), -0.4); g.rotation.set(-0.12, -0.3, 0);
    const housing = shade(new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.85, 48, 1, true), M(0x1b1d20, 0.55))); housing.position.y = 0.42; g.add(housing);
    g.add(cyl(1.75, 0.06, M(0x1b1d20, 0.55), 0, 0, 0, 48));
    g.add(box(1.0, 0.85, 1.3, M(0x1b1d20, 0.55), 1.55, 0, 0.9));
    fanRotor = new THREE.Group(); fanRotor.position.y = 0.45; g.add(fanRotor);
    fanRotor.add(cyl(0.55, 0.4, M(0x232528, 0.5), 0, -0.2, 0, 32));
    for (let i = 0; i < 24; i++) { const b = box(0.5, 0.6, 0.05, M(0x2a2d31, 0.5), 0, -0.3, 0); b.position.x = Math.cos(i / 24 * Math.PI * 2) * 1.12; b.position.z = Math.sin(i / 24 * Math.PI * 2) * 1.12; b.rotation.y = -i / 24 * Math.PI * 2 + 0.5; fanRotor.add(b); }
  }

  // glow sprites
  const glowTex = canvasTex(128, 128, (c) => {
    const gr = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = gr; c.fillRect(0, 0, 128, 128);
  });
  const glow = (color: number, scale: number) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.scale.setScalar(scale); return s;
  };
  flameGlow = glow(0xff7a1a, 2.2); flameGlow.position.set(0, 0.9, -1.9); parts.flame.g.add(flameGlow);
  heatGlow = glow(0xff9a3a, 2.8); heatGlow.position.set(0, 0.8, -0.1); parts.dht.g.add(heatGlow);
  const ledGlows: Record<string, THREE.Sprite> = {};
  ([["red", 0xff3030, -1.0], ["yellow", 0xffd21e, -0.25], ["green", 0x29d64f, 0.5]] as const).forEach(([k, c, z]) => { const s = glow(c, 1.6); s.position.set(0, 0.6, z); parts.lights.g.add(s); ledGlows[k] = s; });
  const smsRing = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 48), new THREE.MeshBasicMaterial({ color: 0xedb23a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
  smsRing.rotation.x = -Math.PI / 2; smsRing.position.set(-1.45, 1.9, -0.95); parts.sim.g.add(smsRing);
  const buzzRing = smsRing.clone(); (buzzRing.material as THREE.MeshBasicMaterial) = (smsRing.material as THREE.MeshBasicMaterial).clone();
  buzzRing.position.set(0, 1.0, 0); parts.buzzer.g.add(buzzRing);

  // ---------- wires (rebuilt as parts move) ----------
  const wireDefs: { from: string; fp: V3; to: string; tp: V3; colors: number[]; arc: number }[] = [
    { from: "mq2", fp: v(0, 0.1, 1.05), to: "header", tp: v(-3.2, 0.42, 0), colors: [0xf08a2a, 0xeeeeee], arc: 2.4 },
    { from: "flame", fp: v(0, 0.1, 1.15), to: "header", tp: v(-2.4, 0.42, 0), colors: [0x8a63c9, 0xeeeeee], arc: 2.0 },
    { from: "dht", fp: v(0, 0.1, 1.2), to: "header", tp: v(-0.3, 0.42, 0), colors: [0x2f72e0, 0x1fa36a, 0xf2d43a], arc: 2.2 },
    { from: "lights", fp: v(0, 0.1, 1.45), to: "header", tp: v(1.4, 0.42, 0), colors: [0x1fa36a, 0xf2d43a, 0xe53935, 0x8d6e4b], arc: 2.0 },
    { from: "fan", fp: v(1.4, 0.4, 1.4), to: "usb", tp: v(-0.6, 0.3, -0.4), colors: [0xe53935, 0x18191b], arc: 1.6 },
  ];
  const wireGroup = new THREE.Group(); world.add(wireGroup);
  const wireCurves: THREE.CatmullRomCurve3[] = [];
  const worldPt = (k: string, p: V3) => p.clone().applyMatrix4(parts[k].g.matrixWorld).applyMatrix4(new THREE.Matrix4().copy(world.matrixWorld).invert());
  const buildWires = () => {
    world.updateMatrixWorld(true);
    wireGroup.children.forEach((c) => (c as THREE.Mesh).geometry.dispose()); wireGroup.clear(); wireCurves.length = 0;
    wireDefs.forEach((w) => {
      const a = worldPt(w.from, w.fp), b = worldPt(w.to, w.tp);
      w.colors.forEach((col, i) => {
        const off = (i - (w.colors.length - 1) / 2) * 0.16;
        const a2 = a.clone().add(v(off, 0, 0)), b2 = b.clone().add(v(off * 0.8, 0, 0));
        const mid = a2.clone().lerp(b2, 0.5); mid.y = Math.max(a2.y, b2.y) + w.arc;
        const curve = new THREE.CatmullRomCurve3([a2, a2.clone().lerp(mid, 0.45).add(v(0, 0.5, 0)), mid, mid.clone().lerp(b2, 0.55).add(v(0, 0.3, 0)), b2]);
        if (i === 0) wireCurves.push(curve);
        const t = shade(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.055, 6), M(col, 0.45))); wireGroup.add(t);
      });
    });
  };

  // ---------- copper traces on the board + signal pulses ----------
  const tracePts: Record<string, V3[]> = {
    "in": [v(-3.2, 0.03, 0.55), v(-3.2, 0.03, 1.2), v(3.0, 0.03, 1.2), v(3.0, 0.03, 0.62), v(3.4, 0.03, 0.62)],
    "relay": [v(4.0, 0.03, -0.82), v(4.0, 0.03, -1.6), v(3.0, 0.03, -1.6)],
    "sim": [v(3.4, 0.03, -0.82), v(3.4, 0.03, -1.15), v(-1.4, 0.03, -1.15), v(-1.4, 0.03, -4.6), v(-4.6, 0.03, -4.6)],
    "buzz": [v(3.1, 0.03, 0.82), v(3.1, 0.03, 1.9), v(-2.5, 0.03, 1.9)],
  };
  const traceMat = new THREE.MeshStandardMaterial({ color: 0xc08a3a, emissive: 0xedb23a, emissiveIntensity: 0.12, roughness: 0.35, metalness: 0.7 });
  const traceCurves: Record<string, THREE.CurvePath<V3>> = {};
  Object.entries(tracePts).forEach(([k, pts]) => {
    const cp = new THREE.CurvePath<V3>(); for (let i = 0; i < pts.length - 1; i++) cp.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    traceCurves[k] = cp;
    const m = new THREE.Mesh(new THREE.TubeGeometry(cp as unknown as THREE.Curve<V3>, 80, 0.045, 5), traceMat); world.add(m);
  });

  const SIG = 0xedb23a;
  type Pulse = { path: () => THREE.Curve<V3> | null; t: number; dur: number; sprites: THREE.Sprite[]; core: THREE.Mesh; reverse?: boolean; done?: () => void };
  const pulses: Pulse[] = [];
  const coreGeo = new THREE.SphereGeometry(0.09, 10, 8), coreMat = new THREE.MeshBasicMaterial({ color: 0xfff3c8 });
  const spawn = (path: () => THREE.Curve<V3> | null, dur: number, opts: { reverse?: boolean; done?: () => void } = {}) => {
    if (o.reduced) { opts.done?.(); return; }
    const sprites = [0, 1, 2, 3, 4].map((i) => { const s = glow(SIG, 0.9 - i * 0.14); (s.material as THREE.SpriteMaterial).opacity = 1 - i * 0.2; world.add(s); return s; });
    const core = new THREE.Mesh(coreGeo, coreMat); world.add(core);
    pulses.push({ path, t: 0, dur, sprites, core, ...opts });
  };
  const wirePath = (i: number) => () => wireCurves[i] ?? null;

  // ---------- state machine (documented behaviour, animated) ----------
  type S = "normal" | "warning" | "emergency";
  const SEQ: S[] = ["normal", "normal", "warning", "warning", "emergency", "emergency"]; // one entry per 2 s polling cycle
  let cycle = -1, state: S = "normal", fanSpeed = 0, relayOn = 1, buzz = 0, lastPoll = -99;
  const ringPulse = { sms: -9, buzz: -9 };
  const setState = (s: S) => {
    const changed = s !== state; state = s; o.onState(s);
    // outputs
    if (s === "warning" && changed) spawn(() => traceCurves.sim, 1.1, { done: () => (ringPulse.sms = clock.elapsedTime) });
    if (s === "emergency" && changed) {
      spawn(() => traceCurves.relay, 0.5, { done: () => (relayOn = 0) });
      spawn(() => traceCurves.sim, 1.1, { done: () => (ringPulse.sms = clock.elapsedTime) });
      spawn(() => traceCurves.buzz, 0.8, { done: () => (buzz = 1) });
    }
    if (s === "normal") { relayOn = 1; buzz = 0; }
    spawn(wirePath(3), 0.9, { reverse: true });
  };
  const poll = () => {
    cycle = (cycle + 1) % SEQ.length;
    const next = SEQ[cycle];
    // sensor readings travel to the controller, then the controller decides
    let pending = 3;
    const arrive = () => { if (--pending === 0) spawn(() => traceCurves.in, 0.45, { done: () => setState(next) }); };
    spawn(wirePath(0), 1.0, { done: arrive }); spawn(wirePath(1), 1.0, { done: arrive }); spawn(wirePath(2), 1.0, { done: arrive });
  };

  // ---------- camera + interaction ----------
  let yawDrag = 0, yawVel = 0, mx = 0, my = 0, smx = 0, smy = 0, dragging = false, lastX = 0;
  o.root.addEventListener("pointermove", (e) => {
    const r = o.root.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; yawVel = dx * 0.006; yawDrag += yawVel; }
  });
  o.root.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; o.root.setPointerCapture(e.pointerId); o.root.classList.add("grabbing"); });
  const endDrag = () => { dragging = false; o.root.classList.remove("grabbing"); };
  o.root.addEventListener("pointerup", endDrag); o.root.addEventListener("pointercancel", endDrag);
  o.root.addEventListener("pointerleave", () => { mx = 0; my = 0; });

  let W = 0, H = 0;
  const resize = () => {
    const r = o.root.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false); camera.aspect = W / H;
    camera.fov = W / H < 0.9 ? 40 : 30;
    // on wide screens, move the model out from under the heading (towards the reading end)
    const rtl = document.documentElement.dir === "rtl";
    const shift = W > 980 ? W * 0.12 : 0;
    if (shift) camera.setViewOffset(W, H, rtl ? shift : -shift, 0, W, H); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(o.root); resize();

  // scroll-driven explode (0 → 1 across the section)
  let explode = 0, explodeTarget = 0;
  const readScroll = () => {
    // the card scrolls like any other section; it comes apart as it rises through the screen
    const r = o.section.getBoundingClientRect(), vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) manual = null;           // off screen: back to automatic
    const auto = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / (vh * 0.5)));
    explodeTarget = manual ?? auto;
  };
  let manual: number | null = null;
  o.toggle?.addEventListener("click", () => {
    manual = explodeTarget > 0.5 ? 0 : 1; explodeTarget = manual;
    if (o.reduced) { explode = manual; requestAnimationFrame(() => { frame(); cancelAnimationFrame(raf); }); }
  });
  window.addEventListener("scroll", readScroll, { passive: true }); readScroll();
  if (o.reduced) { explodeTarget = explode = 0.75; }

  // labels
  const labelEls = [...o.labels.querySelectorAll<HTMLElement>("[data-k]")];
  const tmp = new THREE.Vector3();

  const clock = new THREE.Clock();
  let lastBuiltExplode = -1, running = false, raf = 0;
  const ease = (t: number) => t * t * (3 - 2 * t);

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05), now = clock.elapsedTime;
    if (!o.reduced) explode += (explodeTarget - explode) * Math.min(1, dt * 6);
    const e = ease(explode);
    const nar = W / H < 0.9, spread = nar ? 1.1 : 2.2;

    // parts lift and spread
    Object.values(parts).forEach((p) => {
      p.g.position.set(p.base.x + p.out.x * e * spread, p.base.y + p.lift * e * 1.35, p.base.z + p.out.z * e * spread);
    });
    if (Math.abs(e - lastBuiltExplode) > 0.004) { buildWires(); lastBuiltExplode = e; }

    // camera: gentle sway, mouse parallax, drag; lower and turn as it explodes
    if (!dragging) { yawVel *= 0.94; yawDrag += yawVel; }
    smx += (mx - smx) * Math.min(1, dt * 3); smy += (my - smy) * Math.min(1, dt * 3);
    const sway = o.reduced ? 0 : Math.sin(now * 0.25) * 0.08;
    const yaw = -0.18 + sway + yawDrag + smx * 0.22 + e * (nar ? 0.12 : 0.38);
    const elev = 0.84 - e * 0.3 - smy * 0.08;
    // fit the scene width (~26 units) for any aspect ratio
    const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    const wide = W > 980 ? 1.24 : 1;
    const narrow = W / H < 0.9;
    const dist = (narrow ? Math.max(24, 9.6 / Math.tan(hf / 2)) : Math.max(30 * wide, 13.8 / Math.tan(hf / 2))) + e * (narrow ? 4 : 2);
    camera.position.set(target.x + Math.sin(yaw) * Math.cos(elev) * dist, target.y + Math.sin(elev) * dist, target.z + Math.cos(yaw) * Math.cos(elev) * dist);
    camera.lookAt(target.x, target.y + e * 1.4, target.z);

    // polling every 2 s
    if (!o.reduced && now - lastPoll >= 2) { lastPoll = now; poll(); }

    // outputs
    const want = { green: state === "normal", yellow: state === "warning", red: state === "emergency" } as Record<string, boolean>;
    Object.entries(ledMats).forEach(([k, m]) => {
      const tgt = want[k] ? (k === "red" ? 2.2 + Math.sin(now * 14) * 0.6 : 2.2) : 0.04;
      m.emissiveIntensity += (tgt - m.emissiveIntensity) * Math.min(1, dt * 10);
      const gm = ledGlows[k].material as THREE.SpriteMaterial; gm.opacity = Math.min(1, m.emissiveIntensity / 2.2) * 0.9;
    });
    const fanTarget = state === "normal" ? 0 : 14;
    fanSpeed += (fanTarget - fanSpeed) * Math.min(1, dt * (fanTarget ? 1.2 : 0.6));
    fanRotor.rotation.y -= fanSpeed * dt;
    relayLed.emissiveIntensity += ((relayOn ? 2.2 : 0) - relayLed.emissiveIntensity) * Math.min(1, dt * 12);
    relayArm.rotation.z += ((relayOn ? 0 : 0.5) - relayArm.rotation.z) * Math.min(1, dt * 18);
    buzzerTop.emissiveIntensity = buzz && state === "emergency" ? 1 + Math.sin(now * 30) * 0.8 : 0;
    if (state !== "emergency") buzz = 0;
    // hazard cues
    const fl = flameGlow.material as THREE.SpriteMaterial, ht = heatGlow.material as THREE.SpriteMaterial;
    fl.opacity += ((state === "emergency" ? 0.75 + Math.sin(now * 23) * 0.15 + Math.sin(now * 37) * 0.1 : 0) - fl.opacity) * Math.min(1, dt * 6);
    flameGlow.scale.set(1.6 + Math.sin(now * 19) * 0.15, 2.4 + Math.sin(now * 13) * 0.3, 1);
    ht.opacity += ((state !== "normal" ? 0.45 + Math.sin(now * 3) * 0.1 : 0) - ht.opacity) * Math.min(1, dt * 3);
    // rings (SMS from the antenna, sound from the buzzer)
    const ring = (m: THREE.Mesh, t0: number, period = 1.2) => {
      const a = (now - t0) / period; const mat = m.material as THREE.MeshBasicMaterial;
      if (a < 0 || a > 1) { mat.opacity = 0; return; }
      m.scale.setScalar(0.3 + a * 2.2); mat.opacity = (1 - a) * 0.9;
    };
    ring(smsRing, ringPulse.sms);
    if (buzz && state === "emergency") ring(buzzRing, now - ((now * 1.6) % 1) / 1.6, 0.62); else (buzzRing.material as THREE.MeshBasicMaterial).opacity = 0;
    antenna.rotation.y += dt * 0.5;

    // pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]; p.t += dt / p.dur; const c = p.path();
      if (!c || p.t >= 1) { p.sprites.forEach((s) => { world.remove(s); s.material.dispose(); }); world.remove(p.core); pulses.splice(i, 1); p.done?.(); continue; }
      p.sprites.forEach((s, k) => { const tt = Math.max(0, p.t - k * 0.025); c.getPointAt(p.reverse ? 1 - tt : tt, tmp); s.position.copy(tmp); });
      c.getPointAt(p.reverse ? 1 - p.t : p.t, tmp); p.core.position.copy(tmp);
    }
    traceMat.emissiveIntensity = 0.12 + Math.min(1.2, pulses.length * 0.08);

    renderer.render(scene, camera);
    if (o.toggle) o.toggle.setAttribute("aria-pressed", String(explodeTarget > 0.5));

    // labels: shown once the model starts to come apart
    const la = Math.min(1, Math.max(0, (e - 0.35) / 0.35));
    labelEls.forEach((el) => {
      const p = parts[el.dataset.k!]; if (!p) return;
      tmp.copy(p.anchor).applyMatrix4(p.g.matrixWorld).project(camera);
      const pad = Math.min(90, el.offsetWidth / 2 + 6);
      const x = Math.min(W - pad, Math.max(pad, (tmp.x * 0.5 + 0.5) * W)), y = (-tmp.y * 0.5 + 0.5) * H;
      const vis = la > 0 && tmp.z < 1 && y > 8 && y < H - 8;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      el.style.opacity = vis ? String(la) : "0";
    });
  };

  // only render while on screen
  const start = () => {
    if (o.reduced) { frame(); cancelAnimationFrame(raf); return; }
    if (!running) { running = true; clock.getDelta(); frame(); }
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { rootMargin: "100px" }).observe(o.root);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  o.onState("normal");
}
