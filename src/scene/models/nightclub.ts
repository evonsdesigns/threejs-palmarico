import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, detailedWindow, door, face, palm, pixelText, plant, wallLamp } from "./services-parts";

const WALL = 0x2d454b;
const TRIM = 0x7d9ca0;
const PINK = 0xf04e9b;
const CYAN = 0x36d5d0;

function neonLine(kit: Kit, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: number, count: number) {
  beam(kit, color, [x0, y0, z0], [x1, y1, z1], 0.055);
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    kit.litBox(color, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t, 0.11, 0.11, 0.11);
  }
}

export function buildNightclub(kit: Kit) {
  const { box, solid } = kit;
  box(0x545345, 0, 0.04, 0, 11.8, 0.08, 11.8);
  box(0x75694f, 0, 0.08, 2.2, 11.5, 0.04, 3.5);
  for (let x = -5.5; x <= 5.5; x += 0.65) box(0x645d4b, x, 0.11, 2.2, 0.03, 0.01, 3.5);
  for (let z = 0.5; z < 3.9; z += 0.65) box(0x645d4b, 0, 0.11, z, 11.4, 0.01, 0.03);
  // Distinctive low, boxy dance hall with clipped corners and stepped flat parapet.
  box(0x273b40, 0, 0.2, -1.45, 8.8, 0.32, 7.7);
  box(WALL, 0, 2.65, -1.45, 8.4, 4.55, 7.3);
  box(0x4b686b, 0, 0.52, -1.45, 8.5, 0.35, 7.4);
  box(TRIM, 0, 5.02, -1.45, 8.9, 0.2, 7.7);
  box(0x1e2c30, 0, 5.18, -1.45, 8.55, 0.18, 7.35);
  box(0x3e5559, 0, 5.32, -1.45, 8.05, 0.12, 6.85);
  for (const x of [-4.1, 4.1]) for (const z of [-4.85, 1.95]) box(0x739092, x, 2.65, z, 0.18, 4.3, 0.18);
  // Rooftop bar rail, vents, speaker stacks, and colorful roof edge tubing.
  for (const z of [-4.9, 2.0]) {
    box(0x607a79, 0, 5.58, z, 7.95, 0.08, 0.08);
    for (let x = -3.8; x <= 3.81; x += 0.42) box(0x748c88, x, 5.46, z, 0.045, 0.24, 0.045);
  }
  for (const x of [-2.9, 2.9]) {
    box(0x171f21, x, 5.65, -1.3, 1.05, 0.55, 1.0);
    box(0x536164, x, 5.65, -0.77, 0.8, 0.35, 0.08);
    for (const y of [5.55, 5.75]) {
      const speaker = solid(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 12), 0x17191a, x, y, -0.71);
      speaker.rotation.x = Math.PI / 2;
    }
  }
  box(0x64645b, 1.55, 5.55, -3.3, 1.25, 0.32, 0.8);
  box(0x3e4140, 1.55, 5.75, -3.3, 0.95, 0.08, 0.58);
  neonLine(kit, -4.0, 5.35, 2.52, 4.0, 5.35, 2.52, CYAN, 20);
  neonLine(kit, -4.0, 5.35, -4.92, 4.0, 5.35, -4.92, PINK, 20);
  neonLine(kit, -4.13, 5.35, -4.85, -4.13, 5.35, 2.52, PINK, 18);
  neonLine(kit, 4.13, 5.35, -4.85, 4.13, 5.35, 2.52, PINK, 18);

  const F = face(kit, 0, 2.22, 0);
  // Main entrance has dark glass and a theatrical colored double door.
  door(F, 0, 0.25, 1.75, 2.55, { leaf: 0x183338, frame: 0x94b9b1, trim: 0x243b3d, handle: 0xdbca8d, double: true, glazed: true, glass: 0x395d60 });
  for (const x of [-3.3, -2.05, 2.05, 3.3]) {
    detailedWindow(F, x, 2.35, 0.8, 1.45, { lintel: TRIM });
    box(0x243438, x, 2.35, 2.28, 0.92, 1.55, 0.08);
    box(0x3f6064, x, 2.35, 2.34, 0.65, 1.23, 0.04);
  }
  for (const x of [-3.75, 3.75]) wallLamp(F, x, 2.7, 0x68f5e1);
  // Deep flat entrance canopy with vivid illuminated fascia and an inset sign.
  box(0x141d20, 0, 3.52, 3.37, 6.8, 0.22, 2.05);
  box(0x293d40, 0, 3.28, 4.27, 6.62, 0.42, 0.18);
  neonLine(kit, -3.25, 3.5, 4.4, 3.25, 3.5, 4.4, PINK, 26);
  box(0x162326, 0, 4.12, 3.41, 3.3, 0.7, 0.13);
  box(0x26373a, 0, 4.12, 3.5, 3.05, 0.52, 0.05);
  pixelText(face(kit, 0, 3.54, 0), "LUNA", 0, 4.11, 0.06, 0.14, 0x45efe1);
  for (const x of [-2.8, 2.8]) {
    beam(kit, 0x303a39, [x, 3.45, 2.5], [x, 0.12, 4.6], 0.06);
    box(0x374443, x, 1.35, 4.6, 0.1, 2.6, 0.1);
  }
  // Continuous neon bands outline the front and sides of the dark club facade.
  neonLine(kit, -4.0, 4.82, 2.27, 4.0, 4.82, 2.27, CYAN, 20);
  neonLine(kit, -4.13, 1.0, 2.25, -4.13, 4.55, 2.25, PINK, 10);
  neonLine(kit, 4.13, 1.0, 2.25, 4.13, 4.55, 2.25, PINK, 10);
  // Side glazing and service door, kept subdued against the dark shell.
  const R = face(kit, 4.22, -1.45, Math.PI / 2);
  for (const z of [-3.7, -1.55, 0.55]) detailedWindow(R, z, 2.25, 1.25, 1.5, { lintel: TRIM });
  door(R, -3.7, 0.3, 0.95, 2.15, { leaf: 0x34494a, frame: TRIM, handle: 0xd1bb7a });
  for (const x of [-5.1, 5.05]) {
    palm(kit, x, 3.1, 0.08, 0.74);
    plant(kit, x, -4.15, 0.1, 0x994e4c, [0xe74c9a, 0x45d9ca, 0xe8c75e], 0.8);
  }
  // Queue rails, planters, and a pair of low ground lights frame the doorway.
  for (const x of [-1.75, 1.75]) {
    box(0x393d39, x, 0.52, 4.75, 0.12, 1.0, 0.12);
    box(0xd3be7b, x, 1.06, 4.75, 0.25, 0.08, 0.25);
    box(0x426b4c, x * 2.55, 0.42, 4.0, 0.82, 0.72, 0.82);
    plant(kit, x * 2.55, 4.0, 0.78, 0x8b4b42, [0xe44c9a, 0x45d9ca], 0.68);
    kit.litBox(0x61e7d2, x * 2.7, 0.3, 2.8, 0.22, 0.28, 0.22);
  }
}
