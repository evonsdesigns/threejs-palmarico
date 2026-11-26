import * as THREE from "three";
import { buildingSurface, buildingTexture } from "./building-textures";
import { markNightMaterial } from "./building-lights";

type InstanceBatch = {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
  matrices: THREE.Matrix4[];
};

/** A wall plane: (x, z) is a point on the wall, f is the yaw of its outward normal (0 = +z). */
type Face = { x: number; z: number; f: number };

type WindowOptions = { shutters?: boolean; balcony?: boolean; door?: boolean; keystone?: boolean };

// Footprint: 6 x 5 tiles => x in [-12, 12], z in [-10, 10]; entrance faces +z.
export function createPalace(ghost = false): THREE.Group {
  const palace = new THREE.Group();
  const glass = 0x3e5157;
  const lampGlass = 0xf4e3a1;

  // ---------- shared geometries ----------
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const column = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
  const disc = new THREE.CylinderGeometry(0.5, 0.5, 1, 24);
  const octagon = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
  octagon.rotateY(Math.PI / 8);
  const taper = new THREE.CylinderGeometry(0.5, 0.3, 1, 16);
  const waterSheet = new THREE.CylinderGeometry(0.5, 0.5, 1, 20, 1, true);
  const ball = new THREE.SphereGeometry(0.5, 10, 8);
  const dome = new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const pyramid = new THREE.ConeGeometry(0.5 * Math.SQRT2, 1, 4, 1);
  pyramid.rotateY(Math.PI / 4);
  const cone = new THREE.ConeGeometry(0.5, 1, 10);
  const archRing = new THREE.TorusGeometry(0.5, 0.06, 5, 14, Math.PI);
  const domeRib = new THREE.TorusGeometry(1, 0.035, 4, 12, Math.PI / 2);
  const fanlight = new THREE.CircleGeometry(0.5, 12, 0, Math.PI);
  const ring = new THREE.TorusGeometry(0.5, 0.05, 6, 24);
  const lathe = (points: [number, number][], segments: number) =>
    new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
  const baluster = lathe([[0, 0], [0.1, 0], [0.1, 0.1], [0.055, 0.17], [0.11, 0.42], [0.06, 0.7], [0.05, 0.8], [0.09, 0.86], [0.09, 1], [0, 1]], 8);
  const urn = lathe([[0, 0], [0.22, 0], [0.22, 0.08], [0.1, 0.16], [0.12, 0.3], [0.3, 0.48], [0.32, 0.62], [0.22, 0.74], [0.27, 0.8], [0, 0.82]], 10);
  const bell = lathe([[0, 0.62], [0.12, 0.6], [0.18, 0.45], [0.22, 0.15], [0.3, 0.02], [0.28, 0], [0, 0.05]], 12);
  const bowl = lathe([[0, 0], [0.12, 0], [0.12, 0.1], [0.5, 0.18], [0.5, 0.24], [0.44, 0.22], [0, 0.16]], 16);

  const frond = new THREE.BufferGeometry();
  const frondVertices: number[] = [];
  const frondIndices: number[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const width = Math.sin(Math.PI * t) * 0.4;
    const y = Math.sin(Math.PI * t) * 0.2 - t * t * 1.15;
    frondVertices.push(-width, y, t * 2.8, 0, y + 0.12, t * 2.8, width, y, t * 2.8);
    if (i < 8) {
      const a = i * 3;
      frondIndices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
    }
  }
  frond.setAttribute("position", new THREE.Float32BufferAttribute(frondVertices, 3));
  frond.setIndex(frondIndices);
  frond.computeVertexNormals();

  const archShape = new THREE.Shape();
  archShape.moveTo(-0.5, 0);
  archShape.lineTo(-0.5, 1.5);
  archShape.absarc(0, 1.5, 0.5, Math.PI, 0, true);
  archShape.lineTo(0.5, 0);
  archShape.closePath();
  const arch = new THREE.ExtrudeGeometry(archShape, { depth: 0.08, bevelEnabled: false, curveSegments: 10 });

  // Wall panel above an arcade bay with a semicircular opening (spring line at y = 0).
  const spandrelShape = new THREE.Shape();
  spandrelShape.moveTo(-0.5, 0);
  spandrelShape.lineTo(-0.4, 0);
  spandrelShape.absarc(0, 0, 0.4, Math.PI, 0, true);
  spandrelShape.lineTo(0.5, 0);
  spandrelShape.lineTo(0.5, 0.62);
  spandrelShape.lineTo(-0.5, 0.62);
  spandrelShape.closePath();
  const spandrel = new THREE.ExtrudeGeometry(spandrelShape, { depth: 1, bevelEnabled: false, curveSegments: 10 });

  const triShape = new THREE.Shape();
  triShape.moveTo(-0.5, 0);
  triShape.lineTo(0.5, 0);
  triShape.lineTo(0, 1);
  triShape.closePath();
  const prism = new THREE.ExtrudeGeometry(triShape, { depth: 1, bevelEnabled: false });

  const doubleSided = new Set<THREE.BufferGeometry>([frond, fanlight, waterSheet]);

  // ---------- instancing ----------
  const batches = new Map<string, InstanceBatch>();
  const transform = new THREE.Object3D();
  transform.rotation.order = "YXZ";
  const upAxis = new THREE.Vector3(0, 1, 0);

  const batchFor = (geometry: THREE.BufferGeometry, color: number) => {
    const key = `${geometry.uuid}:${color}`;
    let batch = batches.get(key);
    if (!batch) {
      const surface = buildingSurface(color);
      batch = {
        geometry,
        material: new THREE.MeshStandardMaterial({
          color: ghost ? 0x8be4b0 : color,
          roughness: 0.88,
          map: !ghost && surface ? buildingTexture(surface) : null,
          side: doubleSided.has(geometry) ? THREE.DoubleSide : THREE.FrontSide,
          transparent: ghost,
          opacity: ghost ? 0.6 : 1,
        }),
        matrices: [],
      };
      if (!ghost && (color === glass || color === lampGlass)) markNightMaterial(batch.material);
      batches.set(key, batch);
    }
    return batch;
  };
  const add = (
    geometry: THREE.BufferGeometry, color: number,
    x: number, y: number, z: number, sx: number, sy: number, sz: number,
    rx = 0, ry = 0, rz = 0,
  ) => {
    transform.position.set(x, y, z);
    transform.rotation.set(rx, ry, rz);
    transform.scale.set(sx, sy, sz);
    transform.updateMatrix();
    batchFor(geometry, color).matrices.push(transform.matrix.clone());
  };
  const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, rx = 0, ry = 0, rz = 0) =>
    add(cube, color, x, y, z, w, h, d, rx, ry, rz);
  /** Box stretched between two points (thickness t x t2). */
  const beam = (color: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, t: number, t2 = t) => {
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    const h = Math.hypot(dx, dz);
    add(cube, color, (x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2, t, t2, Math.hypot(h, dy), -Math.atan2(dy, h), Math.atan2(dx, dz));
  };
  /** Y-axis geometry (cylinder etc.) stretched between two points. */
  const rod = (geometry: THREE.BufferGeometry, color: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, r: number) => {
    const dir = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
    const len = dir.length();
    transform.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
    transform.quaternion.setFromUnitVectors(upAxis, dir.normalize());
    transform.scale.set(r * 2, len, r * 2);
    transform.updateMatrix();
    batchFor(geometry, color).matrices.push(transform.matrix.clone());
  };

  // ---------- palette ----------
  const stone = 0xece7da;
  const cream = 0xe3ddce;
  const trim = 0xf5efdf;
  const shadow = 0xc3b9a5;
  const quoin = 0xded8c0;
  const base = 0xbab09b;
  const pave = 0xd8cfb9;
  const paveDark = 0xc4b99f;
  const tile = 0xa34e35;
  const tileLight = 0xb35e3f;
  const tileRib = 0x8f4430;
  const tileCap = 0xc87851;
  const muntin = 0xe8e4d6;
  const shutter = 0x65a39b;
  const louver = 0x4f8279;
  const door = 0x755b43;
  const doorDark = 0x5a4332;
  const brass = 0xc9a548;
  const iron = 0x2e3232;
  const voidDark = 0x3a3f3d;
  const grass = 0x6d9a4c;
  const hedge = 0x4c7a3a;
  const hedgeLight = 0x5d8c45;
  const pot = 0xb06a42;
  const water = 0x5fa8c8;
  const waterLight = 0x9fd3e6;
  const trunk = 0x806850;
  const carpet = 0xa8322d;

  // ---------- facade helpers ----------
  const at = (F: Face, u: number, v: number): [number, number] => {
    const c = Math.cos(F.f), s = Math.sin(F.f);
    return [F.x + u * c + v * s, F.z - u * s + v * c];
  };
  const fadd = (F: Face, geometry: THREE.BufferGeometry, color: number, u: number, y: number, v: number, sx: number, sy: number, sz: number, rx = 0, rz = 0) => {
    const [x, z] = at(F, u, v);
    add(geometry, color, x, y, z, sx, sy, sz, rx, F.f, rz);
  };
  const fbox = (F: Face, color: number, u: number, y: number, v: number, w: number, h: number, d: number) =>
    fadd(F, cube, color, u, y, v, w, h, d);

  const shutters = (F: Face, u: number, y: number, w: number, h: number) => {
    for (const s of [-1, 1]) {
      const su = u + s * (w / 2 + 0.12 + w * 0.26);
      fbox(F, shutter, su, y + h / 2, 0.1, w * 0.5, h, 0.05);
      for (let ly = y + 0.18; ly < y + h - 0.1; ly += 0.2) fbox(F, louver, su, ly, 0.135, w * 0.42, 0.04, 0.03);
    }
  };

  const ironBalcony = (F: Face, u: number, y: number, w: number) => {
    const depth = 0.85;
    fbox(F, trim, u, y - 0.1, depth / 2, w + 1.0, 0.16, depth);
    fbox(F, shadow, u, y - 0.22, depth / 2, w + 0.9, 0.08, depth - 0.1);
    for (const s of [-1, 1]) fbox(F, trim, u + s * (w / 2 + 0.3), y - 0.45, 0.28, 0.14, 0.42, 0.5);
    fbox(F, iron, u, y + 0.88, depth - 0.04, w + 0.95, 0.06, 0.06);
    fbox(F, iron, u, y + 0.2, depth - 0.04, w + 0.95, 0.04, 0.04);
    for (let bu = -w / 2 - 0.42; bu <= w / 2 + 0.43; bu += 0.15) fbox(F, iron, u + bu, y + 0.45, depth - 0.04, 0.03, 0.86, 0.03);
    for (const s of [-1, 1]) {
      fbox(F, iron, u + s * (w / 2 + 0.47), y + 0.88, depth / 2, 0.06, 0.06, depth);
      for (let bv = 0.15; bv < depth; bv += 0.15) fbox(F, iron, u + s * (w / 2 + 0.47), y + 0.45, bv, 0.03, 0.86, 0.03);
    }
    // little scroll ornaments on the front rail
    for (const s of [-1, 0, 1]) fadd(F, ring, iron, u + s * w * 0.35, y + 0.55, depth - 0.04, 0.3, 0.3, 0.3);
  };

  /** Arched window or door; (u, y) is the bottom centre of the opening. */
  const archWindow = (F: Face, u: number, y: number, w: number, h: number, o: WindowOptions = {}) => {
    const spring = y + h - w / 2;
    fadd(F, arch, o.door ? door : glass, u, y, 0, w, h / 2, 1);
    for (const s of [-1, 1]) fbox(F, trim, u + s * (w / 2 + 0.07), (y + spring) / 2, 0.06, 0.14, spring - y, 0.16);
    fadd(F, archRing, trim, u, spring, 0.07, w + 0.14, w + 0.14, 1.6);
    if (o.keystone !== false) fbox(F, trim, u, spring + w / 2 + 0.1, 0.1, 0.22, 0.32, 0.18);
    if (o.door) {
      fadd(F, fanlight, glass, u, spring, 0.09, w * 0.86, w * 0.86, 1);
      fbox(F, trim, u, spring, 0.1, w, 0.1, 0.06);
      fbox(F, doorDark, u, (y + spring) / 2, 0.09, 0.05, spring - y - 0.1, 0.04);
      for (const s of [-1, 1]) {
        for (const py of [0.3, 0.62]) fbox(F, doorDark, u + s * w / 4, y + (spring - y) * py, 0.1, w * 0.32, (spring - y) * 0.24, 0.03);
        fbox(F, brass, u + s * 0.1, y + (spring - y) * 0.48, 0.13, 0.06, 0.06, 0.06);
      }
      fbox(F, trim, u, y + 0.04, 0.2, w + 0.5, 0.08, 0.4);
    } else {
      fbox(F, muntin, u, (y + spring + w / 2) / 2, 0.09, 0.05, h - 0.06, 0.03);
      for (const t of [0.33, 0.62]) fbox(F, muntin, u, y + (spring - y) * t, 0.09, w, 0.05, 0.03);
      fbox(F, muntin, u, spring, 0.09, w, 0.05, 0.03);
      fbox(F, trim, u, y - 0.07, 0.14, w + 0.45, 0.14, 0.32);
      fbox(F, shadow, u, y - 0.2, 0.12, w + 0.25, 0.12, 0.22);
    }
    if (o.shutters) shutters(F, u, y, w, spring - y + w * 0.2);
    if (o.balcony) ironBalcony(F, u, y, w);
  };

  /** Rectangular window with hood moulding and an iron reja (grille). */
  const rectWindow = (F: Face, u: number, y: number, w: number, h: number, grille = true, shuttered = false) => {
    fbox(F, glass, u, y + h / 2, 0.02, w, h, 0.06);
    for (const s of [-1, 1]) fbox(F, trim, u + s * (w / 2 + 0.08), y + h / 2, 0.07, 0.16, h + 0.16, 0.14);
    fbox(F, muntin, u, y + h / 2, 0.07, 0.05, h, 0.03);
    fbox(F, muntin, u, y + h * 0.55, 0.07, w, 0.05, 0.03);
    fbox(F, trim, u, y + h + 0.12, 0.1, w + 0.5, 0.18, 0.22);
    fbox(F, trim, u, y + h + 0.26, 0.15, w + 0.7, 0.1, 0.32);
    fbox(F, trim, u, y - 0.07, 0.14, w + 0.45, 0.14, 0.3);
    if (grille) {
      for (let gu = -w / 2 + 0.1; gu <= w / 2 - 0.09; gu += 0.16) fbox(F, iron, u + gu, y + h / 2, 0.22, 0.035, h, 0.035);
      for (const gy of [0.15, h * 0.5, h - 0.12]) fbox(F, iron, u, y + gy, 0.22, w, 0.04, 0.04);
    }
    if (shuttered) shutters(F, u, y, w, h);
  };

  const pilaster = (F: Face, u: number, y0: number, y1: number, w = 0.42) => {
    fbox(F, trim, u, (y0 + y1) / 2, 0.06, w, y1 - y0, 0.14);
    fbox(F, trim, u, y0 + 0.15, 0.09, w + 0.16, 0.3, 0.2);
    fbox(F, trim, u, y1 - 0.14, 0.1, w + 0.2, 0.2, 0.22);
    fbox(F, trim, u, y1 - 0.03, 0.12, w + 0.3, 0.06, 0.26);
  };

  const oculus = (F: Face, u: number, y: number, r: number) => {
    fadd(F, disc, glass, u, y, 0.02, r * 2, 0.06, r * 2, Math.PI / 2);
    fadd(F, ring, trim, u, y, 0.06, r * 2.2, r * 2.2, 1.6);
    fbox(F, muntin, u, y, 0.07, 0.04, r * 2, 0.03);
    fbox(F, muntin, u, y, 0.07, r * 2, 0.04, 0.03);
  };

  /** Rectangular block with plastered texture. */
  const block = (color: number, x0: number, x1: number, z0: number, z1: number, y0: number, y1: number) =>
    box(color, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, x1 - x0, y1 - y0, z1 - z0);

  const stringCourse = (x0: number, x1: number, z0: number, z1: number, y: number) => {
    block(trim, x0 - 0.12, x1 + 0.12, z0 - 0.12, z1 + 0.12, y - 0.1, y + 0.1);
    block(shadow, x0 - 0.06, x1 + 0.06, z0 - 0.06, z1 + 0.06, y - 0.18, y - 0.1);
  };

  /** Classical entablature on a rectangular block; returns its top height. */
  const entablature = (x0: number, x1: number, z0: number, z1: number, y: number, dentilSides = [true, true, true, true]) => {
    block(trim, x0 - 0.06, x1 + 0.06, z0 - 0.06, z1 + 0.06, y, y + 0.24);
    block(cream, x0 - 0.02, x1 + 0.02, z0 - 0.02, z1 + 0.02, y + 0.24, y + 0.5);
    block(trim, x0 - 0.2, x1 + 0.2, z0 - 0.2, z1 + 0.2, y + 0.5, y + 0.62);
    block(trim, x0 - 0.32, x1 + 0.32, z0 - 0.32, z1 + 0.32, y + 0.62, y + 0.77);
    const [front, right, back, left] = dentilSides;
    for (let x = x0 + 0.1; x <= x1 - 0.1; x += 0.26) {
      if (front) box(trim, x, y + 0.44, z1 + 0.08, 0.12, 0.12, 0.12);
      if (back) box(trim, x, y + 0.44, z0 - 0.08, 0.12, 0.12, 0.12);
    }
    for (let z = z0 + 0.1; z <= z1 - 0.1; z += 0.26) {
      if (right) box(trim, x1 + 0.08, y + 0.44, z, 0.12, 0.12, 0.12);
      if (left) box(trim, x0 - 0.08, y + 0.44, z, 0.12, 0.12, 0.12);
    }
    return y + 0.77;
  };

  /** Alternating long/short quoin stones wrapping an outside corner. sx/sz give the corner's outward signs. */
  const quoins = (x: number, z: number, sx: number, sz: number, y0: number, y1: number) => {
    let i = 0;
    for (let y = y0 + 0.25; y < y1 - 0.2; y += 0.5, i++) {
      const a = i % 2 ? 0.55 : 0.9;
      const b = i % 2 ? 0.9 : 0.55;
      box(quoin, x - sx * (a / 2 - 0.04), y, z + sz * 0.02 - sz * 0.1, a, 0.42, 0.24);
      box(quoin, x + sx * 0.02 - sx * 0.1, y, z - sz * (b / 2 - 0.04), 0.24, 0.42, b);
    }
  };

  /** Stone balustrade along a straight horizontal line from (x1,z1) to (x2,z2) standing on height y. */
  const balustrade = (x1: number, z1: number, x2: number, z2: number, y: number, urns = false) => {
    const dx = x2 - x1, dz = z2 - z1;
    const length = Math.hypot(dx, dz);
    const ry = Math.atan2(-dz, dx);
    const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
    add(cube, trim, mx, y + 0.07, mz, length, 0.14, 0.26, 0, ry);
    add(cube, trim, mx, y + 0.76, mz, length + 0.08, 0.1, 0.3, 0, ry);
    add(cube, shadow, mx, y + 0.68, mz, length, 0.06, 0.22, 0, ry);
    const posts = Math.max(1, Math.round(length / 2.6));
    for (let p = 0; p <= posts; p++) {
      const t = p / posts;
      const px = x1 + dx * t, pz = z1 + dz * t;
      add(cube, trim, px, y + 0.4, pz, 0.3, 0.8, 0.3, 0, ry);
      add(cube, trim, px, y + 0.84, pz, 0.38, 0.08, 0.38, 0, ry);
      if (urns && (p === 0 || p === posts)) add(urn, trim, px, y + 0.88, pz, 0.8, 0.8, 0.8);
      else add(ball, trim, px, y + 0.98, pz, 0.22, 0.22, 0.22);
      if (p === posts) break;
      const segment = length / posts;
      const count = Math.max(1, Math.floor((segment - 0.3) / 0.27));
      for (let b = 0; b < count; b++) {
        const tb = t + ((b + 0.5) / count) * (1 - 0.3 / segment) / posts + 0.15 / length;
        add(baluster, trim, x1 + dx * tb, y + 0.14, z1 + dz * tb, 1, 0.54, 1);
      }
    }
  };

  /** Hipped terracotta roof; (W, D) are the half extents including overhang. */
  const hipRoof = (cx: number, cz: number, W: number, D: number, y: number, rise: number) => {
    const rot = W >= D ? 0 : Math.PI / 2;
    const a = Math.max(W, D), b = Math.min(W, D), R = a - b;
    const c = Math.cos(rot), s = Math.sin(rot);
    const world = (lx: number, ly: number, lz: number): [number, number, number] =>
      [cx + lx * c + lz * s, y + ly, cz - lx * s + lz * c];
    type V = [number, number, number];
    const A: V = [-a, 0, b], B: V = [a, 0, b], C: V = [a, 0, -b], E: V = [-a, 0, -b], P: V = [-R, rise, 0], Q: V = [R, rise, 0];
    const slope = Math.hypot(b, rise) / b;
    const positions: number[] = [];
    const uvs: number[] = [];
    const tri = (verts: V[], sideways: boolean) => {
      for (const v of verts) {
        positions.push(...v);
        uvs.push((sideways ? v[2] : v[0]) / 4, (sideways ? b - Math.abs(v[0]) + R : b - Math.abs(v[2])) * slope / 4);
      }
    };
    tri([A, B, Q], false); tri([A, Q, P], false); tri([C, E, P], false); tri([C, P, Q], false);
    tri([B, C, Q], true); tri([E, A, P], true);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    add(geometry, tile, cx, y, cz, 1, 1, 1, 0, rot);
    box(trim, cx, y - 0.06, cz, (rot ? b : a) * 2, 0.12, (rot ? a : b) * 2);
    box(tileRib, cx, y + 0.02, cz, (rot ? b : a) * 2 + 0.08, 0.08, (rot ? a : b) * 2 + 0.08);
    const lift = 0.05;
    const line = (p: V, q: V, t: number, color = tileRib) => {
      const p1 = world(p[0], p[1] + lift, p[2]);
      const p2 = world(q[0], q[1] + lift, q[2]);
      beam(color, ...p1, ...p2, t);
    };
    const h = (dist: number) => rise * (1 - dist / b);
    // barrel tile ribs running down the long slopes
    for (let u = -a + 0.15; u <= a - 0.15; u += 0.3) {
      const v0 = Math.max(0, Math.abs(u) - R) + 0.05;
      for (const sz of [-1, 1]) line([u, h(v0), sz * v0], [u, 0, sz * b], 0.08);
    }
    // ribs on the hip ends
    for (let t = -b + 0.15; t <= b - 0.15; t += 0.3) {
      const x0 = R + Math.abs(t) + 0.05;
      for (const sx of [-1, 1]) line([sx * x0, h(Math.abs(t) + 0.05), t], [sx * a, 0, t], 0.08);
    }
    // tile courses
    for (let d = 0.5; d < b; d += 0.55) {
      const hy = h(b - d);
      const half = R + (b - d);
      for (const sz of [-1, 1]) line([-half, hy, sz * (b - d)], [half, hy, sz * (b - d)], 0.04, 0x7f3b2a);
      for (const sx of [-1, 1]) line([sx * (R + b - d), hy, -(b - d)], [sx * (R + b - d), hy, b - d], 0.04, 0x7f3b2a);
    }
    for (const [sx, sz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) line([sx * a, 0, sz * b], [sx * R, rise, 0], 0.18, tileCap);
    if (R > 0.01) line([-R, rise, 0], [R, rise, 0], 0.2, tileCap);
    return world(0, rise, 0);
  };

  const lamp = (x: number, y: number, z: number, height: number) => {
    add(column, iron, x, y + 0.15, z, 0.3, 0.3, 0.3);
    add(column, iron, x, y + height / 2, z, 0.09, height, 0.09);
    box(iron, x, y + height - 0.05, z, 0.34, 0.06, 0.34);
    box(lampGlass, x, y + height + 0.18, z, 0.26, 0.34, 0.26);
    add(pyramid, iron, x, y + height + 0.45, z, 0.38, 0.2, 0.38);
    add(ball, iron, x, y + height + 0.6, z, 0.08, 0.08, 0.08);
  };

  const pottedPlant = (x: number, y: number, z: number, size = 1) => {
    add(urn, pot, x, y, z, size, size * 0.8, size);
    add(ball, hedgeLight, x, y + 0.72 * size, z, 0.6 * size, 0.5 * size, 0.6 * size);
    add(ball, 0xd8405a, x + 0.1 * size, y + 0.9 * size, z + 0.12 * size, 0.14 * size, 0.14 * size, 0.14 * size);
  };

  const palm = (x: number, z: number, height: number, s: number, lean: number, leanDir: number) => {
    const segments = 8;
    let px = x, pz = z, py = 0.05;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const nx = x + Math.sin(leanDir) * lean * t * t;
      const nz = z + Math.cos(leanDir) * lean * t * t;
      const ny = height * t;
      rod(column, trunk, px, py, pz, nx, ny, nz, 0.24 - t * 0.07);
      add(column, 0x6c5642, nx, ny - 0.05, nz, 0.46 - t * 0.12, 0.1, 0.46 - t * 0.12);
      px = nx; pz = nz; py = ny;
    }
    for (let i = 0; i < 11; i++) {
      const tilt = i % 3 === 0 ? -0.35 : i % 3 === 1 ? 0.05 : -0.12;
      add(frond, i % 2 ? 0x3f7544 : 0x538449, px, py, pz, s, s, s, tilt, i * Math.PI * 2 / 11 + 0.2);
    }
    for (let i = 0; i < 4; i++) {
      const ang = i * Math.PI / 2 + 0.4;
      add(ball, 0x6b5a2e, px + Math.sin(ang) * 0.2, py - 0.25, pz + Math.cos(ang) * 0.2, 0.24, 0.26, 0.24);
    }
  };

  const flag = (x: number, y: number, z: number, w: number, h: number) => {
    const stripe = h / 3;
    box(0x2f8a4a, x + w / 2, y - stripe / 2, z, w, stripe, 0.04);
    box(0xf5f2ea, x + w / 2, y - stripe * 1.5, z, w, stripe, 0.04);
    box(0xc23b32, x + w / 2, y - stripe * 2.5, z, w, stripe, 0.04);
    add(prism, 0x2b5fa8, x, y - h / 2, z - 0.025, h, w * 0.4, 0.05, 0, 0, -Math.PI / 2);
    add(ball, 0xf2d04b, x + w * 0.14, y - h / 2, z, 0.18, 0.18, 0.08);
  };

  const flagpole = (x: number, z: number, y: number, height: number) => {
    add(column, trim, x, y + height / 2, z, 0.14, height, 0.14);
    add(ball, brass, x, y + height + 0.1, z, 0.22, 0.22, 0.22);
    flag(x + 0.07, y + height - 0.15, z, 1.7, 1.05);
  };

  // ======================================================================
  // GROUNDS
  // ======================================================================
  box(grass, 0, 0.025, 0, 24, 0.05, 20);
  // front plaza with paving joints
  block(pave, -4.2, 4.2, 5.4, 9.95, 0.04, 0.09);
  for (let x = -4.2; x <= 4.21; x += 0.7) box(paveDark, x, 0.092, 7.675, 0.03, 0.01, 4.55);
  for (let z = 5.6; z <= 9.9; z += 0.7) box(paveDark, 0, 0.092, z, 8.4, 0.01, 0.03);
  // walk along the podium front and the side walks
  block(pave, -11.6, 11.6, 5.4, 6.3, 0.04, 0.085);
  for (const sx of [-1, 1]) {
    block(paveDark, sx > 0 ? 4.2 : -4.4, sx > 0 ? 4.4 : -4.2, 5.4, 9.95, 0.04, 0.1);
  }

  // fountain
  const fz = 8.35;
  add(disc, pave, 0, 0.1, fz, 3.2, 0.04, 3.2);
  add(disc, paveDark, 0, 0.11, fz, 2.5, 0.04, 2.5);
  add(disc, stone, 0, 0.3, fz, 2.1, 0.5, 2.1);
  add(disc, trim, 0, 0.58, fz, 2.24, 0.08, 2.24);
  add(disc, water, 0, 0.5, fz, 1.84, 0.06, 1.84);
  add(column, stone, 0, 0.95, fz, 0.32, 0.9, 0.32);
  add(bowl, trim, 0, 1.25, fz, 2.0, 1.2, 2.0);
  add(disc, water, 0, 1.5, fz, 0.86, 0.03, 0.86);
  add(waterSheet, waterLight, 0, 1.0, fz, 0.94, 0.95, 0.94);
  add(column, stone, 0, 1.78, fz, 0.18, 0.55, 0.18);
  add(bowl, trim, 0, 1.95, fz, 1.1, 0.8, 1.1);
  add(waterSheet, waterLight, 0, 1.75, fz, 0.52, 0.45, 0.52);
  add(column, waterLight, 0, 2.35, fz, 0.07, 0.6, 0.07);
  add(ball, waterLight, 0, 2.68, fz, 0.2, 0.16, 0.2);
  for (let i = 0; i < 4; i++) {
    const ang = i * Math.PI / 2 + Math.PI / 4;
    const sx = Math.sin(ang), sz = Math.cos(ang);
    add(ball, stone, sx * 0.98, 0.7, fz + sz * 0.98, 0.22, 0.22, 0.22);
    beam(waterLight, sx * 0.95, 0.72, fz + sz * 0.95, sx * 0.55, 0.52, fz + sz * 0.55, 0.05);
  }

  // parterre gardens either side of the plaza
  for (const sx of [-1, 1]) {
    const x0 = 4.6, x1 = 11.2, z0 = 6.6, z1 = 9.3;
    const cx = sx * (x0 + x1) / 2;
    box(hedge, cx, 0.22, z0, x1 - x0, 0.4, 0.3);
    box(hedge, cx, 0.22, z1, x1 - x0, 0.4, 0.3);
    box(hedge, sx * x0, 0.22, (z0 + z1) / 2, 0.3, 0.4, z1 - z0);
    box(hedge, sx * x1, 0.22, (z0 + z1) / 2, 0.3, 0.4, z1 - z0);
    // gravel cross paths
    box(0xe2d9c0, cx, 0.06, (z0 + z1) / 2, x1 - x0 - 0.3, 0.03, 0.5);
    box(0xe2d9c0, cx, 0.06, (z0 + z1) / 2, 0.5, 0.03, z1 - z0 - 0.3);
    const flowers = [0xd8405a, 0xf2c14e, 0xe86fa4, 0xf6f1e4];
    let k = 0;
    for (const qx of [-1, 1]) {
      for (const qz of [-1, 1]) {
        const bx = cx + qx * 1.7, bz = (z0 + z1) / 2 + qz * 0.68;
        box(0x756345, bx, 0.07, bz, 2.6, 0.06, 0.95);
        for (let fx = -1.1; fx <= 1.11; fx += 0.275) {
          for (let fzz = -0.3; fzz <= 0.31; fzz += 0.3) {
            box(flowers[(k++) % 4], bx + fx, 0.16, bz + fzz, 0.18, 0.14, 0.18);
          }
        }
      }
    }
    add(urn, stone, cx, 0.05, (z0 + z1) / 2, 0.9, 0.9, 0.9);
    add(ball, hedgeLight, cx, 0.85, (z0 + z1) / 2, 0.5, 0.4, 0.5);
    // benches facing the plaza
    for (const bz of [7.2, 8.7]) {
      const bx = sx * 4.0;
      box(stone, bx, 0.45, bz, 0.5, 0.1, 1.3);
      for (const lz of [-0.5, 0.5]) box(stone, bx, 0.22, bz + lz, 0.4, 0.4, 0.14);
    }
    palm(sx * 7.6, 7.7, 6.6, 0.7, 0.6, -sx * (Math.PI / 2 + 0.3));
    palm(sx * 10.2, 7.4, 5.4, 0.55, 0.4, -sx * (Math.PI / 2 + 0.3));
    // hedge strips along podium sides (between podium and fence)
    for (let z = -7.8; z <= 4.6; z += 1.4) add(cone, 0x3f6b35, sx * 11.82, 0.05 + 0.9, z, 0.32, 1.8, 0.32);
  }

  // perimeter fence (front and sides of forecourt)
  const fenceZ = 9.62;
  const pier = (x: number, z: number, size: number, height: number, topper: "urn" | "lamp" | "ball") => {
    box(stone, x, height / 2, z, size, height, size);
    box(trim, x, height + 0.05, z, size + 0.1, 0.1, size + 0.1);
    box(trim, x, 0.12, z, size + 0.08, 0.24, size + 0.08);
    if (topper === "urn") add(urn, trim, x, height + 0.1, z, 0.75, 0.75, 0.75);
    else if (topper === "lamp") lamp(x, height + 0.1, z, 0.5);
    else add(ball, trim, x, height + 0.3, z, 0.36, 0.36, 0.36);
  };
  const fence = (x1: number, z1: number, x2: number, z2: number) => {
    const dx = x2 - x1, dz = z2 - z1;
    const length = Math.hypot(dx, dz);
    const ry = Math.atan2(-dz, dx);
    add(cube, stone, (x1 + x2) / 2, 0.3, (z1 + z2) / 2, length, 0.6, 0.3, 0, ry);
    add(cube, trim, (x1 + x2) / 2, 0.63, (z1 + z2) / 2, length, 0.06, 0.36, 0, ry);
    add(cube, iron, (x1 + x2) / 2, 1.38, (z1 + z2) / 2, length, 0.05, 0.05, 0, ry);
    for (let d = 0.12; d < length; d += 0.18) {
      const px = x1 + dx * d / length, pz = z1 + dz * d / length;
      add(cube, iron, px, 1.02, pz, 0.03, 0.78, 0.03);
      add(cone, iron, px, 1.48, pz, 0.07, 0.14, 0.07);
    }
  };
  for (const sx of [-1, 1]) {
    const piers = [2.05, 5.5, 8.6, 11.65];
    for (let i = 1; i < piers.length; i++) fence(sx * (piers[i - 1] + 0.3), fenceZ, sx * (piers[i] - 0.25), fenceZ);
    for (let i = 1; i < piers.length; i++) pier(sx * piers[i], fenceZ, 0.5, 1.5, "ball");
    fence(sx * 11.65, fenceZ - 0.25, sx * 11.65, 6.55);
    pier(sx * 11.65, 6.3, 0.5, 1.5, "urn");
    // gate piers and open iron gate leaves
    pier(sx * 2.05, fenceZ, 0.62, 2.3, "lamp");
    const hinge = sx * 1.7;
    const leafAngle = sx > 0 ? -1.1 : 1.1;
    const lx = hinge - sx * Math.cos(1.1) * 0.85, lz = fenceZ - Math.sin(1.1) * 0.85;
    add(cube, iron, lx, 1.1, lz, 1.7, 0.06, 0.06, 0, leafAngle);
    add(cube, iron, lx, 0.25, lz, 1.7, 0.06, 0.06, 0, leafAngle);
    add(cube, iron, lx, 1.95, lz, 1.7, 0.06, 0.06, 0, leafAngle);
    for (let d = 0.1; d < 1.7; d += 0.17) {
      const gx = hinge - sx * Math.cos(1.1) * d, gz = fenceZ - Math.sin(1.1) * d;
      add(cube, iron, gx, 1.15, gz, 0.035, 1.9, 0.035);
      add(cone, brass, gx, 2.15, gz, 0.07, 0.16, 0.07);
    }
    add(ring, iron, lx, 1.55, lz, 0.6, 0.6, 0.6, 0, leafAngle);

    // guard box with sentry
    const gx = sx * 3.15, gz = 8.85;
    box(base, gx, 0.08, gz, 1.4, 0.16, 1.4);
    box(stone, gx, 1.38, gz, 1.15, 2.45, 1.15);
    for (const qx of [-1, 1]) for (const qz of [-1, 1]) box(trim, gx + qx * 0.55, 1.38, gz + qz * 0.55, 0.14, 2.45, 0.14);
    box(trim, gx, 2.68, gz, 1.35, 0.16, 1.35);
    add(pyramid, tileLight, gx, 3.12, gz, 1.5, 0.75, 1.5);
    add(ball, brass, gx, 3.55, gz, 0.14, 0.14, 0.14);
    const GF: Face = { x: gx, z: gz + 0.575, f: 0 };
    fadd(GF, arch, voidDark, 0, 0.16, 0, 0.66, 0.95, 1);
    fadd(GF, archRing, trim, 0, 1.73, 0.04, 0.8, 0.8, 1.4);
    for (let st = 0; st < 3; st++) box(st % 2 ? 0xc23b32 : trim, gx, 2.36 - st * 0.08, gz + 0.6, 1.16, 0.08, 0.04);
    const SF: Face = { x: gx + sx * 0.575, z: gz, f: sx * Math.PI / 2 };
    rectWindow(SF, 0, 1.3, 0.45, 0.6, true);
    // sentry standing beside the box
    const px = gx - sx * 0.95, pz = gz + 0.25;
    for (const lx2 of [-0.12, 0.12]) box(0x2f3a2e, px + lx2, 0.5, pz, 0.16, 0.9, 0.18);
    box(0x5b6b3a, px, 1.32, pz, 0.5, 0.8, 0.28);
    box(0x2b2b2b, px, 0.98, pz, 0.52, 0.08, 0.3);
    for (const ax of [-0.31, 0.31]) box(0x5b6b3a, px + ax, 1.3, pz, 0.13, 0.7, 0.16);
    box(0xc89870, px, 1.88, pz, 0.28, 0.3, 0.26);
    box(0x5b6b3a, px, 2.08, pz, 0.34, 0.12, 0.34);
    box(0x2b2b2b, px, 2.03, pz + 0.16, 0.3, 0.03, 0.12);
    beam(0x3b3226, px + sx * 0.32, 0.9, pz + 0.12, px + sx * 0.34, 2.2, pz + 0.12, 0.06);
  }

  // plaza lamps and flags
  for (const sx of [-1, 1]) {
    lamp(sx * 1.6, 0.09, 7.0, 2.6);
    lamp(sx * 3.95, 0.09, 6.55, 2.6);
    box(stone, sx * 2.9, 0.3, 7.6, 0.7, 0.45, 0.7);
    box(trim, sx * 2.9, 0.55, 7.6, 0.8, 0.08, 0.8);
  }
  flagpole(-2.9, 7.6, 0.6, 6.0);
  flagpole(2.9, 7.6, 0.6, 6.0);

  // rear garden: hedge, cypress, rear wall
  box(hedge, -6.5, 0.4, -9.05, 9.0, 0.7, 0.55);
  box(hedge, 6.5, 0.4, -9.05, 9.0, 0.7, 0.55);
  for (const x of [-11.2, -9.2, -7.2, -5.2, -3.2, 3.2, 5.2, 7.2, 9.2, 11.2]) add(cone, 0x3f6b35, x, 1.35, -9.05, 0.7, 2.6, 0.7);
  for (const sx of [-1, 1]) {
    block(stone, sx > 0 ? 1.6 : -11.8, sx > 0 ? 11.8 : -1.6, -9.85, -9.6, 0, 0.9);
    block(trim, sx > 0 ? 1.55 : -11.85, sx > 0 ? 11.85 : -1.55, -9.9, -9.55, 0.9, 0.98);
    for (const x of [1.6, 6.7, 11.6]) pier(sx * x, -9.72, 0.38, 1.25, "ball");
  }
  block(pave, -1.6, 1.6, -9.95, -8.4, 0.04, 0.09);

  // ======================================================================
  // PODIUM / TERRACE
  // ======================================================================
  const floor = 0.9;
  block(base, -11.6, 11.6, -8.4, 5.4, 0, floor);
  block(shadow, -11.7, 11.7, -8.5, 5.5, 0, 0.16);
  block(trim, -11.68, 11.68, -8.48, 5.48, floor - 0.08, floor + 0.04);
  block(pave, -11.5, 11.5, -8.3, 5.3, floor, floor + 0.05);
  // rusticated joints and basement vents on the visible faces
  for (const y of [0.35, 0.6]) {
    box(0xa89d86, 0, y, 5.41, 23.2, 0.03, 0.02);
    box(0xa89d86, 11.61, y, -1.5, 0.02, 0.03, 13.8);
  }
  for (const x of [-10.2, -8.2, -6.2, -4.6, 4.6, 6.2, 8.2, 10.2]) {
    box(voidDark, x, 0.45, 5.41, 0.6, 0.3, 0.02);
    for (let b = -0.2; b <= 0.21; b += 0.1) box(iron, x + b, 0.45, 5.43, 0.03, 0.3, 0.03);
  }
  for (let z = -7.4; z <= 4.5; z += 1.7) {
    box(voidDark, 11.61, 0.45, z, 0.02, 0.3, 0.6);
    for (let b = -0.2; b <= 0.21; b += 0.1) box(iron, 11.63, 0.45, z + b, 0.03, 0.3, 0.03);
  }
  // terrace balustrades
  balustrade(-11.45, 5.25, -3.65, 5.25, floor, true);
  balustrade(3.65, 5.25, 11.45, 5.25, floor, true);
  balustrade(11.45, 5.25, 11.45, -8.25, floor);
  balustrade(-11.45, 5.25, -11.45, -8.25, floor);
  balustrade(-11.45, -8.25, -1.7, -8.25, floor);
  balustrade(1.7, -8.25, 11.45, -8.25, floor);

  // grand stairs with red carpet
  for (let k = 0; k < 5; k++) {
    const top = floor - 0.15 * (k + 1);
    block(stone, -3.3, 3.3, 5.4, 5.4 + 0.3 * (k + 1), 0, top);
    block(trim, -3.3, 3.3, 5.36 + 0.3 * (k + 1), 5.42 + 0.3 * (k + 1), top - 0.04, top + 0.01);
    block(carpet, -0.85, 0.85, 5.4 + 0.3 * k, 5.43 + 0.3 * (k + 1), top + 0.15 - 0.15, top + 0.17);
  }
  block(carpet, -0.85, 0.85, 1.2, 5.45, floor, floor + 0.07);
  block(brass, -0.9, 0.9, 1.2, 5.45, floor + 0.02, floor + 0.05);
  for (const sx of [-1, 1]) {
    const x = sx * 3.48;
    for (let k = 0; k < 5; k++) block(stone, x - 0.18, x + 0.18, 5.4 + 0.3 * k, 5.4 + 0.3 * (k + 1), 0, floor + 0.3 - 0.15 * k);
    beam(trim, x, floor + 0.35, 5.4, x, 0.6, 6.7, 0.44, 0.1);
    box(stone, x, 0.55, 6.85, 0.6, 1.1, 0.6);
    box(trim, x, 1.12, 6.85, 0.72, 0.1, 0.72);
    box(trim, x, 0.08, 6.85, 0.7, 0.16, 0.7);
    add(urn, trim, x, 1.17, 6.85, 0.85, 0.85, 0.85);
    add(ball, 0xd8405a, x, 1.85, 6.85, 0.5, 0.35, 0.5);
    add(ball, hedgeLight, x, 1.75, 6.85, 0.6, 0.35, 0.6);
  }
  // rear stairs
  for (let k = 0; k < 5; k++) block(stone, -1.6, 1.6, -8.4 - 0.25 * (k + 1), -8.4, 0, floor - 0.15 * (k + 1));

  // potted plants along the terrace
  for (const x of [-10.6, -7.6, 7.6, 10.6]) pottedPlant(x, floor, 4.95, 0.9);
  for (const z of [-6.5, -3.5, -0.5]) pottedPlant(11.25, floor, z, 0.8);

  // ======================================================================
  // MAIN BLOCK (x -7..7, z -7.6..2)
  // ======================================================================
  const mx0 = -7, mx1 = 7, mz0 = -7.6, mz1 = 2.0;
  const storey2 = 4.75, wallTop = 8.5;
  block(stone, mx0, mx1, mz0, mz1, floor, wallTop);
  stringCourse(mx0, mx1, mz0, mz1, storey2);
  const mainTop = entablature(mx0, mx1, mz0, mz1, wallTop, [true, false, true, false]);
  // back facade (-z)
  {
    const F: Face = { x: 0, z: mz0, f: Math.PI };
    for (const u of [-5.6, -3.6, -1.6, 1.6, 3.6, 5.6]) {
      rectWindow(F, u, 1.6, 0.95, 2.0, true, true);
      archWindow(F, u, 5.25, 0.95, 2.4, { shutters: true });
    }
    for (const u of [-6.6, -4.6, -2.6, 2.6, 4.6, 6.6]) pilaster(F, u, storey2 + 0.1, wallTop, 0.34);
    archWindow(F, 0, floor, 1.6, 3.0, { door: true });
    ironBalcony(F, 0, 5.25, 1.2);
    archWindow(F, 0, 5.25, 1.2, 2.6);
    block(trim, -1.5, 1.5, mz0 - 1.0, mz0, floor + 3.3, floor + 3.55);
    for (const sx of [-1, 1]) pillar(sx * 1.3, floor, mz0 - 0.8, 3.3, 0.16);
  }
  // front facade behind the arcades (z = 2.0)
  {
    const F: Face = { x: 0, z: mz1, f: 0 };
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const u = sx * (3.2 + 1.233 * (i + 0.5));
        archWindow(F, u, floor, 0.85, 2.3, { door: true, keystone: false });
        archWindow(F, u, storey2 + 0.1, 0.8, 2.6, { door: true, shutters: true });
      }
      for (let i = 0; i <= 3; i++) pilaster(F, sx * (3.2 + 1.233 * i), storey2 + 0.1, wallTop, 0.28);
      // terrace furniture: planters and chairs
      for (const u of [3.8, 6.2]) pottedPlant(sx * u, storey2, 3.55, 0.6);
    }
  }
  // main hipped roof with chimneys
  hipRoof(0, (mz0 + mz1) / 2, (mx1 - mx0) / 2 + 0.45, (mz1 - mz0) / 2 + 0.45, mainTop - 0.02, 2.6);
  for (const [x, z] of [[-5.3, -6.0], [5.3, -6.0], [-5.3, 0.4], [5.3, 0.4]]) {
    box(stone, x, mainTop + 1.3, z, 0.7, 2.4, 1.0);
    box(trim, x, mainTop + 2.55, z, 0.9, 0.12, 1.2);
    for (const dz of [-0.25, 0.25]) box(voidDark, x, mainTop + 2.63, z + dz, 0.3, 0.06, 0.3);
    add(prism, tileLight, x, mainTop + 2.6, z - 0.55, 0.95, 0.35, 1.1);
  }

  // ======================================================================
  // CENTRAL PAVILION + PORTICO
  // ======================================================================
  const px0 = -3.2, px1 = 3.2, pz1 = 4.3, pavWall = 9.4;
  block(stone, px0, px1, mz1 - 0.2, pz1, floor, pavWall);
  stringCourse(px0, px1, mz1 - 0.1, pz1, storey2);
  const pavTop = entablature(px0, px1, mz1 - 0.1, pz1, pavWall, [true, true, false, true]);
  quoins(px1, pz1, 1, 1, floor, pavWall);
  quoins(px0, pz1, -1, 1, floor, pavWall);
  {
    const F: Face = { x: 0, z: pz1, f: 0 };
    // grand entrance
    for (const s of [-1, 1]) {
      fbox(F, trim, s * 1.2, floor + 1.7, 0.08, 0.3, 3.4, 0.2);
      fbox(F, cream, s * 1.2, floor + 0.2, 0.12, 0.42, 0.4, 0.26);
    }
    archWindow(F, 0, floor, 1.9, 3.4, { door: true });
    fbox(F, trim, 0, floor + 3.65, 0.12, 2.8, 0.2, 0.3);
    // coat of arms above the door
    fadd(F, disc, 0xf2d04b, 0, floor + 3.0 + 1.1, 0.1, 0.55, 0.05, 0.55, Math.PI / 2);
    // niches with statues between the paired columns
    for (const s of [-1, 1]) {
      fadd(F, arch, voidDark, s * 2.2, floor + 0.5, 0, 0.62, 1.15, 1);
      fadd(F, archRing, trim, s * 2.2, floor + 2.49, 0.05, 0.76, 0.76, 1.4);
      fbox(F, trim, s * 2.2, floor + 0.45, 0.18, 0.75, 0.12, 0.3);
      fbox(F, trim, s * 2.2, floor + 1.05, 0.12, 0.32, 1.1, 0.24);
      fadd(F, ball, trim, s * 2.2, floor + 1.8, 0.12, 0.3, 0.36, 0.3);
      fadd(F, urn, trim, s * 2.2, floor + 1.55, 0.12, 0.5, 0.4, 0.5);
    }
    // upper floor
    archWindow(F, 0, storey2 + 0.6, 1.3, 2.7, { door: true });
    fbox(F, trim, 0, storey2 + 3.6, 0.12, 2.0, 0.16, 0.3);
    for (const s of [-1, 1]) {
      beam(trim, s * 1.0, storey2 + 3.68, pz1 + 0.15, s * 0.35, storey2 + 4.05, pz1 + 0.15, 0.16, 0.24);
      archWindow(F, s * 2.2, storey2 + 0.75, 0.85, 2.3, { shutters: true });
      pilaster(F, s * 1.35, storey2 + 0.1, pavWall, 0.36);
      pilaster(F, s * 3.0, storey2 + 0.1, pavWall, 0.36);
      oculus(F, s * 2.2, 8.75, 0.32);
    }
    fadd(F, urn, trim, 0, storey2 + 4.02, 0.15, 0.55, 0.55, 0.55);
    // name panel in the attic
    fbox(F, cream, 0, 8.85, 0.06, 1.7, 0.55, 0.06);
    for (let i = -3; i <= 3; i++) fbox(F, brass, i * 0.2, 8.85, 0.1, 0.12, 0.22, 0.02);
  }
  // pavilion side windows above the terraces
  for (const s of [-1, 1]) {
    const F: Face = { x: s * px1, z: 3.15, f: s * Math.PI / 2 };
    archWindow(F, 0, storey2 + 0.75, 0.8, 2.3, { shutters: true });
    oculus(F, 0, 8.75, 0.3);
  }
  // portico
  {
    const zc = 4.95;
    for (const x of [-2.85, -1.55, 1.55, 2.85]) pillar(x, floor, zc, storey2 - floor - 0.45, 0.22);
    block(trim, -3.35, 3.35, pz1, 5.35, storey2 - 0.45, storey2 - 0.15);
    block(cream, -3.3, 3.3, pz1, 5.3, storey2 - 0.15, storey2 + 0.05);
    block(trim, -3.45, 3.45, pz1, 5.45, storey2 + 0.05, storey2 + 0.18);
    for (let x = -3.2; x <= 3.21; x += 0.26) box(trim, x, storey2 - 0.08, 5.36, 0.12, 0.12, 0.08);
    balustrade(-3.3, 5.32, 3.3, 5.32, storey2 + 0.18, true);
    balustrade(-3.3, 5.32, -3.3, pz1 + 0.1, storey2 + 0.18);
    balustrade(3.3, 5.32, 3.3, pz1 + 0.1, storey2 + 0.18);
    // hanging lantern under the portico
    beam(iron, 0, storey2 - 0.45, 4.85, 0, storey2 - 1.1, 4.85, 0.04);
    box(lampGlass, 0, storey2 - 1.3, 4.85, 0.35, 0.45, 0.35);
    add(pyramid, iron, 0, storey2 - 1.0, 4.85, 0.45, 0.2, 0.45);
  }
  // pediment with clock, gable roof
  {
    const pedH = 1.55, pedW = 6.9;
    add(prism, stone, 0, pavTop, pz1 - 0.15, pedW, pedH, 0.45);
    for (const s of [-1, 1]) beam(trim, s * (pedW / 2 + 0.1), pavTop + 0.02, pz1 + 0.38, 0, pavTop + pedH + 0.12, pz1 + 0.38, 0.24, 0.24);
    add(prism, tile, 0, pavTop - 0.05, -1.0, pedW + 0.7, pedH + 0.25, pz1 + 0.85);
    const ridgeY = pavTop - 0.05 + pedH + 0.25;
    const halfW = (pedW + 0.7) / 2;
    for (let z = -0.85; z <= pz1 - 0.3; z += 0.3) {
      for (const s of [-1, 1]) beam(tileRib, 0, ridgeY + 0.02, z, s * halfW, pavTop + 0.02, z, 0.08);
    }
    beam(tileCap, 0, ridgeY + 0.06, -1.0, 0, ridgeY + 0.06, pz1 - 0.15, 0.2);
    // clock
    const cz = pz1 + 0.32;
    add(disc, trim, 0, pavTop + 0.68, cz, 1.0, 0.08, 1.0, Math.PI / 2);
    add(ring, brass, 0, pavTop + 0.68, cz + 0.05, 1.0, 1.0, 1.0);
    for (let i = 0; i < 12; i++) {
      const ang = i * Math.PI / 6;
      box(iron, Math.sin(ang) * 0.38, pavTop + 0.68 + Math.cos(ang) * 0.38, cz + 0.05, 0.04, 0.08, 0.02, 0, 0, -ang);
    }
    box(iron, 0.08, pavTop + 0.78, cz + 0.07, 0.04, 0.3, 0.02, 0, 0, -0.9);
    box(iron, 0, pavTop + 0.84, cz + 0.08, 0.035, 0.36, 0.02);
    // acroteria
    for (const s of [-1, 1]) add(urn, trim, s * (pedW / 2 - 0.1), pavTop + 0.05, pz1 + 0.15, 0.7, 0.7, 0.7);
    box(trim, 0, pavTop + pedH + 0.3, pz1 + 0.2, 0.4, 0.25, 0.4);
    add(ball, brass, 0, pavTop + pedH + 0.6, pz1 + 0.2, 0.35, 0.35, 0.35);
  }

  // ======================================================================
  // ARCADES (x ±3.2..±6.9, z 2..4)
  // ======================================================================
  for (const sx of [-1, 1]) {
    const bays = 3, bay = 1.233, xs = sx * 3.2;
    const zFront = 4.0, spring = floor + 2.25, deck = storey2;
    for (let i = 0; i < bays; i++) {
      const cx = xs + sx * bay * (i + 0.5);
      add(spandrel, stone, cx, spring, zFront - 0.4, bay, bay, 0.4);
      add(archRing, trim, cx, spring, zFront + 0.02, bay * 0.84, bay * 0.84, 1.3);
      box(trim, cx, spring + bay * 0.4 + 0.08, zFront + 0.06, 0.18, 0.26, 0.1);
      // hanging lantern
      beam(iron, cx, spring + 0.4, zFront - 0.6, cx, spring - 0.2, zFront - 0.6, 0.03);
      box(lampGlass, cx, spring - 0.35, zFront - 0.6, 0.22, 0.3, 0.22);
    }
    const len = bay * bays;
    box(stone, sx * (3.2 + len / 2), (spring + bay * 0.62 + deck) / 2, zFront - 0.2, len, deck - spring - bay * 0.62, 0.4);
    for (let i = 0; i <= bays; i++) pillar(xs + sx * bay * i, floor, zFront - 0.2, spring - floor, 0.15);
    block(stone, Math.min(xs, xs + sx * len), Math.max(xs, xs + sx * len), mz1, zFront - 0.4, deck - 0.3, deck);
    block(trim, Math.min(xs, xs + sx * len) - 0.05, Math.max(xs, xs + sx * len) + 0.05, mz1, zFront + 0.15, deck - 0.12, deck + 0.04);
    block(pave, Math.min(xs, xs + sx * len), Math.max(xs, xs + sx * len), mz1, zFront, deck + 0.04, deck + 0.06);
    for (let x = 3.25; x <= 3.2 + len; x += 0.26) box(trim, sx * x, deck - 0.2, zFront + 0.08, 0.1, 0.1, 0.08);
    balustrade(sx * 3.25, zFront - 0.1, sx * (3.2 + len - 0.05), zFront - 0.1, deck + 0.04, sx > 0);
    // arcade floor tiles
    for (let x = 3.3; x < 3.2 + len; x += 0.5) box(pot, sx * x, floor + 0.06, 3.0, 0.45, 0.02, 1.9);
  }
  // end pier between left arcade and octagonal tower
  block(stone, -7.4, -6.9, mz1, 4.0, floor, storey2);

  // ======================================================================
  // LEFT OCTAGONAL TOWER (-9, 2.6)
  // ======================================================================
  {
    const tx = -9.0, tz = 2.6, r = 2.2, apothem = r * Math.cos(Math.PI / 8);
    const top = 11.6;
    add(octagon, stone, tx, (floor + top) / 2, tz, r * 2, top - floor, r * 2);
    for (const y of [floor + 0.1, storey2, wallTop]) add(octagon, trim, tx, y, tz, r * 2 + 0.25, 0.22, r * 2 + 0.25);
    add(octagon, trim, tx, top + 0.1, tz, r * 2 + 0.2, 0.3, r * 2 + 0.2);
    add(octagon, cream, tx, top + 0.35, tz, r * 2 + 0.05, 0.25, r * 2 + 0.05);
    add(octagon, trim, tx, top + 0.55, tz, r * 2 + 0.45, 0.18, r * 2 + 0.45);
    for (let i = 0; i < 8; i++) {
      const ang = i * Math.PI / 4;
      const F: Face = { x: tx + Math.sin(ang) * apothem, z: tz + Math.cos(ang) * apothem, f: ang };
      // corner pilaster strips (at octagon vertices)
      const va = ang + Math.PI / 8;
      box(quoin, tx + Math.sin(va) * (r - 0.02), (floor + top) / 2, tz + Math.cos(va) * (r - 0.02), 0.28, top - floor, 0.28, 0, va);
      if (i === 2) continue;
      const hidden = i === 3 || i === 4;
      if (!hidden) {
        rectWindow(F, 0, 1.6, 0.8, 2.0, true);
        archWindow(F, 0, 5.25, 0.8, 2.35, { shutters: false, balcony: i === 0 || i === 6 });
      }
      archWindow(F, 0, 9.05, 0.7, 1.85);
    }
    // belvedere ring of columns and dome
    const by = top + 0.64;
    add(octagon, voidDark, tx, by + 1.1, tz, 2.4, 2.2, 2.4);
    for (let i = 0; i < 8; i++) {
      const ang = i * Math.PI / 4 + Math.PI / 8;
      pillar(tx + Math.sin(ang) * 1.65, by, tz + Math.cos(ang) * 1.65, 2.1, 0.15);
      const ang2 = i * Math.PI / 4;
      const F: Face = { x: tx + Math.sin(ang2) * 1.55, z: tz + Math.cos(ang2) * 1.55, f: ang2 };
      fadd(F, archRing, trim, 0, by + 1.55, 0, 1.2, 1.0, 1.6);
      for (let b = -0.4; b <= 0.41; b += 0.2) fadd(F, baluster, trim, b, by, 0, 0.8, 0.5, 0.8);
      fbox(F, trim, 0, by + 0.55, 0, 1.0, 0.08, 0.16);
    }
    add(octagon, trim, tx, by + 2.25, tz, 4.1, 0.3, 4.1);
    add(octagon, cream, tx, by + 2.5, tz, 3.8, 0.2, 3.8);
    add(dome, tileLight, tx, by + 2.6, tz, 1.85, 1.75, 1.85);
    for (let i = 0; i < 8; i++) add(domeRib, tileCap, tx, by + 2.6, tz, 1.87, 1.77, 1.87, 0, i * Math.PI / 4);
    add(column, trim, tx, by + 4.5, tz, 0.5, 0.4, 0.5);
    add(dome, tileLight, tx, by + 4.7, tz, 0.3, 0.3, 0.3);
    add(ball, brass, tx, by + 5.1, tz, 0.22, 0.22, 0.22);
    beam(iron, tx, by + 5.2, tz, tx, by + 5.9, tz, 0.05);
  }

  // ======================================================================
  // RIGHT SQUARE BELL TOWER (9, 2.6)
  // ======================================================================
  {
    const tx = 9.0, tz = 2.6, half = 2.1, top = 11.6;
    const x0 = tx - half, x1 = tx + half, z0 = tz - half, z1 = tz + half;
    block(stone, x0, x1, z0, z1, floor, top);
    stringCourse(x0, x1, z0, z1, storey2);
    stringCourse(x0, x1, z0, z1, wallTop);
    quoins(x1, z1, 1, 1, floor, top);
    quoins(x0, z1, -1, 1, floor, storey2);
    quoins(x1, z0, 1, -1, floor, top);
    const faces: Face[] = [{ x: tx, z: z1, f: 0 }, { x: x1, z: tz, f: Math.PI / 2 }, { x: tx, z: z0, f: Math.PI }];
    faces.forEach((F, i) => {
      if (i < 2) {
        archWindow(F, 0, 1.4, 1.1, 2.3, { shutters: true });
        archWindow(F, 0, 5.25, 1.0, 2.4, { shutters: true, balcony: true });
      }
      for (const u of [-0.55, 0.55]) archWindow(F, u, 9.0, 0.6, 1.7);
      fadd(F, disc, cream, 0, wallTop - 0.65, 0.04, 0.5, 0.05, 0.5, Math.PI / 2);
    });
    const tTop = entablature(x0, x1, z0, z1, top, [true, true, true, true]);
    // open belfry: corner piers, columns, arches
    const by = tTop, bh = 2.3;
    block(voidDark, x0 + 0.5, x1 - 0.5, z0 + 0.5, z1 - 0.5, by, by + bh);
    for (const qx of [-1, 1]) {
      for (const qz of [-1, 1]) block(stone, tx + qx * (half - 0.35) - 0.35, tx + qx * (half - 0.35) + 0.35, tz + qz * (half - 0.35) - 0.35, tz + qz * (half - 0.35) + 0.35, by, by + bh);
    }
    for (let i = 0; i < 4; i++) {
      const f = i * Math.PI / 2;
      const F: Face = { x: tx + Math.sin(f) * (half - 0.35), z: tz + Math.cos(f) * (half - 0.35), f };
      for (const u of [-0.45, 0.45]) {
        const [cx, cz] = at(F, u, 0);
        pillar(cx, by, cz, bh - 0.75, 0.11);
      }
      for (const u of [-1.0, 0, 1.0]) fadd(F, archRing, trim, u, by + bh - 0.75, 0.0, 0.9, 0.9, 2.2);
      fbox(F, stone, 0, by + bh - 0.18, 0, 2.9, 0.36, 0.3);
      for (let b = -1.15; b <= 1.16; b += 0.23) fadd(F, baluster, trim, b, by, 0, 0.7, 0.42, 0.7);
      fbox(F, trim, 0, by + 0.45, 0, 2.9, 0.07, 0.2);
    }
    add(bell, 0xa8823e, tx, by + 0.75, tz, 1.6, 1.6, 1.6);
    box(doorDark, tx, by + 1.85, tz, 1.4, 0.18, 0.18);
    block(trim, x0 - 0.15, x1 + 0.15, z0 - 0.15, z1 + 0.15, by + bh, by + bh + 0.22);
    block(trim, x0 - 0.3, x1 + 0.3, z0 - 0.3, z1 + 0.3, by + bh + 0.22, by + bh + 0.34);
    const apex = hipRoof(tx, tz, half + 0.4, half + 0.4, by + bh + 0.34, 2.1);
    add(ball, brass, apex[0], apex[1] + 0.2, apex[2], 0.3, 0.3, 0.3);
    beam(iron, apex[0], apex[1] + 0.3, apex[2], apex[0], apex[1] + 1.4, apex[2], 0.05);
    beam(iron, apex[0] - 0.4, apex[1] + 1.0, apex[2], apex[0] + 0.4, apex[1] + 1.0, apex[2], 0.04);
    beam(iron, apex[0], apex[1] + 1.0, apex[2] - 0.4, apex[0], apex[1] + 1.0, apex[2] + 0.4, 0.04);
    add(prism, iron, apex[0] + 0.15, apex[1] + 1.25, apex[2], 0.25, 0.55, 0.03, 0, 0, -Math.PI / 2);
  }

  // ======================================================================
  // RIGHT WING (x 6.9..11.1, z -7.6..0.5): two storeys + roof terrace with pergola
  // ======================================================================
  {
    const x0 = 6.9, x1 = 11.1, z0 = -7.6, z1 = 0.5;
    block(stone, x0, x1, z0, z1, floor, wallTop);
    stringCourse(x0, x1, z0, z1, storey2);
    quoins(x1, z0, 1, -1, floor, wallTop);
    const F: Face = { x: x1, z: (z0 + z1) / 2, f: Math.PI / 2 };
    const us = [-3.1, -1.05, 1.05, 3.1];
    us.forEach((u, i) => {
      if (i === 1) archWindow(F, u, floor, 1.2, 2.9, { door: true });
      else rectWindow(F, u, 1.55, 0.95, 2.0, true, true);
      archWindow(F, u, 5.25, 0.95, 2.45, { shutters: true, balcony: i === 1 || i === 2 });
    });
    for (const u of [-4.05, -2.08, 0, 2.08]) pilaster(F, u, storey2 + 0.1, wallTop, 0.32);
    const B: Face = { x: (x0 + x1) / 2, z: z0, f: Math.PI };
    for (const u of [-1.1, 1.1]) {
      rectWindow(B, u, 1.55, 0.9, 2.0, true);
      archWindow(B, u, 5.25, 0.9, 2.4, { shutters: true });
    }
    const wTop = entablature(x0, x1, z0, z1, wallTop, [false, true, true, false]);
    block(pot, x0, x1 - 0.1, z0 + 0.1, z1, wTop - 0.05, wTop + 0.02);
    for (let x = x0 + 0.4; x < x1; x += 0.6) box(0x8f5a3a, x, wTop + 0.025, (z0 + z1) / 2, 0.03, 0.01, z1 - z0 - 0.2);
    balustrade(x1 - 0.05, z1 - 0.15, x1 - 0.05, z0 + 0.05, wTop, true);
    balustrade(x1 - 0.05, z0 + 0.05, x0 + 0.6, z0 + 0.05, wTop);
    // pergola
    const pxs = [7.7, 10.3], pzs = [-6.9, -4.8, -2.7, -0.6];
    const ph = 2.3;
    for (const x of pxs) for (const z of pzs) {
      pillar(x, wTop, z, ph, 0.11);
      pottedPlant(x + 0.35, wTop, z + 0.3, 0.5);
    }
    for (const x of pxs) box(trim, x, wTop + ph + 0.1, -3.75, 0.18, 0.22, 6.8);
    for (let z = -7.1; z <= -0.4; z += 0.38) box(0xb28b60, 9.0, wTop + ph + 0.27, z, 3.3, 0.12, 0.1);
    let seed = 7;
    const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 26; i++) {
      add(ball, i % 3 ? 0x4f8a3f : 0x3f7544, 7.6 + rand() * 2.8, wTop + ph + 0.38, -7.0 + rand() * 6.6, 0.9 + rand() * 0.6, 0.35, 0.9 + rand() * 0.6);
    }
    for (const x of pxs) for (const z of [-6.9, -0.6]) beam(0x4f8a3f, x + 0.05, wTop + 0.3, z + 0.08, x + 0.05, wTop + ph, z + 0.08, 0.12);
    // table with umbrella and chairs
    add(column, trim, 9.0, wTop + 0.38, -3.75, 0.12, 0.72, 0.12);
    add(column, trim, 9.0, wTop + 0.76, -3.75, 1.0, 0.06, 1.0);
    for (const [dx, dz] of [[-0.75, 0], [0.75, 0], [0, -0.75], [0, 0.75]]) {
      box(0xb28b60, 9.0 + dx, wTop + 0.42, -3.75 + dz, 0.42, 0.06, 0.42);
      box(0xb28b60, 9.0 + dx * 1.3, wTop + 0.7, -3.75 + dz * 1.3, dx ? 0.06 : 0.42, 0.55, dz ? 0.06 : 0.42);
    }
    for (const [x, z] of [[8.0, -5.8], [10.0, -1.7]]) pottedPlant(x, wTop, z, 0.8);
    // stair kiosk to roof terrace
    block(stone, x0 + 0.1, x0 + 1.3, z0 + 0.3, z0 + 1.9, wTop, wTop + 2.2);
    block(trim, x0, x0 + 1.4, z0 + 0.2, z0 + 2.0, wTop + 2.2, wTop + 2.35);
    archWindow({ x: x0 + 1.3, z: z0 + 1.1, f: Math.PI / 2 }, 0, wTop, 0.7, 1.8, { door: true, keystone: false });
  }

  // ======================================================================
  // LEFT WING (x -11.1..-6.9, z -7.6..0.5): one storey with hipped roof
  // ======================================================================
  {
    const x0 = -11.1, x1 = -6.9, z0 = -7.6, z1 = 0.5;
    block(stone, x0, x1, z0, z1, floor, storey2);
    quoins(x0, z0, -1, -1, floor, storey2);
    quoins(x0, z1, -1, 1, floor, storey2);
    const wTop = entablature(x0, x1, z0, z1, storey2, [true, false, true, true]);
    const L: Face = { x: x0, z: (z0 + z1) / 2, f: -Math.PI / 2 };
    for (const u of [-3.0, -1.0, 1.0, 3.0]) archWindow(L, u, 1.5, 0.95, 2.4, { shutters: true });
    for (const u of [-2.0, 0, 2.0]) pilaster(L, u, floor + 0.1, storey2, 0.3);
    const B: Face = { x: (x0 + x1) / 2, z: z0, f: Math.PI };
    archWindow(B, 0, floor, 1.1, 2.7, { door: true });
    const Fr: Face = { x: -9.0, z: z1, f: 0 };
    rectWindow(Fr, -1.4, 1.6, 0.6, 1.5, true);
    hipRoof((x0 + x1) / 2, (z0 + z1) / 2, (x1 - x0) / 2 + 0.4, (z1 - z0) / 2 + 0.4, wTop - 0.02, 1.9);
    box(stone, -9.0, wTop + 1.6, -5.4, 0.6, 2.2, 0.8);
    box(trim, -9.0, wTop + 2.75, -5.4, 0.8, 0.12, 1.0);
    // small cupola lantern on the ridge
    add(octagon, trim, -9.0, wTop + 2.1, -2.0, 1.0, 0.5, 1.0);
    for (let i = 0; i < 6; i++) {
      const ang = i * Math.PI / 3;
      add(column, trim, -9.0 + Math.sin(ang) * 0.4, wTop + 2.7, -2.0 + Math.cos(ang) * 0.4, 0.08, 0.8, 0.08);
    }
    add(column, voidDark, -9.0, wTop + 2.7, -2.0, 0.6, 0.8, 0.6);
    add(cone, tileLight, -9.0, wTop + 3.45, -2.0, 1.2, 0.7, 1.2);
    add(ball, brass, -9.0, wTop + 3.85, -2.0, 0.15, 0.15, 0.15);
  }

  // ======================================================================
  // CENTRAL DOME on drum (0, -2.8)
  // ======================================================================
  {
    const dx = 0, dz = -2.8;
    const plinth = mainTop + 2.4;
    block(stone, dx - 2.3, dx + 2.3, dz - 2.3, dz + 2.3, mainTop + 1.0, plinth);
    block(trim, dx - 2.45, dx + 2.45, dz - 2.45, dz + 2.45, plinth, plinth + 0.18);
    for (const qx of [-1, 1]) for (const qz of [-1, 1]) {
      add(urn, trim, dx + qx * 2.15, plinth + 0.18, dz + qz * 2.15, 0.75, 0.75, 0.75);
    }
    const r = 2.0, drumH = 2.5;
    add(disc, stone, dx, plinth + 0.18 + drumH / 2, dz, r * 2, drumH, r * 2);
    add(disc, trim, dx, plinth + 0.3, dz, r * 2 + 0.2, 0.24, r * 2 + 0.2);
    for (let i = 0; i < 8; i++) {
      const ang = i * Math.PI / 4 + Math.PI / 8;
      const F: Face = { x: dx + Math.sin(ang) * (r - 0.03), z: dz + Math.cos(ang) * (r - 0.03), f: ang };
      archWindow(F, 0, plinth + 0.6, 0.62, 1.5, { keystone: true });
      const ang2 = i * Math.PI / 4;
      box(trim, dx + Math.sin(ang2) * r, plinth + 0.18 + drumH / 2, dz + Math.cos(ang2) * r, 0.26, drumH - 0.2, 0.16, 0, ang2);
    }
    const ringY = plinth + 0.18 + drumH;
    add(disc, trim, dx, ringY + 0.08, dz, r * 2 + 0.3, 0.16, r * 2 + 0.3);
    add(disc, cream, dx, ringY + 0.22, dz, r * 2 + 0.1, 0.14, r * 2 + 0.1);
    add(disc, trim, dx, ringY + 0.34, dz, r * 2 + 0.45, 0.12, r * 2 + 0.45);
    const domeY = ringY + 0.38;
    add(dome, tileLight, dx, domeY, dz, r + 0.1, 2.2, r + 0.1);
    for (let i = 0; i < 12; i++) add(domeRib, tileCap, dx, domeY, dz, r + 0.12, 2.22, r + 0.12, 0, i * Math.PI / 6);
    for (let i = 0; i < 6; i++) {
      const ang = i * Math.PI / 3 + Math.PI / 6;
      add(ball, 0x3e5157, dx + Math.sin(ang) * 1.55, domeY + 1.4, dz + Math.cos(ang) * 1.55, 0.3, 0.3, 0.12, 0, ang);
    }
    // lantern
    const ly = domeY + 2.1;
    add(disc, trim, dx, ly + 0.05, dz, 1.4, 0.14, 1.4);
    add(column, voidDark, dx, ly + 0.6, dz, 0.75, 1.0, 0.75);
    for (let i = 0; i < 6; i++) {
      const ang = i * Math.PI / 3;
      add(column, trim, dx + Math.sin(ang) * 0.55, ly + 0.6, dz + Math.cos(ang) * 0.55, 0.12, 1.0, 0.12);
    }
    add(disc, trim, dx, ly + 1.15, dz, 1.5, 0.14, 1.5);
    add(dome, tileLight, dx, ly + 1.2, dz, 0.7, 0.6, 0.7);
    add(ball, brass, dx, ly + 1.9, dz, 0.28, 0.28, 0.28);
    add(column, trim, dx, ly + 3.0, dz, 0.1, 2.2, 0.1);
    add(ball, brass, dx, ly + 4.15, dz, 0.18, 0.18, 0.18);
    flag(dx + 0.05, ly + 4.0, dz, 2.0, 1.25);
  }

  function pillar(x: number, y: number, z: number, height: number, radius = 0.2) {
    add(column, 0xe9e3d3, x, y + height / 2, z, radius * 2, height, radius * 2);
    box(0xe9e3d3, x, y + 0.09, z, radius * 2.8, 0.18, radius * 2.8);
    box(trim, x, y + 0.24, z, radius * 2.5, 0.1, radius * 2.5);
    add(taper, 0xf7f0df, x, y + height - 0.2, z, radius * 2.6, 0.16, radius * 2.6, Math.PI);
    box(0xf7f0df, x, y + height - 0.06, z, radius * 3, 0.12, radius * 3);
  }

  for (const batch of batches.values()) {
    const mesh = new THREE.InstancedMesh(batch.geometry, batch.material, batch.matrices.length);
    batch.matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    palace.add(mesh);
  }
  return palace;
}
