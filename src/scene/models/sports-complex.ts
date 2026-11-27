import * as THREE from "three";
import type { Kit } from "./kit";
import { line, paving, shrub } from "./entertainment-b-parts";

export function buildSportsComplex(kit: Kit) {
  const { box } = kit;
  const painted = 0xe9e1cb;
  const red = 0x9b523f;
  const green = 0x4c8048;
  const shade = 0x345f86;

  paving(kit, -9.8, 9.8, -7.8, 7.8, 1.0, 0xaaa18d, 0x867d6b);
  box(0x877966, 0, 0.22, -0.2, 18.8, 0.28, 14.8);
  box(0xb4a68d, 0, 0.38, -0.2, 17.9, 0.15, 13.9);
  box(red, 0, 0.47, -0.25, 13.9, 0.18, 9.6);
  box(0x7d4637, 0, 0.58, -0.25, 12.2, 0.08, 8.3);
  box(green, 0, 0.62, -0.25, 10.8, 0.1, 7.0);
  for (let z = -3.4; z <= 2.9; z += 1.4) {
    if (z > -2.7) box(0x5c9051, 0, 0.68, z, 10.65, 0.025, 0.68);
  }
  for (const x of [-5.2, 5.2]) box(painted, x, 0.69, -0.25, 0.07, 0.025, 6.8);
  box(painted, 0, 0.69, -0.25, 0.07, 0.025, 6.8);
  box(painted, 0, 0.69, 3.03, 10.45, 0.025, 0.07);
  box(painted, 0, 0.69, -3.53, 10.45, 0.025, 0.07);
  for (const x of [-4.3, 4.3]) {
    box(painted, x, 0.7, -0.25, 0.07, 0.025, 3.2);
    box(painted, x + Math.sign(x) * 0.9, 0.7, 1.35, 1.8, 0.025, 0.07);
    box(painted, x + Math.sign(x) * 0.9, 0.7, -1.85, 1.8, 0.025, 0.07);
    box(painted, x + Math.sign(x) * 1.8, 0.7, -0.25, 0.07, 0.025, 3.2);
  }
  const centerRing = kit.solid(new THREE.RingGeometry(0.82, 0.9, 32), painted, 0, 0.71, -0.25);
  centerRing.rotation.x = -Math.PI / 2;
  const centerDot = kit.solid(new THREE.CircleGeometry(0.08, 12), painted, 0, 0.72, -0.25);
  centerDot.rotation.x = -Math.PI / 2;

  for (const z of [-3.75, 3.25]) {
    const back = z < 0 ? z - 0.65 : z + 0.65;
    for (const x of [-1.35, 1.35]) {
      box(painted, x, 1.25, z, 0.1, 1.3, 0.1);
      box(painted, x, 1.9, back, 0.1, 0.1, 1.35);
    }
    box(painted, 0, 1.9, z, 2.7, 0.1, 0.1);
    for (const x of [-1.2, -0.6, 0, 0.6, 1.2]) line(kit, 0xdedbc8, [x, 0.75, z], [x, 1.84, back], 0.025);
  }

  for (const side of [-1, 1]) {
    for (let row = 0; row < 6; row++) {
      const x = side * (6.05 + row * 0.49);
      const y = 0.78 + row * 0.39;
      box(row % 2 ? 0xb8ab94 : 0x9e927c, x, y, -0.25, 0.5, 0.28, 11.9);
      box(row % 2 ? shade : 0x4a6f83, x, y + 0.2, -0.25, 0.43, 0.18, 11.5);
      for (let z = -5.7; z <= 5.2; z += 0.48) {
        const color = Math.round((z + 6) * 10) % 4 === 0 ? 0xe1d7bc : (Math.round((z + 6) * 10) % 4 === 1 ? 0xc3b99f : shade);
        box(color, x - side * 0.05, y + 0.31, z, 0.34, 0.16, 0.29);
      }
      box(0x6d6557, x + side * 0.21, y + 0.38, -0.25, 0.06, 0.05, 11.95);
    }
  }
  for (const side of [-1, 1]) {
    for (let row = 0; row < 5; row++) {
      const z = side * (4.62 + row * 0.48);
      const y = 0.75 + row * 0.38;
      box(0xa69b85, 0, y, z, 11.55, 0.28, 0.47);
      box(shade, 0, y + 0.2, z, 11.25, 0.16, 0.4);
      for (let x = -5.35; x <= 5.1; x += 0.48) box(Math.round((x + 6) * 10) % 3 ? 0xe0d5bd : 0x50738a, x, y + 0.31, z, 0.29, 0.16, 0.33);
    }
  }
  for (const side of [-1, 1]) {
    const roofCenter = side * 7.75;
    box(0xd0c3a9, roofCenter, 3.78, -0.25, 3.65, 0.2, 12.5);
    box(0x385c79, roofCenter, 3.9, -0.25, 3.72, 0.14, 12.55);
    box(0xf1e8d2, roofCenter, 3.54, 6.04 * side, 3.7, 0.58, 0.15);
    for (let z = -5.9; z <= 5.4; z += 1.4) {
      box(0xa69b84, side * 6.1, 2.2, z, 0.17, 3.1, 0.17);
      box(0xa69b84, side * 9.25, 2.2, z, 0.17, 3.1, 0.17);
      line(kit, 0x897d68, [side * 6.1, 3.45, z], [side * 9.25, 3.45, z], 0.08);
    }
  }
  for (const side of [-1, 1]) for (const z of [-4.8, -1.7, 1.7, 4.8]) {
    box(0xd1c4ab, side * 7.5, 1.55, z, 2.9, 0.08, 0.48);
    for (let row = 0; row < 6; row++) box(0xe4ddca, side * (6.15 + row * 0.49), 1.0 + row * 0.39, z, 0.06, 0.3, 0.08);
  }

  const towers: [number, number][] = [
    [-8.85, -5.9], [-8.85, -2.0], [-8.85, 2.0], [-8.85, 5.9],
    [8.85, -5.9], [8.85, -2.0], [8.85, 2.0], [8.85, 5.9],
    [-3.4, -6.9], [3.4, -6.9], [-3.4, 6.9], [3.4, 6.9],
  ];
  for (const [x, z] of towers) {
    box(0x777d7a, x, 6.9, z, 0.16, 13.4, 0.16);
    box(0x666d6b, x, 0.32, z, 0.72, 0.24, 0.72);
    for (const side of [-1, 1]) {
      box(0x9ca29e, x + side * 0.3, 6.4, z, 0.055, 12.2, 0.055, 0, side * 0.025);
      box(0x888f8c, x, 6.4, z + side * 0.3, 0.055, 12.2, 0.055, side * 0.025);
      line(kit, 0x666d6b, [x, 1.0, z], [x + side * 0.3, 13.4, z], 0.045);
      line(kit, 0x666d6b, [x, 1.0, z], [x, 13.4, z + side * 0.3], 0.045);
    }
    box(0x6c7472, x, 13.8, z, 1.05, 0.15, 0.36);
    box(0x505957, x, 13.92, z, 1.16, 0.1, 0.4);
    for (let i = -2; i <= 2; i++) {
      box(0xf1e3aa, x + i * 0.19, 13.78, z + 0.2, 0.14, 0.2, 0.08);
      box(0x3e4745, x + i * 0.19, 13.66, z + 0.2, 0.16, 0.04, 0.1);
    }
    for (let y = 1.1; y < 12.8; y += 0.4) box(0xb8bab3, x + 0.1, y, z + 0.1, 0.22, 0.035, 0.035);
  }

  for (const x of [-3.0, 0, 3.0]) {
    box(0x71614e, x, 1.02, 7.12, 1.55, 1.85, 0.66);
    box(0xddd0b4, x, 1.95, 7.12, 1.72, 0.12, 0.82);
    box(0x4d7084, x, 1.1, 7.47, 0.84, 0.78, 0.08);
    box(0xe0c875, x, 2.16, 7.15, 1.0, 0.16, 0.34);
    for (const side of [-1, 1]) box(0x564633, x + side * 0.58, 0.58, 6.65, 0.12, 0.85, 0.12);
  }
  for (const x of [-6.0, 6.0]) {
    box(0x5b594e, x, 4.0, 7.4, 0.07, 7.4, 0.07);
    box(0xf2e5c4, x, 7.6, 7.4, 1.8, 0.85, 0.07);
    for (let i = 0; i < 5; i++) box(i % 2 ? 0xc3a64e : 0xa4463c, x - 0.72 + i * 0.36, 7.58, 7.45, 0.15, 0.45, 0.04);
  }
  for (const x of [-9.2, 9.2]) for (const z of [-7.3, -3.7, 3.7, 7.3]) shrub(kit, x, z, 0.5, 0x4e7443);
}
