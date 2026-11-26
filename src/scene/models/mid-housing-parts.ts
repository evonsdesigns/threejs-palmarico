import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { buildingTexture } from "../building-textures";
import { Kit } from "./kit";

type V3 = [number, number, number];

/** Box placed in wall-local coordinates: u along the wall, n out of the wall. facing 0 = +z. */
export function wallBox(kit: Kit, facing: number, cx: number, cz: number) {
  const c = Math.cos(facing);
  const s = Math.sin(facing);
  return (color: number, u: number, y: number, n: number, w: number, h: number, d: number) =>
    kit.box(color, cx + u * c + n * s, y, cz - u * s + n * c, w, h, d, 0, facing);
}

export function wallPoint(facing: number, cx: number, cz: number, u: number, n: number): [number, number] {
  return [cx + u * Math.cos(facing) + n * Math.sin(facing), cz - u * Math.sin(facing) + n * Math.cos(facing)];
}

/** Window from the kit with louvred shutters (open) and an optional head trim. */
export function shutteredWindow(
  kit: Kit, facing: number, cx: number, cz: number, u: number, y: number,
  w: number, h: number, shutter: number, slat: number, open = true,
) {
  const b = wallBox(kit, facing, cx, cz);
  const [wx, wz] = wallPoint(facing, cx, cz, u, 0);
  kit.window(wx, y, wz, w, h, facing);
  const sw = w / 2 + 0.04;
  for (const side of [-1, 1]) {
    const su = open ? u + side * (w / 2 + 0.2 + sw / 2) : u + side * sw / 2;
    const sn = open ? 0.06 : 0.22;
    b(shutter, su, y, sn, sw, h + 0.15, 0.06);
    for (let t = -h / 2 + 0.12; t < h / 2 - 0.05; t += 0.16) b(slat, su, y + t, sn + 0.04, sw - 0.08, 0.035, 0.03);
  }
  b(0xd9d0b8, u, y + h / 2 + 0.27, 0.12, w + 0.55, 0.14, 0.22);
}

/** Panelled door with frame, transom, knob and a step. */
export function panelDoor(
  kit: Kit, facing: number, cx: number, cz: number, u: number, y0: number,
  w: number, h: number, color: number, frame: number, panel: number,
) {
  const b = wallBox(kit, facing, cx, cz);
  b(frame, u, y0 + h / 2 + 0.1, 0.03, w + 0.3, h + 0.25, 0.1);
  b(color, u, y0 + h / 2, 0.08, w, h, 0.08);
  for (const py of [0.28, 0.62]) for (const pu of [-0.22, 0.22]) {
    b(panel, u + pu * w, y0 + h * py, 0.13, w * 0.34, h * 0.26, 0.03);
  }
  b(0x3f4e52, u, y0 + h + 0.32, 0.06, w, 0.32, 0.05);
  b(0xc9b16f, u + w * 0.36, y0 + h * 0.48, 0.15, 0.07, 0.07, 0.07);
}

/** Vertical downspout with a little shoe at the bottom. */
export function downspout(kit: Kit, color: number, x: number, z: number, top: number, bottom = 0.1) {
  kit.box(color, x, (top + bottom) / 2, z, 0.12, top - bottom, 0.12);
  kit.box(color, x, bottom + 0.06, z, 0.16, 0.12, 0.16);
  for (let y = bottom + 0.8; y < top - 0.3; y += 1.4) kit.box(0x4b4b45, x, y, z, 0.16, 0.05, 0.16);
}

export function cylinder(kit: Kit, color: number, x: number, y: number, z: number, r: number, h: number, segments = 10, rTop = r, map: THREE.Texture | null = null) {
  return kit.solid(new THREE.CylinderGeometry(rTop, r, h, segments), color, x, y, z, map);
}

