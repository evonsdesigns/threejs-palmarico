import * as THREE from "three";
import type { Kit } from "./kit";
import { acUnit, antenna, type Face, laundry, makeFace, railing, shutters, waterTank } from "./blocks-common";

// Main block x [-7.6, 5.2], z [-5.0, 3.4]; access galleries to z 5.2; open stair x [5.3, 7.8].
const X0 = -7.6;
const X1 = 5.2;
const Z0 = -5.0;
const Z1 = 3.4;
const CX = (X0 + X1) / 2;
const CZ = (Z0 + Z1) / 2;
const W = X1 - X0;
const D = Z1 - Z0;
const GAL = 1.8;
const LV = [0.35, 3.35, 6.35];
const TOP = 9.35;
const LAST = LV[LV.length - 1];

const WALL = 0x92908a;
const SLAB = 0x8a877e;
const STAIN = 0x6e6c64;
const MOLD = 0x5d6650;
const RUST = 0x7a4a32;
const RUST_DARK = 0x5e3a2a;
const IRON = 0x3d3936;
const BRICK = 0xa6573b;
const PAINTS = [0xa8b5b8, 0xe2d3a9, 0xe9c98d, 0xded8c0, WALL, 0xe7bd70];
const SHUTTERS: [number, number][] = [
  [0x537a9a, 0x41627c], [0x65a39b, 0x4f8780], [0x668374, 0x52695c], [0xb28b60, 0x8f6d48],
  [0x9a8967, 0x7b6c50], [0xb5513f, 0x8f3e30], [0x755b43, 0x5c4634],
];
const COLUMNS = [-7.65, -4.55, -1.3, 1.95, 5.2, 7.65];
const UNITS = [-4.8, -1.6, 1.6, 4.8];
const STAIR_RUN = 4.4;
const STAIR_RISE = 1.5;

/** Front doors of every flat (the ground-floor bodega has none), by floor. */
export const TENEMENT_DOORS = LV.map((_, level) => UNITS.filter((_, j) => level > 0 || j > 0).map((uc) => CX + uc - 0.75));
export const TENEMENT_FLOORS = LV.length;

/** Walking route from a flat door on `level` along the gallery and up both stair flights to a door one floor higher. */
export function tenementStairRoute(level: number, fromX: number, toX: number): [number, number, number][] {
  const floor = (i: number) => (i === 0 ? 0.25 : LV[i]);
  const L = LV[level];
  const lane = Z1 + 1.0;
  const landing = L + STAIR_RISE;
  const top = floor(level + 1);
  return [
    [fromX, floor(level), Z1 + 0.45], [fromX, floor(level), lane], [7.2, floor(level), lane], [7.2, L, Z1],
    [7.2, landing, Z1 - STAIR_RUN], [7.2, landing, -1.75], [5.85, landing, -1.75], [5.85, landing, Z1 - STAIR_RUN],
    [5.85, top, Z1], [5.85, top, lane], [toX, top, lane], [toX, top, Z1 + 0.45],
  ];
}

export function buildTenement(kit: Kit) {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rnd() * list.length)];

  const front = makeFace(kit, CX, Z1, 0);
  const back = makeFace(kit, CX, Z0, Math.PI);
  const left = makeFace(kit, X0, CZ, -Math.PI / 2);
  const right = makeFace(kit, X1, CZ, Math.PI / 2);

  shell(kit);
  frontUnits(front, rnd, pick);
  galleries(kit, front, rnd, pick);
  stairs(kit);
  backFacade(back, rnd, pick);
  leftFacade(left, rnd, pick);
  rightFacade(right, rnd, pick);
  roof(kit, rnd, pick);
  street(kit, front);
}

type Rnd = () => number;
type Pick = <T>(list: readonly T[]) => T;

function shell(kit: Kit) {
  const { box } = kit;
  // Cracked pavement apron, foundation and stair pad.
  box(0x7b786f, 0, 0.12, 4.45, 15.9, 0.24, 2.1);
  box(0x6f6c64, CX, 0.18, CZ, W + 0.3, 0.36, D + 0.3);
  box(0x7b786f, 6.6, 0.1, 0.35, 2.7, 0.2, 6.1);
  for (const [x, z, w, d, r] of [[-5.2, 4.6, 2.2, 0.03, 0.3], [0.4, 4.1, 1.6, 0.03, -0.5], [3.6, 5.0, 2.4, 0.03, 0.15], [6.4, 1.2, 0.03, 2.6, 0.2]] as const) {
    box(0x4f4d47, x, 0.245, z, w, 0.01, d, 0, r);
  }
  box(0x6c6962, 0, 0.12, 5.6, 15.9, 0.24, 0.4);

  // Concrete walls, mouldy base and visible slab edges.
  box(WALL, CX, (LV[0] + TOP) / 2, CZ, W, TOP - LV[0], D);
  box(MOLD, CX, 0.65, CZ, W + 0.04, 0.6, D + 0.04);
  for (const L of LV.slice(1)) box(SLAB, CX, L, CZ, W + 0.12, 0.24, D + 0.12);

  // Gallery columns at the front, stair posts behind.
  for (const x of COLUMNS) {
    box(SLAB, x, (0.24 + TOP) / 2, Z1 + GAL - 0.15, 0.3, TOP - 0.24, 0.3);
    box(STAIN, x, 0.6, Z1 + GAL - 0.15, 0.34, 0.7, 0.34);
  }
  for (const x of [5.45, 7.65]) box(SLAB, x, (LAST + 1.5) / 2 + 0.1, -2.45, 0.24, LAST + 1.5, 0.24);
  box(SLAB, 7.65, (LAST + 1.5) / 2 + 0.1, -0.95, 0.2, LAST + 1.5, 0.2);
}

