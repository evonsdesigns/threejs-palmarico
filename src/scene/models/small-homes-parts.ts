import * as THREE from "three";
import type { Kit } from "./kit";
import { buildingSurface, buildingTexture } from "../building-textures";

export const texFor = (color: number) => {
  const surface = buildingSurface(color);
  return surface ? buildingTexture(surface) : null;
};

/** Deterministic pseudo-random generator so models look identical every build. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Collects arbitrarily rotated primitives and merges them into one mesh per colour,
 * so free-form detail (fronds, thatch, barrels) costs only a handful of solids.
 * Rotation order is YXZ: roll (rz) in the local plane, pitch (rx), then yaw (ry).
 */
export function shapes(kit: Kit) {
  const groups = new Map<number, THREE.BufferGeometry[]>();
  const unit = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
  const euler = new THREE.Euler();
  const quat = new THREE.Quaternion();
  const matrix = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const cache = new Map<string, THREE.BufferGeometry>();
  const cached = (key: string, make: () => THREE.BufferGeometry) => {
    let g = cache.get(key);
    if (!g) {
      g = make();
      if (g.index) g = g.toNonIndexed();
      cache.set(key, g);
    }
    return g;
  };
  const add = (color: number, g: THREE.BufferGeometry, x: number, y: number, z: number,
    sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) => {
    euler.set(rx, ry, rz, "YXZ");
    quat.setFromEuler(euler);
    matrix.compose(pos.set(x, y, z), quat, scl.set(sx, sy, sz));
    const part = g.clone().applyMatrix4(matrix);
    let list = groups.get(color);
    if (!list) groups.set(color, list = []);
    list.push(part);
  };
  const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, rx = 0, ry = 0, rz = 0) =>
    add(color, unit, x, y, z, w, h, d, rx, ry, rz);
  const cyl = (color: number, x: number, y: number, z: number, rTop: number, rBot: number, h: number, seg = 8,
    rx = 0, ry = 0, rz = 0, open = false) => {
    const key = `c${rTop.toFixed(3)}_${rBot.toFixed(3)}_${seg}_${open}`;
    add(color, cached(key, () => new THREE.CylinderGeometry(rTop, rBot, 1, seg, 1, open)), x, y, z, 1, h, 1, rx, ry, rz);
  };
  const ball = (color: number, x: number, y: number, z: number, rx: number, ry = rx, rz = rx, yaw = 0) =>
    add(color, cached("ico", () => new THREE.IcosahedronGeometry(1, 0)), x, y, z, rx, ry, rz, 0, yaw, 0);
  const torus = (color: number, x: number, y: number, z: number, r: number, tube: number, rx = 0, ry = 0, rz = 0, arc = Math.PI * 2) =>
    add(color, cached(`t${r}_${tube}_${arc.toFixed(3)}`, () => new THREE.TorusGeometry(r, tube, 4, 12, arc)), x, y, z, 1, 1, 1, rx, ry, rz);
  const tri = (color: number, a: number[], b: number[], c: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
    g.computeVertexNormals();
    let list = groups.get(color);
    if (!list) groups.set(color, list = []);
    list.push(g);
  };
  const quad = (color: number, a: number[], b: number[], c: number[], d: number[]) => {
    tri(color, a, b, c);
    tri(color, a, c, d);
  };
  const flush = () => {
    for (const [color, parts] of groups) {
      const merged = new THREE.BufferGeometry();
      for (const [name, size] of [["position", 3], ["normal", 3], ["uv", 2]] as const) {
        const total = parts.reduce((n, p) => n + p.getAttribute(name).count * size, 0);
        const array = new Float32Array(total);
        let offset = 0;
        for (const p of parts) {
          const attr = p.getAttribute(name) as THREE.BufferAttribute;
          array.set(attr.array as Float32Array, offset);
          offset += attr.count * size;
        }
        merged.setAttribute(name, new THREE.BufferAttribute(array, size));
      }
      merged.computeBoundingSphere();
      kit.solid(merged, color, 0, 0, 0, texFor(color));
    }
    groups.clear();
  };
  return { box, cyl, ball, torus, tri, quad, flush };
}

