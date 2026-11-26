import { Kit } from "./kit";

export function buildCondominium(kit: Kit) {
  const { box, gable, window, frontWindow, backWindow, leftWindow, porch } = kit;
  box(0xb5b3aa, 0, 0.3, 0, 13, 0.6, 9);
  for (const x of [-3.1, 3.1]) {
    box(0xa8b5b8, x, 4.1, 0, 6, 7, 8);
    gable(x, 0, 6.4, 8.4, 7.7, 2.2, 0x687a80, 9);
    for (const y of [2.1, 5, 7]) {
      for (const dx of [-1.8, 0, 1.8]) {
        frontWindow(x + dx, y, 4.08, 0.9, 1.3);
        backWindow(x + dx, y, -4.08, 0.9, 1.3);
      }
    }
    box(0xe4ded2, x, 3.45, 4.28, 5.8, 0.18, 0.55);
    box(0xe4ded2, x, 6.35, 4.28, 5.8, 0.18, 0.55);
    for (const y of [3.85, 6.75]) {
      box(0xe5e1d3, x, y, 4.56, 5.8, 0.1, 0.1);
      for (let dx = -2.6; dx <= 2.6; dx += 0.4) box(0xe5e1d3, x + dx, y - 0.2, 4.56, 0.07, 0.4, 0.07);
    }
    box(0xd8d6ca, x - 1.8, 8.95, -2, 0.55, 1.7, 0.55);
    box(0xb1a99a, x - 1.8, 9.85, -2, 0.7, 0.15, 0.7);
  }
  for (const y of [2.1, 5, 7]) for (const z of [-2.5, 0, 2.5]) {
    window(6.17, y, z, 0.9, 1.3, Math.PI / 2);
    leftWindow(-6.17, y, z, 0.9, 1.3);
  }
  porch(0, 4.25, 4, 0.8);
  box(0x707c7c, 0, 3.35, 4.3, 4.4, 0.2, 1.2);
  box(0xb4a98f, 0, 0.4, 4.9, 2.2, 0.25, 0.8);
}
