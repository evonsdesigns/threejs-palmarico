import * as THREE from "three";
import type { Kit } from "./kit";
import { face, door, wallLamp } from "./services-parts";

function pole(kit: Kit, x: number, z: number, height: number, color = 0x777a76) {
  kit.box(color, x, height / 2, z, 0.08, height, 0.08);
}

export function buildAirport(kit: Kit) {
  const { box, solid, window } = kit;
  const tarmac = 0x4f5655;
  const white = 0xe9e9dc;
  const wall = 0xc9c5b4;
  const blue = 0x587a82;

  box(0x858676, 0, 0.04, 0, 47.8, 0.08, 23.6);
  box(0x9c987f, 0, 0.09, 0, 46.9, 0.06, 22.9);
  for (let x = -23.2; x <= 23.2; x += 1.5) box(0x8e8a75, x, 0.13, 0, 0.035, 0.015, 22.4);
  for (let z = -11.2; z <= 11.2; z += 1.5) box(0x8e8a75, 0, 0.13, z, 46.4, 0.015, 0.035);

  box(tarmac, 0, 0.18, -7.25, 45.4, 0.14, 5.7);
  box(0x5b625f, 0, 0.265, -7.25, 44.8, 0.035, 5.1);
  for (const z of [-9.7, -4.8]) box(white, 0, 0.29, z, 43.9, 0.035, 0.11);
  for (let x = -18.7; x <= 18.8; x += 2.0) box(white, x, 0.32, -7.25, 1.05, 0.04, 0.18);
  for (const end of [-1, 1]) {
    const x = end * 20.25;
    for (let z = -9.4; z <= -5.1; z += 0.48) box(white, x, 0.32, z, 0.14, 0.04, 0.38);
    box(white, x, 0.32, -7.25, 0.75, 0.04, 3.5);
    for (const dx of [-0.48, 0.48]) box(0xc9d2cd, x + dx, 0.33, -7.25, 0.05, 0.04, 4.45);
  }
  for (let x = -22.2; x <= 22.2; x += 1.2) {
    for (const z of [-10.1, -4.4]) box(0x646c69, x, 0.16, z, 0.06, 0.08, 0.06);
  }

  box(0x646d69, 0, 0.17, -3.85, 43.5, 0.12, 1.45);
  box(0x797e77, 0, 0.245, -3.85, 42.8, 0.025, 1.12);
  for (let x = -21.3; x <= 21.3; x += 1.25) box(0xe4ddca, x, 0.27, -3.85, 0.38, 0.035, 0.12);
  box(0x737872, 0, 0.17, -0.3, 25.8, 0.11, 8.0);
  box(0x858980, 0, 0.235, -0.3, 25.3, 0.025, 7.6);
  for (let x = -12.1; x <= 12.1; x += 0.9) box(0x98998e, x, 0.25, -0.3, 0.025, 0.012, 7.3);
  for (let z = -3.8; z <= 3.4; z += 0.9) box(0x98998e, 0, 0.25, z, 25.0, 0.012, 0.025);
  for (const x of [-11.8, 11.8]) {
    box(white, x, 0.27, -2.0, 0.18, 0.04, 1.2);
    box(white, x, 0.27, 1.3, 0.18, 0.04, 1.2);
  }

  box(0xaaa18d, -1.2, 0.24, 7.45, 15.8, 0.32, 6.5);
  box(0x8d8a7e, -1.2, 0.44, 7.45, 15.3, 0.12, 6.0);
  box(wall, -1.2, 2.18, 7.45, 14.8, 3.5, 5.6);
  box(0xa19781, -1.2, 0.68, 7.45, 15.0, 0.35, 5.8);
  box(0xe2ddce, -1.2, 4.0, 7.45, 15.0, 0.22, 5.8);
  box(0x8b8b80, -1.2, 4.18, 7.45, 15.5, 0.14, 6.1);
  box(0x74776f, -1.2, 4.38, 7.45, 14.0, 0.18, 5.3);
  for (const x of [-8.35, 5.95]) for (const z of [4.65, 10.25]) {
    box(0xded8c8, x, 2.16, z, 0.22, 3.55, 0.22);
    box(0xb9b09b, x, 0.9, z, 0.4, 0.14, 0.4);
  }
  for (const x of [-7.3, -5.1, -2.9, -0.7, 1.5, 3.7]) {
    window(x, 2.5, 10.28, 1.65, 1.55, 0);
    box(0x6a726e, x, 2.47, 10.42, 0.09, 1.75, 0.04);
    box(0xe1dac8, x, 1.4, 10.36, 1.95, 0.12, 0.18);
  }
  const terminalFront = face(kit, -1.2, 10.3, 0);
  door(terminalFront, 0, 0.75, 2.1, 2.6, { leaf: 0x7d6953, frame: 0xe4ddca, trim: 0x4c4941, double: true, glazed: true, glass: blue });
  wallLamp(terminalFront, -1.7, 3.25, 0xf3d78b);
  wallLamp(terminalFront, 1.7, 3.25, 0xf3d78b);
  box(0x69634f, -1.2, 5.0, 10.58, 4.8, 0.62, 0.18);
  box(0xe6d5aa, -1.2, 5.02, 10.7, 4.4, 0.43, 0.035);
  for (let x = -3.0; x <= 0.6; x += 0.45) box(0x493f32, x, 5.02, 10.74, 0.07, 0.22, 0.03);
  for (const x of [-7.0, -4.0, -1.2, 1.6, 4.6]) {
    box(0x82775f, x, 2.45, 4.52, 0.22, 4.2, 0.22);
    box(0xb3a689, x, 4.62, 4.52, 0.32, 0.14, 0.32);
  }
  box(0xd2c6ac, -1.2, 4.55, 4.55, 14.8, 0.18, 1.0);
  for (let x = -8.0; x <= 5.5; x += 0.28) box(0xbfb49d, x, 4.65, 4.48, 0.06, 0.16, 0.76);
  box(0x77776c, -1.2, 2.3, 4.0, 14.2, 0.18, 0.18);
  for (let x = -7.5; x < 5.3; x += 0.5) box(0x77776c, x, 2.2, 4.0, 0.07, 0.42, 0.07);

  for (const x of [-8.3, -7.2, -6.1]) {
    box(0x8c8c7d, x, 2.8, 6.6, 0.42, 0.35, 0.42);
    box(0x696b64, x, 3.35, 6.6, 0.32, 0.8, 0.32);
    box(0x4f5350, x, 3.8, 6.6, 0.68, 0.12, 0.68);
    for (const z of [6.3, 6.9]) box(0x4b514e, x, 3.43, z, 0.19, 0.3, 0.03);
  }
  for (const x of [-7.2, 3.4]) {
    box(0x777d78, x, 0.8, 10.75, 0.18, 1.5, 0.18);
    box(0xf0dc9d, x, 1.68, 10.75, 0.34, 0.38, 0.34);
    box(0x3f4542, x, 1.91, 10.75, 0.42, 0.08, 0.42);
  }

  box(0x9a927f, 13.6, 0.24, 7.2, 9.0, 0.32, 6.5);
  box(0x858477, 13.6, 0.44, 7.2, 8.6, 0.12, 6.1);
  box(0xc0b9a5, 13.6, 2.55, 7.2, 8.0, 4.1, 5.4);
  box(0x96917f, 13.6, 4.65, 7.2, 8.3, 0.2, 5.8);
  const hangarRoof = new THREE.CylinderGeometry(2.85, 2.85, 8.4, 16, 1, true, Math.PI, Math.PI);
  hangarRoof.rotateZ(Math.PI / 2);
  solid(hangarRoof, 0x777c76, 13.6, 4.65, 7.2);
  for (let z = 4.9; z <= 9.5; z += 0.38) box(0x69716c, 13.6, 4.6, z, 8.3, 0.07, 0.06);
  box(0x666b66, 13.6, 2.1, 10.0, 7.6, 3.3, 0.14);
  box(0x8e938d, 13.6, 2.05, 10.1, 7.2, 2.8, 0.12);
  for (let x = 10.25; x <= 17.0; x += 0.36) box(0x777c76, x, 2.1, 10.18, 0.04, 2.65, 0.045);
  for (const x of [9.75, 17.45]) {
    box(0xd2cbb7, x, 2.45, 10.22, 0.24, 4.4, 0.22);
    box(0x8e8c80, x, 0.75, 10.25, 0.5, 0.16, 0.45);
  }
  for (const z of [4.6, 9.8]) {
    box(0xd5cdb9, 13.6, 0.7, z, 8.4, 0.26, 0.22);
    for (let x = 9.7; x < 17.6; x += 1.1) box(0x858479, x, 0.92, z, 0.12, 0.22, 0.2);
  }
  for (const x of [10.0, 17.2]) {
    box(0x6c756f, x, 2.8, 10.33, 0.1, 3.0, 0.12);
    box(0x6c756f, x, 1.32, 10.33, 0.65, 0.1, 0.12);
  }
  for (const x of [11.0, 16.2]) {
    box(0x797a70, x, 3.2, 10.35, 0.14, 0.45, 0.15);
    box(0xead597, x, 3.48, 10.38, 0.35, 0.36, 0.35);
    box(0x454a46, x, 3.69, 10.38, 0.42, 0.06, 0.42);
  }

  box(0x8d8878, -8.35, 0.22, 6.9, 3.3, 0.3, 3.5);
  box(0xc3bca7, -8.35, 2.1, 6.9, 2.45, 3.5, 2.7);
  box(0xb4ad9a, -8.35, 4.0, 6.9, 3.05, 0.28, 3.15);
  for (let y = 0.8; y <= 3.8; y += 0.7) box(0x999381, -8.35, y, 5.5, 2.5, 0.05, 0.03);
  for (let y = 0.8; y <= 3.8; y += 0.7) box(0x999381, -9.6, y, 6.9, 0.03, 0.05, 2.5);
  box(0x535b59, -8.35, 6.6, 6.9, 3.1, 2.8, 3.2);
  box(0x404a4c, -8.35, 8.15, 6.9, 3.45, 0.35, 3.55);
  box(0x515e60, -8.35, 9.45, 6.9, 3.0, 2.2, 3.1);
  for (const x of [-9.65, -8.8, -7.95, -7.1]) window(x, 9.45, 8.5, 0.65, 1.1, 0);
  for (const z of [5.65, 6.5, 7.35, 8.2]) window(-6.85, 9.45, z, 0.65, 1.1, Math.PI / 2);
  box(0xd8d5ca, -8.35, 10.68, 6.9, 3.35, 0.16, 3.45);
  for (const x of [-9.8, -6.9]) box(0x6f7773, x, 4.8, 6.9, 0.12, 1.6, 0.12);
  box(0xc7c5b8, -8.35, 5.55, 6.9, 3.45, 0.16, 3.5);
  box(0x4e5655, -8.35, 12.0, 6.9, 0.12, 2.4, 0.12);
  box(0x4e5655, -8.35, 13.0, 6.9, 0.5, 0.08, 0.5);
  for (const x of [-9.55, -7.15]) {
    box(0x606966, x, 12.9, 6.9, 0.08, 1.7, 0.08);
    box(0x606966, -8.35, 12.9, x === -9.55 ? 5.7 : 8.1, 2.5, 0.08, 0.08);
  }
  box(0x555e5b, -8.35, 13.85, 6.9, 3.3, 0.16, 3.5);
  box(0xc6c0aa, -8.35, 4.15, 5.15, 1.8, 0.12, 0.7);
  for (const x of [-9.8, -6.9]) box(0x7b817b, x, 2.0, 5.15, 0.16, 4.0, 0.16);

  const planeX = 7.4;
  const planeZ = 0.25;
  box(0xf0eee4, planeX, 1.68, planeZ, 9.1, 1.02, 1.0);
  const fuselage = solid(new THREE.CylinderGeometry(0.52, 0.58, 8.8, 16), 0xf0eee4, planeX, 1.68, planeZ);
  fuselage.rotation.z = Math.PI / 2;
  const nose = solid(new THREE.ConeGeometry(0.52, 1.5, 16), 0xd9ded8, planeX + 5.05, 1.68, planeZ);
  nose.rotation.z = -Math.PI / 2;
  box(0xd9ded8, planeX - 4.65, 1.72, planeZ, 0.95, 0.75, 0.84);
  box(0x566873, planeX + 4.18, 1.96, planeZ, 0.12, 0.3, 0.66);
  box(0x5b6870, planeX + 4.0, 2.34, planeZ, 0.65, 0.1, 0.72);
  box(0xf0eee4, planeX, 1.64, planeZ, 2.2, 0.14, 8.6);
  box(0xd5dbd5, planeX, 1.67, planeZ, 2.0, 0.035, 8.35);
  for (const z of [-3.55, 4.05]) {
    box(0xe6e5dc, planeX - 3.15, 1.69, z, 2.0, 0.14, 2.2);
    box(0x56636a, planeX - 3.14, 1.78, z, 1.85, 0.05, 0.2);
  }
  for (let x = planeX - 3.6; x <= planeX + 3.5; x += 0.62) {
    box(0x4d6972, x, 1.96, planeZ + 0.53, 0.28, 0.24, 0.045);
    box(0x4d6972, x, 1.96, planeZ - 0.53, 0.28, 0.24, 0.045);
    box(0xe3e0d4, x + 0.18, 1.96, planeZ + 0.56, 0.035, 0.29, 0.035);
  }
  box(0xc34536, planeX - 0.5, 2.25, planeZ + 0.55, 5.0, 0.16, 0.035);
  box(0xc34536, planeX - 0.5, 2.25, planeZ - 0.55, 5.0, 0.16, 0.035);
  for (const z of [-2.55, 2.95]) {
    const engine = solid(new THREE.CylinderGeometry(0.42, 0.42, 1.65, 12), 0x777f7e, planeX - 0.3, 1.3, z);
    engine.rotation.z = Math.PI / 2;
    for (const dx of [-1.22, 0.68]) box(0x606864, planeX + dx, 1.3, z, 0.12, 0.67, 0.67);
    const spinner = solid(new THREE.CylinderGeometry(0.12, 0.19, 0.35, 10), 0xb9b9ad, planeX + 1.0, 1.3, z);
    spinner.rotation.z = Math.PI / 2;
    box(0x343936, planeX + 1.24, 1.3, z, 0.1, 1.35, 0.08);
    box(0x343936, planeX + 1.24, 1.3, z, 0.1, 0.08, 1.35);
  }
  for (const z of [-1.7, 2.2]) {
    box(0x53544e, planeX - 1.5, 0.75, z, 0.12, 1.3, 0.12);
    solid(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), 0x343633, planeX - 1.5, 0.2, z);
  }
  box(0x55564f, planeX + 3.4, 0.72, planeZ, 0.12, 1.2, 0.12);
  solid(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), 0x343633, planeX + 3.4, 0.2, planeZ);
  for (const [x, z] of [[planeX - 1.3, planeZ], [planeX + 5.8, planeZ], [planeX, planeZ + 4.3]] as const) {
    box(0xc54d37, x, 0.5, z, 0.22, 0.5, 0.22);
    box(0xe0d6b7, x, 0.8, z, 0.3, 0.12, 0.3);
  }

  pole(kit, 20.6, 3.1, 4.3);
  box(0x3f4843, 20.6, 4.2, 3.1, 0.08, 0.08, 0.08);
  for (let i = 0; i < 7; i++) {
    const y = 4.0 - i * 0.17;
    const z = 3.1 + (i % 2 ? 0.9 : 0.15);
    box(i % 2 ? 0xe7e2ca : 0xb94a38, 20.6, y, z, 0.12, 0.17, 0.95);
  }
  for (const x of [-21.8, -17.8, 17.8, 21.8]) {
    box(0x77786b, x, 0.48, 2.5, 0.16, 0.9, 0.16);
    box(0xe5cf8c, x, 0.98, 2.5, 0.3, 0.24, 0.3);
    box(0x494c45, x, 1.12, 2.5, 0.4, 0.06, 0.4);
  }
  for (const x of [-22.4, 22.4]) {
    box(0x61635a, x, 0.25, 0, 0.12, 0.4, 6.4);
    for (const z of [-2.2, 0.0, 2.2]) box(0xebe4d0, x, 0.48, z, 0.22, 0.28, 0.22);
  }

  pole(kit, 6.8, 9.8, 2.2, 0x8a8880);
  box(0x343a36, 6.8, 2.31, 9.8, 0.18, 0.12, 0.18);
  for (const x of [-5.5, 4.6, 11.0, 18.8]) {
    box(0x77786c, x, 0.78, 4.0, 0.14, 1.5, 0.14);
    box(0xf0d88d, x, 1.62, 4.0, 0.28, 0.32, 0.28);
    box(0x484b45, x, 1.8, 4.0, 0.34, 0.06, 0.34);
  }
}
