import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, detailedWindow, door, face, hipRoof, palm, pixelText, plant, wallLamp } from "./services-parts";

const WALL = 0xeee7d6;
const TRIM = 0xf6f0df;
const TEAL = 0x477f83;
const WOOD = 0x704b31;

function diningTable(kit: Kit, x: number, z: number, umbrella: number) {
  kit.solid(new THREE.CylinderGeometry(0.52, 0.52, 0.1, 12), 0xf0e9d8, x, 0.96, z);
  kit.box(0x76583b, x, 0.52, z, 0.12, 0.82, 0.12);
  kit.box(0x76583b, x, 0.12, z, 0.68, 0.08, 0.68);
  for (const [dx, dz] of [[-0.8, 0], [0.8, 0], [0, -0.8], [0, 0.8]]) {
    kit.box(0xede8dc, x + dx, 0.52, z + dz, 0.46, 0.08, 0.46);
    kit.box(0x704b31, x + dx, 0.26, z + dz, 0.06, 0.5, 0.06);
    kit.box(0x704b31, x + dx, 0.82, z + dz - 0.17, 0.43, 0.52, 0.06);
  }
  kit.box(0xeee9da, x, 1.75, z, 0.07, 1.6, 0.07);
  kit.solid(new THREE.ConeGeometry(1.05, 0.4, 8, 1, true), umbrella, x, 2.62, z);
  kit.box(umbrella, x, 2.46, z, 1.8, 0.12, 1.8);
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4;
    beam(kit, 0xe9e3d3, [x, 2.45, z], [x + Math.sin(a), 2.62, z + Math.cos(a)], 0.025);
  }
  kit.box(0xf6f0df, x, 2.85, z, 0.12, 0.12, 0.12);
}

function valetCar(kit: Kit, x: number, z: number) {
  kit.box(0x243b42, x, 0.52, z, 1.72, 0.58, 3.15);
  kit.box(0x2e5960, x, 0.95, z - 0.2, 1.4, 0.48, 1.65);
  kit.box(0x9ec2c2, x, 0.97, z - 0.18, 1.26, 0.35, 1.52);
  kit.box(0x31575a, x, 1.23, z - 0.18, 1.43, 0.08, 1.7);
  for (const dx of [-0.88, 0.88]) for (const dz of [-1, 1]) {
    kit.solid(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 10), 0x242322, x + dx, 0.35, z + dz).rotation.z = Math.PI / 2;
    kit.solid(new THREE.CylinderGeometry(0.13, 0.13, 0.15, 10), 0xb9b8ad, x + dx, 0.35, z + dz).rotation.z = Math.PI / 2;
  }
  for (const dx of [-0.53, 0.53]) kit.litBox(0xf5df9b, x + dx, 0.57, z + 1.59, 0.22, 0.17, 0.04);
}

