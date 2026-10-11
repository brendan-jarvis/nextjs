import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Points,
  PointsMaterial,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  type Material,
} from "three";

const ICE = 0x6ae4ff;
const EMBER = 0xff9a3c;
const HULL = 0xd5dee8;
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
  geo: BufferGeometry;
  lineGeo: BufferGeometry;
};

export type UfoView = {
  root: Group;
  ghosts: Group[];
  ring: Object3D;
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

export function makeShadowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas unavailable");
  const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  grad.addColorStop(0, "rgba(0,0,0,0.45)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export function makeStars() {
  const count = 640;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 420;
    positions[i * 3 + 1] = 4 + Math.random() * 36;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 420;
    const t = 0.55 + Math.random() * 0.45;
    colors[i * 3] = t;
    colors[i * 3 + 1] = t;
    colors[i * 3 + 2] = Math.min(1, t + 0.08);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  const mat = new PointsMaterial({
    size: 2.2,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  return new Points(geo, mat);
}

function hullMaterial() {
  return new MeshStandardMaterial({
    color: HULL,
    metalness: 0.82,
    roughness: 0.28,
    flatShading: true,
    emissive: new Color(0x0c2833),
    emissiveIntensity: 0.45,
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
    new SphereGeometry(0.12, 8, 8),
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
  color: 0x8d8680,
  roughness: 0.94,
  metalness: 0.02,
  flatShading: true,
});
rockMat.userData.persist = true;

const rockLineMat = new LineBasicMaterial({
  color: 0xe4ddd4,
  transparent: true,
  opacity: 0.92,
});
rockLineMat.userData.persist = true;

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

function slabGeometry(points: Array<[number, number]>, depth: number, lift: number, sharp = false) {
  const shape = new Shape();
  const first = points[0] ?? [0, 0];
  shape.moveTo(first[0], -first[1]);
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (!p) continue;
    shape.lineTo(p[0], -p[1]);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: !sharp,
    bevelThickness: depth * 0.22,
    bevelSize: depth * 0.16,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, lift, 0);
  geo.computeVertexNormals();
  return geo;
}

function loopGeometry(points: Array<[number, number]>, y: number) {
  const data: number[] = [];
  for (const [x, z] of points) data.push(x, y, z);
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(data, 3));
  return geo;
}

function dressRock(geo: BufferGeometry, lineGeo: BufferGeometry) {
  const body = new Mesh(geo, rockMat);
  body.name = "body";
  body.add(new LineLoop(lineGeo, rockLineMat));
  return body;
}

export function makeRock(seed: number, radius: number): RockView {
  const pts = rockOutline(seed, radius);
  const depth = radius * 0.26;
  const lift = radius * 0.08;
  const geo = slabGeometry(pts, depth, lift);
  const lineGeo = loopGeometry(pts, lift + depth + radius * 0.06);
  const body = dressRock(geo, lineGeo);
  const root = new Group();
  root.add(body);
  const ghosts = [0, 1, 2].map(() => {
    const g = new Group();
    g.add(dressRock(geo, lineGeo));
    g.visible = false;
    return g;
  });
  return { root, ghosts, body, geo, lineGeo };
}

/** Arcade saucer, side-on: dome, shoulder, pointed rim, flat belly. */
const SAUCER_RAW: Array<[number, number]> = [
  [0, 8],
  [4, 4],
  [8, 4],
  [12, 0],
  [8, -4],
  [-8, -4],
  [-12, 0],
  [-8, 4],
  [-4, 4],
];

function saucerPoints(radius: number) {
  let sx = 0;
  let sz = 0;
  for (const [x, z] of SAUCER_RAW) {
    sx += x;
    sz += z;
  }
  sx /= SAUCER_RAW.length;
  sz /= SAUCER_RAW.length;
  const shifted = SAUCER_RAW.map(([x, z]) => [x - sx, z - sz] as [number, number]);
  let max = 1;
  for (const [x, z] of shifted) max = Math.max(max, Math.hypot(x, z));
  const scale = radius / max;
  return {
    pts: shifted.map(([x, z]) => [x * scale, z * scale] as [number, number]),
    windowZ: (0 - sz) * scale,
  };
}

export function makeUfo(kind: "large" | "small"): UfoView {
  const radius = kind === "large" ? 2.7 : 1.55;
  const hunter = kind === "small";
  const { pts, windowZ } = saucerPoints(radius);
  const stroke = pts.map(([x, z]) => [x * 1.14, z * 1.14] as [number, number]);
  const depth = Math.max(0.22, radius * 0.14);
  const lift = 0.35;
  const ink = new MeshBasicMaterial({
    color: hunter ? 0xffb15a : 0xf4fbff,
    toneMapped: false,
  });
  const fill = new MeshStandardMaterial({
    color: hunter ? 0x3a2418 : 0x1a242e,
    metalness: 0.4,
    roughness: 0.55,
    flatShading: true,
    emissive: new Color(hunter ? 0x4a220c : 0x123040),
    emissiveIntensity: 0.45,
  });
  const edge = new LineBasicMaterial({ color: hunter ? 0xffd7a8 : 0xffffff });
  const root = new Group();
  root.add(new Mesh(slabGeometry(stroke, depth * 0.55, lift, true), ink));
  const body = new Mesh(slabGeometry(pts, depth, lift + 0.04, true), fill);
  body.name = "body";
  body.add(new LineLoop(loopGeometry(pts, lift + depth + 0.08), edge));
  root.add(body);

  const bar = new Mesh(new BoxGeometry(radius * 1.35, 0.08, Math.max(0.08, radius * 0.045)), ink);
  bar.position.set(0, lift + depth + 0.1, windowZ);
  root.add(bar);

  const lamps = hunter ? 3 : 4;
  for (let i = 0; i < lamps; i++) {
    const lamp = new Mesh(
      new SphereGeometry(hunter ? 0.16 : 0.2, 10, 8),
      new MeshBasicMaterial({
        color: i % 2 === 0 ? (hunter ? EMBER : ICE) : 0xfff6e8,
        toneMapped: false,
      }),
    );
    lamp.name = i % 2 === 0 ? "lamp-a" : "lamp-b";
    const t = i / (lamps - 1);
    lamp.position.set((t - 0.5) * radius * 1.15, lift + depth + 0.22, windowZ);
    root.add(lamp);
  }

  const ring = new Group();
  ring.name = "ring";
  root.add(ring);

  const ghosts = [0, 1, 2].map(() => {
    const g = root.clone();
    g.visible = false;
    return g;
  });
  return { root, ghosts, ring };
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
