import * as THREE from "three";
import type { Kit } from "./kit";
import { flower, line, paving, shrub } from "./entertainment-b-parts";

export function buildArchaeologicalSite(kit: Kit) {
  const { box, solid } = kit;
  const limestone = 0xb8ae96;
  const pale = 0xd0c6ad;
  const shadow = 0x79735f;
  const soil = 0x806344;
  const rope = 0x987347;

  box(0x685844, 0, 0.02, 0, 15.6, 0.08, 15.6);
  box(0x6a7448, 0, 0.1, 0, 14.8, 0.15, 14.8);
  paving(kit, -7.7, 7.7, 4.75, 7.65, 0.72, 0xb49b73, 0x8c795b);
  paving(kit, -1.15, 1.15, 0.8, 6.5, 0.52, 0xc7b99b, 0x9a8b70);

  const cx = 0;
  const cz = -0.8;
  const tiers = [
    [8.2, 7.8, 0.8, 0], [7.3, 6.9, 0.72, 0.83], [6.45, 6.0, 0.68, 1.58],
    [5.55, 5.15, 0.63, 2.29], [4.72, 4.35, 0.58, 2.95], [3.9, 3.6, 0.55, 3.56],
    [3.1, 2.9, 0.52, 4.14],
  ];
  for (let i = 0; i < tiers.length; i++) {
    const [w, d, h, bottom] = tiers[i];
    const y = bottom + h / 2;
    box(i % 2 ? 0xa69c83 : limestone, cx, y, cz, w, h, d);
    box(i % 2 ? limestone : pale, cx, bottom + h * 0.75, cz + d * 0.17, w + 0.08, 0.11, 0.2);
    for (const side of [-1, 1]) {
      box(shadow, cx + side * (w / 2 - 0.22), y, cz + d / 2 + 0.055, 0.15, h * 0.82, 0.08);
      box(pale, cx + side * (w / 2 - 0.22), bottom + h * 0.18, cz + d / 2 + 0.1, 0.28, 0.12, 0.16);
      box(pale, cx + side * (w / 2 - 0.22), bottom + h * 0.82, cz + d / 2 + 0.1, 0.28, 0.12, 0.16);
    }
    for (let x = -w / 2 + 0.25; x < w / 2; x += 0.55) {
      const shade = (Math.floor((x + w) * 10) + i) % 4 === 0 ? 0xc7bea8 : 0x8e8774;
      box(shade, x, bottom + h * 0.54, cz + d / 2 + 0.11, 0.16, 0.23, 0.045);
    }
  }
  for (let i = 0; i < 25; i++) {
    const y = 0.34 + i * 0.185;
    const z = cz + 3.78 - i * 0.17;
    box(i % 4 === 0 ? pale : 0xc3b89e, 0, y, z, 1.75 - i * 0.016, 0.12, 0.32);
  }
  box(0x645b48, 0, 4.72, cz - 0.62, 1.75, 1.0, 1.32);
  box(0x4c4335, 0, 4.7, cz + 0.04, 0.68, 1.12, 0.08);
  box(pale, 0, 5.34, cz - 0.62, 2.3, 0.2, 1.62);
  box(limestone, 0, 5.8, cz - 0.62, 1.72, 0.72, 1.2);
  box(pale, 0, 6.22, cz - 0.62, 1.95, 0.12, 1.36);
  for (const x of [-0.5, 0.5]) box(shadow, x, 5.85, cz + 0.02, 0.1, 0.65, 0.08);

  for (const [x, z, h] of [[-5.0, 2.8, 1.4], [-4.2, 3.45, 0.85], [4.8, 2.55, 1.1], [5.25, 3.15, 0.75], [-5.45, -1.8, 0.75], [5.5, -2.0, 1.0]]) {
    box(iStone(x), x, h / 2, z, 0.72, h, 0.62);
    box(pale, x, h, z, 0.82, 0.12, 0.72);
    for (let y = 0.2; y < h; y += 0.31) box(shadow, x + 0.37, y, z + 0.31, 0.045, 0.04, 0.05);
  }
  function iStone(x: number) { return Math.abs(Math.round(x * 10)) % 3 ? limestone : 0xa79c82; }

  const pits: [number, number, number, number][] = [
    [-5.9, -4.7, 2.5, 1.75], [5.8, -4.55, 2.55, 1.9], [-5.85, 5.45, 2.35, 1.55], [5.85, 5.45, 2.35, 1.55],
  ];
  for (const [x, z, w, d] of pits) {
    box(0x493f31, x, 0.18, z, w + 0.28, 0.36, d + 0.28);
    box(soil, x, 0.27, z, w, 0.18, d);
    box(0x67513a, x, 0.38, z, w - 0.3, 0.06, d - 0.3);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = x + sx * (w / 2 + 0.13);
      const pz = z + sz * (d / 2 + 0.13);
      box(0x8b6842, px, 0.8, pz, 0.08, 1.45, 0.08);
      box(0xc8ad7b, px, 1.55, pz, 0.14, 0.08, 0.14);
    }
    for (let gx = -w / 2; gx <= w / 2 + 0.01; gx += 0.5) line(kit, rope, [x + gx, 0.83, z - d / 2], [x + gx, 0.83, z + d / 2], 0.025);
    for (let gz = -d / 2; gz <= d / 2 + 0.01; gz += 0.5) line(kit, rope, [x - w / 2, 0.83, z + gz], [x + w / 2, 0.83, z + gz], 0.025);
    for (const dx of [-0.45, 0.3]) box(0x90856e, x + dx, 0.52, z, 0.38, 0.12, 0.28);
    box(0x755a3c, x + 0.58, 0.8, z + 0.08, 0.06, 0.9, 0.06, 0.18);
  }

  for (const [x, z] of [[-5.95, 0.5], [5.95, 0.15]]) {
    box(0xc5b895, x, 1.25, z, 2.3, 0.08, 2.35);
    box(0xb7aa89, x, 0.9, z, 2.0, 1.55, 1.95);
    const left = solid(new THREE.BoxGeometry(1.25, 0.08, 2.05), 0xddd0af, x - 0.33, 1.72, z);
    left.rotation.z = -0.68;
    const right = solid(new THREE.BoxGeometry(1.25, 0.08, 2.05), 0xcabb98, x + 0.33, 1.72, z);
    right.rotation.z = 0.68;
    box(0x786447, x, 2.22, z, 0.08, 0.12, 2.1);
    for (const dx of [-0.9, 0.9]) for (const dz of [-0.88, 0.88]) box(0x785b3a, x + dx, 0.93, z + dz, 0.06, 1.8, 0.06);
    box(0x5b4833, x, 0.82, z + 1.0, 0.62, 1.3, 0.05);
    box(0xd8c79e, x + 0.62, 0.96, z + 1.0, 0.28, 0.78, 0.04);
    line(kit, rope, [x - 1.12, 1.0, z - 1.13], [x - 1.52, 0.15, z - 1.5], 0.03);
    line(kit, rope, [x + 1.12, 1.0, z - 1.13], [x + 1.52, 0.15, z - 1.5], 0.03);
  }

  for (let z = 5.2; z <= 7.5; z += 0.48) {
    box(z % 1 < 0.5 ? 0xb49c75 : 0xc4ad83, 0, 0.17, z, 1.45, 0.12, 0.36);
  }
  box(0x513f2d, 0, 1.75, 7.15, 2.8, 1.25, 0.15);
  box(0xd0c09b, 0, 1.75, 7.25, 2.56, 1.02, 0.06);
  box(0x876b42, 0, 2.12, 7.29, 1.8, 0.08, 0.03);
  for (const x of [-0.8, -0.4, 0, 0.4, 0.8]) box(0x735837, x, 1.86, 7.29, 0.06, 0.25, 0.03);
  for (const x of [-1.25, 1.25]) box(0x5d4831, x, 1.0, 7.15, 0.12, 1.8, 0.12);
  for (const side of [-1, 1]) {
    for (let z = 2.1; z <= 6.0; z += 0.8) {
      box(0x745a3d, side * 1.45, 0.55, z, 0.08, 1.0, 0.08);
      box(0xb39261, side * 1.45, 1.0, z, 0.15, 0.08, 0.15);
    }
    for (const y of [0.35, 0.8]) line(kit, rope, [side * 1.45, y, 2.1], [side * 1.45, y, 6.0], 0.04);
  }
  for (const [x, z] of [[-6.95, 2.2], [6.95, 2.2], [-6.9, -6.5], [6.9, -6.5]]) shrub(kit, x, z, 0.9, 0x526d3e);
  for (const [x, z] of [[-4.9, 6.85], [4.9, 6.85]]) flower(kit, x, z, 0.7, 0xd6aa46);
  for (const x of [-7.45, 7.45]) {
    box(0xb4a990, x, 0.62, 0.0, 0.2, 1.2, 0.2);
    box(0x9b8e73, x, 1.28, 0.0, 0.35, 0.12, 0.35);
  }
}
