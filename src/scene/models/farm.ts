import { FarmCrop } from "../../logic/game";
import { agriProps } from "./agri-props";
import { Kit } from "./kit";

const TILE = 0xa6573b;
const PLASTER = 0xe9c98d;
const TRIM = 0xece7da;
const WOOD = 0x9a8967;
const DARK_WOOD = 0x755b43;
const METAL = 0x6b6b58;
const STONE = 0x9a968a;

// Farmhouse compound: house, barn, tool shed, well and crop-specific produce. Crops are planted on adjacent tiles.
export function buildFarm(kit: Kit, crop: FarmCrop) {
  const { box, gable, window } = kit;
  const props = agriProps(kit);
  const { yawBox, crate, sack, barrel, hayBale, wheelbarrow, basket, bananaBunch, fence, braceXY, shedRoof, gableTrim, door, shutters, flowerBox, chicken } = props;

  // Yard ground, grass verges and a trodden path from the gate.
  box(0x756345, 0, 0.04, 0, 15.9, 0.08, 11.9);
  for (const [x, z, w, d] of [[-6.6, 5.1, 2.4, 1.3], [5.8, 5.2, 3.6, 1.1], [-7.3, -0.2, 1.1, 1.6], [7.4, 0.2, 1, 3]] as const) box(0x7f9a55, x, 0.09, z, w, 0.04, d);
  box(0x8f7a58, -0.8, 0.1, 3.2, 1.5, 0.04, 5.4);
  box(0x8f7a58, -2.6, 0.1, 0.9, 3.2, 0.04, 1.1);
  for (let i = 0; i < 9; i++) box(0x6e5c42, -1.3 + (i % 3) * 0.45, 0.13, 1 + i * 0.55, 0.3, 0.03, 0.18);

  // ---- Farmhouse (x -7.4..-1.0, z -5.3..-1.1) ----
  const hx = -4.2;
  const hz = -3.2;
  const hw = 6.4;
  const hd = 4.2;
  const base = 0.55;
  box(STONE, hx, base / 2, hz, hw + 0.3, base, hd + 0.3);
  for (let x = hx - hw / 2; x < hx + hw / 2; x += 0.6) box(0x858174, x + 0.3, 0.28, hz + hd / 2 + 0.16, 0.03, 0.5, 0.02);
  box(PLASTER, hx, base + 1.5, hz, hw, 3, hd);
  box(0xb99a68, hx, base + 0.25, hz, hw + 0.04, 0.5, hd + 0.04);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(TRIM, hx + sx * (hw / 2 - 0.12), base + 1.5, hz + sz * (hd / 2 - 0.12), 0.3, 3, 0.3);
  box(TRIM, hx, base + 2.95, hz, hw + 0.12, 0.18, hd + 0.12);
  for (const [x, z, w, d] of [[-6.4, -1.08, 0.9, 0.02], [-2.1, -1.08, 0.6, 0.02], [-0.98, -2.6, 0.02, 0.7]] as const) box(0xc9ad78, x, base + 0.9, z, w, 0.5, d);
  gable(hx, hz, hw + 0.7, hd + 1.0, base + 3.05, 1.7, TILE, 8);
  gableTrim(hx, hz, hw + 0.7, hd + 1.0, base + 3.05, 1.7, DARK_WOOD);
  for (const ox of [-2.2, 2.0]) for (const oz of [-1.2, 0.8]) box(0xb35e3f, hx + ox + oz * 0.3, base + 3.05 + 1.7 * (1 - Math.abs(oz) / 2.6) + 0.13, hz + oz, 0.9, 0.06, 0.6, oz > 0 ? Math.atan2(1.7, 2.6) : -Math.atan2(1.7, 2.6));
  box(0x8b5a45, hx + 1.8, base + 4.5, hz - 0.8, 0.6, 1.9, 0.6);
  box(0x6e6a60, hx + 1.8, base + 5.5, hz - 0.8, 0.75, 0.12, 0.75);
  box(0x3c3631, hx + 1.8, base + 5.6, hz - 0.8, 0.4, 0.1, 0.4);
  const front = hz + hd / 2;
  door(hx, base, front + 0.02, 0, 1.1, 2.3);
  for (const dx of [-2.05, 2.05]) {
    window(hx + dx, base + 1.65, front + 0.08, 1, 1.2);
    shutters(hx + dx, base + 1.65, front, 0, 1, 1.2);
    flowerBox(hx + dx, base + 0.85, front, 0, 1.1);
  }
  window(hx + hw / 2 + 0.08, base + 1.65, hz - 0.8, 0.9, 1.15, Math.PI / 2);
  shutters(hx + hw / 2, base + 1.65, hz - 0.8, Math.PI / 2, 0.9, 1.15);
  window(hx - hw / 2 - 0.08, base + 1.65, hz, 0.9, 1.15, -Math.PI / 2);
  window(hx, base + 1.65, hz - hd / 2 - 0.08, 1, 1.2, Math.PI);
  // Front veranda with tiled lean-to roof.
  box(0xb9a382, hx, base - 0.05, front + 0.85, hw - 0.4, 0.14, 1.7);
  for (let x = hx - hw / 2 + 0.35; x < hx + hw / 2 - 0.2; x += 0.4) box(0xa08b6a, x, base + 0.03, front + 0.85, 0.03, 0.02, 1.7);
  for (const dx of [-2.95, -1, 1, 2.95]) {
    box(TRIM, hx + dx, base + 1.15, front + 1.55, 0.16, 2.3, 0.16);
    box(0xd0c7b0, hx + dx, base + 0.08, front + 1.55, 0.26, 0.16, 0.26);
  }
  box(TRIM, hx, base + 2.33, front + 1.55, hw - 0.2, 0.16, 0.18);
  for (const sx of [-1, 1]) {
    box(0xd7cfba, hx + sx * 1.97, base + 0.85, front + 1.55, 1.85, 0.08, 0.08);
    for (let i = 0; i < 6; i++) box(0xd7cfba, hx + sx * (1.2 + i * 0.3), base + 0.48, front + 1.55, 0.06, 0.7, 0.06);
  }
  shedRoof(hx, front + 0.95, hw - 0.1, 1.9, base + 2.42, 0.55, TILE);
  for (const dx of [-1.6, 1.6]) {
    box(0x8a6440, hx + dx, base + 0.45, front + 0.6, 0.55, 0.06, 0.55);
    for (const sx of [-0.22, 0.22]) box(0x6a4c33, hx + dx + sx, base + 0.22, front + 0.6, 0.05, 0.44, 0.45);
    box(0x8a6440, hx + dx, base + 0.75, front + 0.35, 0.55, 0.5, 0.06);
  }
  box(0xc9b16f, hx + 0.9, base + 2.1, front + 0.4, 0.14, 0.2, 0.14);
  // Rain barrel and downpipe.
  box(0x777b74, hx + hw / 2 + 0.1, base + 1.5, front - 0.1, 0.1, 3, 0.1);
  barrel(hx + hw / 2 + 0.4, 0, front - 0.25, 0.95, 0.32, 0x7d6b55, 0x3f5560);

  // ---- Barn (x 0.6..7.6, z -5.4..-0.6) ----
  const bx = 4.1;
  const bz = -3.0;
  const bw = 7;
  const bd = 4.8;
  const bh = 3.6;
  box(STONE, bx, 0.15, bz, bw + 0.2, 0.3, bd + 0.2);
  box(WOOD, bx, 0.3 + bh / 2, bz, bw, bh, bd);
  const barnFront = bz + bd / 2;
  for (let x = bx - bw / 2 + 0.25; x < bx + bw / 2; x += 0.5) box(0x7d6f52, x, 0.3 + bh / 2, barnFront + 0.03, 0.08, bh, 0.05);
  for (let z = bz - bd / 2 + 0.25; z < bz + bd / 2; z += 0.5) box(0x7d6f52, bx + bw / 2 + 0.03, 0.3 + bh / 2, z, 0.05, bh, 0.08);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(DARK_WOOD, bx + sx * (bw / 2 - 0.06), 0.3 + bh / 2, bz + sz * (bd / 2 - 0.06), 0.22, bh, 0.22);
  box(DARK_WOOD, bx, 0.3 + bh - 0.1, barnFront + 0.07, bw + 0.1, 0.2, 0.08);
  box(DARK_WOOD, bx, 0.45, barnFront + 0.07, bw + 0.1, 0.25, 0.08);
  for (const [x, z, w, h, d] of [[1.4, barnFront + 0.06, 0.8, 0.9, 0.02], [7.66, -4.4, 0.02, 0.7, 0.9], [6.8, barnFront + 0.06, 0.5, 1.1, 0.02]] as const) box(0x8a7a5e, x, 2.4, z, w, h, d);
  gable(bx, bz, bw + 0.5, bd + 0.8, 0.3 + bh, 2.0, METAL, 6);
  gableTrim(bx, bz, bw + 0.5, bd + 0.8, 0.3 + bh, 2.0, DARK_WOOD, 0x5c5d4f);
  for (const [x, oz] of [[1.8, 1.4], [5.9, -1.6], [3.3, 0.5]] as const) {
    const slope = Math.atan2(2, (bd + 0.8) / 2);
    box(0x7b7a68, x, 0.3 + bh + 2 * (1 - Math.abs(oz) / ((bd + 0.8) / 2)) + 0.13, bz + oz, 1.1, 0.04, 0.8, oz > 0 ? slope : -slope);
  }
  // Big sliding doors with Z braces, track and hay loft.
  for (const sx of [-1, 1]) {
    const dx = bx + sx * 0.72;
    box(0x8e6b4a, dx, 1.75, barnFront + 0.1, 1.4, 2.9, 0.1);
    box(TRIM, dx, 3.15, barnFront + 0.16, 1.4, 0.12, 0.04);
    box(TRIM, dx, 0.36, barnFront + 0.16, 1.4, 0.12, 0.04);
    box(TRIM, dx + sx * 0.64, 1.75, barnFront + 0.16, 0.12, 2.9, 0.04);
    box(TRIM, dx - sx * 0.64, 1.75, barnFront + 0.16, 0.12, 2.9, 0.04);
    braceXY(TRIM, dx, 1.75, barnFront + 0.17, 3.0, sx * Math.atan2(1.2, 2.7), 0.12, 0.04);
  }
  box(0x3b3b36, bx, 3.32, barnFront + 0.18, 3.4, 0.08, 0.08);
  box(0x2b2621, bx, 4.55, barnFront + 0.02, 1.3, 1.1, 0.05);
  box(0xd6b76a, bx, 4.3, barnFront + 0.05, 1.1, 0.6, 0.08);
  for (const sx of [-1, 1]) {
    box(0x8e6b4a, bx + sx * 0.95, 4.55, barnFront + 0.08, 0.6, 1.1, 0.07);
    braceXY(TRIM, bx + sx * 0.95, 4.55, barnFront + 0.13, 1.15, sx * 0.5, 0.08, 0.03);
  }
  box(DARK_WOOD, bx, 5.25, barnFront + 0.4, 0.14, 0.14, 1);
  box(0x55524a, bx, 4.9, barnFront + 0.85, 0.12, 0.25, 0.12);
  box(0xb9a382, bx, 4.4, barnFront + 0.85, 0.02, 0.9, 0.02);
  window(bx + bw / 2 + 0.06, 2.3, bz + 0.8, 0.8, 0.8, Math.PI / 2);
  // Feed trough and lantern on the barn.
  box(DARK_WOOD, bx + 2.5, 0.45, barnFront + 0.5, 1.6, 0.4, 0.5);
  box(0xc9a85a, bx + 2.5, 0.66, barnFront + 0.5, 1.4, 0.05, 0.35);
  box(0x2f2f2b, bx - 1.75, 2.9, barnFront + 0.2, 0.18, 0.28, 0.18);
  box(0xf2d58a, bx - 1.75, 2.88, barnFront + 0.2, 0.12, 0.16, 0.2);

  // ---- Hay stack beside the barn ----
  for (const [x, z, y, yaw] of [[6.6, 0.7, 0, 0], [6.6, 1.35, 0, 0], [7.25, 1.0, 0.55, Math.PI / 2], [6.3, 1.0, 0.55, 0.1], [5.55, 1.9, 0, 0.5]] as const) {
    hayBale(x, y, z, yaw);
  }
  box(0xd6b76a, 7.4, 0.12, 2.5, 0.7, 0.08, 0.5);
  yawBox(DARK_WOOD, 7.4, 1, 2.2, 0.3, 0, 0, 0, 0.05, 2, 0.05, -0.35);
  yawBox(0x77786c, 7.4, 1.95, 1.85, 0.3, 0, 0, 0, 0.25, 0.05, 0.04, -0.35);

  // ---- Tool shed (x -7.8..-5.4, z 1.6..4.0) ----
  const sx0 = -6.6;
  const sz0 = 2.8;
  box(0x7d6b55, sx0, 1.2, sz0 - 1.1, 2.4, 2.2, 0.15);
  box(0x7d6b55, sx0 - 1.13, 1.2, sz0, 0.15, 2.2, 2.4);
  box(0x7d6b55, sx0, 1.2, sz0 + 1.13, 2.4, 2.2, 0.15);
  for (let z = sz0 - 1; z < sz0 + 1.1; z += 0.4) box(0x5f4c38, sx0 - 1.22, 1.2, z, 0.04, 2.2, 0.06);
  for (let x = sx0 - 1; x < sx0 + 1.1; x += 0.4) box(0x5f4c38, x, 1.2, sz0 + 1.22, 0.06, 2.2, 0.04);
  box(0x7d6b55, sx0 + 1.13, 2.05, sz0, 0.15, 0.5, 2.4);
  for (const dz of [-1.1, 1.1]) box(DARK_WOOD, sx0 + 1.13, 1.1, sz0 + dz, 0.18, 2.2, 0.18);
  box(0x4a3e33, sx0, 0.12, sz0, 2.2, 0.06, 2.2);
  box(0x6e5a44, sx0 + 1.55, 1.05, sz0 + 1.15, 0.9, 1.9, 0.07, 0, 0.9);
  shedRoof(sx0, sz0, 2.7, 2.8, 2.25, 0.6, METAL, false);
  // Tools hanging on the back wall, visible through the open side.
  for (const [dz, head, hw2, hh] of [[-0.7, 0x8a8c86, 0.3, 0.25], [-0.2, 0x8a8c86, 0.4, 0.08], [0.3, 0x6e706a, 0.25, 0.32], [0.8, 0xb59a4a, 0.08, 0.5]] as const) {
    box(0xa58b62, sx0 - 0.95, 1.2, sz0 + dz, 0.05, 1.6, 0.05);
    box(head, sx0 - 0.95, 0.4, sz0 + dz, 0.05, hh, hw2);
  }
  box(0x8a6440, sx0 - 0.5, 0.9, sz0 - 0.75, 1.1, 0.08, 0.6);
  for (const dz of [-0.95, -0.55]) box(0x6a4c33, sx0 - 0.5, 0.45, sz0 + dz, 1, 0.85, 0.06);
  box(0x6e706a, sx0 - 0.7, 1.02, sz0 - 0.75, 0.3, 0.16, 0.2);
  sack(sx0 + 0.1, 0.1, sz0 + 0.5, 0xc2a978, 0.3);
  // Grindstone and chopping block outside.
  box(0x77786c, sx0 + 1.9, 0.55, sz0 - 0.3, 0.2, 0.8, 0.8);
  box(0x77786c, sx0 + 1.9, 0.55, sz0 - 0.3, 0.2, 0.8, 0.8, Math.PI / 4);
  for (const dz of [-0.7, 0.1]) box(DARK_WOOD, sx0 + 1.9, 0.35, sz0 + dz, 0.12, 0.7, 0.12);
  box(0x8a6440, -2.9, 0.3, 4.6, 0.6, 0.5, 0.6);
  box(0xa58b62, -2.9, 0.62, 4.6, 0.55, 0.04, 0.55);
  box(0x8a8c86, -2.85, 0.8, 4.55, 0.05, 0.3, 0.2);
  for (let i = 0; i < 5; i++) box(0x9a7a52, -3.6 + (i % 2) * 0.1, 0.2 + Math.floor(i / 2) * 0.2, 5.1 - i * 0.04, 0.9, 0.18, 0.18, 0, 0.1 * i);

  // ---- Well (x -3.2..-1.8, z 2.1..3.5) ----
  const wx = -2.5;
  const wz = 2.8;
  box(STONE, wx, 0.45, wz, 1.4, 0.9, 1.4);
  box(STONE, wx, 0.45, wz, 1.55, 0.9, 0.9);
  box(STONE, wx, 0.45, wz, 0.9, 0.9, 1.55);
  box(0xb3ad9d, wx, 0.93, wz, 1.5, 0.1, 1.5);
  box(0x1f2b2e, wx, 0.95, wz, 1.05, 0.04, 1.05);
  for (let i = 0; i < 4; i++) box(0x858174, wx, 0.2 + i * 0.22, wz + 0.78, 1.0, 0.025, 0.02);
  for (const dx of [-0.65, 0.65]) box(DARK_WOOD, wx + dx, 1.5, wz, 0.14, 2.2, 0.14);
  box(DARK_WOOD, wx, 2.05, wz, 1.5, 0.16, 0.16);
  box(0x9c8a60, wx, 1.9, wz, 0.02, 0.6, 0.02);
  box(0x7d6b55, wx, 1.45, wz, 0.32, 0.32, 0.32);
  box(0x3b3b36, wx, 1.45, wz, 0.34, 0.05, 0.34);
  box(0x3b3b36, wx + 0.85, 2.05, wz, 0.05, 0.05, 0.05);
  box(0x3b3b36, wx + 0.85, 1.85, wz + 0.1, 0.05, 0.4, 0.05);
  gable(wx, wz, 1.9, 1.7, 2.6, 0.6, TILE, 3);
  box(0x7d6b55, wx + 0.95, 1.05, wz + 0.4, 0.4, 0.35, 0.4);
  box(0x3f5560, wx + 0.95, 1.2, wz + 0.4, 0.34, 0.06, 0.34);

  // ---- Clothes line ----
  for (const z of [1.6, 4.4]) {
    box(DARK_WOOD, -4.4, 1.1, z, 0.1, 2.2, 0.1);
    box(DARK_WOOD, -4.4, 2.1, z, 0.08, 0.08, 0.6);
  }
  box(0xd8d0bc, -4.4, 2.05, 3, 0.02, 0.02, 2.8);
  for (const [z, color, h] of [[1.95, 0xf2efe6, 0.7], [2.55, 0xc65b4a, 0.55], [3.15, 0x5b7fb0, 0.8], [3.75, 0xe8d27a, 0.5]] as const) box(color, -4.4, 2.05 - h / 2, z, 0.03, h, 0.5);

  // ---- Fence and gate ----
  fence(-7.85, 5.78, -1.75, 5.78);
  fence(0.15, 5.78, 7.85, 5.78);
  fence(-7.85, 0.5, -7.85, 5.78);
  fence(7.85, 2.9, 7.85, 5.78);
  for (const x of [-1.75, 0.15]) {
    box(DARK_WOOD, x, 1.3, 5.78, 0.22, 2.6, 0.22);
    box(0x5d4d3a, x, 2.63, 5.78, 0.3, 0.08, 0.3);
  }
  box(DARK_WOOD, -0.8, 2.45, 5.78, 2.2, 0.14, 0.14);
  box(TRIM, -0.8, 2.05, 5.83, 1.4, 0.4, 0.06);
  box(0x4b5f3b, -0.8, 2.05, 5.87, 1.1, 0.12, 0.02);
  for (const x of [-1.4, -0.2]) box(0x8a8c86, x, 2.32, 5.83, 0.03, 0.18, 0.03);
  box(0xb9a382, -1.62, 0.65, 5.3, 0.08, 1.0, 1.0);
  for (const y of [0.3, 1.0]) box(0xb9a382, -1.58, y, 5.3, 0.06, 0.1, 1.0);
  braceXY(0xb9a382, -1.58, 0.65, 5.3, 1.1, Math.PI / 2 - 0.6, 0.08, 0.05);

  // ---- Chickens around the yard ----
  for (const [x, z, yaw, color] of [[-1.8, 1.7, 0.4, 0xf0ece0], [-1.2, 2.2, 2.6, 0xb5652e], [0.3, 1.5, -1, 0xf0ece0], [-3.6, 1.6, 1.2, 0x8a4a2a]] as const) {
    chicken(x, z, yaw, color);
  }
  box(0xd9c690, -0.6, 0.12, 1.9, 0.5, 0.02, 0.3);

  // ---- Wheelbarrow and crop-specific produce ----
  const load: Record<FarmCrop, number> = {
    corn: 0xe0c25a, pineapple: 0xcf9a3a, coffee: 0x8c2a22, sugar: 0x9a9a4a, tobacco: 0x9a7038, papaya: 0xdf9a3a, bananas: 0x9fb54a,
  };
  wheelbarrow(1.1, 0, 4.7, -0.5, load[crop]);
  for (let i = 0; i < 4; i++) box(0x2f2f2b, 0.5 + i * 0.3, 0.13, 5.3 - i * 0.12, 0.12, 0.02, 0.06);

  const cx = 3.6;
  const cz = 3.1;
  if (crop === "coffee") {
    // Drying patio with coffee cherries spread in rows, a rake and stacked sacks.
    box(0xb0a38b, cx, 0.12, cz, 4, 0.16, 2.8);
    for (const sz of [-1, 1]) box(0x8f8574, cx, 0.24, cz + sz * 1.37, 4, 0.12, 0.08);
    for (const sx of [-1, 1]) box(0x8f8574, cx + sx * 1.97, 0.24, cz, 0.08, 0.12, 2.8);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const color = [0x8c2a22, 0x6e3a26, 0x5a3a26, 0xa3402c][(i + j * 2) % 4];
        box(color, cx - 1.6 + i * 0.64, 0.22, cz - 1.0 + j * 0.65, 0.55, 0.05, 0.5);
      }
    }
    for (let i = 0; i < 6; i++) box(0x8f8574, cx - 1.6 + i * 0.64, 0.255, cz - 1.0 + (i % 4) * 0.65, 0.2, 0.02, 0.5);
    yawBox(0xa58b62, cx + 1.1, 0.5, cz + 0.4, 0.6, 0, 0, 0, 0.05, 0.05, 1.6, -0.5);
    yawBox(0x7d6b55, cx + 1.1, 0.25, cz + 0.4, 0.6, 0, 0, 0.75, 0.5, 0.08, 0.06);
    for (const [x, z, y, yaw] of [[1.4, 1.2, 0, 0.2], [2.1, 1.1, 0, -0.1], [1.75, 1.15, 0.62, 0.05], [0.7, 2.3, 0, 1.2]] as const) sack(x, y, z, 0xc2a978, yaw, 0x7a3b28);
    basket(5.9, 0.1, 5.0, 0x8c2a22, 0x5a3a26);
    basket(6.6, 0.1, 4.8, 0xa3402c, 0x6e3a26);
  } else if (crop === "tobacco") {
    // Curing rack with hanging leaves under a small tin roof, plus bales of cured leaf.
    for (const dx of [-1.6, 1.6]) for (const dz of [-0.9, 0.9]) box(DARK_WOOD, cx + dx, 1.4, cz + dz, 0.14, 2.8, 0.14);
    for (const dz of [-0.9, 0.9]) box(DARK_WOOD, cx, 2.5, cz + dz, 3.5, 0.12, 0.12);
    for (let i = 0; i < 5; i++) {
      const lz = cz - 0.8 + i * 0.4;
      box(0xa58b62, cx, 2.45, lz, 3.3, 0.05, 0.05);
      for (let j = 0; j < 7; j++) {
        const age = (i + j) % 3;
        const color = age === 0 ? 0x7d8f45 : age === 1 ? 0xb08a45 : 0x8a6a3a;
        box(color, cx - 1.4 + j * 0.47, 2.0, lz, 0.28, 0.8, 0.05, 0, (j % 2) * 0.3);
      }
    }
    crate(1.2, 0, 1.4, 0.9, 0.6, 0.7, 0x8a6a3a, 0xb08a45);
    crate(1.25, 0.6, 1.4, 0.8, 0.5, 0.6, 0x9a7038);
    for (const [x, z] of [[2.3, 1.3], [5.8, 4.9]] as const) {
      box(0x9a7038, x, 0.35, z, 0.8, 0.5, 0.55);
      box(0x6e5a3a, x, 0.35, z, 0.82, 0.06, 0.57);
    }
  } else if (crop === "bananas") {
    // Rack of hanging bunches and crates of green bananas.
    for (const dx of [-1.5, 1.5]) {
      box(DARK_WOOD, cx + dx, 1.25, cz, 0.16, 2.5, 0.16);
      box(DARK_WOOD, cx + dx, 0.1, cz, 0.2, 0.2, 1.2);
    }
    box(DARK_WOOD, cx, 2.45, cz, 3.3, 0.14, 0.14);
    for (let i = 0; i < 5; i++) bananaBunch(cx - 1.1 + i * 0.55, 2.4, cz, i === 2);
    shedRoof(cx, cz, 3.6, 1.6, 2.6, 0.3, 0x7a9a4a, false);
    for (const [x, z, y] of [[1.4, 1.3, 0], [2.3, 1.3, 0], [1.85, 1.3, 0.62]] as const) crate(x, y, z, 0.85, 0.6, 0.6, 0x9fb54a, 0xb8c254);
    for (let i = 0; i < 3; i++) box(0x5f9a42, 6.0 + i * 0.3, 0.14, 4.9 - i * 0.2, 0.8, 0.04, 0.35, 0, i * 0.6);
    bananaBunch(6.2, 1.05, 4.9, true);
    box(0x8a6440, 6.2, 0.3, 4.9, 0.7, 0.5, 0.7);
  } else if (crop === "sugar") {
    // Bundles of cut cane, a small ox-driven press (trapiche) and molasses barrels.
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 3 - row; i++) {
        const x = cx - 0.6 + i * 0.6 + row * 0.3;
        const y = 0.3 + row * 0.42;
        for (const [ox, oy, color] of [[-0.12, 0, 0x9a9a4a], [0.12, 0, 0x8b7058], [0, 0.16, 0xa3a453]] as const) box(color, x + ox, y + oy, cz, 0.13, 0.13, 2.6);
        for (const dz of [-0.8, 0.8]) box(0x8b6d3c, x, y + 0.06, cz + dz, 0.42, 0.36, 0.08);
      }
    }
    for (let i = 0; i < 5; i++) yawBox(0xa3a453, 1.1, 1.1, 1.3, 0.3, (i - 2) * 0.12, 0, 0, 0.08, 2.2, 0.08, (i - 2) * 0.06);
    box(0x8b6d3c, 1.1, 1.0, 1.3, 0.5, 0.08, 0.45);
    box(STONE, 5.9, 0.35, 4.7, 1.1, 0.6, 1.1);
    for (const dx of [-0.2, 0.2]) box(0x6e706a, 5.9 + dx, 1.0, 4.7, 0.3, 0.7, 0.3);
    box(DARK_WOOD, 5.9, 1.45, 4.7, 0.18, 0.2, 2.2);
    box(0x5d4d3a, 5.9, 1.45, 3.55, 0.08, 0.6, 0.08);
    barrel(1.3, 0, 2.5, 0.9, 0.32, 0x7d6b55, 0x2f1c10);
    barrel(0.6, 0, 2.2, 0.9, 0.32, 0x7d6b55, 0x2f1c10);
  } else if (crop === "corn") {
    // Slatted corn crib on stilts with a tin roof, and sacks/baskets of cobs.
    for (const dx of [-1.3, 1.3]) for (const dz of [-0.7, 0.7]) {
      box(DARK_WOOD, cx + dx, 0.45, cz + dz, 0.18, 0.9, 0.18);
      box(0x8a8c86, cx + dx, 0.85, cz + dz, 0.35, 0.05, 0.35);
    }
    box(DARK_WOOD, cx, 0.95, cz, 2.9, 0.12, 1.6);
    box(0xd9b246, cx, 1.95, cz, 2.6, 1.85, 1.3);
    for (let x = -1.3; x <= 1.31; x += 0.2) {
      box(0xb28b60, cx + x, 1.95, cz + 0.72, 0.08, 1.95, 0.05);
      box(0xb28b60, cx + x, 1.95, cz - 0.72, 0.08, 1.95, 0.05);
    }
    for (let z = -0.6; z <= 0.61; z += 0.2) box(0xb28b60, cx + 1.42, 1.95, cz + z, 0.05, 1.95, 0.08);
    for (let i = 0; i < 18; i++) box(i % 3 ? 0xe0c25a : 0xc98a3a, cx - 1.2 + (i % 9) * 0.3, 1.3 + Math.floor(i / 9) * 0.9, cz + 0.68, 0.12, 0.08, 0.05);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(DARK_WOOD, cx + sx * 1.42, 1.95, cz + sz * 0.72, 0.12, 2, 0.12);
    gable(cx, cz, 3.2, 2.0, 2.95, 0.7, METAL, 3);
    yawBox(DARK_WOOD, cx + 1.6, 0.6, cz + 1.1, -0.3, 0, 0, 0, 0.5, 0.06, 1.5, 0.9);
    for (const [x, z, yaw] of [[1.3, 1.2, 0.1], [2.0, 1.15, -0.3]] as const) sack(x, 0.1, z, 0xd0b98a, yaw, 0x7a6a3a);
    basket(6.0, 0.1, 4.9, 0xe0c25a, 0xc98a3a);
    basket(6.6, 0.1, 5.1, 0xe0c25a, 0x9fb760);
  } else if (crop === "pineapple") {
    // Stacked crates of pineapples with crowns, and a sorting table.
    const pineCrate = (x: number, y: number, z: number) => {
      crate(x, y, z, 0.9, 0.5, 0.65);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
        const fx = x - 0.3 + i * 0.2;
        const fz = z - 0.13 + j * 0.26;
        box(0xcf9a3a, fx, y + 0.55, fz, 0.17, 0.24, 0.17);
        box(0x5a7f3e, fx, y + 0.74, fz, 0.06, 0.16, 0.12);
        box(0x6e9256, fx, y + 0.72, fz, 0.12, 0.12, 0.05);
      }
    };
    pineCrate(cx - 1.2, 0.1, cz - 0.9);
    pineCrate(cx - 0.2, 0.1, cz - 0.9);
    pineCrate(cx - 0.7, 0.6, cz - 0.9);
    pineCrate(cx + 1.2, 0.1, cz + 1.4);
    box(0x8a6440, cx + 0.6, 0.85, cz - 0.4 + 0.6, 2, 0.1, 0.9);
    for (const dx of [-0.9, 0.9]) for (const dz of [-0.35, 0.35]) box(DARK_WOOD, cx + 0.6 + dx, 0.45, cz + 0.2 + dz, 0.08, 0.8, 0.08);
    for (let i = 0; i < 6; i++) {
      const fx = cx - 0.1 + i * 0.28;
      box(i % 2 ? 0xcf9a3a : 0xb8a440, fx, 1.05, cz + 0.2, 0.18, 0.28, 0.18);
      box(0x5a7f3e, fx, 1.3, cz + 0.2, 0.06, 0.22, 0.14);
    }
    for (let i = 0; i < 7; i++) box(0x6e9256, 5.9 + (i % 3) * 0.25, 0.18, 4.8 + Math.floor(i / 3) * 0.25, 0.22, 0.08, 0.06, 0, i);
    basket(6.6, 0.1, 4.8, 0xcf9a3a, 0x5a7f3e);
  } else {
    // Papaya: crates of fruit and baskets beside a packing table.
    for (const [x, z, y] of [[cx - 1.2, cz - 0.9, 0.1], [cx - 0.2, cz - 0.9, 0.1], [cx - 0.7, cz - 0.9, 0.7], [cx + 1.3, cz + 1.35, 0.1]] as const) {
      crate(x, y, z, 0.9, 0.55, 0.65, 0xdf9a3a, 0x9fb04a);
    }
    box(0x8a6440, cx + 0.5, 0.85, cz + 0.2, 2, 0.1, 0.9);
    for (const dx of [-0.9, 0.9]) for (const dz of [-0.35, 0.35]) box(DARK_WOOD, cx + 0.5 + dx, 0.45, cz + 0.2 + dz, 0.08, 0.8, 0.08);
    for (let i = 0; i < 6; i++) box(i % 2 ? 0xdf9a3a : 0xa3ad48, cx - 0.2 + i * 0.28, 1.05, cz + 0.2 + (i % 2) * 0.15, 0.17, 0.3, 0.17);
    box(0xe8823a, cx + 1.3, 0.93, cz + 0.45, 0.3, 0.04, 0.18);
    basket(6.0, 0.1, 4.9, 0xdf9a3a, 0xa3ad48);
    basket(6.6, 0.1, 5.1, 0xdf9a3a, 0xe8823a);
  }
}
