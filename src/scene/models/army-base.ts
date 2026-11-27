import * as THREE from "three";
import type { Kit } from "./kit";
import { ammoCrate, barbedWire, militaryTank, militaryTruck } from "./government-b-parts";
import { detailedWindow, door, face, plant } from "./services-parts";

const WALL = 0xc6c0a9;
const TRIM = 0xe2dcc6;
const OLIVE = 0x626b54;
const STEEL = 0x575e58;

export function buildArmyBase(kit: Kit) {
  const { box, solid } = kit;
  box(0x696b60, 0, 0.05, 0, 19.7, 0.1, 15.7);
  box(0x969184, 0, 0.14, 0, 17.7, 0.08, 14.0);
  box(0x666961, 0, 0.2, -2.0, 17.0, 0.08, 6.0);
  for (let x = -8.2; x < 8.3; x += 0.5) box(0x858375, x, 0.24, -2.0, 0.03, 0.014, 5.95);
  for (let z = -4.8; z <= 0.8; z += 0.5) box(0x858375, 0, 0.24, z, 17.0, 0.014, 0.03);

  // Barracks: two-storey whitewashed quarters with deep green belt, balconies and tiled roof.
  box(0x7d786a, -4.65, 0.32, -3.75, 7.65, 0.42, 5.9);
  box(WALL, -4.65, 2.92, -3.75, 7.3, 5.0, 5.5);
  box(OLIVE, -4.65, 0.72, -3.75, 7.5, 0.5, 5.68);
  box(0x4c5546, -4.65, 0.98, -3.75, 7.56, 0.08, 5.75);
  box(TRIM, -4.65, 3.26, -3.75, 7.5, 0.18, 5.7);
  box(TRIM, -4.65, 5.42, -3.75, 7.55, 0.2, 5.75);
  for (const x of [-8.15, -6.42, -4.65, -2.88, -1.15]) {
    box(0xd3cbb6, x, 2.95, -0.96, 0.26, 4.9, 0.2);
    box(TRIM, x, 5.38, -0.96, 0.34, 0.16, 0.24);
  }
  const barracksFront = face(kit, -4.65, -0.99, 0);
  door(barracksFront, 0, 0.36, 1.2, 2.45, { leaf: 0x65513a, frame: TRIM, trim: 0x403d35 });
  for (const lat of [-2.55, -0.8, 0.8, 2.55]) {
    for (const y of [2.03, 4.35]) {
      detailedWindow(barracksFront, lat, y, 0.82, 1.3, { lintel: TRIM });
      for (const side of [-1, 1]) {
        const shutterX = -4.65 + lat + side * 0.62;
        box(0x66765e, shutterX, y, -0.87, 0.27, 1.44, 0.09);
        for (let sy = -0.48; sy <= 0.48; sy += 0.22) box(0x52654f, shutterX, y + sy, -0.8, 0.23, 0.035, 0.03);
      }
    }
  }
  for (const x of [-7.1, -2.2]) {
    for (const y of [3.28, 5.45]) {
      box(0x545950, x, y, 0.02, 1.2, 0.14, 1.85);
      box(0x71786d, x, y + 0.1, 0.9, 1.22, 0.1, 0.16);
      for (let dx = -0.5; dx <= 0.51; dx += 0.22) box(0x636b61, x + dx, y + 0.45, 0.88, 0.06, 0.62, 0.06);
    }
  }
  const backBarracks = face(kit, -4.65, -6.5, Math.PI);
  for (const x of [-2.4, 0, 2.4]) detailedWindow(backBarracks, x, 2.1, 0.92, 1.4);
  for (let x = -8.1; x <= -1.2; x += 0.34) box(0x9d5539, x, 6.05, -3.75, 0.14, 0.08, 5.7);
  // Roof vents, gutter line, and a modest national flag above the barracks entrance.
  box(0x85553b, -4.65, 6.0, -3.75, 7.8, 0.12, 5.9);
  for (const x of [-7.3, -5.7, -3.6, -2.0]) {
    box(0x81796a, x, 6.35, -3.8, 0.6, 0.5, 0.62);
    box(0x4f524d, x, 6.61, -3.8, 0.72, 0.08, 0.72);
    for (const dx of [-0.16, 0, 0.16]) box(0x4e514e, x + dx, 6.73, -3.8, 0.06, 0.16, 0.42);
  }
  box(0x4f514a, -4.65, 6.62, 0.0, 0.1, 1.25, 0.1);
  box(0x3c774e, -4.65, 7.05, 0.02, 0.8, 0.68, 0.04);
  box(0xe4deca, -4.65, 7.05, 0.05, 0.18, 0.65, 0.025);
  box(0x453c32, -4.65, 7.42, 0.0, 0.22, 0.12, 0.22);

  // Vehicle hangar / motor pool, massive steel sliding doors and a high corrugated gable.
  box(0x7c786c, 4.8, 0.31, -3.42, 7.45, 0.4, 6.15);
  box(0xb7b29f, 4.8, 2.48, -3.42, 7.0, 3.8, 5.72);
  box(OLIVE, 4.8, 0.67, -3.42, 7.18, 0.42, 5.9);
  box(0x4b5148, 4.8, 0.92, -3.42, 7.22, 0.1, 5.95);
  box(TRIM, 4.8, 4.3, -3.42, 7.2, 0.22, 5.95);
  const hangar = face(kit, 4.8, -0.55, 0);
  for (const x of [2.65, 5.1, 7.45]) {
    box(0x444944, x, 2.22, -0.51, 2.18, 2.9, 0.18);
    box(0x6f756b, x, 2.22, -0.4, 1.96, 2.68, 0.06);
    for (let y = 0.9; y <= 3.55; y += 0.42) box(0x85887e, x, y, -0.34, 1.86, 0.08, 0.08);
    box(0x353b38, x, 3.72, -0.4, 2.28, 0.12, 0.22);
    box(0x4b5149, x - 1.06, 2.22, -0.33, 0.08, 2.72, 0.08);
    box(0x4b5149, x + 1.06, 2.22, -0.33, 0.08, 2.72, 0.08);
  }
  for (const x of [-1.4, 1.1]) detailedWindow(hangar, x - 4.8, 2.64, 0.78, 1.2);
  door(hangar, 0, 0.45, 1.0, 2.2, { leaf: 0x4c5549, frame: TRIM, trim: 0x3b403b });
  const hangarRight = face(kit, 8.3, -3.42, Math.PI / 2);
  const hangarLeft = face(kit, 1.3, -3.42, -Math.PI / 2);
  for (const side of [hangarRight, hangarLeft]) for (const z of [-2.0, 0, 2.0]) detailedWindow(side, z, 2.65, 0.72, 1.05);
  box(0x60645d, 4.8, 4.4, -3.42, 7.45, 0.18, 6.12);
  for (let x = 1.3; x <= 8.3; x += 0.26) box(0x72766f, x, 4.5, -3.42, 0.04, 0.05, 5.9);
  box(0x777d74, 4.8, 4.6, -3.42, 0.15, 0.22, 5.95);
  box(0x555c57, 4.8, 4.72, -3.42, 0.2, 0.1, 0.28);
  for (const x of [2.5, 4.8, 7.1]) {
    box(0x4e544e, x, 4.9, -3.45, 1.0, 0.35, 0.8);
    box(0x71776d, x, 5.1, -3.45, 1.1, 0.08, 0.9);
  }
  box(0x545a54, 4.8, 5.36, -3.42, 0.1, 1.25, 0.1);
  box(0x3c774e, 4.8, 5.83, -3.4, 0.78, 0.7, 0.04);
  box(0xe4deca, 4.8, 5.83, -3.37, 0.18, 0.68, 0.025);

  // Perimeter chain-link fence with vehicle gates, concrete entry piers and a guard booth.
  const fx = 9.35;
  const fz = 7.35;
  const fenceX = (z: number, x0: number, x1: number) => {
    for (let x = x0; x <= x1 + 0.01; x += 0.72) {
      box(STEEL, x, 1.25, z, 0.1, 2.5, 0.1);
      box(0x777e73, x, 2.55, z, 0.16, 0.1, 0.16);
    }
    for (let x = x0 + 0.36; x < x1; x += 0.72) {
      box(0x767d73, x, 1.25, z, 0.035, 2.3, 0.035);
      box(0x767d73, x, 1.25, z + 0.11, 0.035, 2.3, 0.035);
    }
    box(0x4b514c, (x0 + x1) / 2, 0.24, z, x1 - x0, 0.12, 0.12);
    box(0x4b514c, (x0 + x1) / 2, 2.24, z, x1 - x0, 0.12, 0.12);
  };
  const fenceZ = (x: number) => {
    for (let z = -fz; z <= fz + 0.01; z += 0.72) {
      box(STEEL, x, 1.25, z, 0.1, 2.5, 0.1);
      box(0x777e73, x, 2.55, z, 0.16, 0.1, 0.16);
    }
    for (let z = -fz + 0.36; z < fz; z += 0.72) {
      box(0x767d73, x, 1.25, z, 0.035, 2.3, 0.035);
      box(0x767d73, x + 0.11, 1.25, z, 0.035, 2.3, 0.035);
    }
    box(0x4b514c, x, 0.24, 0, 0.12, 0.12, fz * 2);
    box(0x4b514c, x, 2.24, 0, 0.12, 0.12, fz * 2);
  };
  fenceX(-fz, -fx, fx);
  fenceZ(-fx);
  fenceZ(fx);
  fenceX(fz, -fx, -2.15);
  fenceX(fz, 2.15, fx);
  for (const x of [-2.2, 2.2]) {
    box(0xbeb39b, x, 1.35, 7.28, 0.48, 2.7, 0.48);
    box(TRIM, x, 2.78, 7.28, 0.64, 0.16, 0.64);
    box(0x414844, x, 3.05, 7.28, 0.08, 0.34, 0.08);
    box(0xf0cd73, x, 3.31, 7.28, 0.3, 0.36, 0.3);
    box(0x414844, x, 3.52, 7.28, 0.4, 0.08, 0.4);
  }
  for (const x of [-1.4, 1.4]) {
    box(0x555c56, x, 1.35, 7.34, 0.1, 2.55, 0.1);
    for (let y = 0.3; y < 2.55; y += 0.55) box(0x777d74, x, y, 7.3, 0.05, 0.06, 0.7);
  }
  box(0xc4bba6, 0, 0.9, 6.55, 1.65, 1.8, 1.25);
  box(0x4f5551, 0, 1.28, 7.19, 1.25, 0.65, 0.08);
  box(0x395453, 0, 1.32, 7.24, 1.08, 0.48, 0.04);
  box(0x555b56, 0, 1.72, 6.55, 1.8, 0.12, 1.4);
  for (const x of [-0.52, 0.52]) box(0x494e49, x, 2.05, 6.55, 0.08, 0.58, 0.08);
  box(0x8c4f38, 0, 2.38, 6.55, 2.0, 0.14, 1.55);
  for (const x of [-0.7, 0, 0.7]) box(0x484e49, x, 2.55, 6.55, 0.07, 0.2, 0.07);

  // Command courtyard and parade ground markings; parking bay chevrons and equipment apron.
  box(0x77776c, 0, 0.22, 2.7, 12.5, 0.16, 7.6);
  box(0xaaa18b, 0, 0.31, 2.72, 12.0, 0.035, 7.2);
  for (let x = -5.5; x <= 5.5; x += 0.55) box(0x77776c, x, 0.34, 2.72, 0.025, 0.01, 7.12);
  for (let z = -0.65; z <= 6.1; z += 0.55) box(0x77776c, 0, 0.34, z, 11.9, 0.01, 0.025);
  box(0xe1d8be, 0, 0.38, 3.0, 0.12, 0.025, 6.7);
  for (const x of [-5.3, 5.3]) {
    for (let z = -0.3; z < 5.8; z += 1.1) {
      box(0xd5c8a9, x, 0.4, z, 0.07, 0.025, 0.58, 0.25);
      box(0xd5c8a9, x + (x < 0 ? 0.3 : -0.3), 0.4, z, 0.07, 0.025, 0.58, -0.25);
    }
  }
  militaryTank(kit, -4.0, 1.4, 0x56624a);
  militaryTank(kit, 4.0, 1.4, 0x676d57);
  militaryTruck(kit, 0, -0.25, 0x777d61);
  // Machine-gun position, stacked field cases, fuel drums, and a raised watchtower on each flank.
  for (const [x, z] of [[-7.5, -0.8], [-7.5, 0.1], [7.5, -0.8], [7.5, 0.1]]) ammoCrate(kit, x, z, 0.45, 0x88714e);
  for (const [x, z] of [[-8.3, 2.0], [8.3, 2.0], [-8.3, -1.0], [8.3, -1.0]]) {
    solid(new THREE.CylinderGeometry(0.24, 0.24, 0.82, 10), 0x57624c, x, 0.52, z);
    box(0x393e39, x, 0.96, z, 0.3, 0.08, 0.3);
    for (const y of [0.35, 0.72]) box(0x9a9b89, x, y, z, 0.5, 0.035, 0.5);
  }
  for (const [x, z] of [[-8.45, -5.35], [8.45, -5.35]]) {
    for (const dx of [-0.62, 0.62]) for (const dz of [-0.62, 0.62]) {
      box(0x525850, x + dx, 2.4, z + dz, 0.16, 4.8, 0.16);
      for (let y = 0.55; y < 4.8; y += 0.46) box(0x777d70, x + dx, y, z + dz, 0.22, 0.055, 0.22);
    }
    box(0x777c70, x, 4.9, z, 1.75, 0.24, 1.75);
    box(0xbeb9a8, x, 6.1, z, 1.5, 2.15, 1.45);
    box(0x424844, x, 5.95, z, 1.62, 0.12, 1.58);
    for (const dx of [-0.45, 0.45]) box(0x454b47, x + dx, 6.15, z + 0.75, 0.13, 0.5, 0.06);
    box(0x323834, x, 6.17, z + 0.82, 0.45, 0.18, 0.08);
    box(0xead084, x, 6.2, z + 0.89, 0.28, 0.1, 0.04);
    box(0x515750, x, 7.27, z, 1.88, 0.12, 1.88);
    for (let y = 0.9; y <= 4.6; y += 0.5) box(0x454b46, x + 0.76, y, z - 0.18, 0.045, 0.055, 0.45);
  }

  // Tall central flagstaff and raised command signal, perimeter floodlamps and palms at the gate.
  solid(new THREE.CylinderGeometry(0.07, 0.12, 8.8, 10), 0x676a62, -0.7, 4.4, 5.35);
  box(0x3b7750, -0.7, 7.05, 5.37, 1.1, 0.75, 0.04);
  box(0xf0e3c9, -0.7, 7.05, 5.4, 0.24, 0.73, 0.03);
  box(0x8e4a39, -0.7, 7.05, 5.43, 0.14, 0.42, 0.025);
  box(0xd2ba70, -0.7, 8.9, 5.35, 0.28, 0.18, 0.28);
  for (const x of [-8.9, 8.9]) {
    solid(new THREE.CylinderGeometry(0.055, 0.085, 5.4, 8), 0x464c47, x, 2.7, 5.6);
    box(0x444a45, x, 5.35, 5.6, 0.62, 0.12, 0.18);
    kit.litBox(0xf0d99b, x, 5.18, 5.6, 0.4, 0.16, 0.2);
  }
  for (const x of [-8.2, 8.2]) {
    plant(kit, x, 6.55, 0.12, 0x765d43, [0x5a7544, 0x718653], 0.9);
    box(0xaaa18b, x, 0.2, 6.52, 1.1, 0.16, 0.92);
  }
  barbedWire(kit, 0, fz, fx * 2, true, 2.75);
  barbedWire(kit, 0, -fz, fx * 2, true, 2.75);
  barbedWire(kit, -fx, 0, fz * 2, false, 2.75);
  barbedWire(kit, fx, 0, fz * 2, false, 2.75);
}