function frontUnits(f: Face, rnd: Rnd, pick: Pick) {
  for (const [fi, L] of LV.entries()) {
    for (const [j, uc] of UNITS.entries()) {
      if (fi === 0 && j === 0) {
        bodega(f, uc, L);
        continue;
      }
      // Each family paints its own patch of wall.
      const paint = pick(PAINTS);
      if (paint !== WALL) {
        f.fb(paint, uc, L + 1.45, 0.02, 3.0 - rnd() * 0.4, 2.6, 0.03);
        f.fb(WALL, uc + 1.0, L + 0.6 + rnd() * 1.4, 0.04, 0.6 + rnd() * 0.6, 0.5 + rnd() * 0.4, 0.02);
      }
      // Door with frame, maybe a security grille.
      const du = uc - 0.75;
      f.fb(0x5f5d57, du, L + 1.2, 0.04, 1.15, 2.45, 0.06);
      f.fb(pick([0x755b43, 0x687a80, 0x537a9a, 0x65a39b, 0x9a8967]), du, L + 1.15, 0.08, 0.95, 2.3, 0.05);
      f.fb(0x2f2d2a, du, L + 1.9, 0.11, 0.6, 0.35, 0.02);
      f.fb(0xb49a5a, du + 0.32, L + 1.15, 0.12, 0.06, 0.12, 0.05);
      if (rnd() < 0.5) {
        for (let i = 0; i < 6; i++) f.fb(IRON, du - 0.42 + i * 0.168, L + 1.15, 0.18, 0.035, 2.25, 0.035);
        for (const dy of [-0.8, 0, 0.8]) f.fb(IRON, du, L + 1.15 + dy, 0.18, 0.95, 0.04, 0.04);
      }
      f.fb(0xd8d2c2, du, L + 2.5, 0.06, 0.3, 0.16, 0.02);
      // Window with bars, boards or mismatched shutters.
      const wu = uc + 0.75;
      const wy = L + 1.6;
      const kind = rnd();
      if (kind < 0.15) {
        f.fb(0x2f2d2a, wu, wy, 0.04, 1.1, 1.2, 0.04);
        for (let i = 0; i < 4; i++) f.fb(pick([0x7d6b55, 0x9a8967, 0x755b43]), wu, wy - 0.45 + i * 0.3, 0.1, 1.3, 0.22, 0.05);
      } else {
        f.win(wu, wy, 0.05, 1.1, 1.2);
        if (kind < 0.5) {
          for (let i = 0; i < 6; i++) f.fb(RUST, wu - 0.5 + i * 0.2, wy, 0.3, 0.035, 1.3, 0.035);
          f.fb(RUST, wu, wy, 0.3, 1.2, 0.035, 0.035);
        } else {
          const [c1, s1] = pick(SHUTTERS);
          shutters(f, wu, wy, 1.1, 1.2, c1, s1, kind < 0.75 ? 0.5 + rnd() * 0.7 : -1, false, rnd() < 0.3);
        }
      }
      // Meter box, bare bulb, stains under the window.
      f.fb(0x85867c, du - 0.42, L + 2.62, 0.08, 0.3, 0.3, 0.14);
      f.fb(0xf4e2a3, uc, L + 2.75, 0.3, 0.1, 0.12, 0.1);
      f.fb(0x1e1e1c, uc, L + 2.87, 0.3, 0.02, 0.15, 0.02);
      f.fb(STAIN, wu + 0.2, wy - 1.0, 0.03, 0.12, 0.7 + rnd() * 0.6, 0.02);
      // Gallery clutter in front of doors.
      if (fi > 0) {
        const c = rnd();
        if (c < 0.25) {
          f.fb(0xb06a42, uc + 1.4, L + 0.25, 0.4, 0.35, 0.5, 0.35);
          f.fb(0x4f7a3a, uc + 1.4, L + 0.7, 0.4, 0.55, 0.5, 0.55);
        } else if (c < 0.5) {
          f.fb(0xd8d2c2, uc + 1.0, L + 0.25, 0.6, 0.45, 0.04, 0.45);
          f.fb(0xd8d2c2, uc + 1.0, L + 0.5, 0.38, 0.45, 0.5, 0.04);
          for (const d of [-0.2, 0.2]) f.fb(0xd8d2c2, uc + 1.0 + d, L + 0.12, 0.6, 0.04, 0.25, 0.4);
        } else if (c < 0.7) {
          f.fb(0x3f6d9a, uc + 1.35, L + 0.22, 0.45, 0.4, 0.45, 0.4);
          f.fb(0x6b6b58, uc + 0.9, L + 0.35, 0.35, 0.3, 0.7, 0.3);
        } else {
          f.fb(0x6b6b58, uc + 1.3, L + 0.35, 0.4, 0.5, 0.7, 0.5);
          f.fb(0x85867c, uc + 1.3, L + 0.75, 0.4, 0.55, 0.06, 0.55);
        }
      }
    }
    // Sagging wires along the gallery ceiling.
    f.fb(0x1e1e1c, 1.3, L + 2.95, 0.25, 13, 0.03, 0.03);
    f.fb(0x1e1e1c, 0.4, L + 2.82, 0.4, 8, 0.03, 0.03);
    // Water streaks below each slab edge.
    if (fi > 0) for (let u = -6.2; u < 6.3; u += 1.3 + rnd()) f.fb(STAIN, u, L - 0.4 - rnd() * 0.3, 0.02, 0.15, 0.4 + rnd() * 0.6, 0.02);
  }
}

