import * as THREE from "three";
import type { Kit } from "./kit";
import { ammoCrate, militaryTank, militaryTruck } from "./government-b-parts";
import { detailedWindow, door, face, plant, wallLamp } from "./services-parts";

const WALL = 0xc3b99f;
const TRIM = 0xe2d7bd;
const OLIVE = 0x686b55;

export function buildArmory(kit: Kit) {
  const { box } = kit;
  box(0x877f6d, 0, 0.06, 0, 15.7, 0.12, 11.7);
  box(0xa6a08d, 0, 0.13, 2.8, 15.4, 0.08, 5.6);
  for (let x = -7.2; x < 7.5; x += 0.55) box(0x898372, x, 0.18, 2.8, 0.035, 0.015, 5.55);
  box(0x74766a, 0, 0.34, -2.62, 13.2, 0.42, 6.35);
  box(0x3e403c, 0, 0.6, -2.62, 13.35, 0.12, 6.45);

  // Reinforced depot: cream masonry, military-green base, roof vents and deep loading bays.
  box(WALL, 0, 2.48, -2.68, 12.6, 4.0, 5.9);
  box(OLIVE, 0, 0.86, -2.68, 12.75, 0.55, 6.03);
  box(0x484c42, 0, 1.15, -2.68, 12.82, 0.1, 6.1);
  box(TRIM, 0, 4.48, -2.68, 12.9, 0.28, 6.2);
  box(0x55584f, 0, 4.66, -2.68, 13.05, 0.14, 6.35);
  box(0x77796e, 0, 4.74, -2.68, 12.65, 0.08, 5.95);
  for (const x of [-6.15, -3.7, -1.25, 1.25, 3.7, 6.15]) {
    box(0x817b67, x, 2.52, 0.33, 0.22, 3.95, 0.18);
    box(TRIM, x, 4.32, 0.39, 0.3, 0.16, 0.24);
  }
  const F = face(kit, 0, 0.28, 0);
  for (const x of [-4.7, 0, 4.7]) {
    box(0x373a38, x, 2.25, 0.38, 2.55, 2.75, 0.16);
    box(0x535751, x, 2.25, 0.48, 2.3, 2.55, 0.08);
    for (let y = 0.95; y <= 3.42; y += 0.38) box(0x8d8e82, x, y, 0.54, 2.24, 0.065, 0.08);
    box(0x343936, x, 3.67, 0.48, 2.7, 0.12, 0.24);
    box(0x6d7167, x - 1.23, 2.25, 0.52, 0.08, 2.65, 0.08);
    box(0x6d7167, x + 1.23, 2.25, 0.52, 0.08, 2.65, 0.08);
    box(0x3a3d39, x, 0.83, 0.7, 2.65, 0.17, 0.55);
  }
  for (const x of [-2.3, 2.3]) {
    detailedWindow(F, x, 2.72, 1.1, 1.45, { lintel: TRIM });
    box(0x4e524b, x, 2.72, 0.5, 0.14, 1.55, 0.12);
  }
  door(F, 0, 0.48, 1.2, 2.3, { leaf: 0x4d574b, frame: TRIM, trim: 0x393e39, handle: 0xc3a75d });
  wallLamp(F, -1.25, 3.0);
  wallLamp(F, 1.25, 3.0);
  // Small side windows, steel ventilation louvres and downpipes.
  for (const x of [-6.32, 6.32]) {
    const side = x < 0 ? face(kit, x, -2.68, -Math.PI / 2) : face(kit, x, -2.68, Math.PI / 2);
    for (const z of [-1.5, 0, 1.5]) {
      detailedWindow(side, z, 2.35, 0.7, 1.05);
      for (let y = 1.95; y < 2.8; y += 0.15) side.put(0x343b3c, z, y, 0.24, 0.68, 0.035, 0.03);
    }
    for (const z of [-5.0, -0.5]) box(0x72776d, x, 2.25, z, 0.16, 4.0, 0.16);
  }
  const B = face(kit, 0, -5.64, Math.PI);
  door(B, -4.5, 0.5, 1.0, 2.2, { leaf: 0x4d574b, frame: TRIM, trim: 0x393e39 });
  for (const x of [-2.4, 0, 2.4]) detailedWindow(B, x, 2.45, 0.9, 1.1);

  // Modest corrugated roof strip, exhaust cowls and power cable conduits.
  box(0x5c605b, 0, 4.9, -2.68, 12.8, 0.18, 6.0);
  for (let x = -6.1; x <= 6.1; x += 0.3) box(0x71756f, x, 5.0, -2.68, 0.045, 0.05, 5.75);
  for (const x of [-4.5, -1.5, 1.5, 4.5]) {
    box(0x4c514d, x, 5.22, -2.65, 1.15, 0.26, 0.9);
    box(0x797d75, x, 5.38, -2.65, 0.85, 0.1, 0.65);
    for (const dx of [-0.28, 0, 0.28]) box(0x343a38, x + dx, 5.48, -2.65, 0.09, 0.14, 0.42);
  }
  for (const x of [-5.5, 5.5]) {
    box(0x4b514a, x, 5.45, -2.55, 0.76, 1.3, 0.7);
    box(0x73776e, x, 6.14, -2.55, 0.92, 0.12, 0.84);
    box(0x414640, x, 6.28, -2.55, 0.45, 0.16, 0.45);
  }

  // Front loading apron, marked gate, staged supplies and parked military vehicles.
  box(0x4b4c46, 0, 0.2, 5.52, 14.5, 0.16, 0.22);
  for (let z = 0.8; z < 5.4; z += 0.8) box(0xe0d5af, 0, 0.15, z, 0.12, 0.025, 0.32);
  for (const x of [-6.9, 6.9]) {
    box(0x4c5149, x, 0.48, 4.9, 0.2, 0.9, 0.2);
    box(0xd0b85d, x, 1.05, 4.9, 0.3, 0.3, 0.3);
    box(0x454943, x, 1.24, 4.9, 0.4, 0.08, 0.4);
  }
  for (const x of [-5.9, -4.9, 4.9, 5.9]) {
    ammoCrate(kit, x, 4.05, 0.55, x < 0 ? 0x927247 : 0x6e7559);
    if (Math.abs(x) > 5.5) ammoCrate(kit, x, 3.15, 1.35, 0x9a7a4e);
  }
  militaryTank(kit, -2.5, 2.75, 0x59644c);
  militaryTruck(kit, 3.0, 2.6, 0x6d7656);
  // Guardrail posts, sandbags, fuel drums and an armory flag.
  for (const x of [-7.3, 7.3]) {
    for (const z of [1.2, 2.0, 2.8, 3.6]) box(0x5c6254, x, 0.55, z, 0.16, 1.1, 0.16);
    box(0xd0b85d, x, 1.18, 2.0, 0.28, 0.22, 0.28);
  }
  for (const [x, z] of [[-4.1, 0.95], [-3.6, 0.95], [4.5, 1.0], [5.0, 1.0]]) {
    box(0xc0ad83, x, 0.18, z, 0.72, 0.32, 0.38, 0.05);
    box(0xb7a57d, x + 0.1, 0.47, z, 0.68, 0.24, 0.38, -0.05);
  }
  for (const x of [-6.1, 6.1]) {
    kit.solid(new THREE.CylinderGeometry(0.28, 0.28, 0.9, 10), 0x4f634b, x, 0.55, 1.7);
    box(0x323631, x, 1.02, 1.7, 0.34, 0.08, 0.34);
    for (const y of [0.35, 0.78]) box(0xa3a28c, x, y, 1.7, 0.58, 0.04, 0.58);
  }
  box(0x4a4b43, 0, 0.62, -5.2, 0.12, 1.0, 0.12);
  box(0xd4c66b, 0, 1.2, -5.2, 0.16, 0.18, 0.16);
  for (const x of [-6.6, 6.6]) plant(kit, x, 5.0, 0.12, 0x6f5840, [0x536343, 0x65774c], 0.7);
}

