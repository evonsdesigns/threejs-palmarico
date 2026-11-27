import type { Kit } from "./kit";
import { face, door, detailedWindow, wallLamp, bench, plant } from "./services-parts";
import { flag } from "./government-a-parts";

export function buildImmigrationOffice(kit: Kit) {
  const { box } = kit;
  box(0xb6a98f, 0, 0.09, 0, 7.7, 0.18, 7.7);
  box(0xd4cdb6, 0, 0.16, 0.65, 7.05, 0.08, 5.95);
  box(0x8bb2c2, 0, 1.75, -0.55, 6.25, 3.15, 5.15);
  box(0x6e9baa, 0, 0.35, -0.55, 6.35, 0.32, 5.25);
  box(0xf1eee2, 0, 3.38, -0.55, 6.58, 0.22, 5.48);
  kit.gable(0, -0.55, 6.55, 5.45, 3.48, 0.75, 0x9b3a31, 6);
  const F = face(kit, 0, 2.05, 0);
  door(F, -1.7, 0.38, 1.25, 2.35, { leaf: 0x456f91, frame: 0xf1eddf, trim: 0x355a78, double: true, glazed: true, glass: 0x789ea5 });
  door(F, 1.7, 0.38, 1.25, 2.35, { leaf: 0x456f91, frame: 0xf1eddf, trim: 0x355a78, double: true, glazed: true, glass: 0x789ea5 });
  detailedWindow(F, 0, 1.75, 1.25, 1.3, { shutter: 0x547d96, louvers: 0x3c5e72 });
  wallLamp(F, -2.65, 2.35); wallLamp(F, 2.65, 2.35);
  box(0x355f7a, 0, 2.95, 2.08, 3.2, 0.42, 0.12);
  box(0xf2eee1, 0, 2.95, 2.16, 2.9, 0.22, 0.04);
  box(0x355f7a, 0, 2.95, 2.19, 1.65, 0.06, 0.02);
  for (const x of [-2.7, 2.7]) for (const z of [-2.85, 1.9]) box(0xe9e5d7, x, 1.75, z, 0.22, 3.15, 0.22);
  for (const z of [-2.85, 1.9]) box(0xe9e5d7, 0, 3.28, z, 5.62, 0.18, 0.18);
  for (const x of [-2.95, 2.95]) box(0xddd8c8, x, 0.28, -0.55, 0.5, 0.15, 5.1);
  for (const [x,z] of [[-1.65,3.45],[1.65,3.45]]) {
    box(0x6a6f69, x, 0.5, z, 0.08, 0.9, 0.08); box(0x6a6f69, x, 0.95, z, 0.12, 0.12, 0.12);
  }
  for (const z of [2.75,3.65]) for (let x=-2.8;x<3.1;x+=0.45) box(0x777a72,x,0.62,z,0.055,0.9,0.055);
  box(0x777a72,0,0.62,2.75,5.8,0.055,0.055); box(0x777a72,0,0.62,3.65,5.8,0.055,0.055);
  bench(kit,-2.15,1.05,0.18,1.55,0); bench(kit,2.15,1.05,0.18,1.55,0);
  flag(kit,3.15,-2.9,0,5.5);
  plant(kit,-3.15,-3.2,0.12,0x9c5b3b,[0xe3c53e,0xf08fb0],0.7);
  plant(kit,3.15,-3.2,0.12,0x9c5b3b,[0xe3c53e,0xf08fb0],0.7);
}
