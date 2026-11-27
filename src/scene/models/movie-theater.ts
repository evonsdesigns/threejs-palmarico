import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, detailedWindow, door, face, palm, pixelText, plant, wallLamp } from "./services-parts";

const WALL = 0xcbb8a4;
const TRIM = 0xe9dfca;
const ART_DECO = 0x9cae9e;
const DARK = 0x42413d;

function poster(kit: Kit, x: number, z: number, colors: [number, number, number]) {
  kit.box(0x302f2b, x, 1.8, z, 0.9, 1.62, 0.14);
  kit.box(0xd8c9a8, x, 1.8, z + 0.09, 0.76, 1.48, 0.04);
  kit.box(colors[0], x, 2.03, z + 0.12, 0.64, 0.78, 0.03);
  kit.box(colors[1], x - 0.14, 2.12, z + 0.15, 0.18, 0.42, 0.05, 0, -0.12);
  kit.box(colors[2], x + 0.14, 2.0, z + 0.15, 0.22, 0.5, 0.05, 0, 0.1);
  kit.box(0xeee0bf, x, 1.42, z + 0.13, 0.54, 0.07, 0.03);
  for (let i = 0; i < 3; i++) kit.box(0x8c4c36, x - 0.18 + i * 0.18, 1.29, z + 0.14, 0.12, 0.05, 0.03);
}

