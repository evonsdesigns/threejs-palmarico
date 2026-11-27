import type { Kit } from "./kit";

export function buildHotel(kit: Kit) {
  kit.group.scale.set(0.8, 1, 0.75);
  const { box, litBox } = kit;
  const stone = 0xded8c0;
  const lightStone = 0xeee8d5;
  const shadowStone = 0xb6ab91;
  const darkStone = 0x9c907a;
  const glass = 0x285788;

  // The upper floors form a U around the lower, tiled entrance court.
  box(0xc9bea5, 0, 0.1, 0, 19.6, 0.2, 15.6);
  box(stone, 0, 1.8, 0, 18.4, 3.4, 13.8);
  box(stone, 0, 6.7, -4.85, 18.4, 6.4, 4.1);
  for (const x of [-6.4, 6.4]) {
    box(stone, x, 6.7, 1.95, 5.6, 6.4, 9.5);
  }

  // Courtyard paving, with individual joints and a raised coping.
  box(0xebe6d3, 0, 3.58, 1.4, 7.1, 0.16, 8.6);
  for (let x = -3; x <= 3; x += 1) box(0xb4ad9c, x, 3.67, 1.4, 0.035, 0.02, 8.5);
  for (let z = -2.6; z <= 5.4; z += 1) box(0xb4ad9c, 0, 3.67, z, 7.0, 0.02, 0.035);
  box(lightStone, 0, 3.79, 6.82, 7.4, 0.36, 0.24);

  // Projecting string courses and cornices around the exterior and courtyard.
  for (const y of [0.35, 3.4, 6.65, 9.85]) {
    const height = y === 9.85 ? 0.25 : 0.14;
    box(lightStone, 0, y, -6.94, 18.55, height, 0.22);
    if (y <= 3.4) {
      box(lightStone, 0, y, 6.94, 18.55, height, 0.22);
    } else {
      for (const x of [-6.4, 6.4]) box(lightStone, x, y, 6.94, 5.7, height, 0.22);
    }
    for (const x of [-9.24, 9.24]) box(lightStone, x, y, 0, 0.22, height, 13.85);
    if (y > 3.4) {
      box(lightStone, 0, y, -2.76, 7.25, height, 0.2);
      for (const x of [-3.58, 3.58]) box(lightStone, x, y, 2, 0.2, height, 9.55);
    }
  }

  // Every facade uses the same framed, illuminated blue windows.
  const window = (x: number, y: number, z: number, facing: number, ground = false) => {
    const nx = Math.sin(facing);
    const nz = Math.cos(facing);
    const part = (color: number, offset: number, dy: number, w: number, h: number, d: number) =>
      box(color, x + nx * offset, y + dy, z + nz * offset, w, h, d, 0, facing);
    const width = ground ? 1.05 : 0.88;
    const height = ground ? 1.95 : 1.55;
    part(shadowStone, 0.02, 0, width + 0.38, height + 0.35, 0.08);
    part(lightStone, 0.08, 0, width + 0.24, height + 0.22, 0.1);
    litBox(glass, x + nx * 0.15, y, z + nz * 0.15, width, height, 0.06, 0, facing);
    part(0x9cb8c0, 0.19, 0, 0.045, height, 0.025);
    part(0x9cb8c0, 0.19, 0.25, width, 0.045, 0.025);
    part(lightStone, 0.18, -height / 2 - 0.12, width + 0.42, 0.14, 0.3);
    part(lightStone, 0.15, height / 2 + 0.12, width + 0.32, 0.13, 0.24);
    if (ground) {
      // Stepped voussoirs suggest the wide arched ground-floor openings.
      for (const side of [-1, 1]) {
        part(lightStone, 0.2, height / 2 + 0.25, width * 0.68, 0.12, 0.12);
        box(lightStone, x + Math.cos(facing) * side * width * 0.38 + nx * 0.2,
          y + height / 2 + 0.16, z - Math.sin(facing) * side * width * 0.38 + nz * 0.2,
          0.19, 0.18, 0.12, 0, facing);
      }
      part(shadowStone, 0.21, height / 2 + 0.32, 0.16, 0.16, 0.14);
    }
  };

  const frontBays = [-8, -6.1, -4.2, 4.2, 6.1, 8];
  for (const x of frontBays) {
    window(x, 1.95, 6.91, 0, true);
    for (const y of [5.05, 8.2]) window(x, y, 6.91, 0);
  }
  for (const x of [-2.2, 2.2]) window(x, 1.95, 6.91, 0, true);
  for (const x of [-8, -6.2, -4.4, -2.6, -0.8, 0.8, 2.6, 4.4, 6.2, 8]) {
    window(x, 1.95, -6.91, Math.PI, true);
    for (const y of [5.05, 8.2]) window(x, y, -6.91, Math.PI);
  }
  for (const side of [-1, 1]) {
    const facing = side * Math.PI / 2;
    for (const z of [-5.7, -3.8, -1.9, 0, 1.9, 3.8, 5.7]) {
      window(side * 9.21, 1.95, z, facing, true);
      for (const y of [5.05, 8.2]) window(side * 9.21, y, z, facing);
    }
    for (const z of [-1.6, 0.35, 2.3, 4.25]) {
      for (const y of [5.05, 8.2]) window(side * 3.61, y, z, -facing);
    }
  }
  for (const x of [-2.65, -0.9, 0.9, 2.65]) {
    for (const y of [5.05, 8.2]) window(x, y, -2.79, 0);
  }

  // Pilasters, masonry joints and small ornamental cornice brackets.
  for (const x of [-9.02, -3.75, 3.75, 9.02]) {
    box(lightStone, x, 5.05, 6.96, 0.27, 9.55, 0.2);
    for (const y of [3.25, 6.5, 9.65]) box(shadowStone, x, y, 7.05, 0.42, 0.13, 0.3);
  }
  for (const y of [0.9, 1.4, 2.8]) {
    box(shadowStone, 0, y, -6.96, 18.1, 0.025, 0.03);
    for (const x of [-9.26, 9.26]) box(shadowStone, x, y, 0, 0.03, 0.025, 13.6);
  }
  for (let x = -8.7; x <= 8.7; x += 0.6) {
    box(shadowStone, x, 9.65, -7.02, 0.15, 0.22, 0.24);
    if (Math.abs(x) > 3.7) box(shadowStone, x, 9.65, 7.02, 0.15, 0.22, 0.24);
  }
  for (let z = -6.4; z <= 6.4; z += 0.6) {
    for (const side of [-1, 1]) box(shadowStone, side * 9.32, 9.65, z, 0.24, 0.22, 0.15);
  }

  // Flat, weathered roofs, low parapets and rooftop service vents.
  box(0x857a75, 0, 9.99, -4.85, 18.2, 0.12, 4.0);
  for (const x of [-6.4, 6.4]) box(0x857a75, x, 9.99, 1.95, 5.5, 0.12, 9.4);
  for (let i = 0; i < 38; i++) {
    const x = -8.5 + (i * 3.73 % 17);
    const z = -6.6 + (i * 2.39 % 13);
    if (Math.abs(x) < 3.75 && z > -2.8) continue;
    box(i % 3 === 0 ? 0xa59a8f : 0x716a69, x, 10.06, z, 0.48 + i % 4 * 0.18, 0.015, 0.3 + i % 3 * 0.18);
  }
  box(lightStone, 0, 10.27, -6.92, 18.5, 0.55, 0.2);
  for (const side of [-1, 1]) {
    box(lightStone, side * 9.2, 10.27, 0, 0.2, 0.55, 13.8);
    box(lightStone, side * 6.4, 10.27, 6.9, 5.6, 0.55, 0.2);
    box(lightStone, side * 3.6, 10.27, 2, 0.2, 0.55, 9.6);
  }
  box(lightStone, 0, 10.27, -2.8, 7.2, 0.55, 0.2);
  for (const [x, z] of [[-7.5, -5.3], [-5.4, 2.4], [6.8, -4.9], [6.9, 3.3]]) {
    box(shadowStone, x, 10.25, z, 1.05, 0.42, 0.8);
    box(lightStone, x, 10.52, z, 1.15, 0.12, 0.9);
  }

  // Recessed main doors and a burgundy porte-cochere, facing +z.
  box(darkStone, 0, 1.65, 6.96, 2.25, 3.05, 0.12);
  box(0x334955, 0, 1.62, 7.04, 1.85, 2.7, 0.08);
  for (const x of [-0.88, 0, 0.88]) box(0xb9a77f, x, 1.62, 7.1, 0.07, 2.7, 0.07);
  for (const x of [-0.3, 0.3]) box(0xd3bc78, x, 1.25, 7.15, 0.07, 0.16, 0.06);
  box(lightStone, 0, 3.17, 7.06, 2.5, 0.17, 0.26);
  box(0x783323, 0, 2.8, 7.42, 2.65, 0.15, 1.0, -0.2);
  box(0x542a20, 0, 2.68, 7.88, 2.7, 0.2, 0.1);
  for (const x of [-1.23, 1.23]) box(lightStone, x, 1.35, 7.78, 0.11, 2.65, 0.11);
  box(0xb8aa91, 0, 0.17, 7.53, 3.4, 0.16, 0.55);
}
