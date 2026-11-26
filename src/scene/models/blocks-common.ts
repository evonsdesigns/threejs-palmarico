import * as THREE from "three";
import { Kit } from "./kit";

/** A building face: origin (cx, cz) on the wall plane, outward normal = (sin yaw, cos yaw). */
export interface Face {
  /** box in face space: u along the wall (right when looking at it), n outward from wall. */
  fb: (color: number, u: number, y: number, n: number, w: number, h: number, d: number, yawOff?: number) => void;
  /** kit.window in face space (n is outward offset of the frame). */
  win: (u: number, y: number, n: number, w: number, h: number) => void;
  at: (u: number, n: number) => [number, number];
  yaw: number;
}

export function makeFace(kit: Kit, cx: number, cz: number, yaw: number): Face {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const at = (u: number, n: number): [number, number] => [cx + u * c + n * s, cz - u * s + n * c];
  return {
    yaw,
    at,
    fb: (color, u, y, n, w, h, d, yawOff = 0) => {
      const [x, z] = at(u, n);
      kit.box(color, x, y, z, w, h, d, 0, yaw + yawOff);
    },
    win: (u, y, n, w, h) => {
      const [x, z] = at(u, n);
      kit.window(x, y, z, w, h, yaw);
    },
  };
}

/** Pair of louvred shutters beside a window; open = angle the shutters swing out (0 = flat against wall). */
export function shutters(f: Face, u: number, y: number, w: number, h: number, color: number, slat: number, open = 0.25, skipLeft = false, skipRight = false) {
  const sw = w / 2 + 0.05;
  for (const side of [-1, 1]) {
    if ((side < 0 && skipLeft) || (side > 0 && skipRight)) continue;
    if (open < 0) {
      // Closed: each leaf covers half the window.
      f.fb(color, u + side * w / 4, y, 0.16, w / 2, h + 0.05, 0.05);
      for (let sy = -h / 2 + 0.15; sy < h / 2 - 0.05; sy += 0.18) f.fb(slat, u + side * w / 4, y + sy, 0.2, w / 2 - 0.08, 0.035, 0.03);
      continue;
    }
    const hingeU = u + side * (w / 2 + 0.15);
    const cu = hingeU + side * Math.cos(open) * sw / 2;
    const cn = 0.12 + Math.sin(open) * sw / 2;
    f.fb(color, cu, y, cn, sw, h + 0.1, 0.06, -side * open);
    for (let sy = -h / 2 + 0.15; sy < h / 2 - 0.05; sy += 0.18) {
      f.fb(slat, cu + side * 0.0, y + sy, cn + 0.04, sw * 0.82, 0.035, 0.03, -side * open);
    }
  }
}

/** Simple rail with posts along u from u0 to u1 at outward offset n. */
export function railing(f: Face, u0: number, u1: number, y: number, n: number, h: number, color: number, spacing = 0.3, bar = 0.05) {
  const len = u1 - u0;
  f.fb(color, (u0 + u1) / 2, y + h, n, len + bar, 0.07, 0.07);
  f.fb(color, (u0 + u1) / 2, y + 0.12, n, len, 0.05, 0.05);
  const count = Math.max(1, Math.round(len / spacing));
  for (let i = 0; i <= count; i++) f.fb(color, u0 + (len * i) / count, y + h / 2, n, bar, h, bar);
}

/** Wall-mounted air conditioner box with grille. */
export function acUnit(f: Face, u: number, y: number, n = 0) {
  f.fb(0xc9c6b8, u, y, n + 0.3, 0.8, 0.5, 0.6);
  f.fb(0x6e7270, u, y, n + 0.61, 0.66, 0.36, 0.03);
  for (let i = -2; i <= 2; i++) f.fb(0x9fa19a, u, y + i * 0.07, n + 0.63, 0.62, 0.025, 0.02);
  f.fb(0x6d6a63, u - 0.3, y - 0.28, n + 0.45, 0.06, 0.06, 0.5);
  f.fb(0x6d6a63, u + 0.3, y - 0.28, n + 0.45, 0.06, 0.06, 0.5);
}

/** Downspout from yTop down to ground along a wall, with brackets and a shoe. */
export function downspout(f: Face, u: number, yTop: number, n: number, color = 0x6f736c) {
  f.fb(color, u, yTop / 2 + 0.1, n + 0.12, 0.16, yTop - 0.2, 0.16);
  f.fb(color, u, yTop - 0.05, n + 0.22, 0.32, 0.2, 0.36);
  for (let y = 1.2; y < yTop - 0.5; y += 2.2) f.fb(0x4a4d48, u, y, n + 0.05, 0.24, 0.06, 0.14);
  f.fb(color, u, 0.12, n + 0.3, 0.18, 0.12, 0.4);
}

