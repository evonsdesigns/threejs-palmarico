import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, door, face } from "./services-parts";

export function buildLoggingCamp(kit: Kit) {
  const { box, solid } = kit;
  const wood = 0x66513a;
  const metal = 0x777a71;
  box(0x80785d, 0, 0.06, 0, 7.8, 0.12, 7.8);
  box(0x91886c, 0, 0.13, 0, 7.55, 0.04, 7.55);

  // Large weathered timber storage shed.
  box(0x414f3d, -2.05, 1.45, -1.65, 3.15, 2.65, 3.5);
  for (let x = -3.45; x <= -0.65; x += 0.3) {
    box(x < -1.5 ? 0x66745a : 0x76765b, x, 1.45, 0.12, 0.26, 2.55, 0.055);
    box(0x303b2e, x + 0.13, 1.45, 0.16, 0.025, 2.55, 0.025);
  }
  for (const x of [-3.55, -0.55]) box(wood, x, 1.5, 0.18, 0.15, 2.75, 0.15);
  box(wood, -2.05, 2.71, 0.19, 3.2, 0.14, 0.12);
  door(face(kit, -2.05, 0.18, 0), 0.45, 0.15, 1.05, 2.3,
    { leaf: 0x625e46, frame: 0x4f4d3c, trim: 0x877b5c, double: true, handle: 0x413d32 });
  kit.gable(-2.05, -1.65, 3.45, 3.8, 2.82, 0.58, 0x70766d, 4);
  for (const side of [-1, 1]) {
    for (let x = -3.6; x <= -0.5; x += 0.45) {
      box(x < -2 ? 0x8c8a7a : 0x656e68, x, 3.12, -1.65 + side * 0.95, 0.07, 0.04, 1.95, side * 0.3);
    }
  }

  // Open-sided sheet-metal work shelter attached to the shed.
  for (const x of [-0.95, 2.05]) {
    for (const z of [-0.75, 1.95]) {
      box(wood, x, 1.43, z, 0.12, 2.8, 0.12);
      box(0x8b7960, x, 0.16, z, 0.24, 0.12, 0.24);
    }
  }
  for (const z of [-0.75, 1.95]) box(wood, 0.55, 2.8, z, 3.2, 0.12, 0.12);
  box(0x737971, 0.55, 3.02, 0.6, 3.5, 0.12, 3.05, -0.11);
  for (let x = -1.1; x <= 2.15; x += 0.42) box(x < 0 ? 0x8a8b7c : metal, x, 3.09, 0.6, 0.045, 0.025, 3.0, -0.11);
  for (const z of [-0.2, 1]) box(0x5e635d, 0.55, 3.09 - z * 0.11, z, 3.4, 0.035, 0.04);
  box(0x705238, 1.1, 0.8, 0.5, 1.5, 0.12, 0.65);
  for (const x of [0.45, 1.75]) for (const z of [0.25, 0.75]) box(wood, x, 0.4, z, 0.09, 0.8, 0.09);
  box(0x444a42, 1.1, 0.9, 0.48, 0.55, 0.12, 0.28);
  box(0xaaa99a, 1.1, 1.05, 0.48, 0.35, 0.16, 0.07);

  // Small red-roofed cabin behind the shelter.
  box(0x796f5b, 1.5, 1.2, -2.75, 2.25, 2.15, 1.7);
  for (let x = 0.5; x <= 2.5; x += 0.3) box(0x99876b, x, 1.2, -1.88, 0.25, 2.05, 0.04);
  kit.frontWindow(1.9, 1.55, -1.86, 0.5, 0.7);
  kit.gable(1.5, -2.75, 2.55, 1.95, 2.3, 0.45, 0xa84b33, 3);
  for (const side of [-1, 1]) {
    for (let x = 0.35; x <= 2.65; x += 0.35) {
      box(x > 1.7 ? 0xc07d58 : 0x934533, x, 2.54, -2.75 + side * 0.48, 0.055, 0.035, 1.02, side * 0.43);
    }
  }

  // A small pale trailer office, raised on blocks with a glazed side window.
  box(0x514f47, 3.0, 0.34, 0.25, 1.45, 0.28, 2.0);
  box(0xd2d4c8, 3.0, 1.08, 0.25, 1.45, 1.28, 2.0);
  box(0xe4e2d5, 3.0, 1.76, 0.25, 1.55, 0.12, 2.1);
  for (const y of [0.62, 0.83, 1.04, 1.25, 1.46]) box(0xadafa4, 3.73, y, 0.25, 0.025, 0.025, 1.95);
  kit.window(3.74, 1.2, 0.25, 0.85, 0.55, Math.PI / 2);
  kit.frontWindow(3.0, 1.2, 1.26, 0.65, 0.55);
  for (const z of [-0.45, 0.9]) box(0x444440, 3.0, 0.18, z, 1.3, 0.22, 0.3);
  for (const z of [-0.55, 0.25, 1.05]) box(0xb4b5aa, 3.0, 1.83, z, 1.45, 0.02, 0.035);

  // Horizontal fuel tank on timber trestles, with bands and a pipe.
  const tank = solid(new THREE.CylinderGeometry(0.52, 0.52, 1.8, 16), 0x999f9a, -2.25, 0.94, 1.55);
  tank.rotation.z = Math.PI / 2;
  for (const x of [-2.95, -2.25, -1.55]) {
    const band = solid(new THREE.CylinderGeometry(0.53, 0.53, 0.055, 16), 0x6e7471, x, 0.94, 1.55);
    band.rotation.z = Math.PI / 2;
  }
  for (const x of [-2.85, -1.65]) {
    box(wood, x, 0.31, 1.55, 0.14, 0.5, 1.05);
    box(wood, x, 0.5, 1.55, 0.18, 0.12, 1.05);
  }
  box(0x4c504b, -2.25, 1.52, 1.55, 0.15, 0.25, 0.15);
  box(0xb4b5a8, -2.25, 1.66, 1.55, 0.24, 0.08, 0.24);

  // Plank walkway and a few cut logs and tools around the work yard.
  for (let z = 2.15; z <= 3.7; z += 0.18) {
    box(Math.round(z * 100) % 3 ? 0xb0a17e : 0x998a6c, 0, 0.2, z, 1.55, 0.08, 0.15);
  }
  for (const x of [-0.65, 0.65]) box(wood, x, 0.15, 2.9, 0.12, 0.12, 1.8);
  for (let i = 0; i < 3; i++) {
    const log = solid(new THREE.CylinderGeometry(0.15, 0.18, 1.5, 8), i === 1 ? 0x836245 : 0x735238, -2.3 + i * 0.22, 0.22 + i * 0.12, 2.65 + i * 0.23);
    log.rotation.z = Math.PI / 2;
  }
  beam(kit, wood, [1.75, 0.17, 2.5], [2.4, 1.4, 2.2], 0.09);
  box(0x989d90, 2.43, 1.45, 2.2, 0.4, 0.15, 0.1);
  box(0x72583e, -3.35, 0.35, 2.9, 0.55, 0.55, 0.55);
}
