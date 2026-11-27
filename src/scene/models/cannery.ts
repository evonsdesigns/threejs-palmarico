import type { Kit } from "./kit";
import { INDUSTRY as C, crateStack, floor, lamp, loadingDoor, pipe, shed, tank } from "./industry-parts";

export function buildCannery(kit: Kit) {
  const { box } = kit;
  floor(kit, 23.6, 15.6, 0xa89e89);
  const fishHall = shed(kit, -5.35, -0.95, 9.4, 8.0, 4.25, C.timber, C.roof, 1.95);
  loadingDoor(kit, -5.35, 0.65, fishHall.front + 0.12, 2.15, 3.1, C.green);
  const packHall = shed(kit, 4.35, -1.15, 8.0, 7.4, 4.0, C.brick, C.steel, 1.8);
  loadingDoor(kit, 4.35, 0.65, packHall.front + 0.12, 1.9, 2.9, C.timber);
  const coldStore = shed(kit, 9.0, -1.0, 3.3, 5.5, 3.4, C.cream, C.green, 1.35);
  loadingDoor(kit, 9.0, 0.65, coldStore.front + 0.12, 1.3, 2.4, C.steel);
  for (const h of [fishHall, packHall]) {
    for (const x of [h.x - h.w * 0.28, h.x, h.x + h.w * 0.28]) {
      const y = h.roofY + 0.4;
      box(C.steel, x, y, h.z, 0.42, 0.8, h.d - 0.9);
      box(C.glass, x, y + 0.06, h.z, 0.24, 0.55, h.d - 1.0);
      box(C.steelLight, x, y + 0.44, h.z, 0.58, 0.08, h.d - 0.75);
      for (const z of [h.z - h.d * 0.28, h.z, h.z + h.d * 0.28]) box(C.steel, x, y + 0.55, z, 0.58, 0.15, 0.16);
    }
  }
  for (const [x, z, r, h] of [[10.8, -3.4, 0.62, 2.1], [10.8, -1.2, 0.72, 2.7], [10.8, 1.1, 0.6, 1.8]]) {
    tank(kit, x, z, 0.02, r, h, C.steelLight, "cone");
    box(C.green, x, 1.0, z + r + 0.13, 0.12, 1.4, 0.12);
  }
  for (const z of [-3.1, -1.6, -0.1]) {
    box(C.steel, -0.15, 0.34, z, 5.1, 0.15, 0.16);
    for (let i = 0; i < 10; i++) {
      const x = -2.6 + i * 0.53;
      box(C.steelLight, x, 0.48, z, 0.06, 0.12, 0.44);
      box(i % 3 === 0 ? 0x7d9a57 : C.copper, x, 0.64, z, 0.36, 0.22, 0.35);
      box(C.gold, x, 0.64, z + 0.19, 0.13, 0.12, 0.025);
    }
  }
  for (const x of [-9.0, -6.2, -3.4]) {
    crateStack(kit, x, 4.3, 6, true);
  }
  for (const x of [1.8, 4.0, 6.2, 8.4]) {
    crateStack(kit, x, 4.2, 3, x % 2 === 0);
  }
  pipe(kit, [[-0.8, 2.5, -3.4], [-0.8, 3.2, -3.4], [1.5, 3.2, -3.4], [1.5, 2.8, -3.4], [3.1, 2.8, -3.4]], C.steel, 0.08);
  pipe(kit, [[8.0, 3.8, -2.0], [9.5, 3.8, -2.0], [9.5, 3.0, -2.0], [10.8, 3.0, -2.0]], C.copper, 0.09);
  for (const x of [-10.3, -5.4, 0.1, 5.7, 10.5]) lamp(kit, x, 6.5);
  for (const x of [-11.4, 11.4]) {
    for (const z of [-6.5, -4.2, -1.9, 0.4, 2.7, 5.0, 6.5]) box(C.shadow, x, 0.62, z, 0.12, 1.2, 0.12);
    box(C.steel, x, 1.24, 0, 0.08, 0.08, 13.0);
  }
  for (const z of [-6.5, 6.5]) {
    for (let x = -11.4; x <= 11.4; x += 2.0) box(C.shadow, x, 0.62, z, 0.12, 1.2, 0.12);
    box(C.steel, 0, 1.24, z, 22.8, 0.08, 0.08);
  }
  for (const x of [-9.4, -7.4, -2.0, 0.2, 7.3, 9.3]) {
    box(C.steel, x, 0.28, 5.55, 0.16, 0.56, 0.16);
    box(C.steelLight, x, 0.58, 5.55, 0.22, 0.08, 0.22);
  }
  box(C.steel, -0.05, 0.9, 5.55, 17.8, 0.09, 0.09);
  box(C.cream, 4.2, 5.1, -1.0, 2.2, 0.16, 0.55);
  for (const x of [3.3, 4.2, 5.1]) box(C.green, x, 5.25, -1.0, 0.1, 0.08, 0.38);
}
