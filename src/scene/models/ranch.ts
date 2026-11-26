import { Kit } from "./kit";

export function buildRanch(kit: Kit) {
  const { box, gable, window, frontWindow, backWindow, leftWindow } = kit;
  box(0x756345, 0, 0.18, 0, 12.5, 0.36, 12.5);
  box(0x9a8967, 0, 1.9, -1.8, 7.8, 3.4, 5.8);
  for (let x = -3.5; x <= 3.5; x += 0.55) box(0x776a51, x, 1.9, 1.12, 0.04, 3.3, 0.06);
  gable(0, -1.8, 8.4, 6.4, 3.65, 1.5, 0x6b6b58, 8);
  box(0x4e493c, 0, 1.4, 1.18, 2.2, 2.6, 0.12);
  for (const x of [-5.8, 5.8]) {
    for (let z = 2; z <= 6; z += 1.4) box(0xc3ac7f, x, 0.8, z, 0.16, 1.6, 0.16);
    for (const y of [0.55, 1.1]) box(0xc3ac7f, x, y, 4, 0.12, 0.12, 4.2);
  }
  for (let x = -5.8; x <= 5.8; x += 1.45) box(0xc3ac7f, x, 0.8, 6, 0.16, 1.6, 0.16);
  for (const y of [0.55, 1.1]) box(0xc3ac7f, 0, y, 6, 11.8, 0.12, 0.12);
  box(0xc6a45e, -4.4, 0.55, 4.3, 1.3, 0.9, 1.1);
  box(0xb59150, -4.4, 1.35, 4.3, 1.1, 0.7, 0.9);
  for (const x of [-2.5, 2.5]) frontWindow(x, 2.2, 1.18, 0.9, 1);
  for (const z of [-3.5, -1.8, 0]) {
    window(3.96, 2.1, z, 0.9, 1, Math.PI / 2);
    leftWindow(-3.96, 2.1, z, 0.9, 1);
  }
  for (const x of [-2.5, 2.5]) backWindow(x, 2.2, -4.78, 0.9, 1);
  box(0x65533b, 4.5, 0.42, 3.8, 1.8, 0.55, 0.8);
  box(0x87938b, 4.5, 0.7, 3.8, 1.55, 0.1, 0.55);
  for (const x of [3.8, 5.2]) for (const z of [-4.6, -3.4]) box(0xa29172, x, 1.6, z, 0.15, 3.2, 0.15);
  box(0x7d8175, 4.5, 3.3, -4, 2, 0.3, 1.6);
  box(0x9ca49a, 4.5, 4, -4, 1.6, 1.2, 1.2);
  box(0x7a8178, 4.5, 4.7, -4, 1.8, 0.15, 1.4);
}
