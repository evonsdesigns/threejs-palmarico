import * as THREE from "three";
import { agriProps } from "./agri-props";
import { Kit } from "./kit";

const TILE = 0xa6573b;
const COLUMN = 0xe3ddce;
const WOOD = 0xb28b60;
const DARK_WOOD = 0x755b43;
const POST = 0x7d6b55;

// Open-air marketplace: tiled market hall on columns, striped stalls full of produce, and a market office.
export function buildMarket(kit: Kit) {
  const { box, gable, window, solid } = kit;
  const { yawBox, ray, crate, sack, barrel, basket, bananaBunch, braceXY, shedRoof, gableTrim, door, shutters, flowerBox } = agriProps(kit);

  // ---- Cobbled plaza ----
  box(0xb0a38b, 0, 0.08, 0, 11.9, 0.16, 11.9);
  for (let i = -5; i <= 5; i++) {
    box(0x958a74, i * 1.08, 0.165, 0, 0.04, 0.01, 11.8);
    box(0x958a74, 0, 0.165, i * 1.08, 11.8, 0.01, 0.04);
  }
  for (const [x, z] of [[-3.2, 3.6], [1.1, 4.8], [4.6, 2.9], [-5.1, 5.2], [2.3, -0.6], [-1.5, 0.2]] as const) box(0xc2b69c, x, 0.17, z, 0.9, 0.01, 0.9);
  for (const s of [-1, 1]) {
    box(0x8f8574, 0, 0.12, s * 5.9, 11.9, 0.24, 0.12);
    box(0x8f8574, s * 5.9, 0.12, 0, 0.12, 0.24, 11.9);
  }

  // ---- Market hall (x -5.6..1.6, z -5.4..-1.0) ----
  const hx = -2;
  const hz = -3.2;
  box(0xc49a74, hx, 0.22, hz, 7.4, 0.12, 4.6);
  for (let x = hx - 3.5; x <= hx + 3.5; x += 0.5) box(0xa87e5a, x, 0.285, hz, 0.03, 0.01, 4.5);
  const colX = [-5.3, -3.1, -0.9, 1.3];
  const colZ = [-5.1, -1.3];
  for (const x of colX) for (const z of colZ) {
    box(0xb3ad9d, x, 0.35, z, 0.6, 0.3, 0.6);
    box(COLUMN, x, 1.95, z, 0.38, 2.9, 0.38);
    for (const y of [0.6, 3.25]) box(0xd2cab6, x, y, z, 0.5, 0.14, 0.5);
    box(0xd2cab6, x, 3.4, z, 0.6, 0.16, 0.6);
  }
  for (const z of colZ) {
    box(DARK_WOOD, hx, 3.6, z, 7.2, 0.3, 0.3);
    for (const x of colX.slice(0, 3)) {
      braceXY(DARK_WOOD, x + 0.45, 3.2, z + 0.16, 0.9, Math.PI / 4, 0.12, 0.1);
      braceXY(DARK_WOOD, x + 2.2 - 0.45, 3.2, z + 0.16, 0.9, -Math.PI / 4, 0.12, 0.1);
    }
  }
  for (const x of colX) box(DARK_WOOD, x, 3.6, hz, 0.25, 0.25, 4.1);
  gable(hx, hz, 7.6, 5.2, 3.75, 1.8, TILE, 9);
  gableTrim(hx, hz, 7.6, 5.2, 3.75, 1.8, DARK_WOOD);
  box(0xece7da, hx + 3.84, 4.35, hz, 0.06, 0.65, 0.65);
  box(0x3b3b36, hx + 3.88, 4.35, hz, 0.04, 0.5, 0.5);
  box(0xece7da, hx + 3.9, 4.4, hz, 0.02, 0.2, 0.03);
  box(0xece7da, hx + 3.9, 4.35, hz + 0.08, 0.02, 0.03, 0.18);
  // Hanging sign on the front beam.
  box(0x2f5b8a, hx, 3.15, -1.15, 2.6, 0.5, 0.08);
  box(0xe9c98d, hx, 3.15, -1.1, 2.4, 0.06, 0.02);
  for (let i = 0; i < 7; i++) box(0xf2efe6, hx - 1.05 + i * 0.35, 3.15, -1.09, 0.18, 0.26, 0.02);
  // Low back wall with a tiled coping.
  box(0xe9c98d, hx, 0.85, -5.35, 7.0, 1.2, 0.25);
  box(0xb06a42, hx, 1.5, -5.35, 7.1, 0.1, 0.4);
  // Long produce tables under the roof.
  const table = (x: number, z: number, w: number) => {
    box(WOOD, x, 0.98, z, w, 0.1, 1.0);
    box(0x8f6c48, x, 0.84, z + 0.48, w, 0.2, 0.04);
    for (const dx of [-w / 2 + 0.15, w / 2 - 0.15]) for (const dz of [-0.4, 0.4]) box(DARK_WOOD, x + dx, 0.6, z + dz, 0.1, 0.75, 0.1);
    box(DARK_WOOD, x, 0.45, z, w - 0.3, 0.05, 0.8);
  };
  table(-4.1, -2.4, 2.4);
  table(-0.4, -2.4, 2.4);
  table(-2.2, -4.4, 5.6);
  const fruits = [0xc8382a, 0xe8a23a, 0x4f8a3a, 0xd9c08a, 0x9fb54a, 0x7a2f45, 0xdf9a3a, 0xe0c25a];
  for (let i = 0; i < 4; i++) {
    crate(-4.9 + i * 0.55, 1.03, -2.4, 0.5, 0.3, 0.7, fruits[i], fruits[(i + 3) % 8]);
    crate(-1.2 + i * 0.55, 1.03, -2.4, 0.5, 0.3, 0.7, fruits[i + 4], fruits[(i + 1) % 8]);
  }
  for (let i = 0; i < 8; i++) basket(-4.7 + i * 0.68, 1.03, -4.4, fruits[i], fruits[(i + 2) % 8], 0.48);
  for (const [x, ripe] of [[-4.7, false], [-3.6, true], [-0.2, false], [0.8, true]] as const) bananaBunch(x, 3.45, -1.3, ripe);
  for (const [x, z, yaw] of [[-5.1, -3.4, 0.2], [-4.5, -3.35, -0.3], [0.9, -3.4, 0.1]] as const) sack(x, 0.28, z, 0xc2a978, yaw, 0x7a3b28);
  barrel(1.0, 0.28, -4.6, 0.9, 0.3, 0x8a6440, 0xd9c08a);
  barrel(-5.25, 0.28, -4.65, 0.9, 0.3, 0x8a6440, 0x6e3a26);
  // Hanging scale on the central table.
  const sx = -2.4;
  box(DARK_WOOD, sx, 1.75, -2.4, 0.08, 1.4, 0.08);
  box(DARK_WOOD, sx, 2.4, -2.4, 0.9, 0.06, 0.06);
  for (const dx of [-0.4, 0.4]) {
    box(0x8a8c86, sx + dx, 2.2, -2.4, 0.02, 0.4, 0.02);
    box(0xb08a45, sx + dx, 2.0, -2.4, 0.36, 0.04, 0.36);
  }
  box(0x3b3b36, sx + 0.4, 2.06, -2.4, 0.14, 0.1, 0.14);

  // ---- Market office (x 2.5..5.7, z -5.6..-2.8) ----
  const ox = 4.0;
  const oz = -4.1;
  const ow = 3.2;
  const od = 2.8;
  const front = oz + od / 2;
  box(0x9a968a, ox, 0.3, oz, ow + 0.2, 0.3, od + 0.2);
  box(0xe7bd70, ox, 1.95, oz, ow, 3.0, od);
  box(0xc9a060, ox, 0.65, oz, ow + 0.03, 0.4, od + 0.03);
  for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) box(0xece3cd, ox + s1 * (ow / 2 - 0.1), 1.95, oz + s2 * (od / 2 - 0.1), 0.24, 3, 0.24);
  box(0xece3cd, ox, 3.4, oz, ow + 0.1, 0.16, od + 0.1);
  gable(ox, oz, ow + 0.3, od + 0.6, 3.45, 1.1, 0xb06a42, 5);
  gableTrim(ox, oz, ow + 0.3, od + 0.6, 3.45, 1.1, DARK_WOOD);
  door(ox - 0.6, 0.45, front + 0.02, 0, 1.0, 2.3, 0x537a9a);
  window(ox + 0.8, 2.0, front + 0.08, 0.9, 1.1);
  shutters(ox + 0.8, 2.0, front, 0, 0.9, 1.1, 0x537a9a);
  for (let i = 0; i < 4; i++) box(0x3b3b36, ox + 0.5 + i * 0.2, 2.0, front + 0.2, 0.03, 1.1, 0.03);
  flowerBox(ox + 0.8, 1.25, front, 0, 1.0);
  window(ox + ow / 2 + 0.08, 2.0, oz, 0.9, 1.1, Math.PI / 2);
  shutters(ox + ow / 2, 2.0, oz, Math.PI / 2, 0.9, 1.1, 0x537a9a);
  window(ox - ow / 2 - 0.08, 2.0, oz, 0.9, 1.1, -Math.PI / 2);
  shedRoof(ox - 0.6, front + 0.55, 1.4, 1.0, 2.85, 0.3, TILE);
  for (const dx of [-0.55, 0.55]) yawBox(DARK_WOOD, ox - 0.6 + dx, 2.7, front + 0.5, 0, 0, 0, 0, 0.07, 0.07, 1.0, -0.6);
  box(0x2f5b8a, ox + 0.78, 3.05, front + 0.06, 1.1, 0.4, 0.05);
  for (let i = 0; i < 6; i++) box(0xf2efe6, ox + 0.33 + i * 0.18, 3.05, front + 0.1, 0.1, 0.2, 0.02);
  box(0x8b5a45, ox + 0.9, 4.2, oz - 0.4, 0.45, 1.1, 0.45);
  box(0x6e6a60, ox + 0.9, 4.8, oz - 0.4, 0.55, 0.08, 0.55);
  // Bench and notice board.
  box(DARK_WOOD, ox + 0.8, 0.6, front + 0.9, 1.4, 0.08, 0.4);
  for (const dx of [-0.6, 0.6]) box(DARK_WOOD, ox + 0.8 + dx, 0.38, front + 0.9, 0.08, 0.4, 0.35);
  box(DARK_WOOD, ox + 0.8, 0.9, front + 1.08, 1.4, 0.35, 0.05);

  // ---- Striped stalls ----
  const stall = (x: number, z: number, w: number, a: number, b: number, goods: readonly number[], hangBananas: boolean) => {
    const d = 1.7;
    for (const dx of [-w / 2 + 0.08, w / 2 - 0.08]) {
      box(POST, x + dx, 1.4, z + d / 2 - 0.1, 0.1, 2.5, 0.1);
      box(POST, x + dx, 1.6, z - d / 2 + 0.1, 0.1, 2.9, 0.1);
      box(POST, x + dx, 2.75, z, 0.08, 0.08, d);
    }
    // Counter with a draped cloth and produce crates.
    box(WOOD, x, 0.95, z + 0.45, w - 0.2, 0.1, 0.75);
    box(0x8f6c48, x, 0.58, z + 0.8, w - 0.2, 0.7, 0.05);
    for (let px = -w / 2 + 0.3; px < w / 2 - 0.1; px += 0.3) box(0x7d6040, x + px, 0.58, z + 0.83, 0.03, 0.7, 0.02);
    box(a, x, 0.82, z + 0.84, w - 0.3, 0.26, 0.03);
    const n = goods.length;
    for (let i = 0; i < n; i++) {
      const cx = x - (w - 0.5) / 2 + (i + 0.5) * (w - 0.5) / n;
      crate(cx, 1.0, z + 0.45, (w - 0.6) / n, 0.22, 0.6, goods[i], goods[(i + 1) % n]);
    }
    // Back shelf with jars and baskets.
    box(WOOD, x, 1.3, z - 0.6, w - 0.2, 0.08, 0.4);
    for (let i = 0; i < 5; i++) {
      const jx = x - w / 2 + 0.4 + i * (w - 0.8) / 4;
      box(i % 2 ? 0xc98a3a : 0x9fb54a, jx, 1.46, z - 0.6, 0.16, 0.24, 0.16);
      box(0xe8e1cc, jx, 1.6, z - 0.6, 0.12, 0.04, 0.12);
    }
    basket(x - w / 2 + 0.4, 0.2, z - 0.1, goods[0], goods[n - 1], 0.45);
    basket(x + w / 2 - 0.4, 0.2, z - 0.15, goods[n - 1], goods[0], 0.45);
    // Striped awning sloping toward the customers, with a scalloped valance.
    const rise = 0.55;
    const run = d + 0.5;
    const tilt = Math.atan2(rise, run);
    const len = Math.hypot(rise, run);
    const stripes = Math.round(w / 0.35);
    for (let i = 0; i < stripes; i++) {
      const sxp = x - w / 2 + (i + 0.5) * w / stripes;
      box(i % 2 ? a : b, sxp, 3.05 - rise / 2 + 0.05, z + 0.25, w / stripes, 0.06, len, tilt);
      box(i % 2 ? a : b, sxp, 2.5 - 0.14, z + d / 2 + 0.47, w / stripes, 0.28, 0.03);
      box(i % 2 ? b : a, sxp, 2.5 - 0.3, z + d / 2 + 0.47, w / stripes * 0.5, 0.06, 0.03);
    }
    if (hangBananas) for (const dx of [-w / 2 + 0.5, w / 2 - 0.5]) bananaBunch(x + dx, 2.4, z + d / 2 - 0.1, dx > 0);
  };
  stall(-4.1, 1.2, 2.9, 0xc8382a, 0xf2efe6, [0xc8382a, 0x4f8a3a, 0xd9c08a, 0xe8823a], false);
  stall(-0.4, 1.2, 2.9, 0x4f8a3a, 0xf0d050, [0xe8a23a, 0xdf9a3a, 0x9fb54a, 0xc8382a], true);
  stall(3.6, 1.2, 2.9, 0x2f5b8a, 0xf2efe6, [0x7a2f45, 0xe0c25a, 0xcf9a3a, 0x8c2a22], false);
  // Pineapples with crowns on the blue stall.
  for (let i = 0; i < 4; i++) {
    box(0xcf9a3a, 4.6 + (i % 2) * 0.22, 1.5, 1.55 + Math.floor(i / 2) * 0.22, 0.17, 0.26, 0.17);
    box(0x5a7f3e, 4.6 + (i % 2) * 0.22, 1.7, 1.55 + Math.floor(i / 2) * 0.22, 0.06, 0.18, 0.12);
  }

  // ---- Fruit cart with a parasol ----
  const cx = 4.3;
  const cz = 4.4;
  box(WOOD, cx, 0.9, cz, 1.6, 0.1, 0.9);
  for (const s of [-1, 1]) box(0x8f6c48, cx, 1.05, cz + s * 0.45, 1.6, 0.25, 0.05);
  for (const s of [-1, 1]) box(0x8f6c48, cx + s * 0.8, 1.05, cz, 0.05, 0.25, 0.9);
  for (let i = 0; i < 12; i++) box(fruits[i % 8], cx - 0.6 + (i % 6) * 0.24, 1.05, cz - 0.2 + Math.floor(i / 6) * 0.35, 0.2, 0.2, 0.2);
  for (const s of [-1, 1]) {
    box(0x5c4a36, cx - 0.2, 0.42, cz + s * 0.52, 0.7, 0.7, 0.08);
    braceXY(0x5c4a36, cx - 0.2, 0.42, cz + s * 0.52, 0.7, Math.PI / 4, 0.7, 0.08);
    braceXY(0x3b3b36, cx - 0.2, 0.42, cz + s * 0.54, 0.75, Math.PI / 2, 0.05, 0.05);
    braceXY(0x3b3b36, cx - 0.2, 0.42, cz + s * 0.54, 0.75, 0, 0.05, 0.05);
    box(0x9a9b93, cx - 0.2, 0.42, cz + s * 0.56, 0.12, 0.12, 0.06);
  }
  box(DARK_WOOD, cx + 1.1, 0.8, cz, 0.7, 0.06, 0.06);
  box(DARK_WOOD, cx + 0.95, 0.4, cz, 0.06, 0.7, 0.06);
  box(0xd9d2c0, cx - 0.3, 1.9, cz, 0.06, 2.0, 0.06);
  solid(new THREE.ConeGeometry(1.2, 0.55, 12, 1, true), 0xd94a4a, cx - 0.3, 3.05, cz);
  solid(new THREE.ConeGeometry(1.22, 0.56, 12, 1, true, 0, Math.PI / 3), 0xf2efe6, cx - 0.3, 3.06, cz);
  solid(new THREE.ConeGeometry(1.22, 0.56, 12, 1, true, Math.PI * 2 / 3, Math.PI / 3), 0xf2efe6, cx - 0.3, 3.06, cz);
  solid(new THREE.ConeGeometry(1.22, 0.56, 12, 1, true, Math.PI * 4 / 3, Math.PI / 3), 0xf2efe6, cx - 0.3, 3.06, cz);

  // ---- Goods stacked along the front of the plaza ----
  barrel(-5.2, 0.16, 4.2, 0.95, 0.34, 0x8a6440, 0xc8382a);
  barrel(-4.5, 0.16, 4.6, 0.95, 0.34, 0x8a6440, 0xd9c08a);
  barrel(-5.2, 0.16, 5.0, 0.95, 0.34, 0x8a6440);
  for (const [x, z, y, yaw] of [[-3.5, 4.9, 0.16, 0.2], [-2.9, 5.0, 0.16, -0.2], [-3.2, 4.95, 0.78, 0], [-2.4, 4.3, 0.16, 1.2]] as const) sack(x, y, z, 0xc2a978, yaw, 0x2f5b8a);
  crate(-1.0, 0.16, 4.7, 0.9, 0.55, 0.65, 0xe8a23a, 0xc8382a);
  crate(-0.1, 0.16, 4.7, 0.9, 0.55, 0.65, 0x9fb54a, 0xe0c25a);
  crate(-0.55, 0.71, 4.7, 0.9, 0.55, 0.65, 0xc8382a, 0x4f8a3a);
  crate(1.0, 0.16, 5.0, 0.8, 0.45, 0.6);
  crate(1.05, 0.61, 5.0, 0.7, 0.4, 0.55, 0xdf9a3a);
  for (const [x, z, c1, c2] of [[2.0, 4.0, 0xe0c25a, 0x9fb54a], [2.5, 4.6, 0xc8382a, 0x4f8a3a], [1.9, 5.3, 0x7a2f45, 0xd9c08a]] as const) basket(x, 0.16, z, c1, c2, 0.55);
  // Potted palms at the hall corners.
  for (const [x, z] of [[1.5, -0.5], [-4.9, -0.5]] as const) {
    box(0xb06a42, x, 0.45, z, 0.5, 0.6, 0.5);
    box(0x5a432d, x, 0.76, z, 0.42, 0.04, 0.42);
    box(0x8a7851, x, 1.3, z, 0.1, 1.1, 0.1);
    for (let i = 0; i < 7; i++) {
      const psi = i * Math.PI * 2 / 7;
      const [ex, ey, ez] = ray(i % 2 ? 0x5f9a42 : 0x6fae4c, x, 1.85, z, psi, -0.5, 0.4, 0.16, 0.04);
      ray(i % 2 ? 0x5f9a42 : 0x6fae4c, ex, ey, ez, psi, 0.5, 0.4, 0.14, 0.04);
    }
  }
  // Water barrel with ladle and a hand truck.
  box(0x9a968a, 2.6, 0.55, 3.0, 0.8, 0.8, 0.8);
  box(0x3f6f82, 2.6, 0.96, 3.0, 0.62, 0.03, 0.62);
  box(0x8a8c86, 2.8, 1.05, 3.1, 0.05, 0.05, 0.5, -0.4);
}
