import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, beam, face, plant, wallLamp } from "./services-parts";
import { arch, archedDoor, gableRoof, windowBay } from "./human-services-parts";

const BRICK = 0x9c553e;
const BRICK_DARK = 0x784438;
const TRIM = 0xe9dfca;
const AQUA = 0x79c4bd;
const AQUA_DARK = 0x569b98;

export function buildCollege(kit: Kit) {
  const { box, solid } = kit;
  box(0xc9bb9e, 0, 0.045, 0, 15.7, 0.09, 15.7);
  box(0xdacba7, 0, 0.1, 0.25, 14.8, 0.035, 8.2);
  for (let x = -7.3; x <= 7.3; x += 0.66) box(0xc8b995, x, 0.125, 0.25, 0.025, 0.012, 8.2);
  for (let z = -3.8; z <= 4.3; z += 0.66) box(0xc8b995, 0, 0.125, z, 14.8, 0.012, 0.025);
  box(0xa58c67, 0, 0.09, -5.2, 14.8, 0.035, 4.7);
  box(0xa58c67, 0, 0.09, 5.75, 14.8, 0.035, 3.0);

  const block = (x: number, z: number, w: number, d: number, frontZ: number, backZ: number, frontDoor = false) => {
    box(0x716054, x, 0.32, z, w + 0.25, 0.5, d + 0.25);
    box(BRICK, x, 3.48, z, w, 5.85, d);
    box(BRICK_DARK, x, 0.73, z, w + 0.1, 0.28, d + 0.1);
    box(TRIM, x, 0.92, z, w + 0.18, 0.12, d + 0.18);
    box(TRIM, x, 6.45, z, w + 0.22, 0.2, d + 0.22);
    box(BRICK_DARK, x, 6.58, z, w + 0.26, 0.1, d + 0.26);
    gableRoof(kit, x, backZ - 0.1, frontZ + 0.1, w / 2 + 0.2, 6.58, 1.25, AQUA, AQUA_DARK);
    for (const y of [2.05, 4.82]) {
      const F = face(kit, x, frontZ + 0.04, 0);
      for (let u = -w / 2 + 0.8; u <= w / 2 - 0.5; u += 1.42) {
        if (frontDoor && Math.abs(u) < 1.1) continue;
        windowBay(F, u, y, 0.8, 1.35, TRIM);
        F.put(BRICK_DARK, u, y - 0.88, 0.08, 1.12, 0.12, 0.16);
      }
      const B = face(kit, x, backZ - 0.04, Math.PI);
      for (let u = -w / 2 + 0.8; u <= w / 2 - 0.5; u += 1.42) windowBay(B, -u, y, 0.8, 1.35, TRIM);
    }
    for (const side of [-1, 1]) {
      const xf = x + side * (w / 2 + 0.04);
      const F = face(kit, xf, z, side > 0 ? Math.PI / 2 : -Math.PI / 2);
      for (const y of [2.05, 4.82]) for (let pz = -d / 2 + 0.9; pz < d / 2 - 0.3; pz += 1.65) windowBay(F, -pz, y, 0.78, 1.32, TRIM);
      for (const pz of [-d / 2 + 0.1, d / 2 - 0.1]) {
        box(TRIM, xf, 3.5, z + pz, 0.3, 5.8, 0.3);
        for (const y of [1.0, 3.9, 6.4]) box(BRICK_DARK, xf, y, z + pz, 0.36, 0.08, 0.36);
      }
    }
    const F = face(kit, x, frontZ + 0.06, 0);
    if (frontDoor) {
      archedDoor(F, 0, 0.55, 1.7, 2.35, 0x4e3a32, TRIM);
      arch(F, 0, 2.95, 1.08, 0.18, TRIM, 0.16);
      for (const u of [-1.25, 1.25]) {
        box(TRIM, x + u, 1.9, frontZ + 0.18, 0.22, 2.85, 0.22);
        box(BRICK_DARK, x + u, 0.98, frontZ + 0.18, 0.45, 0.12, 0.42);
      }
    }
    for (let u = -w / 2 + 0.28; u <= w / 2 - 0.1; u += 0.65) {
      box(TRIM, x + u, 0.18, frontZ + 0.55, 0.08, 0.3, 0.08);
      box(TRIM, x + u, 2.6, frontZ + 0.55, 0.08, 0.08, 0.08);
    }
  };

  block(-5.1, -0.15, 4.3, 8.6, 4.15, -4.45);
  block(5.1, -0.15, 4.3, 8.6, 4.15, -4.45);
  block(0, -5.0, 8.0, 4.2, -2.9, -7.1, true);
  block(0, 5.35, 4.9, 2.8, 6.75, 3.95, true);

  const rearFront = face(kit, 0, -2.86, 0);
  for (const u of [-2.5, 2.5]) {
    box(TRIM, u, 2.1, -2.66, 0.28, 3.4, 0.28);
    box(AQUA_DARK, u, 3.85, -2.66, 0.4, 0.14, 0.4);
  }
  wallLamp(rearFront, -1.5, 3.35);
  wallLamp(rearFront, 1.5, 3.35);

  const tx = 0, tz = -3.75;
  box(BRICK_DARK, tx, 6.95, tz, 3.0, 0.6, 3.0);
  box(BRICK, tx, 8.5, tz, 2.55, 2.8, 2.55);
  box(TRIM, tx, 9.92, tz, 2.95, 0.22, 2.95);
  for (const side of [-1, 1]) {
    box(TRIM, tx + side * 0.96, 8.52, tz + 1.31, 0.16, 2.45, 0.16);
    box(TRIM, tx, 7.45, tz + side * 1.31, 2.55, 0.16, 0.16);
  }
  solid(new THREE.CylinderGeometry(1.0, 1.15, 0.5, 12), AQUA, tx, 10.36, tz);
  solid(new THREE.ConeGeometry(1.1, 1.35, 8), AQUA_DARK, tx, 11.28, tz);
  box(TRIM, tx, 12.0, tz, 0.17, 0.55, 0.17);
  for (const side of [-1, 1]) {
    const F = face(kit, tx, tz + 1.31, 0);
    solid(new THREE.CylinderGeometry(0.53, 0.53, 0.12, 20), TRIM, tx, 8.78, tz + 1.47).rotation.x = Math.PI / 2;
    solid(new THREE.CylinderGeometry(0.43, 0.43, 0.14, 20), 0x444b49, tx, 8.78, tz + 1.55).rotation.x = Math.PI / 2;
    F.put(TRIM, 0, 8.78, 0.18, 0.035, 0.68, 0.035);
    F.put(TRIM, 0, 8.78, 0.18, 0.52, 0.035, 0.035);
    F.put(AQUA, side * 0.2, 8.96, 0.2, 0.22, 0.035, 0.04);
  }

  box(0x9fb174, 0, 0.09, 0.65, 5.9, 0.06, 5.5);
  box(0xd1bb93, 0, 0.12, 0.65, 2.8, 0.04, 5.45);
  box(0xd1bb93, 0, 0.12, 0.65, 5.9, 0.04, 1.45);
  for (const z of [-1.75, 3.05]) for (const x of [-2.55, 2.55]) {
    box(0x8c7657, x, 0.35, z, 0.32, 0.55, 0.32);
    box(0x547b4c, x, 0.85, z, 0.6, 0.5, 0.6);
  }
  solid(new THREE.CylinderGeometry(0.42, 0.52, 0.32, 10), 0x99978c, 0, 0.38, 0.65);
  solid(new THREE.CylinderGeometry(0.18, 0.18, 1.05, 10), 0xd7d4ca, 0, 0.92, 0.65);
  solid(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 10), 0xa2cbc2, 0, 1.48, 0.65);
  for (const x of [-2.0, 2.0]) for (const z of [-0.75, 1.95]) bench(kit, x, z, 0.15, 1.6);
  for (const x of [-7.1, 7.1]) {
    plant(kit, x, 5.8, 0.16, 0x98603f, [0xd9554e, 0xe4c253, 0xe9e0ca], 0.75);
    box(0x7d6040, x, 0.48, -5.9, 0.6, 0.9, 0.6);
    box(0x5a7950, x, 1.0, -5.9, 0.78, 0.35, 0.78);
  }
  for (const [x, z] of [[-2.6, -2.4], [2.6, -2.4], [-2.6, 3.6], [2.6, 3.6]]) {
    box(TRIM, x, 0.56, z, 0.32, 1.05, 0.32);
    box(AQUA, x, 1.12, z, 0.42, 0.12, 0.42);
  }
  beam(kit, 0xe4decd, [-2.6, 1.4, -2.4], [-2.6, 1.4, 3.6], 0.05);
  beam(kit, 0xe4decd, [2.6, 1.4, -2.4], [2.6, 1.4, 3.6], 0.05);
  return kit.finish();
}
