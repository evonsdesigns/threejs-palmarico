import * as THREE from "three";
import { agriProps } from "./agri-props";
import type { Kit } from "./kit";

const BARN_RED = 0x8e4a36;
const TRIM = 0xece7da;
const METAL = 0x6b6b58;
const DARK_WOOD = 0x755b43;
const FENCE_POST = 0x7d6b55;
const RAIL = 0xb9a382;
const STEEL = 0x8a8c86;

// Cattle ranch: red barn, ranch house, corral with cattle, water trough, hay and a windmill pump.
export function buildRanch(kit: Kit) {
  const { box, gable, window, solid } = kit;
  const { yawBox, sack, hayBale, fence, cow, braceXY, braceYZ, shedRoof, gableTrim, door, shutters, flowerBox, chicken, barrel } = agriProps(kit);

  // Ground: grass, trodden corral and a lane to the house.
  box(0x7f9a55, 0, 0.03, 0, 11.9, 0.06, 11.9);
  box(0x756345, -1.5, 0.07, 2.3, 8.5, 0.04, 7);
  box(0x8f7a58, -2.8, 0.07, -1.6, 2.2, 0.04, 1.2);
  box(0x8f7a58, 4.3, 0.07, 3.2, 1.6, 0.04, 5.4);
  for (const [x, z, w, d] of [[-3.2, 2.8, 1.4, 0.9], [0.4, 3.0, 1.0, 1.4], [2.1, 1.6, 0.9, 1.6], [-4.8, 0.2, 0.9, 0.6]] as const) box(0x4f3f2e, x, 0.1, z, w, 0.03, d);
  for (let i = 0; i < 10; i++) box(0x6e5a3e, -5 + (i * 3.7) % 7.5, 0.1, -0.5 + (i * 2.3) % 6, 0.3, 0.02, 0.2, 0, i);

  // ---- Barn (x -5.8..0.2, z -5.45..-2.05) ----
  const bx = -2.7;
  const bz = -3.75;
  const bw = 6;
  const bd = 3.4;
  const bh = 3.4;
  const front = bz + bd / 2;
  box(0x9a968a, bx, 0.15, bz, bw + 0.2, 0.3, bd + 0.2);
  box(BARN_RED, bx, 0.3 + bh / 2, bz, bw, bh, bd);
  for (let x = bx - bw / 2 + 0.2; x < bx + bw / 2; x += 0.4) box(0x7a3e2d, x, 0.3 + bh / 2, front + 0.02, 0.06, bh, 0.04);
  for (let z = bz - bd / 2 + 0.2; z < bz + bd / 2; z += 0.4) box(0x7a3e2d, bx + bw / 2 + 0.02, 0.3 + bh / 2, z, 0.04, bh, 0.06);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(TRIM, bx + sx * (bw / 2 - 0.05), 0.3 + bh / 2, bz + sz * (bd / 2 - 0.05), 0.2, bh, 0.2);
  box(TRIM, bx, 0.3 + bh - 0.1, front + 0.05, bw + 0.05, 0.18, 0.06);
  gable(bx, bz, bw + 0.3, bd + 0.8, 0.3 + bh, 1.9, METAL, 6);
  gableTrim(bx, bz, bw + 0.3, bd + 0.8, 0.3 + bh, 1.9, TRIM, 0x5c5d4f);
  const slope = Math.atan2(1.9, (bd + 0.8) / 2);
  for (const [x, oz] of [[-4.6, 1.0], [-1.2, -1.2], [-0.4, 0.6]] as const) {
    box(0x8f7d62, x, 0.3 + bh + 1.9 * (1 - Math.abs(oz) / ((bd + 0.8) / 2)) + 0.13, bz + oz, 1.0, 0.04, 0.7, oz > 0 ? slope : -slope);
  }
  box(0xb8b9b0, bx + 1.8, 0.3 + bh + 2.25, bz, 0.12, 0.6, 0.12);
  box(0xb8b9b0, bx + 1.8, 0.3 + bh + 2.5, bz, 0.5, 0.04, 0.04);
  box(0xc9b16f, bx + 1.8, 0.3 + bh + 2.65, bz, 0.4, 0.2, 0.06);
  // Barn doors facing the corral.
  for (const sx of [-1, 1]) {
    const dx = bx + sx * 0.7;
    box(BARN_RED, dx, 1.6, front + 0.08, 1.35, 2.6, 0.08);
    for (const y of [0.35, 1.6, 2.85]) box(TRIM, dx, y, front + 0.14, 1.35, 0.12, 0.04);
    for (const ex of [-0.62, 0.62]) box(TRIM, dx + ex, 1.6, front + 0.14, 0.12, 2.6, 0.04);
    for (const y of [0.97, 2.22]) {
      braceXY(TRIM, dx, y, front + 0.15, 1.35, Math.atan2(1.15, 1.13), 0.1, 0.03);
      braceXY(TRIM, dx, y, front + 0.15, 1.35, -Math.atan2(1.15, 1.13), 0.1, 0.03);
    }
  }
  box(0x3b3b36, bx, 3.0, front + 0.16, 3.2, 0.08, 0.08);
  window(bx - 2.2, 2.2, front + 0.06, 0.8, 0.8);
  window(bx + 2.2, 2.2, front + 0.06, 0.8, 0.8);
  // Hay loft door in the +x gable end with hay showing and a hoist beam.
  const gx = bx + (bw + 0.3) / 2 + 0.02;
  box(0x2b2621, gx, 4.3, bz, 0.04, 1.0, 0.9);
  box(0xd6b76a, gx + 0.02, 4.0, bz, 0.04, 0.4, 0.8);
  for (const sz of [-1, 1]) box(TRIM, gx + 0.03, 4.3, bz + sz * 0.5, 0.04, 1.1, 0.1);
  box(TRIM, gx + 0.03, 4.85, bz, 0.04, 0.1, 1.1);
  box(DARK_WOOD, gx + 0.35, 5.05, bz, 0.8, 0.14, 0.14);
  box(0x55524a, gx + 0.65, 4.85, bz, 0.12, 0.22, 0.12);
  box(0xb9a382, gx + 0.65, 4.1, bz, 0.02, 1.3, 0.02);
  window(bx + bw / 2 + 0.05, 2.2, bz, 0.8, 0.8, Math.PI / 2);
  // Lean-to with feed sacks and a saddle rack against the barn front.
  for (const [x, z, y, yaw] of [[-5.3, -1.6, 0.08, 0.3], [-4.7, -1.55, 0.08, -0.2], [-5.0, -1.6, 0.65, 0.1]] as const) sack(x, y, z, 0xc2a978, yaw, 0x7a3b28);
  box(DARK_WOOD, -0.5, 1.0, -1.85, 0.8, 0.1, 0.25);
  box(0x6a3d22, -0.5, 1.15, -1.8, 0.6, 0.25, 0.4);
  box(0x6a3d22, -0.5, 1.3, -1.6, 0.35, 0.2, 0.1);
  box(0x6a3d22, -0.5, 0.85, -1.62, 0.5, 0.35, 0.04);

  // ---- Ranch house (x 1.1..5.7, z -5.6..-2.8) ----
  const hx = 3.3;
  const hz = -4.2;
  const hw = 4.6;
  const hd = 2.8;
  const base = 0.45;
  const hf = hz + hd / 2;
  box(0x9a968a, hx, base / 2, hz, hw + 0.2, base, hd + 0.2);
  box(0xece3cd, hx, base + 1.45, hz, hw, 2.9, hd);
  box(0xb3aa94, hx, base + 0.2, hz, hw + 0.03, 0.4, hd + 0.03);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0xd9cdb0, hx + sx * (hw / 2 - 0.1), base + 1.45, hz + sz * (hd / 2 - 0.1), 0.24, 2.9, 0.24);
  gable(hx, hz, hw + 0.4, hd + 0.5, base + 2.9, 1.3, 0xb35e3f, 6);
  gableTrim(hx, hz, hw + 0.4, hd + 0.5, base + 2.9, 1.3, DARK_WOOD);
  box(0x8b5a45, hx - 1.3, base + 4.0, hz - 0.5, 0.5, 1.5, 0.5);
  box(0x6e6a60, hx - 1.3, base + 4.8, hz - 0.5, 0.62, 0.1, 0.62);
  door(hx - 0.2, base, hf + 0.02, 0, 1.0, 2.25, 0x537a9a);
  for (const dx of [-1.5, 1.35]) {
    window(hx + dx, base + 1.6, hf + 0.08, 0.85, 1.1);
    shutters(hx + dx, base + 1.6, hf, 0, 0.85, 1.1, 0x537a9a);
  }
  flowerBox(hx + 1.35, base + 0.85, hf, 0, 0.9);
  window(hx + hw / 2 + 0.08, base + 1.6, hz, 0.85, 1.1, Math.PI / 2);
  shutters(hx + hw / 2, base + 1.6, hz, Math.PI / 2, 0.85, 1.1, 0x537a9a);
  window(hx - hw / 2 - 0.08, base + 1.6, hz, 0.85, 1.1, -Math.PI / 2);
  window(hx, base + 1.6, hz - hd / 2 - 0.08, 0.85, 1.1, Math.PI);
  // Porch with posts, rail, rocking chair and milk cans.
  box(0xb9a382, hx, base - 0.05, hf + 0.6, hw - 0.2, 0.12, 1.2);
  for (const dx of [-2.1, -0.75, 0.75, 2.1]) box(DARK_WOOD, hx + dx, base + 1.1, hf + 1.1, 0.14, 2.2, 0.14);
  box(DARK_WOOD, hx, base + 2.22, hf + 1.1, hw - 0.1, 0.14, 0.16);
  for (const sx of [-1, 1]) {
    box(RAIL, hx + sx * 1.45, base + 0.75, hf + 1.1, 1.3, 0.08, 0.06);
    for (let i = 0; i < 5; i++) box(RAIL, hx + sx * (0.95 + i * 0.25), base + 0.4, hf + 1.1, 0.05, 0.65, 0.05);
  }
  shedRoof(hx, hf + 0.65, hw + 0.1, 1.3, base + 2.3, 0.45, METAL, false);
  box(DARK_WOOD, hx + 0.8, base + 0.4, hf + 0.5, 0.5, 0.06, 0.45);
  box(DARK_WOOD, hx + 0.8, base + 0.75, hf + 0.3, 0.5, 0.65, 0.06);
  box(DARK_WOOD, hx + 0.8, base + 0.05, hf + 0.5, 0.06, 0.06, 0.7);
  for (const dx of [1.7, 1.95]) {
    box(0xb8b9b0, hx + dx, base + 0.3, hf + 0.4, 0.2, 0.5, 0.2);
    box(0x9a9b93, hx + dx, base + 0.6, hf + 0.4, 0.14, 0.12, 0.14);
  }
  chicken(5.3, -1.4, 0.8);
  chicken(5.6, -0.9, 2.2, 0xb5652e);

  // ---- Corral (x -5.8..2.8, z -1.2..5.8) ----
  const rails = [0.4, 0.85, 1.3];
  fence(-5.8, -1.2, -3.7, -1.2, FENCE_POST, RAIL, rails, 1.45);
  fence(-1.9, -1.2, 2.8, -1.2, FENCE_POST, RAIL, rails, 1.45);
  fence(-5.8, -1.2, -5.8, 5.8, FENCE_POST, RAIL, rails, 1.45);
  fence(-5.8, 5.8, 2.8, 5.8, FENCE_POST, RAIL, rails, 1.45);
  fence(2.8, -1.2, 2.8, 5.8, FENCE_POST, RAIL, rails, 1.45);
  for (const x of [-3.7, -1.9]) box(DARK_WOOD, x, 1.1, -1.2, 0.24, 2.2, 0.24);
  box(DARK_WOOD, -2.8, 2.1, -1.2, 2.1, 0.16, 0.16);
  box(0x6a3d22, -2.8, 1.85, -1.17, 0.9, 0.3, 0.05);
  box(0xece7da, -2.8, 1.85, -1.13, 0.5, 0.1, 0.02);
  // Gate swung open into the corral.
  for (const y of [0.4, 0.85, 1.3]) box(RAIL, -3.6, y, -0.3, 0.07, 0.1, 1.7);
  box(RAIL, -3.6, 0.85, 0.5, 0.1, 1.1, 0.1);
  braceYZ(RAIL, -3.6, 0.85, -0.3, 1.9, -Math.atan2(0.9, 1.6), 0.08, 0.05);

  // Cattle.
  cow(-4.2, 1.3, 0.25, 0x8a5a3a, 0xf0ece0, true);
  cow(-1.6, 3.6, Math.PI - 0.2, 0xefe9dc, 0x2b2724);
  cow(0.8, 0.3, -0.3, 0x5a3a26, 0x8a5a3a);
  cow(-4.0, 4.6, Math.PI + 0.3, 0xd2a066, 0xf0ece0, true);
  cow(1.6, 4.1, Math.PI, 0x3a2a22, 0x5a3a26);

  // Hay feeder rack against the back fence.
  const fx = -0.6;
  const fz = -0.65;
  for (const dx of [-0.9, 0.9]) for (const dz of [-0.3, 0.3]) box(DARK_WOOD, fx + dx, 0.6, fz + dz, 0.12, 1.2, 0.12);
  box(DARK_WOOD, fx, 0.35, fz, 1.9, 0.1, 0.7);
  box(0xd6b76a, fx, 0.7, fz, 1.7, 0.6, 0.5);
  box(0xe2c67e, fx, 1.05, fz, 1.5, 0.2, 0.4);
  for (let i = 0; i < 9; i++) for (const dz of [-0.32, 0.32]) box(0x8b6d3c, fx - 0.8 + i * 0.2, 0.85, fz + dz, 0.04, 0.7, 0.04);
  for (const dz of [-0.32, 0.32]) box(DARK_WOOD, fx, 1.2, fz + dz, 1.9, 0.08, 0.08);

  // Water trough straddling the corral fence, fed from the windmill tank.
  const tx = 2.8;
  const tz = 1.7;
  box(DARK_WOOD, tx, 0.42, tz, 0.8, 0.55, 2);
  for (const dz of [-0.85, 0, 0.85]) box(0x4e4a44, tx, 0.42, tz + dz, 0.84, 0.06, 0.06);
  box(0x3f6f82, tx, 0.64, tz, 0.64, 0.06, 1.84);
  box(0x8fb4bf, tx + 0.1, 0.675, tz - 0.4, 0.2, 0.01, 0.3);
  for (const dz of [-0.75, 0.75]) box(DARK_WOOD, tx, 0.1, tz + dz, 0.9, 0.2, 0.15);
  box(0x777b74, 3.6, 0.95, tz, 1.3, 0.1, 0.1);
  box(0x777b74, 3.0, 0.85, tz, 0.1, 0.2, 0.1);

  // ---- Windmill pump (tower at x 4.6, z 0.4) ----
  const wx = 4.6;
  const wz = 0.4;
  const top = 5.6;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(STEEL, wx + sx * 0.55, top / 2, wz + sz * 0.55, 0.1, top, 0.1);
    box(0x9a968a, wx + sx * 0.55, 0.15, wz + sz * 0.55, 0.3, 0.3, 0.3);
  }
  for (let y = 1.1; y < top; y += 1.1) {
    for (const s of [-1, 1]) {
      box(STEEL, wx, y, wz + s * 0.55, 1.1, 0.06, 0.06);
      box(STEEL, wx + s * 0.55, y, wz, 0.06, 0.06, 1.1);
    }
  }
  for (let y = 0.55; y < top; y += 1.1) {
    const len = Math.hypot(1.1, 1.1);
    for (const s of [-1, 1]) {
      braceXY(0x777b74, wx, y, wz + 0.58, len, s * Math.PI / 4, 0.04, 0.04);
      braceYZ(0x777b74, wx + 0.58, y, wz, len, s * Math.PI / 4, 0.04, 0.04);
    }
  }
  box(0xa58b62, wx, top, wz, 1.4, 0.08, 1.4);
  for (let i = -2; i <= 2; i++) box(0x8f7a58, wx + i * 0.28, top + 0.05, wz, 0.04, 0.02, 1.4);
  box(STEEL, wx, top + 0.3, wz, 0.1, 0.6, 0.1);
  box(0x5d6058, wx, top + 0.6, wz + 0.1, 0.4, 0.35, 0.7);
  box(0x777b74, wx, top + 0.6, wz + 0.5, 0.1, 0.1, 0.3);
  const hubY = top + 0.6;
  const hubZ = wz + 0.7;
  box(0x3b3b36, wx, hubY, hubZ, 0.22, 0.22, 0.12);
  for (let i = 0; i < 14; i++) {
    const a = i * Math.PI * 2 / 14;
    braceXY(i % 2 ? 0xd7d2c3 : 0xb8b9b0, wx + Math.sin(a) * 0.75, hubY + Math.cos(a) * 0.75, hubZ, 0.95, a, 0.24, 0.03);
    braceXY(0x777b74, wx + Math.sin(a) * 0.35, hubY + Math.cos(a) * 0.35, hubZ + 0.03, 0.55, a, 0.03, 0.03);
    const b = a + Math.PI / 14;
    braceXY(0x5d6058, wx + Math.sin(b) * 1.2, hubY + Math.cos(b) * 1.2, hubZ + 0.03, 0.55, b + Math.PI / 2, 0.04, 0.04);
  }
  box(0x777b74, wx, hubY, wz - 0.75, 0.08, 0.08, 1.9);
  box(0xd7d2c3, wx, hubY + 0.05, wz - 1.85, 0.04, 0.85, 0.9);
  box(0x8e4a36, wx + 0.025, hubY + 0.05, wz - 1.85, 0.02, 0.25, 0.7);
  // Pump rod, pump head and spout.
  box(0x4e4a44, wx, top / 2, wz, 0.04, top, 0.04);
  box(0x5d6058, wx, 0.65, wz, 0.3, 1.0, 0.3);
  box(0x5d6058, wx, 0.9, wz + 0.35, 0.1, 0.1, 0.5);
  box(0x777b74, wx, 1.25, wz + 0.6, 0.1, 0.8, 0.1);
  box(0x777b74, wx, 1.6, wz + 1.05, 0.1, 0.1, 0.9);

  // Storage tank on a timber stand.
  const tankZ = 2.4;
  box(DARK_WOOD, wx, 0.15, tankZ, 1.7, 0.3, 1.7);
  for (const dx of [-0.6, 0, 0.6]) box(0x5f4c38, wx + dx, 0.31, tankZ, 0.12, 0.04, 1.7);
  solid(new THREE.CylinderGeometry(0.75, 0.75, 1.3, 18, 1, true), 0x87938b, wx, 0.95, tankZ);
  solid(new THREE.CylinderGeometry(0.75, 0.75, 0.04, 18), 0x3f6f82, wx, 1.45, tankZ);
  for (const y of [0.5, 0.95, 1.4]) {
    box(0x5d6058, wx, y, tankZ, 1.56, 0.05, 1.0);
    box(0x5d6058, wx, y, tankZ, 1.0, 0.05, 1.56);
    box(0x5d6058, wx, y, tankZ, 1.32, 0.05, 1.32, 0, Math.PI / 4);
  }

  // ---- Hay stack, pitchfork and barrels by the lane ----
  for (const [x, z, y, yaw] of [[4.0, 4.4, 0, Math.PI / 2], [4.7, 4.4, 0, Math.PI / 2], [5.4, 4.4, 0, Math.PI / 2], [4.35, 4.5, 0.55, Math.PI / 2], [5.05, 4.5, 0.55, Math.PI / 2], [4.7, 4.45, 1.1, Math.PI / 2 + 0.1]] as const) {
    hayBale(x, y, z, yaw);
  }
  box(0xd6b76a, 4.6, 0.09, 5.5, 1.6, 0.04, 0.5);
  yawBox(0xa58b62, 3.5, 0.95, 5.3, 0, 0, 0, 0, 0.05, 0.05, 1.9, 1.1);
  yawBox(STEEL, 3.5, 1.75, 4.95, 0, 0, 0, 0, 0.3, 0.3, 0.04, 1.1);
  barrel(5.5, 0, 3.0, 0.95, 0.32, 0x7d6b55);
  barrel(5.5, 0, 2.3, 0.95, 0.32, 0x7d6b55, 0x3f6f82);
  box(0x2f2f2b, 5.5, 1.05, 3.0, 0.3, 0.2, 0.3);
  box(0x9a9b93, 3.5, 0.18, 3.6, 0.35, 0.3, 0.35);
  box(0x6b6b58, 3.5, 0.35, 3.6, 0.4, 0.04, 0.4);
}