function bodega(f: Face, uc: number, L: number) {
  f.fb(0xe7bd70, uc, L + 1.5, 0.03, 3.1, 2.9, 0.04);
  // Half-raised roll-up shutter over the counter.
  f.fb(0x2a2724, uc, L + 1.2, 0.05, 2.5, 2.2, 0.04);
  f.fb(0x858079, uc, L + 2.0, 0.1, 2.6, 0.9, 0.08);
  for (let y = 1.6; y < 2.5; y += 0.12) f.fb(0x6c6a62, uc, L + y, 0.15, 2.6, 0.02, 0.02);
  f.fb(0x9a8967, uc, L + 0.55, 0.35, 2.5, 1.0, 0.6);
  f.fb(0x7d6b55, uc, L + 1.08, 0.4, 2.6, 0.06, 0.7);
  // Shelves of goods inside.
  for (let i = 0; i < 5; i++) for (const y of [1.3, 1.55]) f.fb([0xc2493f, 0xe4c55a, 0x3f6d9a, 0xf1eee6, 0x6e9a63][(i + Math.round(y * 4)) % 5], uc - 1.0 + i * 0.5, L + y, 0.1, 0.35, 0.18, 0.08);
  // Hand-painted sign and soda advert.
  f.fb(0xc2493f, uc, L + 2.75, 0.12, 2.9, 0.42, 0.06);
  for (let i = 0; i < 6; i++) f.fb(0xf1eee6, uc - 1.1 + i * 0.44, L + 2.75, 0.16, 0.3, 0.16, 0.02);
  f.fb(0xc2493f, uc + 1.45, L + 1.0, 0.1, 0.06, 0.06, 0.06);
  f.fb(0xd8d2c2, uc - 1.45, L + 1.6, 0.08, 0.3, 0.5, 0.04);
  // Fruit crates out front.
  for (const [du, c] of [[-0.9, 0xe4c55a], [-0.3, 0x6e9a63], [0.4, 0xd98a55]] as const) {
    f.fb(0xb28b60, uc + du, L + 0.2, 1.1, 0.55, 0.32, 0.4);
    f.fb(c, uc + du, L + 0.4, 1.1, 0.48, 0.1, 0.34);
  }
  f.fb(0xc2493f, uc + 1.1, L + 0.55, 1.1, 0.5, 1.1, 0.45);
  f.fb(0xf1eee6, uc + 1.1, L + 0.8, 1.34, 0.4, 0.12, 0.02);
}

function galleries(kit: Kit, f: Face, rnd: Rnd, pick: Pick) {
  const { box } = kit;
  const levels = [...LV.slice(1), TOP];
  for (const [gi, L] of levels.entries()) {
    const isRoof = L === TOP;
    const x0 = isRoof ? X1 + 0.05 : X0;
    const width = 7.8 - x0;
    box(SLAB, x0 + width / 2, L - 0.11, Z1 + GAL / 2, width, 0.22, GAL);
    box(STAIN, x0 + width / 2, L - 0.26, Z1 + GAL - 0.04, width, 0.1, 0.1);
    // Spalled edge where rebar shows.
    for (const x of [-5.9, 0.7, 4.1]) if (!isRoof || x > X1) {
      box(0x9a9890, x, L - 0.2, Z1 + GAL + 0.005, 0.7, 0.12, 0.02);
      box(RUST_DARK, x, L - 0.2, Z1 + GAL + 0.02, 0.6, 0.025, 0.02);
    }
    // Railing bays between columns: rusty pipe rails, breeze-block parapets, or broken.
    for (let c = 0; c < COLUMNS.length - 1; c++) {
      const a = COLUMNS[c] + 0.15;
      const b = COLUMNS[c + 1] - 0.15;
      if (b <= x0) continue;
      const ua = Math.max(a, x0) - CX;
      const ub = b - CX;
      const mid = (ua + ub) / 2;
      const len = ub - ua;
      const n = GAL - 0.12;
      const kind = isRoof ? 0 : (gi * 3 + c * 2 + Math.floor(rnd() * 2)) % 4;
      if (kind === 1) {
        f.fb(0xa8b5b8, mid, L + 0.5, n, len, 1.0, 0.14);
        for (let u = ua + 0.25; u < ub - 0.15; u += 0.4) f.fb(0x5d5b55, u, L + 0.62, n, 0.22, 0.22, 0.16);
        f.fb(SLAB, mid, L + 1.04, n, len + 0.04, 0.08, 0.2);
        f.fb(STAIN, mid - len * 0.2, L + 0.5, n + 0.08, 0.3, 0.9, 0.01);
      } else if (kind === 2) {
        // Broken rail: one post bent, rail hanging.
        f.fb(RUST, mid - len / 4, L + 1.0, n, len / 2, 0.06, 0.06);
        f.fb(RUST, mid + len / 4, L + 0.8, n, len / 2 + 0.05, 0.06, 0.06, 0.35);
        for (let u = ua; u < mid; u += 0.35) f.fb(RUST_DARK, u, L + 0.5, n, 0.04, 1.0, 0.04);
        f.fb(0x9c9a8f, mid + len / 4, L + 0.3, n, len / 2, 0.6, 0.05);
      } else {
        railing(f, ua, ub, L, n, 1.0, kind === 3 ? RUST : RUST_DARK, 0.22, 0.04);
        f.fb(RUST, mid, L + 0.55, n, len, 0.04, 0.04);
      }
      if (isRoof) continue;
      // Clothes draped on rails and lines strung between columns.
      for (let i = 0; i < 3; i++) {
        if (rnd() < 0.55) {
          const u = ua + 0.4 + rnd() * (len - 0.8);
          f.fb(pick([0xd8d2c2, 0x3f6d9a, 0xc2493f, 0xe4c55a, 0x6e9a63, 0x9a5f87, 0xf1eee6]), u, L + 0.75, n + 0.1, 0.5 + rnd() * 0.4, 0.55, 0.05);
        }
      }
      if (rnd() < 0.75) laundry(f, ua, ub, L + 2.35, GAL - 0.35, gi * 10 + c, 0.42);
    }
    // Rail across the stair-side end of each landing.
    railing(makeFace(kit, 7.72, Z1 + GAL / 2, Math.PI / 2), -GAL / 2 + 0.1, GAL / 2 - 0.1, L, 0, 1.0, RUST, 0.25, 0.04);
  }
  // Ground-floor column bases and buckets.
  for (const x of [-4.55, 1.95]) {
    box(0x3f6d9a, x + 0.45, 0.45, Z1 + GAL - 0.2, 0.4, 0.42, 0.4);
    box(0x6b6b58, x - 0.5, 0.55, Z1 + GAL - 0.25, 0.45, 0.62, 0.45);
  }
}