const CLOTHES = [0xd8d2c2, 0x3f6d9a, 0xc2493f, 0xe4c55a, 0x6e9a63, 0xf1eee6, 0x9a5f87, 0x2f3f52, 0xd98a55, 0x88b4c7];

/** Laundry line along u between u0 and u1 at height y (wire) with hanging clothes; seed varies the garments. */
export function laundry(f: Face, u0: number, u1: number, y: number, n: number, seed: number, density = 0.55) {
  f.fb(0x8a8a82, (u0 + u1) / 2, y, n, u1 - u0, 0.025, 0.025);
  let r = seed * 9301 + 49297;
  const rnd = () => {
    r = (r * 9301 + 49297) % 233280;
    return r / 233280;
  };
  for (let u = u0 + 0.3; u < u1 - 0.3; u += density + rnd() * 0.35) {
    const color = CLOTHES[Math.floor(rnd() * CLOTHES.length)];
    const kind = rnd();
    if (kind < 0.35) {
      // shirt
      f.fb(color, u, y - 0.3, n, 0.45, 0.55, 0.03);
      f.fb(color, u, y - 0.1, n, 0.7, 0.16, 0.03);
    } else if (kind < 0.6) {
      // trousers
      f.fb(color, u - 0.08, y - 0.4, n, 0.13, 0.75, 0.03);
      f.fb(color, u + 0.08, y - 0.4, n, 0.13, 0.75, 0.03);
      f.fb(color, u, y - 0.08, n, 0.32, 0.14, 0.03);
    } else if (kind < 0.8) {
      // sheet / towel
      const w = 0.5 + rnd() * 0.5;
      f.fb(color, u + w / 2 - 0.2, y - 0.38, n, w, 0.72, 0.025);
      u += w * 0.6;
    } else {
      // small items
      f.fb(color, u, y - 0.14, n, 0.18, 0.26, 0.03);
      f.fb(CLOTHES[(Math.floor(rnd() * 10) + 3) % 10], u + 0.22, y - 0.12, n, 0.14, 0.2, 0.03);
    }
    f.fb(0xc7b48a, u, y + 0.02, n, 0.04, 0.08, 0.05);
  }
}

/** TV antenna mast with cross elements. */
export function antenna(kit: Kit, x: number, y: number, z: number, h: number, ry = 0) {
  kit.box(0x5b5e5a, x, y + h / 2, z, 0.07, h, 0.07);
  for (let i = 0; i < 3; i++) {
    const yy = y + h - 0.15 - i * 0.35;
    const w = 1.3 - i * 0.3;
    kit.box(0x6b6e69, x, yy, z, w, 0.04, 0.04, 0, ry);
    for (let j = -2; j <= 2; j++) {
      const ox = Math.cos(ry) * j * w / 5;
      const oz = -Math.sin(ry) * j * w / 5;
      kit.box(0x7a7d77, x + ox, yy, z + oz, 0.03, 0.03, 0.4, 0, ry);
    }
  }
  kit.box(0x4a4c49, x, y + 0.08, z, 0.3, 0.16, 0.3);
}

/** Cylindrical water tank on a steel stand (uses 2 solids). */
export function waterTank(kit: Kit, x: number, y: number, z: number, r: number, h: number, color: number, stand = 0.9) {
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
    kit.box(0x55524b, x + dx * r * 0.6, y + stand / 2, z + dz * r * 0.6, 0.1, stand, 0.1);
  }
  kit.box(0x55524b, x, y + stand - 0.05, z, r * 1.5, 0.1, r * 1.5);
  kit.box(0x5f5c55, x, y + stand * 0.4, z + r * 0.6, r * 1.2, 0.05, 0.05, 0.6);
  kit.solid(new THREE.CylinderGeometry(r, r, h, 16), color, x, y + stand + h / 2, z);
  kit.solid(new THREE.CylinderGeometry(r * 0.4, r * 1.02, 0.2, 16), color, x, y + stand + h + 0.1, z);
  kit.box(0x6c6a62, x + r * 0.7, y + stand + 0.2, z + r * 0.4, 0.08, 0.08, 0.6);
  kit.box(0x6c6a62, x + r * 0.7, y + stand / 2, z + r * 0.7, 0.08, stand, 0.08);
}