export type Shapes = ReturnType<typeof shapes>;

/** Places boxes relative to a wall: u runs along the wall (to the viewer's right), n points out of it. */
export function wall(kit: Kit, sh: Shapes, facing: number, x0: number, z0: number) {
  const c = Math.cos(facing);
  const s = Math.sin(facing);
  const at = (u: number, n: number) => [x0 + c * u + s * n, z0 - s * u + c * n] as const;
  const box = (color: number, u: number, y: number, n: number, w: number, h: number, d: number, yaw = 0) => {
    const [x, z] = at(u, n);
    kit.box(color, x, y, z, w, h, d, 0, facing + yaw);
  };
  const litBox = (color: number, u: number, y: number, n: number, w: number, h: number, d: number, yaw = 0) => {
    const [x, z] = at(u, n);
    kit.litBox(color, x, y, z, w, h, d, 0, facing + yaw);
  };
  /** Box rolled within the wall plane (diagonal braces) and/or pitched away from the wall. */
  const slant = (color: number, u: number, y: number, n: number, w: number, h: number, d: number, roll: number, pitch = 0) => {
    const [x, z] = at(u, n);
    sh.box(color, x, y, z, w, h, d, pitch, facing, roll);
  };
  return { box, litBox, slant, at, facing };
}

/** A straight sloped plane along z from (z1,y1) to (z2,y2) with z2 > z1; helpers place boxes on it. */
export function slope(kit: Kit, z1: number, y1: number, z2: number, y2: number) {
  const theta = Math.atan2(y1 - y2, z2 - z1);
  const len = Math.hypot(z2 - z1, y2 - y1);
  const ny = Math.cos(theta);
  const nz = Math.sin(theta);
  const point = (t: number, off = 0) => [y1 + (y2 - y1) * t + ny * off, z1 + (z2 - z1) * t + nz * off] as const;
  const box = (color: number, x: number, t: number, off: number, w: number, h: number, d: number) => {
    const [y, z] = point(t, off);
    kit.box(color, x, y, z, w, h, d, theta);
  };
  return { theta, len, point, box };
}

export interface GableOptions {
  x: number; z: number; w: number; d: number; top: number; rise: number; overX: number; overZ: number;
  roof: number; row: number; ridge: number; fascia: number; fill: number; line?: number;
  vent?: number; gutter?: number; rowStep?: number; channelStep?: number; th?: number;
}

