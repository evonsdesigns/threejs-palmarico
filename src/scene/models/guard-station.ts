import * as THREE from "three";
import type { Kit } from "./kit";
import { face, door, detailedWindow, wallLamp, bench, plant } from "./services-parts";
import { flag, jeep, sandbags } from "./government-a-parts";

export function buildGuardStation(kit: Kit) {
  const { box, solid } = kit;
  box(0xb7ae98, 0, 0.09, 0, 7.7, 0.18, 7.7);
  box(0xc4bca6, 0, 0.19, 0, 7.25, 0.08, 7.25);
  box(0xdedac8, 0, 1.75, -0.35, 5.7, 3.05, 4.8);
  box(0xcac4b1, 0, 0.38, -0.35, 5.78, 0.32, 4.88);
  kit.gable(0, -0.35, 6.12, 5.18, 3.22, 1.25, 0x8a2d29, 8);
  box(0x6a3028, 0, 3.18, 2.37, 6.28, 0.16, 0.16);
  const F = face(kit, 0, 2.07, 0);
  door(F, 0, 0.35, 1.15, 2.35, { leaf: 0x53705a, frame: 0xddd6c2, trim: 0x3d5947, handle: 0xd2bd78 });
  detailedWindow(F, -1.95, 1.9, 1.05, 1.22, { shutter: 0x6a806f, louvers: 0x40544a });
  detailedWindow(F, 1.95, 1.9, 1.05, 1.22, { shutter: 0x6a806f, louvers: 0x40544a });
  wallLamp(F, -1.15, 2.55);
  wallLamp(F, 1.15, 2.55);
  for (const x of [-2.35, 2.35]) for (const z of [-2.45, 1.75]) box(0xd9d4c4, x, 1.8, z, 0.22, 3.15, 0.22);
  for (const x of [-2.35, 2.35]) box(0x3f4a43, x, 3.48, -0.35, 0.28, 0.12, 4.38);
  box(0x53624f, 0, 3.48, -2.75, 4.1, 0.12, 0.28);
  for (const z of [-1.25, 0.45]) box(0x53624f, 0, 3.48, z, 5.15, 0.12, 0.16);
  box(0x5e6958, 0, 4.02, -2.72, 2.3, 1.05, 2.3);
  solid(new THREE.CylinderGeometry(1.28, 1.28, 0.16, 12), 0x9a332d, 0, 4.56, -2.72);
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4;
    box(0xcfd3c5, -Math.sin(a) * 1.08, 4.65, -2.72 - Math.cos(a) * 1.08, 0.08, 0.08, 0.18, 0, a);
  }
  box(0x777b70, 0, 5.2, -2.72, 0.1, 1.2, 0.1);
  for (const dx of [-1.0, 1.0]) box(0x777b70, dx, 5.05, -2.72, 0.08, 0.08, 1.7);
  for (const dz of [-3.55, -1.9]) box(0x777b70, 0, 5.05, dz, 1.7, 0.08, 0.08);
  sandbags(kit, -3.42, 1.15, 2.6, Math.PI / 2);
  sandbags(kit, 3.42, 1.15, 2.6, Math.PI / 2);
  sandbags(kit, -1.15, 3.55, 3.0, 0);
  jeep(kit, 2.05, 2.55, Math.PI);
  flag(kit, 3.05, -3.05, 0, 5.8);
  bench(kit, -2.4, 3.18, 0.18, 1.6, 0);
  plant(kit, -3.15, -2.8, 0.12, 0x9c5b3b, [0xd8434f,0xe3c53e,0xf08fb0], 0.7);
  plant(kit, 3.15, -2.8, 0.12, 0x9c5b3b, [0xd8434f,0xe3c53e,0xf08fb0], 0.7);
}