export function buildMovieTheater(kit: Kit) {
  const { box, solid } = kit;
  box(0x918b7b, 0, 0.04, 0, 11.8, 0.08, 11.8);
  box(0xbab19c, 0, 0.08, 2.35, 11.5, 0.04, 3.2);
  for (let x = -5.6; x <= 5.6; x += 0.72) box(0xa49b88, x, 0.11, 2.35, 0.025, 0.01, 3.2);
  for (let z = 0.75; z <= 3.9; z += 0.72) box(0xa49b88, 0, 0.11, z, 11.4, 0.01, 0.025);

  // Plain flat-roofed cinema block with a taller stepped art-deco entrance pavilion.
  box(0x766e64, 0, 0.22, -1.35, 9.0, 0.36, 8.1);
  box(WALL, 0, 3.34, -1.35, 8.6, 5.85, 7.7);
  box(0x9b8067, 0, 0.58, -1.35, 8.7, 0.38, 7.8);
  box(TRIM, 0, 6.35, -1.35, 8.95, 0.24, 8.05);
  box(DARK, 0, 6.53, -1.35, 8.65, 0.12, 7.75);
  box(0x514f48, 0, 6.67, -1.35, 8.2, 0.14, 7.3);
  for (let x = -3.7; x <= 3.71; x += 0.7) box(0x62615b, x, 6.76, -1.35, 0.05, 0.025, 7.1);
  // Art-deco central tower, stepped cornice, and glass-block lobby.
  box(ART_DECO, 0, 3.16, 2.02, 4.5, 5.35, 2.2);
  box(0x809589, 0, 5.98, 2.02, 5.1, 0.24, 2.45);
  box(TRIM, 0, 6.2, 2.02, 5.6, 0.2, 2.7);
  box(0x66796f, 0, 6.4, 2.02, 4.8, 0.14, 2.35);
  for (const x of [-1.85, 1.85]) {
    box(TRIM, x, 3.03, 3.17, 0.2, 4.75, 0.12);
    box(0xaeb9a7, x, 3.1, 3.25, 0.08, 4.5, 0.08);
  }
  for (const x of [-1.2, -0.4, 0.4, 1.2]) {
    box(0x87a9a2, x, 2.3, 3.18, 0.62, 1.65, 0.12);
    box(0xd9d3c4, x, 2.3, 3.26, 0.05, 1.62, 0.03);
  }
  const F = face(kit, 0, 3.23, 0);
  door(F, 0, 0.28, 1.5, 2.45, { leaf: 0x354642, frame: TRIM, trim: 0x57695d, handle: 0xc9ae61, double: true, glazed: true, glass: 0x8bb4ac });
  // Raised concentric deco panels and stylized round clock above the entrance.
  box(0x54675f, 0, 4.95, 3.3, 2.1, 1.45, 0.12);
  box(0xe4d6b7, 0, 4.95, 3.39, 1.72, 1.12, 0.04);
  const clock = solid(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 16), 0x39433f, 0, 5.03, 3.47);
  clock.rotation.x = Math.PI / 2;
  const dial = solid(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 16), 0xe8d8ae, 0, 5.03, 3.52);
  dial.rotation.x = Math.PI / 2;
  beam(kit, 0x49453b, [0, 5.03, 3.59], [0, 5.25, 3.59], 0.035);
  beam(kit, 0x49453b, [0, 5.03, 3.6], [0.18, 4.96, 3.6], 0.03);
  for (const y of [2.4, 4.55]) for (const x of [-3.35, 3.35]) {
    detailedWindow(F, x, y, 0.62, 1.08, { lintel: TRIM });
    box(0x8d7060, x, y - 0.02, 3.17, 0.78, 1.28, 0.07);
  }
  // Front marquee projects over the pavement, bright bulb lines under its edge.
  box(0x393a37, 0, 3.65, 4.23, 6.9, 0.24, 1.68);
  box(0xede3cb, 0, 3.7, 4.33, 6.65, 0.32, 1.48);
  box(0xa33e36, 0, 3.71, 5.02, 6.7, 0.44, 0.18);
  pixelText(face(kit, 0, 5.13, 0), "PALACE", 0, 3.72, 0.02, 0.105, 0xf3dc92);
  for (let x = -3.1; x <= 3.101; x += 0.31) {
    kit.litBox(0xffd66d, x, 3.86, 5.1, 0.13, 0.15, 0.1);
    kit.litBox(0xffd66d, x, 3.53, 5.1, 0.13, 0.15, 0.1);
  }
  for (const x of [-3.25, 3.25]) for (let z = 3.6; z < 5; z += 0.32) kit.litBox(0xffd66d, x, 3.7, z, 0.12, 0.14, 0.12);
  for (const x of [-3.05, 3.05]) beam(kit, 0x44413b, [x, 3.56, 3.25], [x, 3.42, 4.85], 0.05);
  // Vertical illuminated blade sign with stacked lettering and a border of bulbs.
  box(0x333d3a, -4.55, 4.56, 2.12, 0.42, 4.65, 0.4);
  box(0xa43d37, -4.55, 4.56, 2.37, 0.29, 4.38, 0.1);
  for (const y of [2.55, 3.05, 3.55, 4.05, 4.55, 5.05, 5.55, 6.05, 6.55]) {
    kit.litBox(0xffd66d, -4.55, y, 2.47, 0.12, 0.12, 0.06);
  }
  for (const z of [2.2, 2.52]) for (let y = 2.5; y <= 6.6; y += 0.36) kit.litBox(0xffd66d, -4.55, y, z, 0.1, 0.11, 0.07);
  pixelText(face(kit, -4.55, 2.48, 0), "CINEMA", 0, 4.55, 0.02, 0.09, 0xeee3bd);
  for (const x of [-2.45, 2.45]) {
    poster(kit, x, 3.34, x < 0 ? [0xa74d39, 0xe0b55c, 0x54695d] : [0x495b6a, 0xd17a5b, 0xe9d39b]);
    wallLamp(F, x, 2.85, 0xf3cf73);
  }
  // Small side windows, service door, and metal fire escape with landing and stairs.
  const R = face(kit, 4.32, -1.35, Math.PI / 2);
  for (const z of [-3.4, -1.2, 1.0]) detailedWindow(R, z, 3.0, 0.85, 1.2, { lintel: TRIM });
  door(R, -3.2, 0.3, 0.9, 2.2, { leaf: 0x55463c, frame: TRIM, handle: 0xbfa65e });
  box(0x343936, 4.55, 3.55, -0.2, 1.0, 0.12, 2.2);
  box(0x343936, 4.55, 3.72, -0.2, 1.0, 0.08, 2.2);
  for (const z of [-1.2, 0.8]) for (let y = 2.1; y < 5.2; y += 0.48) box(0x343936, 4.55, y, z, 0.07, 0.5, 0.07);
  for (let i = 0; i < 8; i++) box(0x343936, 4.15 + i * 0.13, 2.9 - i * 0.34, 1.25 - i * 0.27, 0.42, 0.08, 0.35, 0.4);
  for (const x of [-5.25, 5.15]) {
    palm(kit, x, -4.25, 0.1, 0.68);
    plant(kit, x, 4.1, 0.1, 0x9a5c3c, [0xe3bc55, 0xcc5351], 0.75);
  }
}