/** Tiled gable roof with ridge along x, tile courses, barrel channels, ridge cap, fascia, barge boards and gable infill. */
export function gableRoof(kit: Kit, sh: Shapes, o: GableOptions) {
  const half = o.d / 2;
  const k = o.rise / half;
  const H = half + o.overZ;
  const ridgeY = o.top + o.rise;
  const eaveY = o.top - k * o.overZ;
  const W = o.w + 2 * o.overX;
  const th = o.th ?? 0.16;
  for (const s of [-1, 1]) {
    const sl = s > 0 ? slope(kit, o.z, ridgeY, o.z + H, eaveY) : slope(kit, o.z - H, eaveY, o.z, ridgeY);
    const t = (u: number) => (s > 0 ? u : 1 - u);
    sl.box(o.roof, o.x, 0.5, th / 2, W, th, sl.len);
    const rows = Math.max(3, Math.round(sl.len / (o.rowStep ?? 0.36)));
    for (let i = 1; i <= rows; i++) sl.box(o.row, o.x, t(i / rows - 0.03), th + 0.02, W, 0.07, 0.11);
    const step = o.channelStep ?? 0.34;
    for (let dx = -W / 2 + step / 2; dx < W / 2; dx += step) sl.box(o.row, o.x + dx, 0.5, th + 0.025, 0.07, 0.05, sl.len);
    const [ey, ez] = sl.point(t(1), th / 2);
    kit.box(o.fascia, o.x, ey - 0.1, ez + s * 0.04, W + 0.06, 0.26, 0.08);
    if (o.gutter !== undefined) {
      kit.box(o.gutter, o.x, ey - 0.16, ez + s * 0.14, W, 0.13, 0.16);
      kit.box(0x5f6466, o.x, ey - 0.1, ez + s * 0.21, W, 0.05, 0.03);
    }
    for (const xs of [-1, 1]) sl.box(o.fascia, o.x + xs * (W / 2 + 0.04), 0.5, th / 2 + 0.02, 0.08, th + 0.2, sl.len + 0.06);
  }
  const capY = ridgeY + th / Math.cos(Math.atan(k)) - 0.03;
  kit.box(o.ridge, o.x, capY, o.z, W + 0.1, 0.24, 0.24, Math.PI / 4);
  for (let dx = -W / 2 + 0.2; dx < W / 2; dx += 0.42) kit.box(o.ridge, o.x + dx, capY, o.z, 0.07, 0.29, 0.29, Math.PI / 4);
  for (const xs of [-1, 1]) {
    const gx = o.x + xs * o.w / 2;
    sh.tri(o.fill, [gx, o.top, o.z - half], [gx, o.top, o.z + half], [gx, ridgeY, o.z]);
    if (o.line !== undefined) {
      for (let y = o.top + 0.28; y < ridgeY - 0.2; y += 0.28) {
        const width = 2 * half * (1 - (y - o.top) / o.rise);
        kit.box(o.line, gx + xs * 0.02, y, o.z, 0.03, 0.04, width);
      }
    }
    if (o.vent !== undefined) {
      const vy = o.top + o.rise * 0.42;
      kit.box(o.fascia, gx + xs * 0.04, vy, o.z, 0.06, 0.62, 0.82);
      kit.box(0x2c2a27, gx + xs * 0.06, vy, o.z, 0.04, 0.48, 0.66);
      for (let dy = -0.18; dy <= 0.19; dy += 0.09) kit.box(o.vent, gx + xs * 0.09, vy + dy, o.z, 0.04, 0.04, 0.66);
    }
    kit.box(o.fascia, gx + xs * 0.03, o.top + 0.05, o.z, 0.08, 0.12, o.d + 0.04);
  }
  return { ridgeY, eaveY, H, W, k, th };
}

export interface WindowStyle {
  frame: number; glass: number; muntin: number; sill: number;
  shutter?: number; slat?: number; closed?: boolean; flowers?: number[]; planter?: number;
  gap?: number; panes?: boolean;
}

