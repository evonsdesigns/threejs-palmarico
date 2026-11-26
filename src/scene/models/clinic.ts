import { Kit } from "./kit";

export function buildClinic(kit: Kit) {
  const { box, gable, window, frontWindow, backWindow, leftWindow } = kit;
  box(0xb4b5aa, 0, 0.25, 0, 6.4, 0.5, 6);
  box(0xece3cd, 0, 2.35, -0.1, 6, 4.1, 5.5);
  for (const y of [0.55, 4.45]) box(0xf0ebdc, 0, y, -0.1, 6.2, 0.18, 5.7);
  gable(0, -0.1, 6.3, 5.8, 4.6, 0.85, 0x737b77, 8);
  for (const x of [-2, 2]) {
    frontWindow(x, 2.25, 2.72, 1.1, 1.5);
    backWindow(x, 2.25, -2.92, 1.1, 1.5);
  }
  for (const z of [-1.5, 0, 1.5]) {
    window(3.05, 2.3, z, 0.8, 1.4, Math.PI / 2);
    leftWindow(-3.05, 2.3, z, 0.8, 1.4);
  }
  box(0x687a72, 0, 1.55, 2.72, 1.2, 2.4, 0.15);
  box(0xeee9dc, 0, 3.3, 2.95, 2.2, 0.35, 0.7);
  for (const x of [-0.95, 0.95]) box(0xf0ebdc, x, 1.9, 3.05, 0.16, 2.6, 0.16);
  box(0xc34d42, 0, 4, 2.8, 1.1, 0.24, 0.12);
  box(0xc34d42, 0, 4, 2.8, 0.24, 1.1, 0.12);
  box(0xa4a69b, 2.15, 4.8, -1, 0.8, 0.4, 0.8);
}
