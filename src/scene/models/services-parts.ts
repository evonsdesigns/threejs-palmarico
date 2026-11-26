import * as THREE from "three";
import { buildingTexture } from "../building-textures";
import { Kit } from "./kit";

export type Vec3 = [number, number, number];

/**
 * Wall-relative placement. `lat` runs along the wall (to the right when looking at it),
 * `out` is the distance in front of the wall plane. `tilt` pitches the box's depth axis
 * downward (for awnings and roof slabs); tilted facings must be cardinal.
 */
export function face(kit: Kit, x: number, z: number, f: number) {
  const c = Math.cos(f);
  const s = Math.sin(f);
  const at = (lat: number, out: number): [number, number] => [x + c * lat + s * out, z - s * lat + c * out];
  const put = (color: number, lat: number, y: number, out: number, w: number, h: number, d: number, tilt = 0) => {
    const [px, pz] = at(lat, out);
    if (!tilt) return kit.box(color, px, y, pz, w, h, d, 0, f);
    const rc = Math.round(c);
    const rs = Math.round(s);
    if (rc === 1) kit.box(color, px, y, pz, w, h, d, tilt, 0);
    else if (rc === -1) kit.box(color, px, y, pz, w, h, d, -tilt, Math.PI);
    else if (rs === 1) kit.box(color, px, y, pz, d, w, h, Math.PI / 2, -tilt);
    else kit.box(color, px, y, pz, d, w, h, Math.PI / 2, tilt);
  };
  const win = (lat: number, y: number, w: number, h: number, out = 0.04) => {
    const [px, pz] = at(lat, out);
    kit.window(px, y, pz, w, h, f);
  };
  return { kit, f, at, put, win };
}

export type Face = ReturnType<typeof face>;

/** Thin box spanning two points. */
export function beam(kit: Kit, color: number, a: Vec3, b: Vec3, t = 0.06, t2 = t) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const length = Math.hypot(dx, dy, dz);
  if (length < 1e-4) return;
  const yaw = Math.asin(Math.max(-1, Math.min(1, dx / length)));
  const pitch = Math.abs(dy) < 1e-6 && Math.abs(dz) < 1e-6 ? 0 : Math.atan2(-dy, dz);
  kit.box(color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, t, t2, length, pitch, yaw);
}

/** Sagging wire with bulbs between two points. */
export function stringLights(kit: Kit, a: Vec3, b: Vec3, sag: number, bulbs: number, colors: number[]) {
  const point = (t: number): Vec3 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t),
    a[2] + (b[2] - a[2]) * t,
  ];
  const segments = 6;
  for (let i = 0; i < segments; i++) beam(kit, 0x2f2c28, point(i / segments), point((i + 1) / segments), 0.025);
  for (let i = 1; i <= bulbs; i++) {
    const p = point(i / (bulbs + 1));
    kit.box(0x2f2c28, p[0], p[1] - 0.04, p[2], 0.05, 0.06, 0.05);
    kit.box(colors[i % colors.length], p[0], p[1] - 0.13, p[2], 0.11, 0.14, 0.11);
  }
}

export interface DoorOptions {
  leaf: number;
  frame: number;
  trim?: number;
  handle?: number;
  double?: boolean;
  glazed?: boolean;
  glass?: number;
}

export function door(F: Face, lat: number, y0: number, w: number, h: number, o: DoorOptions) {
  const { put } = F;
  const trim = o.trim ?? o.leaf;
  put(0x2b2824, lat, y0 + h / 2, 0.01, w, h, 0.04);
  for (const side of [-1, 1]) put(o.frame, lat + side * (w / 2 + 0.08), y0 + h / 2 + 0.04, 0.05, 0.16, h + 0.08, 0.14);
  put(o.frame, lat, y0 + h + 0.08, 0.05, w + 0.32, 0.16, 0.14);
  put(o.frame, lat, y0 + h + 0.2, 0.08, w + 0.5, 0.08, 0.2);
  const leaves = o.double ? [-1, 1] : [0];
  const lw = o.double ? w / 2 - 0.03 : w - 0.04;
  for (const side of leaves) {
    const lc = lat + side * (w / 4);
    put(o.leaf, lc, y0 + h / 2, 0.04, lw, h - 0.04, 0.06);
    if (o.glazed) {
      put(o.glass ?? 0x6f8f96, lc, y0 + h * 0.64, 0.08, lw - 0.22, h * 0.5, 0.02);
      put(trim, lc, y0 + h * 0.64, 0.09, 0.04, h * 0.5, 0.02);
      put(trim, lc, y0 + h * 0.22, 0.08, lw - 0.26, h * 0.22, 0.03);
    } else {
      for (const fy of [0.27, 0.7]) put(trim, lc, y0 + h * fy, 0.08, lw - 0.26, h * 0.34, 0.03);
    }
    const hx = o.double ? lc - side * (lw / 2 - 0.12) : lc + lw / 2 - 0.15;
    put(o.handle ?? 0xc9b16f, hx, y0 + h * 0.46, 0.1, 0.05, o.double ? 0.3 : 0.06, 0.06);
    put(o.handle ?? 0xc9b16f, hx, y0 + h * 0.46, 0.13, o.double ? 0.05 : 0.14, 0.05, 0.05);
  }
  put(0x9d978a, lat, y0 + 0.03, 0.12, w + 0.4, 0.06, 0.26);
}