/** Framed sash window with optional louvered shutters and a flower box. (x,z) is the wall surface point. */
export function shutteredWindow(kit: Kit, sh: Shapes, x: number, y: number, z: number, w: number, h: number,
  facing: number, st: WindowStyle) {
  const f = wall(kit, sh, facing, x, z);
  f.box(0x24282a, 0, y, 0.01, w, h, 0.04);
  f.litBox(st.glass, 0, y, 0.035, w - 0.06, h - 0.06, 0.03);
  f.slant(0x9cc0c4, -w * 0.12, y + h * 0.08, 0.055, 0.07, h * 0.7, 0.01, 0.45);
  if (st.panes !== false) {
    f.box(st.muntin, 0, y, 0.06, 0.06, h, 0.04);
    f.box(st.muntin, 0, y + h * 0.05, 0.06, w, 0.07, 0.05);
    f.box(st.muntin, 0, y + h * 0.3, 0.06, w, 0.04, 0.04);
    f.box(st.muntin, 0, y - h * 0.22, 0.06, w, 0.04, 0.04);
  }
  f.box(st.frame, 0, y + h / 2 + 0.08, 0.06, w + 0.34, 0.16, 0.1);
  f.box(st.frame, 0, y + h / 2 + 0.2, 0.09, w + 0.48, 0.08, 0.16);
  for (const side of [-1, 1]) f.box(st.frame, side * (w / 2 + 0.08), y, 0.06, 0.16, h, 0.1);
  f.box(st.sill, 0, y - h / 2 - 0.05, 0.12, w + 0.42, 0.1, 0.26);
  f.box(st.frame, 0, y - h / 2 - 0.16, 0.06, w + 0.1, 0.12, 0.08);
  if (st.shutter !== undefined) {
    const slat = st.slat ?? st.frame;
    for (const side of [-1, 1]) {
      const sw = w / 2;
      const u = st.closed ? side * w / 4 : side * (w / 2 + (st.gap ?? 0.17) + sw / 2);
      const n = st.closed ? 0.14 : 0.07;
      f.box(st.shutter, u, y, n, sw - 0.02, h + 0.04, 0.05);
      for (const e of [-1, 1]) f.box(st.shutter, u + e * (sw / 2 - 0.06), y, n + 0.03, 0.09, h + 0.04, 0.04);
      f.box(st.shutter, u, y, n + 0.03, sw - 0.04, 0.08, 0.04);
      for (let dy = -h / 2 + 0.12; dy < h / 2 - 0.08; dy += 0.12) if (Math.abs(dy) > 0.05) f.box(slat, u, y + dy, n + 0.045, sw - 0.16, 0.035, 0.03);
      if (!st.closed) for (const dy of [-h * 0.35, h * 0.35]) f.box(0x2c2a27, side * (w / 2 + 0.17), y + dy, 0.1, 0.12, 0.05, 0.04);
    }
  }
  if (st.flowers) {
    const by = y - h / 2 - 0.42;
    f.box(st.planter ?? st.frame, 0, by, 0.26, w + 0.2, 0.3, 0.3);
    f.box(0x5a4632, 0, by + 0.16, 0.26, w + 0.1, 0.04, 0.24);
    for (const e of [-1, 1]) f.box(0x2c2a27, e * (w / 2 - 0.05), by + 0.25, 0.12, 0.05, 0.22, 0.04);
    const count = Math.max(3, Math.round(w / 0.18));
    for (let i = 0; i < count; i++) {
      const u = -w / 2 + 0.05 + (i + 0.5) * (w - 0.1) / count;
      f.box(i % 2 ? 0x3f7a35 : 0x4f8c3c, u, by + 0.28, 0.24 + (i % 2) * 0.06, 0.2, 0.2, 0.18, i * 0.7);
      f.box(st.flowers[i % st.flowers.length], u, by + 0.42 + (i % 3) * 0.04, 0.27, 0.12, 0.1, 0.12, i);
    }
    for (let i = 0; i < 3; i++) f.box(0x3f7a35, -w / 3 + i * w / 3, by - 0.18, 0.4, 0.06, 0.3, 0.05);
  }
}

export interface DoorStyle {
  leaf: number; frame: number; panel?: number; knob?: number; open?: number; glass?: number; transom?: boolean; step?: number;
}

/** Panelled door with casing; open > 0 swings the leaf outward around its left hinge. (x,z) is the wall surface point, y0 the threshold. */
export function door(kit: Kit, sh: Shapes, x: number, y0: number, z: number, w: number, h: number, facing: number, st: DoorStyle) {
  const f = wall(kit, sh, facing, x, z);
  f.box(0x1c1915, 0, y0 + h / 2, 0.01, w, h, 0.04);
  f.box(0x3a2f26, 0, y0 + 0.02, 0.0, w, 0.04, 0.3);
  for (const side of [-1, 1]) f.box(st.frame, side * (w / 2 + 0.08), y0 + h / 2, 0.05, 0.16, h + 0.02, 0.1);
  f.box(st.frame, 0, y0 + h + 0.1, 0.05, w + 0.34, 0.2, 0.1);
  f.box(st.frame, 0, y0 + h + 0.24, 0.09, w + 0.48, 0.08, 0.16);
  if (st.transom) {
    f.box(st.frame, 0, y0 + h + 0.55, 0.05, w + 0.34, 0.5, 0.08);
    f.litBox(st.glass ?? 0x526e6b, 0, y0 + h + 0.53, 0.09, w - 0.08, 0.32, 0.03);
    for (const du of [-w / 4, 0, w / 4]) f.box(st.frame, du, y0 + h + 0.53, 0.11, 0.04, 0.32, 0.03);
    f.box(st.frame, 0, y0 + h + 0.84, 0.1, w + 0.48, 0.08, 0.16);
  }
  if (st.step !== undefined) f.box(st.step, 0, y0 - 0.06, 0.22, w + 0.4, 0.12, 0.4);
  const a = st.open ?? 0;
  const [lx, lz] = f.at(-w / 2 + (w / 2) * Math.cos(a), 0.05 + (w / 2) * Math.sin(a));
  const leaf = wall(kit, sh, facing - a, lx, lz);
  const lw = w - 0.04;
  leaf.box(st.leaf, 0, y0 + h / 2, 0, lw, h - 0.04, 0.07);
  const panel = st.panel ?? st.leaf;
  for (const n of [-1, 1]) {
    if (st.glass !== undefined) {
      leaf.litBox(st.glass, 0, y0 + h * 0.72, n * 0.04, lw * 0.62, h * 0.32, 0.02);
      for (const du of [-lw * 0.1, lw * 0.1]) leaf.box(panel, du, y0 + h * 0.72, n * 0.05, 0.04, h * 0.32, 0.02);
    } else {
      for (const du of [-lw / 4.4, lw / 4.4]) leaf.box(panel, du, y0 + h * 0.72, n * 0.045, lw * 0.32, h * 0.3, 0.025);
    }
    for (const du of [-lw / 4.4, lw / 4.4]) leaf.box(panel, du, y0 + h * 0.3, n * 0.045, lw * 0.32, h * 0.36, 0.025);
    leaf.box(st.knob ?? 0xc9a24a, lw / 2 - 0.13, y0 + h * 0.48, n * 0.07, 0.07, 0.07, 0.07);
  }
}

