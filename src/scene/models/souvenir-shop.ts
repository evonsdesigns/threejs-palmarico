import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, detailedWindow, door, face, hipRoof, plant, wallLamp } from "./services-parts";
import { sign, stripedAwning } from "./tourism-a-parts";

const STUCCO = 0xe6d4a0;
const TIMBER = 0x805a36;
const TRIM = 0xf0d56f;
const ROOF = 0x9b4432;

export function buildSouvenirShop(kit: Kit) {
  const { box, solid } = kit;
  box(0x71924d, 0, 0.035, 0, 7.8, 0.07, 7.8);
  box(0xd0bb90, 0, 0.09, 2.25, 7.45, 0.04, 3.2);
  for (let x = -3.4; x < 3.5; x += 0.5) box(0xb9a77d, x, 0.115, 2.25, 0.025, 0.01, 3.0);

  box(0x78563a, 0, 0.28, -1.05, 5.9, 0.4, 4.0);
  box(STUCCO, 0, 1.86, -1.05, 5.55, 2.8, 3.65);
  box(0x9b6340, 0, 0.54, -1.05, 5.63, 0.34, 3.72);
  box(TRIM, 0, 3.25, -1.05, 5.9, 0.18, 3.95);
  hipRoof(kit, { x0: -3.15, x1: 3.15, z0: -3.18, z1: 1.08, eave: 3.32, rise: 1.18, runX: 1.65, runZ: 1.35, color: ROOF, rib: 0x783c31, course: 0x6e352c, cap: 0xd4b264, fascia: 0x74492f, ribStep: 0.34, courses: 6, patches: [0xb85a39, 0x863a2f, 0xa84b32] });

  const F = face(kit, 0, 0.79, 0);
  detailedWindow(F, -1.82, 1.85, 1.24, 1.42, { shutter: 0x427e73, lintel: TRIM });
  detailedWindow(F, 1.82, 1.85, 1.24, 1.42, { shutter: 0x427e73, lintel: TRIM });
  door(F, 0, 0.38, 1.22, 2.22, { leaf: 0x6b4730, frame: TRIM, trim: 0x4d3929, handle: 0xd0ad54, double: true, glazed: true, glass: 0x638d87 });
  F.put(0x754b2d, 0, 3.0, 0.12, 3.9, 0.47, 0.14);
  F.put(TRIM, 0, 3.0, 0.22, 3.65, 0.32, 0.04);
  sign(kit, "SOUVENIR", 0, 3.0, 0.25, 0.064, 0x9a3c32, TRIM);
  wallLamp(F, -2.72, 2.28, 0xffd77d);
  wallLamp(F, 2.72, 2.28, 0xffd77d);
  stripedAwning(kit, 0, 2.52, 0.83, 5.8, 1.05, 0.4, 0x3d7c70, 0xf2e5bf);

  for (const x of [-2.7, 0, 2.7]) {
    box(TIMBER, x, 1.6, 1.85, 0.16, 3.0, 0.16);
    box(0x60432f, x, 0.13, 1.85, 0.3, 0.12, 0.3);
    box(TRIM, x, 3.18, 1.85, 0.2, 0.13, 0.2);
  }
  for (let x = -2.8; x < 2.8; x += 0.58) box(TIMBER, x, 3.12, 1.85, 0.12, 0.12, 2.2);
  stripedAwning(kit, 0, 3.1, 0.86, 5.4, 1.4, 0.12, 0xd84e3c, 0xf6e6c1);
  for (const rackX of [-2.15, 2.15]) {
    for (const dz of [1.12, 2.02]) {
      box(0x62462f, rackX, 1.85, dz, 1.25, 0.08, 0.08);
      for (let j = 0; j < 5; j++) {
        const x = rackX - 0.48 + j * 0.24;
        box(0x4f4232, x, 1.72, dz, 0.035, 0.18, 0.03);
        const c = [0xe2473a, 0x35a8aa, 0xf0cf3f, 0x548c50, 0xd74f80][j];
        box(c, x, 1.38, dz, 0.2, 0.56, 0.1);
        box(c, x - 0.13, 1.5, dz, 0.12, 0.3, 0.1, 0, -0.22);
        box(c, x + 0.13, 1.5, dz, 0.12, 0.3, 0.1, 0, 0.22);
        box(0xf1dfba, x, 1.45, dz + 0.06, 0.06, 0.06, 0.02);
      }
    }
    for (let h = 0; h < 3; h++) {
      const x = rackX + (rackX < 0 ? 0.7 : -0.7);
      box(0x9a643b, x, 0.35 + h * 0.25, 2.92, 0.38, 0.2, 0.38);
      box([0xe5b742, 0xd54b37, 0x438c83][h], x, 0.51 + h * 0.25, 2.92, 0.42, 0.08, 0.42);
    }
    for (let h = 0; h < 3; h++) {
      const x = rackX + (rackX < 0 ? -0.72 : 0.72);
      box(0x85603c, x, 0.2 + h * 0.24, 2.95, 0.4, 0.18, 0.35);
      box([0xf5c63a, 0xe44c4c, 0x418c73][h], x, 0.34 + h * 0.24, 2.95, 0.33, 0.08, 0.3);
    }
  }
  for (const x of [-0.9, 0.9]) {
    box(0x805433, x, 0.53, 2.95, 1.18, 0.8, 0.52);
    box(0xe4c56b, x, 0.96, 2.95, 1.24, 0.09, 0.58);
    box(0x4a8979, x, 1.07, 2.95, 0.78, 0.04, 0.3);
    for (let j = 0; j < 4; j++) box([0xdd4c3f, 0x368f9f, 0xe8c54d, 0x598749][j], x - 0.3 + j * 0.2, 1.26, 2.94, 0.16, 0.3, 0.08);
  }
  box(0x6f573b, 0, 1.2, 1.32, 2.8, 0.08, 0.1);
  for (let i = 0; i < 10; i++) {
    box([0x4c879e, 0xe1b64b, 0xc65345, 0x6d9657, 0xdd8350][i % 5], -1.15 + i * 0.25, 1.53 + (i % 3) * 0.06, 1.33, 0.18, 0.43, 0.025, -0.15);
  }
  for (const [x, z] of [[-3.15, 3.25], [3.15, 3.25], [-3.15, 0.85], [3.15, 0.85]]) {
    plant(kit, x, z, 0.12, 0x9c5037, [0xe6c64e, 0xcf4a40, 0xf2e4c2], 0.7);
  }
  bench(kit, 0, 3.55, 0.12, 1.8, 0, 0x8c633e);
  for (const x of [-2.5, 2.5]) {
    box(0x885c3a, x, 0.22, -3.55, 1.2, 0.36, 0.46);
    plant(kit, x - 0.25, -3.55, 0.42, 0x885c3a, [0xf3d251, 0xe24b4c], 0.55);
  }
  const R = face(kit, 2.79, -1.05, Math.PI / 2);
  for (const z of [-2.15, -0.25]) detailedWindow(R, z + 1.05, 1.8, 0.9, 1.2, { shutter: 0x427e73 });
  for (let i = 0; i < 5; i++) R.put(0x60472f, -0.7, 2.55 + i * 0.09, 0.1, 0.5, 0.035, 0.04);
  const B = face(kit, 0, -3.01, Math.PI);
  door(B, -1.6, 0.34, 0.82, 2.12, { leaf: TIMBER, frame: TRIM, trim: 0x543a2b });
  for (const x of [1.3, 2.0]) box(0x577447, x, 0.34, -3.16, 0.5, 0.62, 0.36);
  solid(new THREE.CylinderGeometry(0.18, 0.22, 0.36, 8), 0x9b6340, -2.2, 0.33, -3.2);
}
