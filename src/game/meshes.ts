import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Points,
  PointsMaterial,
  ShapeUtils,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  type Material,
} from "three";

const ICE = 0x6ae4ff;
const EMBER = 0xff9a3c;
const HULL = 0xc5ced6;
const VOID = 0x10151c;

export type ShipView = {
  root: Group;
  ghosts: Group[];
  bank: Group;
  body: Mesh;
  ring: Mesh;
  flames: Object3D[];
};

export type RockView = {
  root: Group;
  ghosts: Group[];
  body: Object3D;
  geos: BufferGeometry[];
};

export type UfoView = {
  root: Group;
  ghosts: Group[];
  hull: Group;
};

export type BulletView = {
  root: Group;
  ghost: Group;
  mesh: Mesh;
};

export function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas unavailable");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

let glowTex: CanvasTexture | null = null;

function sharedGlow() {
  glowTex ??= makeGlowTexture();
  return glowTex;
}

export function makeStars() {
  const count = 320;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 420;
    positions[i * 3 + 1] = 4 + Math.random() * 36;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 420;
    const t = 0.22 + Math.random() * 0.28;
    colors[i * 3] = t;
    colors[i * 3 + 1] = t;
    colors[i * 3 + 2] = Math.min(1, t + 0.08);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  const mat = new PointsMaterial({
    size: 1.35,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  return new Points(geo, mat);
}

function hullMaterial() {
  return new MeshStandardMaterial({
    color: HULL,
    metalness: 0.62,
    roughness: 0.34,
    flatShading: true,
    emissive: new Color(0x24303a),
    emissiveIntensity: 0.85,
    side: DoubleSide,
  });
}

function glassMaterial(emissive: number) {
  return new MeshStandardMaterial({
    color: VOID,
    metalness: 0.15,
    roughness: 0.08,
    emissive: new Color(emissive),
    emissiveIntensity: 0.85,
  });
}

export function makeShip(): ShipView {
  const root = new Group();
  const bank = new Group();
  bank.position.y = 1.15;
  root.add(bank);

  const shape = dartGeometry();
  const body = new Mesh(shape, hullMaterial());
  body.name = "body";
  bank.add(body);

  const canopy = new Mesh(new SphereGeometry(0.42, 16, 12), glassMaterial(ICE));
  canopy.scale.set(0.62, 0.38, 1.05);
  canopy.position.set(0, 0.32, -0.55);
  bank.add(canopy);

  const nose = new Mesh(
    new SphereGeometry(0.18, 8, 8),
    new MeshBasicMaterial({ color: ICE, toneMapped: false }),
  );
  nose.position.set(0, 0.06, -2.55);
  bank.add(nose);

  const flames: Object3D[] = [];
  for (const x of [-0.46, 0.46]) {
    const nozzle = new Mesh(
      new CylinderGeometry(0.1, 0.16, 0.28, 8),
      new MeshStandardMaterial({
        color: 0x1a120c,
        roughness: 0.45,
        metalness: 0.4,
        emissive: new Color(EMBER),
        emissiveIntensity: 0.35,
      }),
    );
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(x, -0.02, 1.85);
    bank.add(nozzle);

    const flame = new Mesh(
      new ConeGeometry(0.18, 0.95, 8),
      new MeshBasicMaterial({
        color: EMBER,
        transparent: true,
        opacity: 0.92,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    flame.rotation.x = Math.PI / 2;
    flame.position.set(x, -0.02, 2.45);
    flame.visible = false;
    flame.name = "flame";
    bank.add(flame);
    flames.push(flame);
  }

  const ring = new Mesh(
    new TorusGeometry(2.35, 0.035, 8, 32),
    new MeshBasicMaterial({
      color: ICE,
      transparent: true,
      opacity: 0.75,
      toneMapped: false,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  ring.visible = false;
  ring.name = "ring";
  root.add(ring);

  const ghosts = [0, 1, 2].map(() => cloneShipGhost(bank));
  return { root, ghosts, bank, body, ring, flames };
}

function cloneShipGhost(bank: Group) {
  const ghost = new Group();
  const bankClone = bank.clone();
  ghost.add(bankClone);
  ghost.visible = false;
  return ghost;
}

function dartGeometry() {
  const v = [
    [0, 0.05, -2.7],
    [0, 0.48, -0.35],
    [0, -0.32, -0.15],
    [-1.6, 0.02, 1.2],
    [1.6, 0.02, 1.2],
    [0, 0.18, 2.15],
    [0, -0.22, 1.75],
  ];
  const faces = [
    [0, 3, 1],
    [0, 1, 4],
    [1, 3, 5],
    [1, 5, 4],
    [0, 2, 3],
    [0, 4, 2],
    [2, 6, 3],
    [2, 4, 6],
    [3, 6, 5],
    [4, 5, 6],
    [5, 3, 6],
    [5, 6, 4],
  ];
  const positions: number[] = [];
  for (const f of faces) {
    for (const i of f) positions.push(...(v[i] as number[]));
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

const rockMat = new MeshStandardMaterial({
  color: 0xffffff,
  vertexColors: true,
  roughness: 0.84,
  metalness: 0.06,
  flatShading: true,
  emissive: new Color(0x050608),
  emissiveIntensity: 0.25,
  side: DoubleSide,
});
rockMat.userData.persist = true;

const chipMat = new MeshStandardMaterial({
  color: 0x161a1f,
  roughness: 0.8,
  metalness: 0.12,
  flatShading: true,
  emissive: new Color(0x10141a),
  emissiveIntensity: 0.35,
});
chipMat.userData.persist = true;

const rockLineMat = new LineBasicMaterial({
  color: 0x5c6772,
  transparent: true,
  opacity: 0.42,
});
rockLineMat.userData.persist = true;

const fissureAmber = new MeshBasicMaterial({
  color: 0xff9a3c,
  toneMapped: false,
  transparent: true,
  opacity: 0.85,
  blending: AdditiveBlending,
  depthWrite: false,
  side: DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});
fissureAmber.userData.persist = true;

const fissureCyan = fissureAmber.clone();
fissureCyan.color.setHex(0x6ae4ff);
fissureCyan.userData.persist = true;

let chipGeo: BufferGeometry | null = null;

function sharedChipGeo() {
  if (chipGeo) return chipGeo;
  const s = 1;
  const v = [
    [0, 0.72 * s, 0.04 * s],
    [-0.62 * s, -0.28 * s, -0.22 * s],
    [0.58 * s, -0.18 * s, -0.34 * s],
    [0.08 * s, -0.34 * s, 0.66 * s],
    [-0.16 * s, 0.22 * s, 0.18 * s],
  ];
  const faces = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 3, 2],
    [4, 2, 1],
    [4, 3, 2],
  ];
  const positions: number[] = [];
  for (const f of faces) {
    for (const i of f) positions.push(...(v[i] ?? [0, 0, 0]));
  }
  chipGeo = new BufferGeometry();
  chipGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  chipGeo.computeVertexNormals();
  chipGeo.userData.persist = true;
  return chipGeo;
}

/** Jagged arcade silhouettes. Unit-ish, normalized to the collision radius. */
const ROCK_OUTLINES: Array<Array<[number, number]>> = [
  [
    [0.05, -1],
    [0.46, -0.72],
    [0.98, -0.55],
    [0.68, -0.12],
    [1.05, 0.28],
    [0.52, 0.22],
    [0.74, 0.86],
    [0.16, 0.58],
    [0.1, 1.04],
    [-0.36, 0.7],
    [-0.88, 0.96],
    [-0.58, 0.28],
    [-1.04, 0.06],
    [-0.7, -0.38],
    [-1.02, -0.74],
    [-0.42, -0.96],
  ],
  [
    [0.15, -1],
    [0.58, -0.66],
    [0.32, -0.22],
    [1.02, -0.38],
    [0.78, 0.16],
    [1.04, 0.52],
    [0.42, 0.24],
    [0.64, 0.96],
    [0.02, 0.62],
    [-0.28, 1.02],
    [-0.74, 0.64],
    [-0.36, 0.28],
    [-1.0, 0.5],
    [-0.78, -0.08],
    [-1.04, -0.58],
    [-0.4, -0.32],
    [-0.66, -0.98],
    [-0.08, -0.58],
  ],
  [
    [0, -1.02],
    [0.5, -0.58],
    [0.22, -0.16],
    [0.96, -0.04],
    [0.5, 0.22],
    [0.9, 0.66],
    [0.26, 0.4],
    [0.16, 1.02],
    [-0.32, 0.68],
    [-0.12, 0.34],
    [-0.76, 0.92],
    [-1.0, 0.18],
    [-0.54, 0],
    [-1.02, -0.42],
    [-0.38, -0.18],
    [-0.78, -0.86],
    [-0.14, -0.54],
  ],
  [
    [0.24, -1.02],
    [0.76, -0.62],
    [0.44, -0.16],
    [1.04, 0.08],
    [0.58, 0.46],
    [0.88, 0.82],
    [0.22, 0.5],
    [-0.08, 1.02],
    [-0.56, 0.66],
    [-0.98, 0.88],
    [-0.64, 0.24],
    [-1.04, -0.1],
    [-0.5, -0.38],
    [-0.92, -0.76],
    [-0.22, -0.46],
    [-0.06, -0.98],
  ],
];

function rockOutline(seed: number, radius: number) {
  const fallback = ROCK_OUTLINES[0] ?? [];
  const raw = ROCK_OUTLINES[Math.abs(seed) % ROCK_OUTLINES.length] ?? fallback;
  const flip = seed & 1 ? -1 : 1;
  let max = 1;
  for (const [x, z] of raw) max = Math.max(max, Math.hypot(x, z));
  return raw.map(([x, z]) => [(flip * x * radius) / max, (z * radius) / max] as [number, number]);
}

function mulberry32(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function loopGeometry(points: Array<[number, number]>, y: number) {
  const data: number[] = [];
  for (const [x, z] of points) data.push(x, y, z);
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(data, 3));
  return geo;
}

function pushVert(pos: number[], col: number[], x: number, y: number, z: number, tint: number[]) {
  pos.push(x, y, z);
  col.push(tint[0] ?? 0.2, tint[1] ?? 0.2, tint[2] ?? 0.22);
}

function fissureGeometry(ax: number, az: number, bx: number, bz: number, y: number, width: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz) || 1;
  const nx = (-dz / len) * width * 0.5;
  const nz = (dx / len) * width * 0.5;
  const data = [
    ax + nx, y, az + nz,
    bx + nx, y, bz + nz,
    bx - nx, y, bz - nz,
    ax + nx, y, az + nz,
    bx - nx, y, bz - nz,
    ax - nx, y, az - nz,
  ];
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(data, 3));
  return geo;
}

function buildRock(points: Array<[number, number]>, radius: number, seed: number) {
  const rnd = mulberry32(seed);
  const contour = points.map(([x, z]) => new Vector2(x, z));
  const faces = ShapeUtils.triangulateShape(contour, []);
  const stone = [0.11, 0.115, 0.12];
  const crest = [0.16, 0.165, 0.17];
  const valley = [0.055, 0.058, 0.06];
  const rimY = points.map(() => radius * (0.14 + rnd() * 0.1));
  const pos: number[] = [];
  const col: number[] = [];

  const emit = (x: number, y: number, z: number, tint: number[]) => pushVert(pos, col, x, y, z, tint);

  if (faces.length === 0) {
    for (let i = 1; i < points.length - 1; i++) faces.push([0, i, i + 1]);
  }

  for (const face of faces) {
    const ia = face[0] ?? 0;
    const ib = face[1] ?? 0;
    const ic = face[2] ?? 0;
    const pa = points[ia] ?? [0, 0];
    const pb = points[ib] ?? [0, 0];
    const pc = points[ic] ?? [0, 0];
    const mx = (pa[0] + pb[0] + pc[0]) / 3;
    const mz = (pa[1] + pb[1] + pc[1]) / 3;
    const raised = rnd() > 0.28;
    const peak = radius * (raised ? 0.26 + rnd() * 0.28 : 0.08 + rnd() * 0.08);
    const tint = raised ? (rnd() > 0.55 ? crest : stone) : valley;
    const tri = [
      [pa[0], rimY[ia] ?? 0, pa[1], stone],
      [pb[0], rimY[ib] ?? 0, pb[1], stone],
      [mx, peak, mz, tint],
      [pb[0], rimY[ib] ?? 0, pb[1], stone],
      [pc[0], rimY[ic] ?? 0, pc[1], stone],
      [mx, peak, mz, tint],
      [pc[0], rimY[ic] ?? 0, pc[1], stone],
      [pa[0], rimY[ia] ?? 0, pa[1], stone],
      [mx, peak, mz, tint],
    ] as const;
    for (const [x, y, z, c] of tri) emit(x, y, z, [...c]);
  }

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const a = points[i] ?? [0, 0];
    const b = points[j] ?? [0, 0];
    const inset = 0.74;
    const y0 = radius * 0.03;
    const shade = [0.035, 0.037, 0.04];
    emit(a[0], rimY[i] ?? 0, a[1], stone);
    emit(b[0], rimY[j] ?? 0, b[1], stone);
    emit(b[0] * inset, y0, b[1] * inset, shade);
    emit(a[0], rimY[i] ?? 0, a[1], stone);
    emit(b[0] * inset, y0, b[1] * inset, shade);
    emit(a[0] * inset, y0, a[1] * inset, shade);
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();

  const body = new Group();
  body.name = "body";
  const mesh = new Mesh(geo, rockMat);
  mesh.name = "shell";
  body.add(mesh);

  const line = new LineLoop(loopGeometry(points, radius * 0.5), rockLineMat);
  body.add(line);

  const geos: BufferGeometry[] = [geo, line.geometry];
  const crackMat = seed % 6 === 0 ? fissureCyan : fissureAmber;
  const cracks = radius > 1.6 ? 1 : 0;
  for (let k = 0; k < cracks; k++) {
    const edge = points[Math.floor(rnd() * points.length)] ?? [radius, 0];
    const ox = (rnd() - 0.5) * radius * 0.35;
    const oz = (rnd() - 0.5) * radius * 0.35;
    const reach = 0.42 + rnd() * 0.28;
    const fissure = fissureGeometry(
      ox,
      oz,
      ox + (edge[0] - ox) * reach,
      oz + (edge[1] - oz) * reach,
      radius * 0.52,
      Math.max(radius * 0.065, 0.14),
    );
    geos.push(fissure);
    const glow = new Mesh(fissure, crackMat);
    glow.name = "fissure";
    body.add(glow);
  }

  const chipCount = radius > 3.4 ? 2 : 0;
  for (let i = 0; i < chipCount; i++) {
    const chip = new Mesh(sharedChipGeo(), chipMat);
    chip.name = "chip";
    const ang = rnd() * Math.PI * 2;
    const dist = radius * (1.02 + rnd() * 0.22);
    const y = radius * (0.18 + rnd() * 0.42);
    chip.position.set(Math.cos(ang) * dist, y, Math.sin(ang) * dist);
    chip.scale.setScalar(radius * (0.13 + rnd() * 0.07));
    chip.rotation.set(rnd() * 2, rnd() * 4, rnd() * 2);
    chip.userData.baseY = y;
    chip.userData.phase = rnd() * Math.PI * 2;
    body.add(chip);
  }

  return { body, geos };
}

export function makeRock(seed: number, radius: number): RockView {
  const pts = rockOutline(seed, radius);
  const { body, geos } = buildRock(pts, radius, seed);
  const root = new Group();
  root.add(body);
  const ghosts = [0, 1, 2].map(() => {
    const g = new Group();
    g.add(body.clone());
    g.visible = false;
    return g;
  });
  return { root, ghosts, body, geos };
}

function saucerMetal(color: number, emissive: number, metalness: number, roughness: number) {
  return new MeshStandardMaterial({
    color,
    metalness,
    roughness,
    flatShading: true,
    emissive: new Color(emissive),
    emissiveIntensity: 0.42,
  });
}

function saucerProfile(radius: number) {
  const h = radius * 0.42;
  const r = radius;
  return [
    new Vector2(0.02 * r, 0.9 * h),
    new Vector2(0.2 * r, 0.74 * h),
    new Vector2(0.38 * r, 0.46 * h),
    new Vector2(0.56 * r, 0.28 * h),
    new Vector2(0.78 * r, 0.14 * h),
    new Vector2(1 * r, 0.02 * h),
    new Vector2(0.8 * r, -0.2 * h),
    new Vector2(0.46 * r, -0.34 * h),
    new Vector2(0.06 * r, -0.14 * h),
  ];
}

export function makeUfo(kind: "large" | "small"): UfoView {
  const radius = kind === "large" ? 2.7 : 1.55;
  const hunter = kind === "small";
  const accent = hunter ? EMBER : ICE;
  const root = new Group();
  const hull = new Group();
  hull.name = "hull";
  hull.userData.baseY = 0.48;
  hull.position.y = 0.48;
  root.add(hull);

  const lathe = new LatheGeometry(saucerProfile(radius), hunter ? 10 : 12);
  lathe.computeVertexNormals();
  const shell = new Mesh(
    lathe,
    saucerMetal(hunter ? 0x3a342e : 0x46505a, hunter ? 0x140e0c : 0x101418, 0.42, 0.5),
  );
  shell.name = "shell";
  hull.add(shell);

  const dome = new Mesh(
    new SphereGeometry(radius * 0.3, 7, 5),
    saucerMetal(hunter ? 0x4a453e : 0x5c6772, hunter ? 0x1a120e : 0x121c22, 0.28, 0.42),
  );
  dome.scale.y = 0.52;
  dome.position.y = radius * 0.16;
  hull.add(dome);

  const seam = new Mesh(
    new TorusGeometry(radius * 0.72, Math.max(0.035, radius * 0.018), 4, 20),
    saucerMetal(0x14181e, 0x0a0e12, 0.4, 0.55),
  );
  seam.rotation.x = Math.PI / 2;
  seam.position.y = radius * 0.05;
  hull.add(seam);

  const rim = new Mesh(
    new TorusGeometry(radius * 0.98, Math.max(0.055, radius * 0.028), 5, 28),
    new MeshBasicMaterial({ color: 0x6a737c, transparent: true, opacity: 0.32, toneMapped: false }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = radius * 0.012;
  hull.add(rim);

  const sensor = new Mesh(
    new SphereGeometry(Math.max(0.16, radius * 0.1), 8, 6),
    new MeshBasicMaterial({ color: accent, toneMapped: false }),
  );
  sensor.name = "sensor";
  sensor.position.y = radius * 0.3;
  hull.add(sensor);

  const lamps = hunter ? 6 : 8;
  const lampReach = radius * 0.5;
  const lampSize = Math.max(0.36, radius * 0.28);
  for (let i = 0; i < lamps; i++) {
    const lamp = new Mesh(
      new BoxGeometry(lampSize, Math.max(0.06, radius * 0.035), lampSize * 0.72),
      new MeshBasicMaterial({ color: accent, toneMapped: false }),
    );
    const a = (i / lamps) * Math.PI * 2;
    lamp.position.set(Math.cos(a) * lampReach, radius * 0.1, Math.sin(a) * lampReach);
    lamp.rotation.y = -a;
    lamp.name = i % 2 === 0 ? "lamp-a" : "lamp-b";
    hull.add(lamp);
  }

  const charge = new Mesh(
    new TorusGeometry(radius * 0.5, Math.max(0.04, radius * 0.02), 6, 24),
    new MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.95,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  charge.name = "charge";
  charge.visible = false;
  charge.rotation.x = Math.PI / 2;
  charge.position.y = radius * 0.12;
  hull.add(charge);

  const underglow = new Sprite(
    new SpriteMaterial({
      map: sharedGlow(),
      color: hunter ? EMBER : 0xffc27a,
      transparent: true,
      opacity: 0.18,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  underglow.name = "underglow";
  underglow.position.y = -radius * 0.22;
  underglow.scale.setScalar(radius * 1.45);
  hull.add(underglow);

  const trail = new Group();
  trail.name = "trail";
  root.add(trail);
  for (let i = 0; i < 3; i++) {
    const mote = new Sprite(
      new SpriteMaterial({
        map: sharedGlow(),
        color: hunter ? EMBER : ICE,
        transparent: true,
        opacity: 0.22 - i * 0.06,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    mote.position.set(0, 0.35, -(radius * 0.42) * (i + 1.2));
    mote.scale.setScalar(radius * (0.42 - i * 0.06));
    mote.name = "trail";
    trail.add(mote);
  }

  const ghosts = [0, 1, 2].map(() => {
    const g = new Group();
    g.add(hull.clone());
    g.visible = false;
    return g;
  });
  return { root, ghosts, hull };
}

export function releaseUfo(view: UfoView) {
  const geos = new Set<BufferGeometry>();
  const mats = new Set<Material>();
  view.root.traverse((child) => {
    const mesh = child as Mesh;
    if (mesh.geometry) geos.add(mesh.geometry);
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      for (const entry of mat) mats.add(entry);
    } else if (mat) mats.add(mat);
  });
  for (const geo of geos) geo.dispose();
  for (const mat of mats) mat.dispose();
}

export function makeBullet(glow: CanvasTexture): BulletView {
  const mat = new MeshBasicMaterial({
    color: ICE,
    toneMapped: false,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(new CylinderGeometry(0.09, 0.09, 1.15, 6), mat);
  mesh.rotation.x = Math.PI / 2;
  const sprite = new Sprite(
    new SpriteMaterial({
      map: glow,
      color: ICE,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  sprite.scale.setScalar(1.5);
  const root = new Group();
  root.add(mesh);
  root.add(sprite);
  root.visible = false;
  root.position.y = 1.35;
  const ghost = root.clone();
  return { root, ghost, mesh };
}

export function makeSpark(glow: CanvasTexture) {
  const sprite = new Sprite(
    new SpriteMaterial({
      map: glow,
      color: EMBER,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      opacity: 0,
    }),
  );
  sprite.visible = false;
  sprite.position.y = 1.2;
  return sprite;
}

export function retintBullet(view: BulletView, color: number) {
  const meshMat = view.mesh.material as MeshBasicMaterial;
  meshMat.color.setHex(color);
  const sprite = view.root.children[1] as Sprite | undefined;
  if (sprite) (sprite.material as SpriteMaterial).color.setHex(color);
  const ghostMesh = view.ghost.children[0] as Mesh | undefined;
  const ghostMat = ghostMesh?.material;
  if (ghostMat && !Array.isArray(ghostMat) && "color" in ghostMat) {
    (ghostMat as MeshBasicMaterial).color.setHex(color);
  }
  const ghostSprite = view.ghost.children[1] as Sprite | undefined;
  if (ghostSprite) (ghostSprite.material as Material & { color?: Color }).color?.setHex(color);
}