/** Simple palm: leaning trunk segments plus a crown of fronds (boxes). */
export function palm(kit: Kit, x: number, z: number, height: number, lean = 0.25, yaw = 0) {
  const segs = 6;
  for (let i = 0; i < segs; i++) {
    const t = (i + 0.5) / segs;
    const off = lean * t * t * height * 0.3;
    kit.box(i % 2 ? 0x7a6448 : 0x8a7354, x + off * Math.cos(yaw), t * height, z + off * Math.sin(yaw), 0.32 - t * 0.08, height / segs + 0.04, 0.32 - t * 0.08);
  }
  const tx = x + lean * height * 0.3 * Math.cos(yaw);
  const tz = z + lean * height * 0.3 * Math.sin(yaw);
  kit.box(0x6b5a3a, tx, height, tz, 0.4, 0.3, 0.4);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + yaw;
    const c = k % 2 ? 0x4f7a34 : 0x3f6a2c;
    kit.box(c, tx + Math.sin(a) * 0.45, height + 0.02, tz + Math.cos(a) * 0.45, 0.42, 0.06, 0.8, 0, a);
    kit.box(c, tx + Math.sin(a) * 1.05, height - 0.18, tz + Math.cos(a) * 1.05, 0.34, 0.06, 0.6, 0, a);
    kit.box(0x5d8a3e, tx + Math.sin(a) * 1.45, height - 0.45, tz + Math.cos(a) * 1.45, 0.22, 0.05, 0.4, 0, a);
  }
}

/** Round shrub cluster built from a few boxes. */
export function shrub(kit: Kit, x: number, y: number, z: number, s: number, color = 0x4c7436) {
  kit.box(color, x, y + s * 0.4, z, s, s * 0.8, s);
  kit.box(0x5f8a43, x + s * 0.15, y + s * 0.7, z - s * 0.1, s * 0.7, s * 0.5, s * 0.7, 0, 0.6);
  kit.box(0x3e6530, x - s * 0.2, y + s * 0.5, z + s * 0.2, s * 0.6, s * 0.6, s * 0.6, 0, 0.3);
}