export interface WindowOptions {
  shutter?: number;
  louvers?: number;
  flowers?: number[];
  lintel?: number;
}

export function detailedWindow(F: Face, lat: number, y: number, w: number, h: number, o: WindowOptions = {}) {
  const { put } = F;
  F.win(lat, y, w, h);
  for (const dy of [-h / 4, h / 4]) put(0xdcd6c7, lat, y + dy, 0.2, w, 0.04, 0.03);
  put(o.lintel ?? 0xf0ebdc, lat, y + h / 2 + 0.24, 0.06, w + 0.6, 0.16, 0.18);
  if (o.louvers !== undefined) {
    for (let k = 0; k < 7; k++) put(o.louvers, lat, y - h / 2 + (k + 0.5) * (h / 7), 0.24, w - 0.04, 0.03, 0.14, -0.45);
  }
  if (o.shutter !== undefined) {
    const sw = w / 2 + 0.04;
    for (const side of [-1, 1]) {
      const sl = lat + side * (w / 2 + 0.18 + sw / 2);
      put(o.shutter, sl, y, 0.05, sw, h + 0.2, 0.05);
      for (let yy = y - h / 2 + 0.05; yy < y + h / 2; yy += 0.13) put(0x4e5b4f, sl, yy, 0.09, sw - 0.12, 0.035, 0.025);
      for (const dy of [-h / 3, h / 3]) put(0x333331, lat + side * (w / 2 + 0.17), y + dy, 0.08, 0.08, 0.05, 0.05);
    }
  }
  if (o.flowers) {
    put(0x7a5236, lat, y - h / 2 - 0.36, 0.22, w + 0.15, 0.26, 0.3);
    put(0x5f8f45, lat, y - h / 2 - 0.17, 0.22, w + 0.05, 0.16, 0.26);
    let k = 0;
    for (let dl = -w / 2 + 0.1; dl <= w / 2; dl += 0.22) put(o.flowers[k++ % o.flowers.length], lat + dl, y - h / 2 - 0.06, 0.24 + (k % 2) * 0.06, 0.12, 0.1, 0.12);
  }
}

/** Downspout running from `top` to the ground on a wall. */
export function downspout(F: Face, lat: number, top: number, color = 0x8c9089) {
  const { put } = F;
  put(color, lat, top - 0.1, 0.16, 0.26, 0.22, 0.22);
  put(color, lat, top / 2, 0.12, 0.12, top - 0.2, 0.12);
  put(color, lat, 0.12, 0.25, 0.14, 0.12, 0.3);
  for (let y = 0.8; y < top - 0.3; y += 1.1) put(0x5a5c57, lat, y, 0.08, 0.2, 0.05, 0.08);
}

export function stain(F: Face, lat: number, y: number, w: number, h: number, color = 0xd6cfba) {
  F.put(color, lat, y, 0.012, w, h, 0.02);
}

export function wallLamp(F: Face, lat: number, y: number, glow = 0xf3d27a) {
  const { put } = F;
  put(0x2f2d2a, lat, y + 0.25, 0.05, 0.16, 0.22, 0.08);
  put(0x2f2d2a, lat, y + 0.3, 0.2, 0.05, 0.05, 0.3);
  put(0x2f2d2a, lat, y + 0.17, 0.34, 0.3, 0.06, 0.3);
  put(glow, lat, y, 0.34, 0.2, 0.3, 0.2);
  put(0x2f2d2a, lat, y - 0.17, 0.34, 0.24, 0.05, 0.24);
}