/** Fence segment from (x1,z1) to (x2,z2); gaps is a list of [t0,t1] fractions left open. */
export function picketFence(kit: Kit, x1: number, z1: number, x2: number, z2: number, color: number, post: number,
  height = 0.85, gaps: [number, number][] = [], seed = 1) {
  const len = Math.hypot(x2 - x1, z2 - z1);
  const yaw = Math.atan2(x2 - x1, z2 - z1) - Math.PI / 2;
  const dx = (x2 - x1) / len;
  const dz = (z2 - z1) / len;
  const random = rng(seed);
  const open = (t: number) => gaps.some(([a, b]) => t > a && t < b);
  const posts = Math.max(1, Math.round(len / 1.3));
  for (let i = 0; i <= posts; i++) {
    const t = i / posts;
    if (open(t) && !gaps.some(([a, b]) => Math.abs(t - a) < 1e-3 || Math.abs(t - b) < 1e-3)) continue;
    kit.box(post, x1 + dx * len * t, height / 2 + 0.05, z1 + dz * len * t, 0.13, height + 0.1, 0.13, 0, yaw);
    kit.box(post, x1 + dx * len * t, height + 0.13, z1 + dz * len * t, 0.17, 0.06, 0.17, 0, yaw);
  }
  const segs: [number, number][] = [];
  let start = 0;
  for (const [a, b] of [...gaps].sort((p, q) => p[0] - q[0])) {
    segs.push([start, a]);
    start = b;
  }
  segs.push([start, 1]);
  for (const [a, b] of segs) {
    if (b - a < 1e-3) continue;
    const mid = (a + b) / 2;
    for (const ry of [0.25, 0.7]) kit.box(post, x1 + dx * len * mid, height * ry, z1 + dz * len * mid, 0.05, 0.07, len * (b - a), 0, yaw + Math.PI / 2);
  }
  for (let d = 0.12; d < len; d += 0.22) {
    const t = d / len;
    if (open(t)) continue;
    const r = random();
    if (r < 0.03) continue;
    const c = r < 0.15 ? 0xb4ae9c : color;
    const ph = height - 0.08 + random() * 0.1;
    kit.box(c, x1 + dx * d, ph / 2, z1 + dz * d, 0.11, ph, 0.035, (random() - 0.5) * 0.06, yaw);
    kit.box(c, x1 + dx * d, ph + 0.03, z1 + dz * d, 0.06, 0.06, 0.035, 0, yaw);
  }
}