/** Triangular-section rib strips laid along given segments; merged into one mesh. */
export function ribs(kit: Kit, segments: [V3, V3][], width: number, height: number, color: number, lift = 0.02) {
  const pts: number[] = [];
  for (const [a, b] of segments) {
    const dx = b[0] - a[0];
    const dz = b[2] - a[2];
    let px = -dz;
    let pz = dx;
    const len = Math.hypot(px, pz) || 1;
    px = (px / len) * width / 2;
    pz = (pz / len) * width / 2;
    const L = (p: V3): V3 => [p[0] + px, p[1] + lift, p[2] + pz];
    const R = (p: V3): V3 => [p[0] - px, p[1] + lift, p[2] - pz];
    const A = (p: V3): V3 => [p[0], p[1] + lift + height, p[2]];
    pts.push(...L(a), ...A(a), ...A(b), ...L(a), ...A(b), ...L(b));
    pts.push(...A(a), ...R(a), ...R(b), ...A(a), ...R(b), ...A(b));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  g.computeVertexNormals();
  return kit.solid(g, color, 0, 0, 0);
}

export interface HipRoofOptions {
  x: number; z: number; w: number; d: number; eave: number; rise: number;
  color: number; ribColor?: number; ridgeColor?: number; ribSpacing?: number; courses?: number; courseColor?: number;
  fascia?: number;
}

/** Hipped (or pyramidal) tiled roof with barrel-tile ribs, courses, hip/ridge caps and fascia. */
export function hipRoof(kit: Kit, o: HipRoofOptions) {
  const W = o.w / 2;
  const D = o.d / 2;
  const m = Math.min(W, D);
  const iw = W - m;
  const id = D - m;
  const top = o.eave + o.rise;
  const outer: [number, number][] = [[-W, D], [W, D], [W, -D], [-W, -D]];
  const inner: [number, number][] = [[-iw, id], [iw, id], [iw, -id], [-iw, -id]];
  const p: number[] = [];
  for (let k = 0; k < 4; k++) {
    const n = (k + 1) % 4;
    const a = [o.x + outer[k][0], o.eave, o.z + outer[k][1]];
    const b = [o.x + outer[n][0], o.eave, o.z + outer[n][1]];
    const c = [o.x + inner[n][0], top, o.z + inner[n][1]];
    const d = [o.x + inner[k][0], top, o.z + inner[k][1]];
    p.push(...a, ...b, ...c, ...a, ...c, ...d);
  }
  const roof = new THREE.BufferGeometry();
  roof.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  const uv: number[] = [];
  for (let i = 0; i < p.length; i += 3) uv.push((p[i] + p[i + 2]) / 3, p[i + 1] / 1.2);
  roof.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  roof.computeVertexNormals();
  kit.solid(roof, o.color, 0, 0, 0, buildingTexture("tile"));

  const sp = o.ribSpacing ?? 0.42;
  const segs: [V3, V3][] = [];
  for (let u = -W + sp / 2; u < W; u += sp) {
    const s = Math.min(1, (W - Math.abs(u)) / m);
    if (s < 0.08) continue;
    for (const side of [-1, 1]) {
      segs.push([[o.x + u, o.eave, o.z + side * D], [o.x + u, o.eave + s * o.rise, o.z + side * (D - s * m)]]);
    }
  }
  for (let v = -D + sp / 2; v < D; v += sp) {
    const s = Math.min(1, (D - Math.abs(v)) / m);
    if (s < 0.08) continue;
    for (const side of [-1, 1]) {
      segs.push([[o.x + side * W, o.eave, o.z + v], [o.x + side * (W - s * m), o.eave + s * o.rise, o.z + v]]);
    }
  }
  ribs(kit, segs, sp * 0.62, 0.09, o.ribColor ?? 0xc0714a);

  const caps: [V3, V3][] = [];
  for (let k = 0; k < 4; k++) {
    caps.push([[o.x + outer[k][0], o.eave, o.z + outer[k][1]], [o.x + inner[k][0], top, o.z + inner[k][1]]]);
  }
  if (iw > 0.01) caps.push([[o.x - iw, top, o.z], [o.x + iw, top, o.z]]);
  if (id > 0.01) caps.push([[o.x, top, o.z - id], [o.x, top, o.z + id]]);
  ribs(kit, caps, 0.3, 0.16, o.ridgeColor ?? 0x8f4a2c, 0.04);

  const courses = o.courses ?? 5;
  const cc = o.courseColor ?? 0x7f3f26;
  for (let i = 1; i < courses; i++) {
    const t = i / courses;
    const y = o.eave + o.rise * t + 0.02;
    const ww = 2 * (W - t * m);
    const dd = 2 * (D - t * m);
    for (const side of [-1, 1]) {
      kit.box(cc, o.x, y, o.z + side * (D - t * m), ww, 0.05, 0.07);
      kit.box(cc, o.x + side * (W - t * m), y, o.z, 0.07, 0.05, dd);
    }
  }
  const f = o.fascia ?? 0xe8dfc8;
  for (const side of [-1, 1]) {
    kit.box(f, o.x, o.eave - 0.1, o.z + side * D, o.w + 0.1, 0.22, 0.1);
    kit.box(f, o.x + side * W, o.eave - 0.1, o.z, 0.1, 0.22, o.d + 0.1);
  }
}

/** Arcade/frieze wall with semicircular arch openings, extruded along z (faces +z). */
export function arcade(
  kit: Kit, color: number, x0: number, x1: number, y0: number, y1: number, z: number, thickness: number,
  arches: { x: number; w: number; spring: number }[], map: THREE.Texture | null = null,
) {
  const shape = new THREE.Shape();
  shape.moveTo(x0, y0);
  shape.lineTo(x1, y0);
  shape.lineTo(x1, y1);
  shape.lineTo(x0, y1);
  shape.lineTo(x0, y0);
  for (const a of arches) {
    const r = a.w / 2;
    const hole = new THREE.Path();
    hole.moveTo(a.x - r, y0 - 0.001);
    hole.lineTo(a.x + r, y0 - 0.001);
    hole.lineTo(a.x + r, a.spring);
    hole.absarc(a.x, a.spring, r, 0, Math.PI, false);
    hole.lineTo(a.x - r, y0 - 0.001);
    shape.holes.push(hole);
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 8 });
  if (map) {
    const uv = g.getAttribute("uv");
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3, uv.getY(i) / 3);
  }
  return kit.solid(g, color, 0, 0, z - thickness / 2, map);
}

/** Many half-disc arch heads (fanlights/trims) merged into one mesh. */
export function archHeads(kit: Kit, color: number, items: { x: number; y: number; z: number; r: number; facing: number; inner?: number }[]) {
  if (!items.length) return;
  const parts: THREE.BufferGeometry[] = [];
  for (const it of items) {
    const g = it.inner
      ? new THREE.RingGeometry(it.inner, it.r, 10, 1, 0, Math.PI)
      : new THREE.CircleGeometry(it.r, 10, 0, Math.PI);
    g.rotateY(it.facing);
    g.translate(it.x, it.y, it.z);
    parts.push(g.index ? g.toNonIndexed() : g);
  }
  const merged = mergeGeometries(parts);
  if (merged) kit.solid(merged, color, 0, 0, 0);
}