export function plant(kit: Kit, x: number, z: number, y0: number, pot: number, flowers: number[], s = 1) {
  kit.box(pot, x, y0 + 0.22 * s, z, 0.42 * s, 0.44 * s, 0.42 * s);
  kit.box(pot, x, y0 + 0.46 * s, z, 0.5 * s, 0.08 * s, 0.5 * s);
  kit.box(0x5a4632, x, y0 + 0.49 * s, z, 0.38 * s, 0.03, 0.38 * s);
  kit.box(0x4f8040, x, y0 + 0.68 * s, z, 0.55 * s, 0.38 * s, 0.55 * s);
  kit.box(0x5f8f45, x + 0.06 * s, y0 + 0.92 * s, z - 0.05 * s, 0.36 * s, 0.26 * s, 0.38 * s);
  flowers.forEach((color, i) => {
    const a = i * 2.1;
    kit.box(color, x + Math.cos(a) * 0.2 * s, y0 + (0.88 + (i % 2) * 0.14) * s, z + Math.sin(a) * 0.2 * s, 0.13 * s, 0.11 * s, 0.13 * s);
  });
}

export function palm(kit: Kit, x: number, z: number, y0: number, s = 1) {
  kit.box(0x9c5b3b, x, y0 + 0.25 * s, z, 0.5 * s, 0.5 * s, 0.5 * s);
  kit.box(0x8a4f33, x, y0 + 0.52 * s, z, 0.58 * s, 0.08 * s, 0.58 * s);
  for (let i = 0; i < 4; i++) kit.box(0x8c7656, x + i * 0.03 * s, y0 + (0.75 + i * 0.32) * s, z, 0.12 * s, 0.34 * s, 0.12 * s);
  const top: Vec3 = [x + 0.12 * s, y0 + 1.9 * s, z];
  for (let k = 0; k < 6; k++) {
    const a = k * Math.PI / 3 + 0.3;
    beam(kit, k % 2 ? 0x4f8040 : 0x5f8f45, top, [top[0] + Math.cos(a) * 0.75 * s, top[1] - 0.35 * s, top[2] + Math.sin(a) * 0.75 * s], 0.22 * s, 0.04);
  }
}

export function bench(kit: Kit, x: number, z: number, y0: number, len: number, ry = 0, wood = 0x9a8967, metal = 0x3f4240) {
  const c = Math.cos(ry);
  const s = Math.sin(ry);
  const p = (lat: number, out: number): [number, number] => [x + c * lat + s * out, z - s * lat + c * out];
  for (const lat of [-len / 2 + 0.15, len / 2 - 0.15]) {
    for (const out of [-0.15, 0.15]) {
      const [px, pz] = p(lat, out);
      kit.box(metal, px, y0 + 0.21, pz, 0.06, 0.42, 0.06, 0, ry);
    }
    const [bx, bz] = p(lat, -0.24);
    kit.box(metal, bx, y0 + 0.62, bz, 0.06, 0.5, 0.06, 0, ry);
  }
  for (const out of [-0.12, 0, 0.12]) {
    const [px, pz] = p(0, out);
    kit.box(wood, px, y0 + 0.45, pz, len, 0.05, 0.1, 0, ry);
  }
  for (const y of [0.62, 0.78]) {
    const [px, pz] = p(0, -0.25);
    kit.box(wood, px, y0 + y, pz, len, 0.1, 0.04, 0, ry);
  }
}

const stripeCache = new Map<string, THREE.CanvasTexture>();