function stairs(kit: Kit) {
  const { box } = kit;
  const run = 4.4;
  const rise = 1.5;
  const len = Math.hypot(run, rise);
  const tilt = Math.atan2(rise, run);
  const steps = 8;
  const flight = (lx: number, zStart: number, yStart: number, dir: -1 | 1) => {
    const zMid = zStart + dir * run / 2;
    const rx = dir < 0 ? tilt : -tilt;
    box(SLAB, lx, yStart + rise / 2 - 0.22, zMid, 1.05, 0.14, len, rx);
    for (const side of [-0.55, 0.55]) box(RUST_DARK, lx + side, yStart + rise / 2 - 0.12, zMid, 0.07, 0.24, len, rx);
    for (let k = 1; k < steps; k++) {
      const t = k / steps;
      box(k % 3 ? 0x9a978e : 0x8c897f, lx, yStart + rise * t - 0.06, zStart + dir * run * t, 1.0, 0.12, run / steps + 0.04);
    }
    return rx;
  };
  for (const L of LV) {
    flight(7.2, Z1, L, -1);
    const rx = flight(5.85, -1.0, L + rise, 1);
    // Mid landing with railings.
    box(SLAB, 6.55, L + rise - 0.11, -1.75, 2.5, 0.22, 1.5);
    box(STAIN, 6.55, L + rise - 0.26, -2.5, 2.5, 0.1, 0.06);
    const backRail = makeFace(kit, 6.55, -2.45, Math.PI);
    railing(backRail, -1.2, 1.2, L + rise, 0, 1.0, RUST, 0.22, 0.04);
    railing(makeFace(kit, 7.72, -1.75, Math.PI / 2), -0.7, 0.7, L + rise, 0, 1.0, RUST, 0.22, 0.04);
    // Outer handrail on flight B, shared centre rail between the flights.
    box(RUST, 7.74, L + rise / 2 + 1.0, Z1 - run / 2, 0.06, 0.06, len, -rx);
    for (let k = 0; k <= 4; k++) {
      const t = k / 4;
      box(RUST_DARK, 7.74, L + rise * t + 0.5, Z1 - run * t, 0.04, 1.0, 0.04);
    }
    box(RUST, 6.53, L + rise * 1.5 + 1.0, -1.0 + run / 2, 0.06, 0.06, len, rx);
    for (let k = 0; k <= 4; k++) {
      const t = k / 4;
      box(RUST_DARK, 6.53, L + rise + rise * t + 0.5, -1.0 + run * t, 0.04, 1.0, 0.04);
    }
    // Rust bleeding down the stringers.
    box(RUST_DARK, 7.78, L + 0.4, 1.6, 0.02, 0.6, 0.1);
  }
  // Roof-level stair hood made of salvaged sheet metal.
  for (const [x, z] of [[5.45, -2.45], [7.65, -2.45], [7.65, -0.95]] as const) box(RUST_DARK, x, TOP - 0.3, z, 0.1, 0.6, 0.1);
  box(0x858079, 6.6, LAST + 1.5 + 2.75, -1.4, 2.6, 0.08, 2.6, -0.12);
  for (let x = 5.4; x <= 7.8; x += 0.3) box(0x9a735e, x, LAST + 1.5 + 2.82, -1.4, 0.05, 0.04, 2.6, -0.12);
  for (const [x, z] of [[5.45, -2.6], [7.7, -2.6], [7.7, -0.2]] as const) box(IRON, x, LAST + 1.5 + 1.35, z, 0.08, 2.7, 0.08);
}

