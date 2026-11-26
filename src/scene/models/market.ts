import { Kit } from "./kit";

export function buildMarket(kit: Kit) {
  const { box, gable, window, frontWindow, backWindow, leftWindow } = kit;
  box(0xb0a38b, 0, 0.25, 0, 6.4, 0.5, 6.1);
  box(0xe7bd70, 0, 2, -0.25, 6, 3.2, 5.4);
  gable(0, -0.25, 6.3, 5.8, 3.65, 0.9, 0xa6573b, 8);
  for (const x of [-2, 2]) {
    frontWindow(x, 2.1, 2.55, 1.1, 1.25);
    backWindow(x, 2.1, -3.05, 1.1, 1.25);
  }
  for (const z of [-1.5, 0, 1.5]) {
    window(3.05, 2.1, z, 0.8, 1.2, Math.PI / 2);
    leftWindow(-3.05, 2.1, z, 0.8, 1.2);
  }
  box(0x604a39, 0, 1.45, 2.55, 1.1, 2.3, 0.12);
  for (let i = 0; i < 6; i++) {
    box(i % 2 ? 0xc98e69 : 0xeee2ca, -2.5 + i, 3.15, 2.95, 1, 0.12, 0.8, -0.15);
  }
  for (const x of [-2.5, 2.5]) {
    box(0x8c6b4d, x, 0.7, 2.8, 0.9, 0.7, 0.55);
    box(0x7eaa59, x, 1.08, 2.8, 0.75, 0.12, 0.45);
    for (const dx of [-0.25, 0, 0.25]) box(0xd7b65b, x + dx, 1.2, 2.8, 0.16, 0.18, 0.16);
  }
}