/** Low-poly leafy bush built from clustered icosahedra. */
export function bush(sh: Shapes, x: number, z: number, r: number, leaf: number, dark: number, flower?: number, seed = 3) {
  const random = rng(seed);
  sh.ball(dark, x, r * 0.55, z, r, r * 0.7, r);
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1 + random();
    sh.ball(leaf, x + Math.cos(a) * r * 0.45, r * (0.7 + random() * 0.3), z + Math.sin(a) * r * 0.45, r * 0.62, r * 0.55, r * 0.62, a);
  }
  if (flower !== undefined) {
    for (let i = 0; i < 7; i++) {
      const a = random() * Math.PI * 2;
      const e = random() * 0.8 + 0.2;
      sh.ball(flower, x + Math.cos(a) * r * 0.75 * Math.cos(e), r * (0.6 + Math.sin(e) * 0.7), z + Math.sin(a) * r * 0.75 * Math.cos(e), r * 0.13);
    }
  }
}

/** Coconut palm with a curved trunk and drooping V-shaped fronds. */
export function palm(sh: Shapes, x: number, z: number, topX: number, topZ: number, height: number, trunk: number, frond: number,
  frondDark: number, seed = 7, frondLen = 1.7) {
  const segs = 6;
  let px = x;
  let py = 0;
  let pz = z;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const bend = t * t;
    const nx = x + (topX - x) * bend;
    const nz = z + (topZ - z) * bend;
    const ny = height * t;
    const dx = nx - px;
    const dy = ny - py;
    const dz = nz - pz;
    const len = Math.hypot(dx, dy, dz);
    const yaw = Math.atan2(dx, dz);
    const pitch = Math.acos(dy / len);
    const r = 0.17 - t * 0.05;
    sh.cyl(trunk, (px + nx) / 2, (py + ny) / 2, (pz + nz) / 2, r, r + 0.02, len + 0.04, 6, pitch, yaw);
    sh.cyl(0x6e5a42, nx, ny - 0.05, nz, r + 0.025, r + 0.025, 0.08, 6, pitch, yaw);
    px = nx; py = ny; pz = nz;
  }
  const random = rng(seed);
  for (let c = 0; c < 3; c++) sh.ball(0x5b4a2a, topX + Math.cos(c * 2.1) * 0.15, height - 0.15, topZ + Math.sin(c * 2.1) * 0.15, 0.13);
  const fronds = 10;
  for (let i = 0; i < fronds; i++) {
    const yaw = i * Math.PI * 2 / fronds + random() * 0.3;
    let fx = topX;
    let fy = height + 0.05;
    let fz = topZ;
    let pitch = -0.4 + random() * 0.25 + (i % 2) * 0.2;
    const seg = frondLen / 4;
    for (let k = 0; k < 4; k++) {
      const dir = [Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
      const cx = fx + dir[0] * seg / 2;
      const cy = fy + dir[1] * seg / 2;
      const cz = fz + dir[2] * seg / 2;
      const width = 0.46 - k * 0.09;
      const color = (i + k) % 2 ? frond : frondDark;
      for (const roll of [-0.45, 0.45]) {
        sh.box(color, cx + Math.cos(yaw) * Math.sign(roll) * width / 4, cy - 0.04, cz - Math.sin(yaw) * Math.sign(roll) * width / 4,
          width / 2, 0.025, seg + 0.05, pitch, yaw, roll);
      }
      fx += dir[0] * seg;
      fy += dir[1] * seg;
      fz += dir[2] * seg;
      pitch += 0.3;
    }
  }
}

/** Wooden or metal barrel with hoops. */
export function barrel(sh: Shapes, x: number, z: number, r: number, h: number, body: number, hoop: number, y0 = 0) {
  sh.cyl(body, x, y0 + h / 2, z, r, r * 0.94, h, 10);
  for (const t of [0.12, 0.5, 0.88]) sh.cyl(hoop, x, y0 + h * t, z, r + 0.02, r + 0.02, 0.06, 10);
  sh.cyl(hoop, x, y0 + h + 0.01, z, r * 0.9, r * 0.9, 0.03, 10);
}

