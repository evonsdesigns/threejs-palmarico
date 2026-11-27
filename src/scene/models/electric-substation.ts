import * as THREE from "three";
import type { Kit } from "./kit";

export function buildElectricSubstation(kit: Kit) {
  const { box, solid } = kit;
  const steel = 0x617078;
  const porcelain = 0xe7e2cf;
  const wire = 0x343936;
  const insulator = (x: number, y: number, z: number, r = 0.16) => {
    for (let i = 0; i < 3; i++) {
      const mesh = solid(new THREE.CylinderGeometry(r * (0.72 + (i % 2) * 0.2), r * (0.72 + (i % 2) * 0.2), 0.12, 8), porcelain, x, y + i * 0.14, z);
      mesh.rotation.z = Math.PI / 2;
    }
    box(0x829093, x, y + 0.44, z, 0.08, 0.08, 0.08);
  };

  box(0x777561, 0, 0.03, 0, 3.8, 0.06, 3.8);
  box(0xb3b4a8, -0.15, 0.17, -0.25, 2.55, 0.28, 2.45);
  // Reinforced concrete pad and compact oil transformer tank.
  box(0x77786f, -0.15, 0.35, -0.25, 1.7, 0.28, 1.62);
  box(0xaaa99e, -0.15, 1.02, -0.25, 1.45, 1.15, 1.28);
  for (const x of [-0.82, 0.52]) {
    box(0x787a73, x, 0.72, -0.25, 0.12, 0.5, 1.3);
    box(0x858780, x, 1.3, -0.25, 0.12, 0.44, 1.3);
    for (let z = -0.74; z <= 0.25; z += 0.17) box(0x666b68, x, 1.02, z, 0.07, 0.65, 0.035);
  }
  box(0x4c5555, -0.15, 1.66, -0.25, 0.58, 0.14, 0.55);
  box(0xd2c7a6, -0.15, 1.9, -0.25, 0.62, 0.28, 0.62);
  for (const x of [-0.55, -0.15, 0.25]) {
    box(steel, x, 2.28, -0.25, 0.1, 0.58, 0.1);
    insulator(x, 2.5, -0.25, 0.13);
  }
  // Steel buswork, three incoming phase bars and knife-switch links.
  for (const z of [-0.7, -0.25, 0.2]) {
    box(steel, -0.15, 3.45, z, 2.35, 0.08, 0.08);
    for (const x of [-0.95, -0.15, 0.65]) {
      box(steel, x, 2.9, z, 0.06, 0.95, 0.06);
      insulator(x, 3.2, z, 0.11);
    }
    box(wire, -0.15, 3.68, z, 2.2, 0.035, 0.035);
    box(0xb99b57, -0.15, 3.12, z, 0.68, 0.06, 0.06, 0, 0.14);
  }
  // Small line pole with crossarm and ceramic caps; power wires continue out of the fenced lot.
  box(0x705638, 1.2, 2.9, -1.32, 0.16, 5.8, 0.16);
  box(0x785f3d, 1.2, 5.76, -1.32, 1.25, 0.14, 0.15);
  box(0x705638, 1.2, 5.35, -1.32, 0.12, 0.9, 0.12);
  for (const x of [0.78, 1.2, 1.62]) {
    insulator(x, 5.8, -1.32, 0.12);
    box(wire, x, 6.5, -1.32, 0.035, 1.0, 0.035);
  }
  // Galvanized mesh fence encloses the live yard, leaving a clear service gate at +z.
  const fence = (x1: number, z1: number, x2: number, z2: number, vertical: boolean) => {
    const len = Math.hypot(x2 - x1, z2 - z1);
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const x = x1 + (x2 - x1) * t;
      const z = z1 + (z2 - z1) * t;
      box(steel, x, 1.13, z, 0.07, 2.2, 0.07);
      box(0x92958f, x, 2.26, z, 0.12, 0.06, 0.12);
    }
    for (const y of [0.25, 1.08, 1.95]) box(steel, (x1 + x2) / 2, y, (z1 + z2) / 2, vertical ? 0.055 : len, 0.055, vertical ? len : 0.055);
    for (let i = 0; i < 15; i++) {
      const t = i / 14;
      const x = x1 + (x2 - x1) * t;
      const z = z1 + (z2 - z1) * t;
      box(0x9ca19b, x, 1.08, z, vertical ? 0.035 : len / 12, 1.65, vertical ? len / 12 : 0.035, 0, vertical ? Math.PI / 4 : 0);
    }
  };
  fence(-1.78, -1.78, 1.78, -1.78, false);
  fence(-1.78, -1.78, -1.78, 1.78, true);
  fence(1.78, -1.78, 1.78, 1.78, true);
  fence(-1.78, 1.78, -0.62, 1.78, false);
  fence(0.62, 1.78, 1.78, 1.78, false);
  for (const x of [-0.65, 0.65]) {
    box(0x35403c, x, 0.78, 1.78, 0.08, 1.55, 0.08);
    box(0x667775, x, 1.55, 1.78, 0.1, 0.08, 0.1);
  }
  box(0xd5d3c5, -1.45, 1.55, 0.25, 0.38, 0.42, 0.05);
  box(0xbc4738, -1.45, 1.57, 0.22, 0.24, 0.26, 0.04);
  box(0xf0d36a, 1.35, 0.25, 0.9, 0.32, 0.5, 0.36);
  for (const y of [0.42, 0.53]) box(0x323532, 1.35, y, 0.9, 0.36, 0.035, 0.4);
}
