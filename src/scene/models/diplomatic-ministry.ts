import type { Kit } from "./kit";
import { detailedWindow, door, face, palm, plant, pixelText, wallLamp } from "./services-parts";

const WALL = 0xe7e1d2;
const TRIM = 0xf0ecdf;
const STONE = 0xaaa18d;

export function buildDiplomaticMinistry(kit: Kit) {
  const { box } = kit;
  const x0 = -4.55;
  const x1 = 4.55;
  const z0 = -4.1;
  const zf = 1.55;
  const ground = face(kit, 0, zf, 0);
  box(0xc9bea8, 0, 0.06, 0, 11.7, 0.12, 11.7);
  box(0xd8c9ae, 0, 0.13, 3.45, 7.8, 0.06, 3.8);
  for (let x = -3.65; x <= 3.65; x += 0.45) box(0xc4b698, x, 0.17, 3.45, 0.035, 0.015, 3.75);
  for (let z = 1.65; z <= 5.2; z += 0.45) box(0xc4b698, 0, 0.17, z, 7.8, 0.015, 0.035);
  box(STONE, 0, 0.28, -1.25, 10.1, 0.4, 6.2);
  box(0x887f6c, 0, 0.48, -1.25, 10.15, 0.08, 6.25);

  // Monumental two-storey colonial block with a shaded arcade and occupied rooftop terrace.
  box(WALL, 0, 3.3, -1.25, 9.1, 5.9, 5.65);
  box(STONE, 0, 0.67, -1.25, 9.3, 0.42, 5.85);
  box(0x827965, 0, 0.88, -1.25, 9.34, 0.08, 5.9);
  for (const y of [3.38, 6.42]) {
    box(TRIM, 0, y, -1.25, 9.42, 0.24, 5.95);
    box(STONE, 0, y - 0.17, -1.25, 9.26, 0.1, 5.81);
  }
  box(TRIM, 0, 6.43, -1.25, 9.72, 0.32, 6.2);
  for (const x of [x0, x1]) {
    for (const z of [z0, zf]) {
      box(0xbdb5a3, x, 3.35, z, 0.42, 5.9, 0.42);
      for (let y = 1.0, i = 0; y < 6.2; y += 0.48, i++) {
        const offset = i % 2 ? 0.07 : -0.07;
        box(i % 2 ? 0x958c7a : 0xcac1ae, x + offset, y, z + Math.sign(z + 1.25) * 0.03, 0.46, 0.16, 0.46);
      }
    }
  }

  // Deep front loggia with square masonry columns and decorative arches.
  for (const x of [-4.05, -2.72, -1.36, 0, 1.36, 2.72, 4.05]) {
    box(STONE, x, 1.67, 1.65, 0.5, 3.1, 0.55);
    box(TRIM, x, 0.18, 1.65, 0.72, 0.28, 0.76);
    box(TRIM, x, 3.18, 1.65, 0.7, 0.24, 0.76);
    box(0xc9c0ae, x, 2.8, 1.7, 0.55, 0.12, 0.62);
    box(0x8e8573, x, 1.3, 1.9, 0.08, 0.12, 0.06);
  }
  box(TRIM, 0, 3.34, 1.65, 9.55, 0.26, 0.36);
  door(ground, 0, 0.28, 1.65, 2.55, { leaf: 0x704c35, frame: TRIM, trim: 0x453b31, handle: 0xc5a75f, double: true });
  for (const x of [-3.4, -2.0, 2.0, 3.4]) {
    detailedWindow(ground, x, 1.92, 0.72, 1.55, { lintel: TRIM });
    box(0x3e3730, x - 0.48, 1.95, 1.86, 0.12, 1.8, 0.08);
    box(0x3e3730, x + 0.48, 1.95, 1.86, 0.12, 1.8, 0.08);
  }
  wallLamp(ground, -1.2, 2.55);
  wallLamp(ground, 1.2, 2.55);
  for (const x of [-3.4, -1.15, 1.15, 3.4]) detailedWindow(ground, x, 4.88, 0.82, 1.75, { lintel: TRIM });
  const upper = face(kit, 0, z0, Math.PI);
  for (const x of [-3.3, -1.1, 1.1, 3.3]) detailedWindow(upper, x, 4.9, 0.82, 1.72, { lintel: TRIM });
  const right = face(kit, x1, -1.25, Math.PI / 2);
  const left = face(kit, x0, -1.25, -Math.PI / 2);
  for (const faceSide of [right, left]) for (const z of [-3.0, -0.65, 0.65]) detailedWindow(faceSide, z, 1.9, 0.82, 1.52, { lintel: TRIM });
  for (const faceSide of [right, left]) for (const z of [-3.1, -0.8, 1.1]) detailedWindow(faceSide, z, 4.9, 0.82, 1.62, { lintel: TRIM });

  // Roof deck parapet, balusters, diplomatic ensigns and finial poles.
  box(0x625e55, 0, 6.66, -1.25, 9.4, 0.18, 6.0);
  box(0x827e72, 0, 6.77, -1.25, 8.95, 0.06, 5.55);
  for (const z of [-4.03, 1.53]) {
    box(TRIM, 0, 7.04, z, 9.35, 0.16, 0.16);
    box(TRIM, 0, 7.72, z, 9.4, 0.14, 0.18);
    for (let x = -4.42; x <= 4.42; x += 0.32) {
      box(0xe4ddcc, x, 7.38, z, 0.09, 0.55, 0.09);
      box(0xe4ddcc, x, 7.18, z, 0.15, 0.12, 0.15);
    }
  }
  for (const x of [-4.6, 4.6]) {
    box(TRIM, x, 7.04, -1.25, 0.18, 0.16, 5.75);
    box(TRIM, x, 7.72, -1.25, 0.18, 0.14, 5.8);
    for (let z = -3.85; z <= 1.35; z += 0.32) box(0xe4ddcc, x, 7.38, z, 0.09, 0.55, 0.09);
  }
  box(0x716c60, 0, 6.84, -1.25, 9.1, 0.12, 5.7);
  for (const x of [-2.7, 0, 2.7]) {
    box(0x363936, x, 9.0, -1.2, 0.08, 4.2, 0.08);
    box(0xc8bc9e, x, 7.98, -1.1, 0.06, 2.05, 0.06);
    box(x === 0 ? 0x2d6d49 : 0xc8463e, x, 8.67, -1.0, 0.92, 1.15, 0.04);
    box(0xe4d6aa, x + 0.17, 8.67, -0.965, 0.14, 1.15, 0.025);
    box(0xe4d6aa, x - 0.17, 8.67, -0.965, 0.14, 1.15, 0.025);
    box(0xd7c9a9, x, 11.17, -1.2, 0.34, 0.14, 0.34);
    box(0xa58c65, x, 11.36, -1.2, 0.18, 0.24, 0.18);
  }
  const sign = face(kit, 0, 1.84, 0);
  box(0x403b33, 0, 4.03, 2.13, 2.95, 0.55, 0.08);
  box(0xe3d6b7, 0, 4.03, 2.18, 2.75, 0.4, 0.03);
  pixelText(sign, "MINISTRY", 0, 4.03, 0.21, 0.075, 0x373a35);
  for (const x of [-5.05, 5.05]) {
    palm(kit, Math.sign(x) * 4.3, 4.3, 0.18, 1.3);
    plant(kit, x * 0.68, 4.8, 0.2, 0x955d3e, [0xe3c53e, 0xd8434f, 0xffffff], 0.9);
  }
  for (const x of [-4.3, 4.3]) {
    box(0x5c5140, x, 0.46, 2.6, 0.12, 0.9, 0.12);
    box(0xf4dfa3, x, 1.05, 2.6, 0.3, 0.36, 0.3);
    box(0x4a443b, x, 1.27, 2.6, 0.4, 0.08, 0.4);
  }
}