function windowRow(f: Face, us: number[], rnd: Rnd, pick: Pick, w = 1.0, flat = false) {
  for (const [fi, L] of LV.entries()) {
    for (const u of us) {
      const y = L + 1.6;
      const kind = rnd();
      if (kind < 0.12) {
        // Boarded up.
        f.fb(0x2f2d2a, u, y, 0.03, w, 1.2, 0.04);
        for (let i = 0; i < 3; i++) f.fb(pick([0x7d6b55, 0x9a8967, 0xb28b60]), u, y - 0.4 + i * 0.4, 0.08, w + 0.2, 0.25, 0.04);
        f.fb(0x7d6b55, u, y, 0.12, 0.2, 1.3, 0.04);
        continue;
      }
      f.win(u, y, 0.05, w, 1.2);
      if (kind < 0.35) {
        for (let i = 0; i < 5; i++) f.fb(RUST, u - w / 2 + 0.1 + i * (w - 0.2) / 4, y, 0.32, 0.035, 1.3, 0.035);
        f.fb(RUST, u, y + 0.3, 0.32, w + 0.1, 0.035, 0.035);
      } else {
        const [c, s] = pick(SHUTTERS);
        const [c2, s2] = rnd() < 0.3 ? pick(SHUTTERS) : [c, s];
        const open = kind < 0.7 ? (flat ? 0.05 + rnd() * 0.15 : 0.6 + rnd() * 0.8) : -1;
        shutters(f, u, y, w, 1.2, c, s, open, false, true);
        if (rnd() > 0.2) shutters(f, u, y, w, 1.2, c2, s2, open < 0 && rnd() < 0.5 ? (flat ? 0.15 : 0.9) : open, true, false);
      }
      if (fi > 0 && !flat && rnd() < 0.2) acUnit(f, u, L + 0.55, 0.05);
      f.fb(STAIN, u + (rnd() - 0.5) * 0.6, y - 1.1, 0.02, 0.14, 0.7 + rnd() * 0.5, 0.02);
    }
  }
}

function rustyBalcony(f: Face, u: number, L: number, rnd: Rnd, pick: Pick, seed: number) {
  f.fb(SLAB, u, L - 0.08, 0.45, 2.2, 0.16, 0.9);
  f.fb(RUST_DARK, u, L - 0.22, 0.86, 2.2, 0.1, 0.06);
  for (const s of [-0.9, 0.9]) f.fb(RUST_DARK, u + s, L - 0.4, 0.3, 0.08, 0.4, 0.6, 0);
  railing(f, u - 1.1, u + 1.1, L, 0.88, 1.0, RUST, 0.2, 0.035);
  for (const s of [-1.1, 1.1]) {
    f.fb(RUST, u + s, L + 1.0, 0.45, 0.06, 0.06, 0.9);
    for (let n = 0.2; n < 0.85; n += 0.22) f.fb(RUST, u + s, L + 0.5, n, 0.035, 1.0, 0.035);
  }
  // Balcony door and clutter.
  f.fb(0x2f2d2a, u, L + 1.15, 0.03, 0.9, 2.2, 0.03);
  f.fb(pick([0x537a9a, 0x65a39b, 0xb28b60]), u - 0.25, L + 1.15, 0.07, 0.45, 2.2, 0.04);
  if (rnd() < 0.6) laundry(f, u - 1.0, u + 1.0, L + 2.0, 0.6, seed, 0.4);
  f.fb(pick([0x3f6d9a, 0xc2493f, 0x6b6b58]), u + 0.6, L + 0.3, 0.6, 0.4, 0.5, 0.4);
  if (rnd() < 0.5) f.fb(0xc2493f, u - 0.5, L + 0.35, 0.55, 0.3, 0.7, 0.3);
  f.fb(STAIN, u, L - 0.8, 0.02, 1.4, 0.7, 0.01);
  f.fb(RUST_DARK, u - 0.5, L - 0.7, 0.03, 0.08, 0.9, 0.01);
}

function backFacade(f: Face, rnd: Rnd, pick: Pick) {
  windowRow(f, [-5.2, -2.8, 2.8, 5.2], rnd, pick, 0.9);
  for (const [fi, L] of LV.slice(1).entries()) rustyBalcony(f, 0, L, rnd, pick, fi * 5 + 2);
  // Ground-floor back door and plumbing stack.
  f.fb(0x687a80, 0.9, LV[0] + 1.15, 0.05, 0.9, 2.3, 0.05);
  f.fb(0x5f5d57, 0.9, LV[0] + 2.4, 0.06, 1.1, 0.14, 0.1);
  for (const u of [1.6, -1.6]) {
    f.fb(0x6f736c, u, TOP / 2, 0.15, 0.18, TOP - 0.2, 0.18);
    for (let y = 1.5; y < TOP; y += 2.5) f.fb(0x4a4d48, u, y, 0.08, 0.26, 0.06, 0.14);
  }
  f.fb(0x6f736c, 1.6, 0.4, 0.4, 0.2, 0.2, 0.5);
  // Plaster patches and exposed brick.
  plasterDamage(f, [[-4.0, 6.0, 1.4, 0.7], [4.0, 7.4, 1.0, 0.6], [-2.6, 8.9, 1.6, 0.5], [4.0, 0.9, 0.8, 0.4]]);
  // Poles with laundry jutting from windows.
  for (const [u, y, s] of [[-4.0, 8.6, 41], [4.0, 5.6, 43]] as const) {
    for (const du of [-0.7, 0.7]) f.fb(0x7a7d77, u + du, y, 0.45, 0.05, 0.05, 0.9);
    laundry(f, u - 0.7, u + 0.7, y, 0.85, s, 0.4);
  }
}