/** Wooden crate with plank seams. */
export function crate(kit: Kit, x: number, y0: number, z: number, s: number, yaw: number, body: number, edge: number) {
  kit.box(body, x, y0 + s / 2, z, s, s, s, 0, yaw);
  const c = Math.cos(yaw);
  const sn = Math.sin(yaw);
  for (const side of [-1, 1]) {
    // edge battens on the faces looking along local z and x
    kit.box(edge, x + sn * side * (s / 2 + 0.01), y0 + s / 2, z + c * side * (s / 2 + 0.01), s + 0.02, 0.07, 0.03, 0, yaw);
    kit.box(edge, x + c * side * (s / 2 + 0.01), y0 + s / 2, z - sn * side * (s / 2 + 0.01), 0.03, 0.07, s + 0.02, 0, yaw);
    for (const e of [-1, 1]) {
      kit.box(edge, x + c * e * (s / 2 - 0.03) + sn * side * (s / 2 + 0.01), y0 + s / 2, z - sn * e * (s / 2 - 0.03) + c * side * (s / 2 + 0.01), 0.07, s, 0.03, 0, yaw);
    }
  }
  kit.box(edge, x, y0 + s + 0.01, z, s + 0.02, 0.02, 0.07, 0, yaw);
}

/** Clothesline between posts at (x1,z1) and (x2,z2) with hanging laundry. */
export function laundry(kit: Kit, x1: number, z1: number, x2: number, z2: number, y: number, post: number, colors: number[]) {
  const len = Math.hypot(x2 - x1, z2 - z1);
  const dx = (x2 - x1) / len;
  const dz = (z2 - z1) / len;
  const yaw = Math.atan2(dx, dz) - Math.PI / 2;
  for (const [x, z] of [[x1, z1], [x2, z2]]) {
    kit.box(post, x, y / 2, z, 0.1, y + 0.05, 0.1, 0, yaw);
    kit.box(post, x, y - 0.05, z, 0.07, 0.06, 0.38, 0, yaw);
  }
  kit.box(0xe8e2d0, (x1 + x2) / 2, y - 0.02, (z1 + z2) / 2, len, 0.02, 0.02, 0, yaw);
  const n = colors.length;
  for (let i = 0; i < n; i++) {
    const d = len * (i + 0.75) / (n + 0.5);
    const x = x1 + dx * d;
    const z = z1 + dz * d;
    const kind = i % 3;
    const w = kind === 0 ? 0.46 : kind === 1 ? 0.36 : 0.5;
    const h = kind === 0 ? 0.55 : kind === 1 ? 0.75 : 0.42;
    kit.box(colors[i], x, y - 0.04 - h / 2, z, w, h, 0.03, 0, yaw + (i % 2 ? 0.05 : -0.05));
    if (kind === 0) for (const e of [-1, 1]) kit.box(colors[i], x + dx * e * 0.3, y - 0.22, z + dz * e * 0.3, 0.16, 0.28, 0.03, 0, yaw);
    if (kind === 1) kit.box(0x2c2a27, x, y - 0.04 - h * 0.55, z, 0.02, h * 0.9, 0.05, 0, yaw);
    for (const e of [-1, 1]) kit.box(0xd8c8a0, x + dx * e * w * 0.38, y - 0.01, z + dz * e * w * 0.38, 0.03, 0.09, 0.05, 0, yaw);
  }
}

/** A chicken. */
export function chicken(kit: Kit, x: number, z: number, yaw: number, body = 0xefe9dc) {
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  kit.box(body, x, 0.28, z, 0.2, 0.2, 0.3, 0, yaw);
  kit.box(body, x - fx * 0.15, 0.36, z - fz * 0.15, 0.14, 0.18, 0.08, 0.4, yaw);
  kit.box(body, x + fx * 0.16, 0.44, z + fz * 0.16, 0.11, 0.16, 0.1, 0, yaw);
  kit.box(0xc23a2b, x + fx * 0.17, 0.55, z + fz * 0.17, 0.03, 0.06, 0.08, 0, yaw);
  kit.box(0xd9a03b, x + fx * 0.23, 0.44, z + fz * 0.23, 0.04, 0.03, 0.05, 0, yaw);
  for (const e of [-1, 1]) kit.box(0xd9a03b, x + Math.cos(yaw) * e * 0.05, 0.1, z - Math.sin(yaw) * e * 0.05, 0.025, 0.2, 0.025);
}
