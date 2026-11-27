import * as THREE from "three";
import type { Kit } from "./kit";

export function buildLuxuryHotel(kit: Kit) {
  const { box, litBox, solid } = kit;
  const wall = 0xe3ddce;
  const trim = 0xeee9da;
  const shade = 0xb9b39f;
  const roof = 0x963c2b;
  const roofDark = 0x713022;

  // Five-storey wings surround an entrance court, with roof terraces above.
  box(0xc9c0a9, 0, 0.1, 0, 19.6, 0.2, 15.6);
  box(wall, 0, 1.65, 0, 18.2, 3.1, 13.2);
  box(wall, 0, 9.5, -4.65, 18.2, 12.6, 3.9);
  for (const x of [-6.35, 6.35]) box(wall, x, 9.5, 1.95, 5.5, 12.6, 9.3);
  box(0xd4cdb9, 0, 3.25, 1.6, 7.15, 0.12, 8.5);
  for (let x = -3; x <= 3; x++) box(0xbcb4a2, x, 3.32, 1.6, 0.025, 0.02, 8.3);
  for (let z = -2; z <= 5; z++) box(0xbcb4a2, 0, 3.32, z, 7.1, 0.02, 0.025);

  const window = (x: number, y: number, z: number, facing: number, arched: boolean) => {
    const nx = Math.sin(facing), nz = Math.cos(facing);
    const part = (color: number, offset: number, dy: number, width: number, height: number, depth: number) =>
      box(color, x + nx * offset, y + dy, z + nz * offset, width, height, depth, 0, facing);
    part(shade, 0.02, 0, 1.05, 1.55, 0.08);
    part(trim, 0.08, 0, 0.95, 1.45, 0.08);
    litBox(0x768c91, x + nx * 0.14, y, z + nz * 0.14, 0.72, 1.18, 0.05, 0, facing);
    part(0xd6ded4, 0.18, 0, 0.045, 1.18, 0.025);
    part(0xd6ded4, 0.18, 0.12, 0.72, 0.045, 0.025);
    part(trim, 0.17, -0.75, 1.08, 0.12, 0.22);
    if (arched) {
      part(roofDark, 0.15, 0.79, 0.72, 0.09, 0.1);
      for (const side of [-1, 1]) {
        const tx = Math.cos(facing) * side;
        const tz = -Math.sin(facing) * side;
        box(roofDark, x + tx * 0.44 + nx * 0.15, y + 0.64, z + tz * 0.44 + nz * 0.15, 0.1, 0.22, 0.1, 0, facing);
        box(roof, x + tx * 0.3 + nx * 0.15, y + 0.76, z + tz * 0.3 + nz * 0.15, 0.18, 0.1, 0.1, 0, facing);
      }
    } else {
      part(trim, 0.14, 0.78, 1.0, 0.12, 0.18);
    }
  };
  const upperFloors = [4.65, 7.55, 10.45, 13.35];
  for (const x of [-8, -6.35, -4.7, 4.7, 6.35, 8]) {
    window(x, 1.75, 6.61, 0, true);
    for (const y of upperFloors) window(x, y, 6.61, 0, true);
  }
  for (const x of [-2.4, 2.4]) window(x, 1.75, 6.61, 0, true);
  for (const x of [-8, -6.25, -4.5, -2.7, -0.9, 0.9, 2.7, 4.5, 6.25, 8]) {
    window(x, 1.75, -6.61, Math.PI, false);
    for (const y of upperFloors) window(x, y, -6.61, Math.PI, false);
  }
  for (const side of [-1, 1]) {
    const facing = side * Math.PI / 2;
    for (const z of [-5.4, -3.6, -1.8, 0, 1.8, 3.6, 5.4]) {
      window(side * 9.11, 1.75, z, facing, false);
      for (const y of upperFloors) window(side * 9.11, y, z, facing, false);
    }
    for (const z of [-1.4, 0.5, 2.4, 4.3]) {
      for (const y of upperFloors) window(side * 3.61, y, z, -facing, false);
    }
  }
  for (const x of [-2.6, -0.85, 0.85, 2.6]) {
    for (const y of upperFloors) window(x, y, -2.69, 0, false);
  }

  // Pale pilasters and a prominent lobby storey.
  for (const y of [0.35, 3.25, 15.7]) {
    box(trim, 0, y, -6.65, 18.4, 0.19, 0.24);
    for (const side of [-1, 1]) {
      box(trim, side * 9.16, y, 0, 0.24, 0.19, 13.3);
      box(trim, side * 6.35, y, 6.65, 5.65, 0.19, 0.24);
    }
    if (y < 3.3) box(trim, 0, y, 6.65, 7.2, 0.19, 0.24);
  }
  for (const x of [-8.85, -3.8, 3.8, 8.85]) {
    box(trim, x, 8, 6.66, 0.25, 15.5, 0.2);
    for (const y of [3.15, 15.45]) box(shade, x, y, 6.76, 0.42, 0.16, 0.32);
  }
  box(0x6a6860, 0, 1.55, 6.68, 2.05, 2.75, 0.1);
  for (const x of [-0.85, 0, 0.85]) box(trim, x, 1.55, 6.77, 0.1, 2.7, 0.12);
  box(trim, 0, 2.98, 6.79, 2.3, 0.16, 0.25);
  box(roof, 0, 2.75, 7.15, 2.6, 0.15, 1.0, -0.18);
  for (const x of [-1.2, 1.2]) box(trim, x, 1.35, 7.55, 0.1, 2.65, 0.1);
  box(0xbab19c, 0, 0.18, 7.38, 3.2, 0.16, 0.7);

  // Red parapets enclose furnished rooftop terraces.
  box(0xc7bca9, 0, 15.88, -4.65, 18.0, 0.18, 3.8);
  for (const x of [-6.35, 6.35]) box(0xc7bca9, x, 15.88, 1.95, 5.4, 0.18, 9.2);
  box(roof, 0, 16.28, -6.6, 18.3, 0.75, 0.28);
  for (const side of [-1, 1]) {
    box(roof, side * 9.05, 16.28, 0, 0.28, 0.75, 13.2);
    box(roof, side * 6.35, 16.28, 6.6, 5.5, 0.75, 0.28);
    box(roof, side * 3.6, 16.28, 1.95, 0.28, 0.75, 9.3);
  }
  box(roof, 0, 16.28, -2.7, 7.2, 0.75, 0.28);
  box(roofDark, 0, 16.68, -6.6, 18.4, 0.08, 0.35);
  for (const side of [-1, 1]) {
    box(roofDark, side * 9.05, 16.68, 0, 0.35, 0.08, 13.3);
    box(roofDark, side * 6.35, 16.68, 6.6, 5.6, 0.08, 0.35);
    box(roofDark, side * 3.6, 16.68, 1.95, 0.35, 0.08, 9.4);
  }
  for (const x of [-6.35, 6.35]) {
    for (const z of [-4.7, -0.8, 3.5]) {
      solid(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 8), 0x827561, x, 16.7, z);
      solid(new THREE.CylinderGeometry(0.08, 0.9, 0.27, 16), 0xf3edda, x, 17.45, z);
      solid(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 12), 0xe9e1d0, x, 16.65, z);
      for (const dx of [-0.75, 0.75]) {
        box(0x8c7967, x + dx, 16.25, z, 0.45, 0.12, 0.5);
        box(0xe4dbca, x + dx, 16.48, z - 0.22, 0.45, 0.48, 0.08);
      }
    }
    for (const z of [-2.7, 1.4, 5.1]) {
      box(0x8c735e, x + 1.55, 16.18, z, 0.75, 0.5, 0.6);
      solid(new THREE.SphereGeometry(0.42, 8, 6), 0x576b48, x + 1.55, 16.62, z);
    }
  }

  // Glazed barrel-vaulted roof passage joins the two terraces.
  for (let i = 0; i < 10; i++) {
    const angle = (i + 0.5) * Math.PI / 10;
    const y = 16.15 + Math.sin(angle) * 1.05;
    const z = -4.65 + Math.cos(angle) * 1.05;
    const tilt = Math.atan2(-Math.cos(angle), -Math.sin(angle));
    box(i % 2 ? 0x78918b : 0x92aaa1, 0, y, z, 5.9, 0.055, 0.32, tilt);
    for (const x of [-2.9, -1.45, 0, 1.45, 2.9]) box(0x766f59, x, y + 0.02, z, 0.08, 0.09, 0.36, tilt);
  }
  for (const x of [-2.9, 2.9]) {
    for (const z of [-5.7, -3.6]) box(0x766f59, x, 16.12, z, 0.1, 0.48, 0.1);
  }
}