function plasterDamage(f: Face, patches: number[][]) {
  for (const [u, y, w, h] of patches) {
    f.fb(0xb4b1a6, u, y, 0.015, w + 0.25, h + 0.2, 0.02);
    f.fb(BRICK, u, y, 0.03, w, h, 0.02);
    for (let r = -h / 2 + 0.12; r < h / 2; r += 0.2) f.fb(0x8e4a33, u, y + r, 0.045, w, 0.025, 0.01);
  }
}

function crack(f: Face, u: number, y: number, len: number) {
  let cu = u;
  let cy = y;
  for (let i = 0; i < len; i++) {
    const du = (i % 2 ? 0.18 : -0.12);
    f.fb(0x3e3c38, cu + du / 2, cy - 0.2, 0.02, 0.04, 0.42, 0.01, 0);
    cu += du;
    cy -= 0.38;
  }
}

function leftFacade(f: Face, rnd: Rnd, pick: Pick) {
  windowRow(f, [-3.0, 3.0], rnd, pick, 0.95, true);
  plasterDamage(f, [[-0.6, 3.9, 1.0, 0.8], [0.6, 7.6, 1.4, 0.7], [-3.0, 6.4, 0.9, 0.6]]);
  crack(f, 0.0, 9.0, 7);
  crack(f, -0.6, 5.6, 6);
  // Faded political mural on the blank strip.
  f.fb(0xb5513f, 0, 7.6, 0.03, 2.1, 1.3, 0.02);
  f.fb(0x2f3f52, -0.6, 7.75, 0.05, 0.5, 0.6, 0.01);
  for (let i = 0; i < 4; i++) f.fb(0xe9e3cf, -0.1 + i * 0.32, 7.85, 0.05, 0.22, 0.3, 0.01);
  f.fb(0xe4c55a, 0, 7.15, 0.05, 1.8, 0.12, 0.01);
  f.fb(0x92908a, 0.7, 7.3, 0.06, 0.5, 0.4, 0.01);
  // Broken downspout ending mid-wall with a stain fan.
  f.fb(0x6f736c, -4.05, TOP - 3.2, 0.1, 0.14, 6.4, 0.14);
  f.fb(STAIN, -4.05, TOP - 8.0, 0.02, 0.3, 3.0, 0.02);
  f.fb(MOLD, -4.0, 2.2, 0.02, 0.4, 2.6, 0.02);
}

function rightFacade(f: Face, rnd: Rnd, pick: Pick) {
  // Open-side windows behind the stair landings and in the exposed rear strip.
  windowRow(f, [3.0], rnd, pick, 1.0);
  for (const L of LV) {
    const y = L + 1.7;
    f.fb(0x4a5652, -1.2, y, 0.03, 0.7, 0.7, 0.04);
    f.fb(0x5f5d57, -1.2, y, 0.05, 0.85, 0.85, 0.03);
    for (let i = 0; i < 4; i++) f.fb(RUST, -1.45 + i * 0.17, y, 0.1, 0.03, 0.75, 0.03);
    f.fb(0x1e1e1c, 0.5, L + 2.3, 0.05, 0.03, 0.03, 3.0);
  }
  plasterDamage(f, [[1.4, 7.6, 1.0, 1.2], [-3.0, 4.2, 1.2, 0.7]]);
  crack(f, 1.4, 8.9, 6);
  f.fb(0xe2d3a9, -2.4, 6.6, 0.02, 2.4, 2.0, 0.02);
}

