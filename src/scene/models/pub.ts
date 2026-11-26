import { Kit } from "./kit";

export function buildPub(kit: Kit) {
  const { box, gable, frontWindow, backWindow, leftWindow } = kit;
  box(0xb7af97, 0, 0.2, 0, 21, 0.4, 11);
  box(0xece3cd, -4.4, 2.25, 0, 10.4, 4, 8.6);
  box(0xb68b68, -4.4, 4.25, 0, 10.6, 0.45, 8.8);
  box(0x5d614d, -4.4, 4.52, 0, 10.4, 0.18, 8.6);
  for (const z of [-4.3, 4.3]) box(0xe9e5d7, -4.4, 4.85, z, 10.8, 0.55, 0.24);
  for (const x of [-9.65, 0.85]) box(0xe9e5d7, x, 4.85, 0, 0.24, 0.55, 8.7);
  box(0x9b9e8d, -2.7, 4.9, -1.5, 0.18, 0.8, 0.18);
  for (const x of [-9.35, 0.55]) {
    box(0xa97755, x, 2.35, 4.34, 0.38, 4, 0.28);
    box(0xe1d8be, x, 4.55, 4.34, 0.6, 0.3, 0.5);
    box(0x597346, x, 4.8, 4.34, 0.55, 0.3, 0.55);
  }
  for (const x of [-5.4, -2.1]) {
    frontWindow(x, 2.4, 4.36, 1.8, 1.7);
    for (let dx = -0.75; dx <= 0.75; dx += 0.3) box(0x434d43, x + dx, 2.4, 4.57, 0.06, 1.8, 0.06);
    for (const y of [1.9, 2.6, 3.2]) box(0x434d43, x, y, 4.57, 1.9, 0.06, 0.06);
    box(0x405e43, x, 3.7, 4.48, 1.7, 0.38, 0.12);
    box(0xd0b27a, x, 3.7, 4.56, 1.4, 0.05, 0.04);
  }
  for (const z of [-2.7, 0, 2.7]) {
    leftWindow(-9.66, 2.35, z, 1.1, 1.4);
    for (let dz = -0.45; dz <= 0.45; dz += 0.3) box(0x647162, -9.86, 2.35, z + dz, 0.06, 1.5, 0.06);
  }
  for (const x of [-7.3, -4.4, -1.5]) backWindow(x, 2.35, -4.37, 1.1, 1.4);
  box(0x534a38, -7.9, 1.55, 4.38, 1.6, 2.8, 0.15);
  box(0xb5966c, -7.9, 0.35, 4.8, 2.3, 0.16, 1.05);
  for (const x of [-9.15, -6.65]) box(0xe6ddc9, x, 1.95, 4.9, 0.22, 3.3, 0.22);
  gable(-7.9, 4.7, 3.2, 2.5, 3.65, 0.7, 0xb35e3f, 5);
  box(0x526d49, -7.9, 4.5, 5.85, 0.9, 0.9, 0.12);
  box(0xd0b46b, -7.9, 4.5, 5.93, 0.55, 0.08, 0.04);
  box(0x8b9b70, 5.2, 0.3, -0.15, 8.7, 0.15, 9.2);
  for (const z of [-4.65, 4.35]) box(0xece3cd, 5.2, 0.95, z, 8.8, 1.3, 0.25);
  box(0xece3cd, 9.5, 0.95, -0.15, 0.25, 1.3, 9.2);
  for (const x of [1, 5.2, 9.5]) for (const z of [-4.65, 4.35]) {
    box(0xe1d9c6, x, 1.35, z, 0.45, 2.1, 0.45);
    box(0xa9a999, x, 2.45, z, 0.55, 0.15, 0.55);
  }
  for (const x of [3.1, 6.9]) for (const z of [-2.1, 1.6]) {
    box(0x9b8970, x, 0.85, z, 0.2, 1.1, 0.2);
    box(0xe8dfc7, x, 1.45, z, 1.5, 0.15, 1.5);
    for (const dx of [-0.9, 0.9]) box(0xb4a58c, x + dx, 0.65, z, 0.45, 0.6, 0.45);
  }
  for (const x of [1.2, 9.2]) box(0x897b6b, x, 3.3, -4.35, 0.08, 2.2, 0.08);
  box(0x9c8a67, 5.2, 4.35, -4.35, 8, 0.04, 0.04);
  const lightColors = [0xe3b44f, 0xc36d51, 0xd4c782, 0x8eaa6a];
  for (let i = 0; i < 13; i++) box(lightColors[i % lightColors.length], 1.6 + i * 0.6, 4.22, -4.35, 0.12, 0.2, 0.12);
}
