import { Kit } from "./kit";

export function buildShack(kit: Kit) {
  const { box, gable, window, frontWindow, backWindow, leftWindow } = kit;
  box(0x6a5946, 0, 0.18, 0, 5.2, 0.35, 4.2);
  box(0x7d6b55, 0, 1.55, 0, 4.8, 2.5, 3.8);
  for (let x = -2.2; x <= 2.2; x += 0.4) box(x % 0.8 < 0.4 ? 0x8e7b60 : 0x75634e, x, 1.55, 1.92, 0.36, 2.4, 0.06);
  gable(0, 0, 5.3, 4.3, 2.85, 0.7, 0x858079, 9);
  box(0x705b4a, -1.3, 1.25, 2, 0.85, 2.1, 0.12);
  frontWindow(1, 1.65, 2.02, 0.8, 0.8);
  window(2.42, 1.6, -0.5, 0.75, 0.8, Math.PI / 2);
  backWindow(-0.8, 1.65, -1.98, 0.8, 0.8);
  leftWindow(-2.42, 1.6, 0.5, 0.75, 0.8);
  box(0x9b947f, 1.5, 3.25, 0.8, 1.5, 0.08, 1.2, -0.3);
  box(0xa28c6d, -0.2, 0.35, 2.17, 1.4, 0.2, 0.35);
  box(0x555d52, 2.35, 0.45, 1.65, 0.45, 0.75, 0.45);
}