function roof(kit: Kit, rnd: Rnd, pick: Pick) {
  const { box, solid } = kit;
  const r0 = TOP + 0.15;
  box(SLAB, CX, TOP, (Z0 + Z1 + GAL) / 2, W + 0.2, 0.3, D + GAL + 0.1);
  box(0x6b6a64, CX, r0 + 0.01, -0.6, W - 0.4, 0.02, D + GAL - 0.6);
  for (const [x, z, w, d] of [[-4.0, 2.0, 3, 2], [2.2, -3.0, 2.5, 1.5], [-1.0, -1.2, 1.4, 1.6]] as const) {
    box(0x56554f, x, r0 + 0.025, z, w, 0.02, d);
  }
  // Low parapet, broken in places, with rebar stubs on columns.
  const zf = Z1 + GAL - 0.1;
  const ph = 0.7;
  const segs: [number, number][] = [[X0, -3.4], [-2.4, X1 + 0.05]];
  for (const [a, b] of segs) box(0x8f8d86, (a + b) / 2, r0 + ph / 2, zf, b - a, ph, 0.2);
  box(0x8f8d86, CX, r0 + ph / 2, Z0 + 0.1, W, ph, 0.2);
  box(0x8f8d86, X0 + 0.1, r0 + ph / 2, (Z0 + zf) / 2, 0.2, ph, zf - Z0);
  box(0x8f8d86, X1 - 0.1, r0 + ph / 2, (Z0 - 2.6) / 2, 0.2, ph, -2.6 - Z0);
  for (const [a, b, z] of [[-3.4, -2.4, zf]] as const) {
    box(0x8f8d86, a + 0.2, r0 + 0.2, z, 0.4, 0.4, 0.2);
    box(0x8f8d86, b - 0.1, r0 + 0.12, z, 0.2, 0.25, 0.2);
    box(0x9a9890, (a + b) / 2, r0 + 0.08, z + 0.4, 0.4, 0.16, 0.3, 0, 0.6);
  }
  for (const x of COLUMNS.slice(0, 5)) {
    for (const dx of [-0.08, 0.08]) for (const dz of [-0.08, 0.08]) {
      box(RUST_DARK, x + dx, r0 + 0.55, zf - 0.05 + dz, 0.035, 1.1, 0.035);
    }
  }
  // Rail at the stair head.
  railing(makeFace(kit, X1 - 0.1, 0.4, Math.PI / 2), -3.0, 3.0, r0, 0, 1.0, RUST, 0.3, 0.04);

  // Rooftop shack of salvaged planks and corrugated sheet.
  const sx = -5.4;
  const sz = -3.2;
  box(0x7d6b55, sx, r0 + 1.1, sz, 3.4, 2.2, 3.0);
  for (let x = sx - 1.6; x < sx + 1.7; x += 0.42) box(pick([0x755b43, 0x9a8967, 0x7d6b55, 0xb28b60]), x, r0 + 1.1, sz + 1.52, 0.38, 2.15, 0.04);
  box(0x687a80, sx + 1.71, r0 + 1.1, sz, 0.04, 2.1, 2.9);
  box(0x4e5e5b, sx + 0.6, r0 + 0.95, sz + 1.56, 0.85, 1.9, 0.05);
  box(0x2f2d2a, sx - 0.9, r0 + 1.4, sz + 1.56, 0.7, 0.55, 0.04);
  box(0x858079, sx, r0 + 2.35, sz + 0.1, 3.9, 0.08, 3.6, -0.1);
  for (let x = sx - 1.8; x <= sx + 1.8; x += 0.3) box(0x9a735e, x, r0 + 2.41, sz + 0.1, 0.05, 0.04, 3.6, -0.1);
  box(0x737b77, sx - 0.8, r0 + 2.46, sz + 0.6, 1.4, 0.06, 1.2, -0.1, 0.2);
  for (const [x, z] of [[sx - 1, sz + 1.2], [sx + 1.2, sz - 0.8]] as const) box(0x6b6b58, x, r0 + 2.62, z, 0.3, 0.3, 0.3);
  box(0x6b6a64, sx + 1.2, r0 + 1.2, sz + 1.6, 0.5, 0.06, 0.5);
  box(0x1e1e1c, sx + 0.5, r0 + 2.2, sz + 2.5, 0.03, 0.03, 3.4);

  // Black water tanks crowded on the roof (6 solids).
  waterTank(kit, -1.8, r0, -3.8, 0.65, 1.2, 0x343b3c, 0.6);
  waterTank(kit, -0.1, r0, -3.8, 0.65, 1.2, 0x343b3c, 0.6);
  waterTank(kit, 3.6, r0, -3.55, 0.75, 1.4, 0x343b3c, 1.0);
  box(0x6c6a62, 0.9, r0 + 0.3, -2.8, 5.0, 0.07, 0.07);
  box(0x6c6a62, 3.1, r0 + 0.3, -1.0, 0.07, 0.07, 4.4);

  // Antennas, pigeon coop, laundry lines and junk.
  antenna(kit, -3.2, r0, 2.9, 3.2, 0.3);
  antenna(kit, 1.2, r0, 3.6, 2.6, -0.5);
  antenna(kit, sx, r0 + 2.5, sz - 0.6, 1.8, 0.8);
  antenna(kit, 4.4, r0, 1.6, 2.4, 1.1);
  box(0x9a8967, 3.2, r0 + 0.9, 2.6, 1.6, 1.0, 1.1);
  box(0x6b6a64, 3.2, r0 + 0.2, 2.6, 1.7, 0.4, 1.2);
  box(0x2f2d2a, 3.2, r0 + 0.95, 3.16, 1.3, 0.6, 0.02);
  for (let x = 2.55; x < 3.9; x += 0.13) box(0x8a8a82, x, r0 + 0.95, 3.18, 0.02, 0.62, 0.02);
  box(0x858079, 3.2, r0 + 1.45, 2.6, 1.8, 0.06, 1.3, 0.15);
  for (const [x, z] of [[3.0, 3.0], [3.5, 2.9], [2.7, 2.4]] as const) {
    box(0xd8d2c2, x, r0 + 1.55, z, 0.18, 0.14, 0.25);
    box(0x8a8a82, x, r0 + 1.6, z + 0.13, 0.08, 0.08, 0.08);
  }
  for (const z of [-1.8, 0.0, 1.6]) {
    const f = makeFace(kit, 0, z, 0);
    for (const x of [-3.6, 2.0]) box(0x7a7d77, x, r0 + 0.95, z, 0.08, 1.9, 0.08);
    laundry(f, -3.6, 2.0, r0 + 1.85, 0, Math.round(z * 10) + 60, 0.4);
  }
  // Junk: mattress, crates, tires, buckets, plastic chairs.
  box(0xd8d2c2, -6.0, r0 + 0.12, 0.9, 1.0, 0.18, 1.9, 0, 0.3);
  box(0xb5967d, -6.0, r0 + 0.22, 0.9, 0.95, 0.02, 1.85, 0, 0.3);
  for (const [x, z, h] of [[-6.6, 3.6, 0], [-6.0, 3.7, 0], [-6.3, 3.6, 0.5]] as const) {
    box(0xb28b60, x, r0 + 0.25 + h, z, 0.55, 0.5, 0.5, 0, rnd() * 0.5);
  }
  box(0xc2493f, 0.6, r0 + 0.3, 2.0, 0.5, 0.06, 0.5);
  box(0xc2493f, 0.6, r0 + 0.55, 1.78, 0.5, 0.5, 0.06);
  box(0xf1eee6, 1.3, r0 + 0.3, 1.8, 0.5, 0.06, 0.5, 0, 0.5);
  box(0x3f6d9a, -1.6, r0 + 0.22, 3.6, 0.4, 0.44, 0.4);
  box(0x6b6b58, 4.4, r0 + 0.35, -1.8, 0.6, 0.7, 0.6);
  solid(new THREE.TorusGeometry(0.35, 0.13, 6, 14), 0x232323, -4.6, r0 + 0.13, 0.2).rotation.x = Math.PI / 2;
  solid(new THREE.TorusGeometry(0.35, 0.13, 6, 14), 0x232323, -4.6, r0 + 0.39, 0.2).rotation.x = Math.PI / 2;
  // Old rooftop slab poured but never built on: rebar grid and blocks.
  for (const x of [-0.8, 0.2, 1.2]) box(RUST_DARK, x, r0 + 0.8, -0.9, 0.04, 1.6, 0.04);
  for (let i = 0; i < 5; i++) box(0x8f8d86, -0.6 + (i % 3) * 0.42, r0 + 0.14 + Math.floor(i / 3) * 0.22, -1.6, 0.4, 0.2, 0.2);
}

