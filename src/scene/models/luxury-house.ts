import { Kit } from "./kit";

export function buildLuxuryHouse(kit: Kit) {
  const { box, window, frontWindow, backWindow, leftWindow, porch } = kit;
  box(0xc8bea3, 0, 0.35, 0, 12.6, 0.7, 8.6);
  box(0xe2d3a9, 0, 3.9, 0, 11.8, 6.4, 7.8);
  for (const y of [0.8, 4, 7.15]) box(0xf0e7ce, 0, y, 0, 12, 0.22, 8);
  box(0x484e47, 0, 7.45, 0, 12.2, 0.4, 8.2);
  for (const y of [2.4, 5.6]) {
    for (const x of [-4.4, -2.2, 0, 2.2, 4.4]) {
      frontWindow(x, y, 3.98, 1, 1.6);
      backWindow(x, y, -3.98, 1, 1.6);
    }
  }
  porch(0, 4.25, 10.6, 0.9, 4);
  porch(0, 4.25, 10.6, 4.1, 4);
  box(0xf0e7ce, 0, 6.65, 4.25, 11, 0.22, 1.5);
  box(0x6c5144, 0, 2.1, 4.1, 1.3, 2.4, 0.15);
  for (const y of [2.4, 5.6]) for (const z of [-2.5, 0, 2.5]) {
    window(5.97, y, z, 1, 1.6, Math.PI / 2);
    leftWindow(-5.97, y, z, 1, 1.6);
  }
  for (const z of [-3.8, 3.8]) box(0xf0e7ce, 0, 7.8, z, 12, 0.65, 0.18);
  for (const x of [-5.9, 5.9]) box(0xf0e7ce, x, 7.8, 0, 0.18, 0.65, 7.6);
  box(0x90968a, 3, 7.8, -1, 1.5, 0.35, 1);
  for (let x = -4.8; x <= 4.8; x += 0.4) box(0xe2d6be, x, 4.55, 4.87, 0.07, 0.8, 0.07);
  box(0xe2d6be, 0, 4.95, 4.87, 10, 0.1, 0.12);
}