export function buildGourmetRestaurant(kit: Kit) {
  const { box, solid } = kit;
  box(0xb9ac91, 0, 0.04, 0, 11.8, 0.08, 7.8);
  box(0xd5c8aa, 0, 0.09, 2.1, 11.6, 0.05, 3.5);
  for (let x = -5.7; x < 5.8; x += 0.58) box(0xb5a584, x, 0.125, 2.1, 0.025, 0.01, 3.5);
  for (let z = 0.45; z < 3.8; z += 0.58) box(0xb5a584, 0, 0.125, z, 11.5, 0.01, 0.025);

  const cx = -1.55;
  const cz = -1.45;
  box(0xc5b99f, cx, 0.2, cz, 7.95, 0.32, 4.45);
  box(WALL, cx, 2.05, cz, 7.6, 3.45, 4.1);
  box(TEAL, cx, 0.58, cz, 7.7, 0.48, 4.2);
  box(0x396b70, cx, 0.83, cz, 7.72, 0.07, 4.22);
  box(TRIM, cx, 3.85, cz, 7.9, 0.2, 4.42);
  box(0xd8d0bd, cx, 3.68, cz, 7.78, 0.12, 4.3);
  for (const x of [cx - 3.7, cx + 3.7]) for (const z of [cz - 1.95, cz + 1.95]) {
    box(TRIM, x, 2.05, z, 0.25, 3.05, 0.25);
    box(0xd7cbb4, x, 2.05, z + Math.sign(z - cz) * 0.15, 0.08, 2.75, 0.08);
  }
  hipRoof(kit, { x0: cx - 4.05, x1: cx + 4.05, z0: cz - 2.3, z1: cz + 2.3, eave: 3.96, rise: 1.05, runX: 1.65, runZ: 1.45, color: 0xb65f3e, rib: 0x98482e, course: 0x793c2b, cap: 0xa34b30, fascia: TRIM, ribStep: 0.34, courses: 5, patches: [0xcc7445, 0x9c5035] });

  const F = face(kit, cx, 0.62, 0);
  door(F, -0.25, 0.28, 1.45, 2.3, { leaf: WOOD, frame: TRIM, trim: 0x503a2a, handle: 0xd5b85e, double: true, glazed: true, glass: 0x68979a });
  for (const x of [-2.65, 2.45]) {
    detailedWindow(F, x, 2.06, 1.25, 1.45, { shutter: TEAL, lintel: TRIM });
    box(0x9b5937, cx + x, 0.37, 0.77, 1.65, 0.15, 0.46);
    for (let i = 0; i < 3; i++) box(0x714b32, cx + x - 0.5 + i * 0.5, 0.66, 0.77, 0.06, 0.48, 0.06);
  }
  for (const x of [-3.45, 3.45]) wallLamp(F, x, 2.6, 0xf5d17a);
  box(0x4c3a2a, cx, 4.23, 0.75, 3.2, 0.65, 0.16);
  box(0xd7b66b, cx, 4.23, 0.86, 2.95, 0.48, 0.07);
  pixelText(face(kit, cx, 0.91, 0), "GOURMET", 0, 4.23, 0.04, 0.075, 0x354e45);
  box(0x477f83, cx, 3.84, 0.9, 3.25, 0.08, 0.12);

  const R = face(kit, cx + 3.82, cz, Math.PI / 2);
  for (const z of [-2.35, -0.4]) detailedWindow(R, z, 2.05, 1.05, 1.35, { shutter: TEAL, lintel: TRIM });
  door(R, 1.05, 0.3, 1.1, 2.15, { leaf: WOOD, frame: TRIM, double: false, handle: 0xd5b85e });
  for (const x of [cx - 3.8, cx + 3.7]) box(0xf1eadc, x, 1.55, -3.55, 0.08, 2.2, 0.08);
  box(0xf1eadc, cx, 2.65, -3.55, 7.55, 0.08, 0.08);
  box(0xf1eadc, cx, 0.52, -3.55, 7.55, 0.08, 0.08);
  for (const x of [-4.6, 1.55, 4.75]) {
    box(0x8c5a36, x, 0.55, 3.55, 0.48, 0.95, 0.48);
    plant(kit, x, 3.55, 1.05, 0x9c5b3b, [0xe3c53e, 0xd8434f, 0xffffff], 0.9);
  }
  diningTable(kit, -3.65, 2.45, 0x347a9b);
  diningTable(kit, 0.15, 2.55, 0xd79c3d);
  diningTable(kit, 3.75, 2.15, 0x347a9b);
  // Small valet island and drop-off car occupy the remaining forecourt.
  box(0xd7c69f, 4.95, 0.09, -0.95, 1.55, 0.06, 2.25);
  box(0x56493a, 4.95, 0.63, -0.95, 0.07, 1.0, 0.07);
  box(0xe4c56c, 4.95, 1.2, -0.95, 1.05, 0.3, 0.08);
  pixelText(face(kit, 4.95, -0.89, 0), "VALET", 0, 1.2, 0.04, 0.045, 0x453526);
  valetCar(kit, -4.95, -0.9);
  palm(kit, -5.3, -3.15, 0.08, 0.62);
  palm(kit, 5.2, 3.42, 0.08, 0.62);
  for (const [x, z] of [[-5.3, 0.25], [5.15, -3.35]] as const) plant(kit, x, z, 0.1, 0x9c5b3b, [0xe3c53e, 0xd8434f], 0.72);
  // Kitchen exhaust and compact roof equipment.
  box(0x8c8a80, 0.65, 4.85, -1.7, 0.65, 0.28, 0.65);
  solid(new THREE.CylinderGeometry(0.2, 0.22, 1.0, 10), 0x77766f, 0.65, 5.45, -1.7);
  box(0x676760, 0.65, 5.98, -1.7, 0.58, 0.08, 0.58);
}