function street(kit: Kit, front: Face) {
  const { box, solid } = kit;
  // Trash heap with bags, bins and a dumped appliance at the front corner.
  for (const [x, z, s, c] of [[-2.6, 5.55, 0.6, 0x1e1e1c], [-2.1, 5.6, 0.5, 0x2a3a2a], [-2.9, 5.2, 0.45, 0x1e1e1c], [-2.4, 5.2, 0.4, 0x3a3836]] as const) {
    box(c, x, 0.24 + s / 2.4, z, s, s * 0.8, s * 0.9, 0, x * 2);
  }
  box(0x4d6b4a, -3.6, 0.8, 5.5, 0.8, 1.1, 0.7);
  box(0x2f3a2e, -3.6, 1.38, 5.4, 0.85, 0.06, 0.75, -0.4);
  box(0xd8d2c2, -0.6, 0.69, 5.45, 0.7, 0.9, 0.65, 0, 0.25);
  box(0x2f2d2a, -0.52, 0.79, 5.77, 0.4, 0.4, 0.02, 0, 0.25);
  // Crates and barrels stacked by the stair (3 solids).
  for (const [x, z, y] of [[4.0, 5.55, 0.24], [4.55, 5.5, 0.24], [4.25, 5.55, 0.74]] as const) box(0xb28b60, x, y + 0.25, z, 0.5, 0.5, 0.5, 0, x);
  for (const [x, z, c] of [[6.9, 5.5, 0x3f6d9a], [7.5, 5.5, 0xb5513f], [7.2, 4.9, 0x4f6a52]] as const) {
    solid(new THREE.CylinderGeometry(0.28, 0.28, 0.9, 10), c, x, 0.69, z);
  }
  // Old tyre leaning on a column.
  solid(new THREE.TorusGeometry(0.33, 0.12, 6, 14), 0x232323, -7.2, 0.6, 5.45);
  // Moped and junk under the stair.
  box(0x2a2a28, 6.0, 0.55, -0.2, 0.08, 0.6, 0.6);
  box(0x2a2a28, 6.0, 0.55, 1.1, 0.08, 0.6, 0.6);
  box(0xc2493f, 6.0, 0.75, 0.45, 0.35, 0.35, 1.2);
  box(0x2a2a28, 6.0, 1.0, 0.65, 0.3, 0.1, 0.6);
  box(0x8a8a82, 6.0, 1.25, -0.1, 0.6, 0.05, 0.05);
  box(0xd8d2c2, 7.2, 0.65, -1.7, 0.7, 0.9, 0.7);
  box(0x2f2d2a, 7.2, 0.75, -1.34, 0.4, 0.4, 0.02);
  box(0x9a8967, 5.9, 0.6, 2.6, 0.9, 0.8, 1.0, 0, 0.3);
  box(0xb28b60, 5.9, 1.25, 2.7, 0.5, 0.5, 0.5, 0, 0.6);
  // Ground-level chair and domino table under the gallery.
  front.fb(0x7d6b55, 2.6, 0.95, 1.0, 0.8, 0.06, 0.8);
  front.fb(0x7d6b55, 2.6, 0.6, 1.0, 0.1, 0.7, 0.1);
  front.fb(0xf1eee6, 2.6, 0.99, 1.0, 0.3, 0.02, 0.16);
  for (const du of [-0.7, 0.7]) front.fb(0xc2493f, 2.6 + du, 0.5, 1.0, 0.45, 0.5, 0.45);
}