/** Vertical stripes texture (u direction) used for umbrella canopies. */
export function stripeTexture(a: string, b: string, stripes: number): THREE.CanvasTexture {
  const key = `${a}-${b}-${stripes}`;
  const cached = stripeCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = stripes * 16;
  canvas.height = 4;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create stripe texture.");
  for (let i = 0; i < stripes; i++) {
    context.fillStyle = i % 2 ? b : a;
    context.fillRect(i * 16, 0, 16, 4);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  stripeCache.set(key, texture);
  return texture;
}

export interface HipRoofOptions {
  x0: number; x1: number; z0: number; z1: number;
  eave: number; rise: number; runX: number; runZ: number;
  color: number; rib: number; course: number; cap: number; fascia: number;
  gutter?: number; ribStep?: number; courses?: number; patches?: number[];
}

/** Hipped tile roof (ridge or flat top) built from one custom mesh plus batched tile detail. */
export function hipRoof(kit: Kit, o: HipRoofOptions) {
  const { x0, x1, z0, z1, eave, rise, runX, runZ } = o;
  const outer = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
  const inner = [[x0 + runX, z1 - runZ], [x1 - runX, z1 - runZ], [x1 - runX, z0 + runZ], [x0 + runX, z0 + runZ]];
  const points: number[] = [];
  for (let k = 0; k < 4; k++) {
    const n = (k + 1) % 4;
    const a = [outer[k][0], eave, outer[k][1]];
    const b = [outer[n][0], eave, outer[n][1]];
    const c = [inner[n][0], eave + rise, inner[n][1]];
    const d = [inner[k][0], eave + rise, inner[k][1]];
    points.push(...a, ...b, ...c, ...a, ...c, ...d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const uv: number[] = [];
  for (let p = 0; p < points.length; p += 3) uv.push(points[p] / 3, points[p + 2] / 3);
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  kit.solid(geometry, o.color, 0, 0, 0, buildingTexture("tile"));

  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const faces = [
    { f: 0, x: cx, z: z1, half: (x1 - x0) / 2, perp: runZ, hip: runX },
    { f: Math.PI / 2, x: x1, z: cz, half: (z1 - z0) / 2, perp: runX, hip: runZ },
    { f: Math.PI, x: cx, z: z0, half: (x1 - x0) / 2, perp: runZ, hip: runX },
    { f: -Math.PI / 2, x: x0, z: cz, half: (z1 - z0) / 2, perp: runX, hip: runZ },
  ];
  const step = o.ribStep ?? 0.34;
  const courses = o.courses ?? 6;
  let seed = 7;
  for (const fc of faces) {
    const F = face(kit, fc.x, fc.z, fc.f);
    const angle = Math.atan2(rise, fc.perp);
    const length = Math.hypot(rise, fc.perp);
    const lift = (n: number, t: number) => [eave + rise * t + n * Math.cos(angle), -fc.perp * t + n * Math.sin(angle)];
    for (let lat = -fc.half + step / 2; lat < fc.half; lat += step) {
      const inside = fc.half - Math.abs(lat);
      const tmax = Math.min(1, fc.hip > 0 ? inside / fc.hip : 1);
      if (tmax < 0.06) continue;
      const [y, out] = lift(0.06, tmax / 2);
      F.put(o.rib, lat, y, out, 0.1, 0.07, length * tmax, angle);
    }
    for (let k = 1; k < courses; k++) {
      const t = k / courses;
      const [y, out] = lift(0.05, t);
      F.put(o.course, 0, y, out, 2 * (fc.half - fc.hip * t), 0.05, 0.08, angle);
    }
    if (o.patches) {
      for (let k = 0; k < 4; k++) {
        seed = (seed * 9301 + 49297) % 233280;
        const t = 0.15 + (seed / 233280) * 0.55;
        seed = (seed * 9301 + 49297) % 233280;
        const room = fc.half - fc.hip * (t + 0.15) - 0.5;
        if (room <= 0) continue;
        const lat = ((seed / 233280) * 2 - 1) * room;
        const [y, out] = lift(0.035, t);
        F.put(o.patches[k % o.patches.length], lat, y, out, 0.9, 0.03, 0.6, angle);
      }
    }
    F.put(o.fascia, 0, eave - 0.1, 0.03, 2 * fc.half + 0.06, 0.2, 0.1);
    if (o.gutter !== undefined) {
      F.put(o.gutter, 0, eave - 0.14, 0.12, 2 * fc.half + 0.2, 0.12, 0.12);
      F.put(o.gutter, 0, eave - 0.06, 0.17, 2 * fc.half + 0.2, 0.06, 0.03);
    }
  }
  for (let k = 0; k < 4; k++) {
    beam(kit, o.cap, [outer[k][0], eave + 0.1, outer[k][1]], [inner[k][0], eave + rise + 0.1, inner[k][1]], 0.2, 0.14);
  }
  for (let k = 0; k < 4; k++) {
    const n = (k + 1) % 4;
    const a = inner[k];
    const b = inner[n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 0.1) continue;
    beam(kit, o.cap, [a[0], eave + rise + 0.1, a[1]], [b[0], eave + rise + 0.1, b[1]], 0.24, 0.16);
    for (let t = 0.2; t < len; t += 0.45) {
      const px = a[0] + (b[0] - a[0]) * t / len;
      const pz = a[1] + (b[1] - a[1]) * t / len;
      kit.box(o.rib, px, eave + rise + 0.19, pz, 0.12, 0.06, 0.12);
    }
  }
  return { outer, inner };
}
