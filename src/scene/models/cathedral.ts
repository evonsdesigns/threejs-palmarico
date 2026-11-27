import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, beam, face, plant, wallLamp } from "./services-parts";
import { arch, archedDoor, cross, gableRoof, stairs, windowBay } from "./human-services-parts";

const WALL = 0xe9e0ca;
const WHITE = 0xf6efdc;
const STONE = 0xc3b28e;
const GOLD = 0xc6a45e;
const ROOF = 0xa65333;
const BLUE = 0x54817f;

export function buildCathedral(kit: Kit) {
  const { box, solid } = kit;
  box(0xc8b995, 0, 0.05, 0, 23.7, 0.1, 15.7);
  box(0xdacba9, 0, 0.11, 4.0, 22.8, 0.035, 7.3);
  for (let x = -11.2; x <= 11.2; x += 0.78) box(0xc8b995, x, 0.14, 4.0, 0.026, 0.012, 7.3);
  for (let z = 0.45; z <= 7.55; z += 0.78) box(0xc8b995, 0, 0.14, z, 22.8, 0.012, 0.026);
  box(0xb9a981, 0, 0.2, 7.52, 22.8, 0.32, 0.18);
  for (let x = -11.0; x <= 11.0; x += 1.8) {
    box(STONE, x, 0.46, 7.5, 0.16, 0.55, 0.16);
    box(WHITE, x, 0.79, 7.5, 0.3, 0.12, 0.3);
  }
  box(0xa58f6a, 0, 0.08, -3.1, 19.2, 0.04, 8.4);
  for (let x = -9.1; x <= 9.1; x += 0.72) box(0x9c8660, x, 0.11, -3.1, 0.024, 0.01, 8.4);

  const zFront = 2.55, zBack = -7.15, cz = -2.3;
  box(STONE, 0, 0.4, cz, 13.0, 0.7, 10.1);
  box(WALL, 0, 4.5, cz, 12.3, 7.6, 9.65);
  box(WHITE, 0, 8.35, cz, 12.65, 0.28, 9.95);
  box(STONE, 0, 0.86, cz, 12.55, 0.2, 9.9);
  gableRoof(kit, 0, zBack, zFront, 6.55, 8.45, 3.0, ROOF, 0x813f2e);
  for (const z of [zFront, zBack]) {
    box(WHITE, 0, 8.45, z, 13.1, 0.3, 0.28);
    for (const x of [-5.7, -3.5, 0, 3.5, 5.7]) {
      box(STONE, x, 4.4, z, 0.32, 7.5, 0.32);
      box(WHITE, x, 1.0, z, 0.52, 0.18, 0.54);
      box(WHITE, x, 8.1, z, 0.52, 0.2, 0.54);
      for (let y = 1.7; y < 7.7; y += 0.78) box(GOLD, x, y, z + (z > 0 ? 0.18 : -0.18), 0.42, 0.07, 0.1);
    }
  }
  const front = face(kit, 0, zFront + 0.04, 0);
  for (const u of [-4.3, 4.3]) {
    windowBay(front, u, 4.0, 1.0, 2.1, STONE, 0x547b80);
    windowBay(front, u, 6.6, 0.9, 1.25, STONE, 0x547b80);
  }
  archedDoor(front, 0, 0.58, 2.6, 3.1, 0x503b32, WHITE);
  arch(front, 0, 3.72, 1.48, 0.17, GOLD, 0.18);
  for (const u of [-2.4, 2.4]) {
    box(WHITE, u, 2.25, zFront + 0.24, 0.4, 3.6, 0.36);
    box(GOLD, u, 4.18, zFront + 0.3, 0.53, 0.18, 0.5);
    box(STONE, u, 0.95, zFront + 0.25, 0.68, 0.2, 0.6);
  }
  solid(new THREE.CylinderGeometry(0.9, 0.9, 0.16, 20), GOLD, 0, 6.45, zFront + 0.23).rotation.x = Math.PI / 2;
  solid(new THREE.CylinderGeometry(0.72, 0.72, 0.18, 20), BLUE, 0, 6.45, zFront + 0.33).rotation.x = Math.PI / 2;
  for (const side of [-1, 1]) {
    box(GOLD, side * 0.65, 6.45, zFront + 0.45, 0.08, 1.2, 0.08);
    box(GOLD, 0, 6.45 + side * 0.58, zFront + 0.45, 1.2, 0.08, 0.08);
  }
  box(WALL, 0, 8.1, zFront + 0.18, 4.6, 1.25, 0.4);
  for (let x = -2.2; x <= 2.2; x += 0.28) {
    const h = 1.35 * (1 - Math.abs(x) / 2.4);
    if (h > 0.07) box(WALL, x, 8.55 + h / 2, zFront + 0.18, 0.3, h, 0.4);
  }
  box(WHITE, 0, 8.55, zFront + 0.32, 5.0, 0.18, 0.5);
  cross(kit, 0, 9.25, zFront + 0.3, 1.15, GOLD, 0.14);
  stairs(kit, 0, 3.2, 5.8, 5, 0.18, 0.26, 0xd5c8ae);
  for (const x of [-3.3, 3.3]) {
    box(STONE, x, 0.55, 3.36, 0.36, 1.1, 0.38);
    box(WHITE, x, 1.15, 3.36, 0.52, 0.12, 0.52);
  }
  wallLamp(front, -3.25, 4.1, 0xffe6a3);
  wallLamp(front, 3.25, 4.1, 0xffe6a3);

  for (const side of [-1, 1]) {
    const F = face(kit, side * 6.18, cz, side > 0 ? Math.PI / 2 : -Math.PI / 2);
    for (const z of [-5.9, -3.8, -1.7, 0.4, 2.0]) {
      const lat = side > 0 ? -(z - cz) : z - cz;
      windowBay(F, lat, 4.6, 0.92, 1.8, STONE, 0x547b80);
      arch(F, lat, 5.55, 0.55, 0.15, WHITE, 0.12);
    }
    for (const z of [-6.4, -4.2, -2.0, 0.2, 2.2]) {
      const lat = side > 0 ? -(z - cz) : z - cz;
      F.put(WHITE, lat, 4.5, 0.08, 0.22, 7.35, 0.26);
    }
  }
  const back = face(kit, 0, zBack - 0.05, Math.PI);
  for (const x of [-3.4, 0, 3.4]) windowBay(back, -x, 4.5, 1.0, 1.8, STONE, 0x547b80);

  const tower = (x: number) => {
    const z = 2.58;
    box(STONE, x, 0.65, z, 3.65, 1.25, 3.65);
    box(WALL, x, 4.85, z, 3.05, 7.2, 3.05);
    box(WHITE, x, 8.55, z, 3.5, 0.3, 3.5);
    box(GOLD, x, 8.76, z, 3.7, 0.12, 3.7);
    for (const y of [1.5, 4.15, 7.9]) box(STONE, x, y, z + 1.6, 3.2, 0.16, 0.2);
    for (const side of [-1, 1]) {
      box(WHITE, x + side * 1.38, 4.85, z, 0.26, 7.0, 0.26);
      box(GOLD, x + side * 1.48, 4.8, z, 0.12, 7.15, 0.12);
    }
    const F = face(kit, x, z + 1.54, 0);
    for (const y of [2.4, 5.4]) {
      F.put(STONE, 0, y, 0.06, 1.28, 2.1, 0.2);
      F.put(0x333735, 0, y, 0.2, 0.92, 1.78, 0.08);
      arch(F, 0, y + 0.9, 0.48, 0.25, WHITE, 0.14);
      F.put(GOLD, 0, y - 1.12, 0.22, 1.5, 0.12, 0.28);
      for (const u of [-0.73, 0.73]) F.put(WHITE, u, y, 0.17, 0.18, 2.22, 0.18);
    }
    for (const y of [9.25, 12.5, 15.75]) {
      const scale = y > 14 ? 2.25 : 3.25;
      const depth = scale;
      box(WALL, x, y + (y > 14 ? 1.12 : 1.38), z, scale, y > 14 ? 2.25 : 2.75, depth);
      box(WHITE, x, y, z, scale + 0.28, 0.2, depth + 0.28);
      const height = y > 14 ? 1.35 : 1.85;
      for (const side of [-1, 1]) {
        const f = face(kit, x + side * (scale / 2 + 0.03), z, side > 0 ? Math.PI / 2 : -Math.PI / 2);
        f.put(STONE, 0, y + height / 2, 0.06, 0.72, height, 0.18);
        f.put(0x353a38, 0, y + height / 2, 0.19, 0.45, height - 0.28, 0.08);
        arch(f, 0, y + height - 0.2, 0.24, 0.24, WHITE, 0.1);
        f.put(GOLD, 0, y + 0.08, 0.21, 0.95, 0.14, 0.25);
      }
      box(WHITE, x, y + (y > 14 ? 2.27 : 2.77), z, scale + 0.4, 0.14, depth + 0.4);
    }
    solid(new THREE.CylinderGeometry(1.48, 1.78, 0.35, 8), ROOF, x, 19.9, z);
    solid(new THREE.ConeGeometry(1.52, 4.25, 8), 0x6a4d39, x, 22.18, z);
    solid(new THREE.CylinderGeometry(0.13, 0.18, 0.55, 8), GOLD, x, 24.55, z);
    cross(kit, x, 24.85, z, 1.0, GOLD, 0.12);
  };
  tower(-5.1);
  tower(5.1);

  const domeX = 0, domeZ = -1.5;
  box(STONE, domeX, 9.2, domeZ, 7.2, 0.8, 7.2);
  solid(new THREE.CylinderGeometry(3.35, 3.75, 2.2, 16), WALL, domeX, 10.65, domeZ);
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    const x = domeX + Math.cos(a) * 3.42;
    const z = domeZ + Math.sin(a) * 3.42;
    box(WHITE, x, 10.62, z, 0.2, 1.65, 0.2, 0, -a);
    box(GOLD, x, 9.9, z, 0.3, 0.12, 0.3);
  }
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const F = face(kit, domeX + Math.cos(a) * 3.45, domeZ + Math.sin(a) * 3.45, a + Math.PI / 2);
    windowBay(F, 0, 10.62, 0.48, 1.1, GOLD, 0x446f72);
  }
  const domeGeometry = new THREE.SphereGeometry(3.48, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  solid(domeGeometry, 0x9c633c, domeX, 11.75, domeZ);
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8;
    beam(kit, 0xc08b56, [domeX, 11.78, domeZ], [domeX + Math.cos(a) * 3.4, 12.0, domeZ + Math.sin(a) * 3.4], 0.07, 0.05);
  }
  solid(new THREE.CylinderGeometry(0.55, 0.72, 0.72, 10), WALL, domeX, 15.35, domeZ);
  solid(new THREE.ConeGeometry(0.62, 1.35, 10), 0x6a4d39, domeX, 16.35, domeZ);
  cross(kit, domeX, 17.05, domeZ, 0.95, GOLD, 0.13);

  solid(new THREE.CylinderGeometry(0.75, 0.9, 0.42, 12), 0xb7aa8d, 0, 0.34, 5.5);
  solid(new THREE.CylinderGeometry(0.36, 0.75, 0.65, 12), 0x6f9390, 0, 0.87, 5.5);
  solid(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), GOLD, 0, 1.45, 5.5);
  solid(new THREE.SphereGeometry(0.14, 8, 6), 0xc3a762, 0, 2.08, 5.5);
  for (const x of [-9.7, 9.7]) {
    plant(kit, x, 6.05, 0.15, 0x97603f, [0xd95249, 0xe3bd4d, 0xe7ded0], 0.85);
    bench(kit, x, 2.55, 0.15, 2.3);
  }
  for (const x of [-8.0, -6.2, 6.2, 8.0]) {
    box(STONE, x, 0.42, 6.1, 0.45, 0.84, 0.45);
    solid(new THREE.SphereGeometry(0.25, 8, 6), WHITE, x, 0.96, 6.1);
  }
  return kit.finish();
}
