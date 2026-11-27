import * as THREE from "three";
import type { Kit } from "./kit";

export function buildConstructionOffice(kit: Kit) {
  const { box, solid } = kit;
  const steel = 0x555b58;
  const cream = 0xd8d1bd;
  const cylinder = (color: number, x: number, y: number, z: number, r: number, h: number, rx = 0, rz = 0) => {
    const mesh = solid(new THREE.CylinderGeometry(r, r, h, 10), color, x, y, z);
    mesh.rotation.x = rx;
    mesh.rotation.z = rz;
    return mesh;
  };
  const crate = (x: number, z: number, w: number, h: number, d: number, color = 0xb28b60) => {
    box(color, x, h / 2 + 0.08, z, w, h, d);
    for (const y of [0.2, 0.6, 0.94]) box(0x795b3b, x, h * y + 0.08, z, w + 0.05, 0.055, d + 0.05);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0x76583a, x + sx * (w / 2 - 0.06), h / 2 + 0.08, z + sz * (d / 2 - 0.05), 0.08, h, 0.08);
  };

  box(0x8e8165, 0, 0.03, 0, 11.8, 0.06, 7.8);
  box(0xb8aa8a, 0, 0.075, 2.45, 11.4, 0.03, 2.65);
  for (let x = -5.3; x <= 5.3; x += 0.55) box(0x9b8c70, x, 0.1, 2.45, 0.025, 0.015, 2.65);
  for (let z = 1.25; z <= 3.65; z += 0.5) box(0x9b8c70, 0, 0.1, z, 11.4, 0.015, 0.025);

  // Low masonry-front office with a shaded porch, a storeroom wing and corrugated roof.
  box(0x76614a, -2.35, 0.22, -1.9, 6.9, 0.4, 3.55);
  box(cream, -2.35, 1.74, -1.9, 6.55, 2.8, 3.25);
  box(0xa6a08d, -2.35, 0.55, -1.9, 6.58, 0.34, 3.3);
  box(0xe4ddca, -2.35, 3.15, -1.9, 6.75, 0.18, 3.48);
  for (const x of [-5.45, 0.75]) for (const z of [-3.45, -0.35]) box(0x76614a, x, 1.8, z, 0.16, 3.0, 0.16);
  // Roof is flat over the office block, with rows of greened corrugated sheet seams.
  box(0x56605b, -2.35, 3.35, -1.9, 6.95, 0.16, 3.75);
  box(0x899083, -2.35, 3.46, -1.9, 6.82, 0.06, 3.62);
  for (let x = -5.55; x <= 0.85; x += 0.38) box(0x666d64, x, 3.51, -1.9, 0.05, 0.025, 3.58);
  for (const x of [-4.6, -2.35, -0.1]) {
    kit.frontWindow(x, 2.08, -0.24, 0.95, 1.0);
    box(0x607a78, x, 2.1, -0.08, 0.08, 1.05, 0.04);
  }
  box(0x624a35, 0.45, 1.36, -0.19, 0.85, 2.15, 0.08);
  box(0xc2a473, 0.72, 1.36, -0.12, 0.07, 0.08, 0.04);
  box(0x8b6842, -2.45, 0.15, 0.12, 2.7, 0.22, 1.0);
  for (const x of [-3.65, -1.25]) {
    box(0x76583a, x, 1.5, 0.48, 0.12, 2.8, 0.12);
    box(0x76583a, x, 2.85, 0.48, 1.3, 0.12, 0.12);
  }
  box(0x819188, -2.45, 2.87, 0.48, 2.45, 0.04, 0.06);
  // Emergency light, work-order board and safety notice beside the entrance.
  box(0x303430, 1.0, 2.35, -0.13, 0.12, 0.34, 0.12);
  box(0xf2cc72, 1.0, 2.15, 0.0, 0.25, 0.26, 0.22);
  box(0x425c54, -5.0, 1.95, -0.2, 0.75, 0.88, 0.06);
  for (let y = 1.65; y <= 2.25; y += 0.2) box(0xe2d6b7, -5.0, y, -0.15, 0.48, 0.025, 0.02);
  box(0xe0c05e, -5.25, 0.45, 0.42, 0.42, 0.7, 0.42);
  box(0x303431, -5.25, 0.82, 0.42, 0.46, 0.07, 0.46);

  // Work yard: stacks of bricks, cement sacks, a timber rack and scaffolded frame.
  for (let tier = 0; tier < 4; tier++) for (let row = 0; row < 4; row++) {
    const x = 1.75 + row * 0.29 + (tier % 2) * 0.12;
    const y = 0.18 + tier * 0.16;
    box(tier % 3 ? 0x9e5941 : 0xb3694c, x, y, -2.5, 0.48, 0.14, 0.25);
    box(0xc0805b, x, y + 0.07, -2.5, 0.44, 0.025, 0.23);
  }
  box(0x876b4a, 3.1, 0.12, -2.45, 2.0, 0.16, 1.05);
  for (let i = 0; i < 4; i++) {
    const x = 2.3 + i * 0.52;
    box(0x87704e, x, 0.4, -2.4, 0.16, 0.52, 0.75);
    box(0x9b8060, x, 0.73, -2.4, 0.58, 0.12, 0.88);
  }
  for (const [x, z] of [[4.7, -2.85], [4.1, -2.75], [4.65, -3.4]] as const) {
    box(0xc2a978, x, 0.38, z, 0.56, 0.66, 0.44);
    box(0xb39767, x, 0.72, z, 0.48, 0.12, 0.38);
    box(0x705c40, x, 0.76, z, 0.12, 0.16, 0.12);
  }
  // Tall multi-bay scaffold, toe boards, cross braces and planked working platform.
  for (const x of [2.4, 3.6, 4.8]) for (const y of [0.9, 2.0, 3.1]) {
    box(steel, x, y, 0.18, 0.1, y === 0.9 ? 1.8 : 2.1, 0.1);
  }
  for (const y of [0.35, 1.45, 2.55, 3.55]) box(steel, 3.6, y, 0.18, 2.55, 0.08, 0.08);
  for (const x of [2.4, 3.6, 4.8]) box(0x8e7654, x, 1.55, 0.18, 1.2, 0.12, 0.95);
  for (const x of [2.4, 3.6, 4.8]) {
    box(0x4c5551, x, 1.0, 0.18, 0.055, 1.95, 0.055, -0.55);
    box(0x4c5551, x, 1.0, 0.18, 0.055, 1.95, 0.055, 0.55);
  }
  // Cement mixer on two wheels: striped drum, loading chute, motor, crank and towing handle.
  box(0x323532, -4.25, 0.44, 2.15, 0.14, 0.14, 1.85);
  for (const x of [-4.8, -3.7]) {
    const wheel = solid(new THREE.TorusGeometry(0.35, 0.09, 6, 12), 0x302f2b, x, 0.43, 2.15);
    wheel.rotation.y = Math.PI / 2;
    box(0xb3a68d, x, 0.43, 2.15, 0.08, 0.08, 0.08);
  }
  const drum = cylinder(0xb64734, -4.25, 1.28, 2.15, 0.62, 1.4, 0.9, Math.PI / 2);
  drum.rotation.y = 0.22;
  cylinder(0xd0c8b3, -4.25, 1.68, 2.15, 0.68, 0.13, 0.9, Math.PI / 2);
  cylinder(0x424744, -4.25, 0.56, 2.15, 0.11, 0.55, Math.PI / 2);
  box(0x777d76, -4.25, 0.72, 1.42, 0.52, 0.52, 0.55);
  box(0x474d48, -4.25, 1.15, 1.42, 0.54, 0.12, 0.56);
  box(0x9eaaa2, -4.25, 1.82, 2.15, 0.14, 0.7, 0.14, -0.5);
  for (const z of [1.75, 2.15, 2.55]) box(0xe1d7c3, -4.25, 1.28, z, 0.05, 0.08, 0.06, 0.9);

  // Site sign and bollards delineate the edge of the material laydown area.
  box(0x75563a, -0.85, 1.05, 3.7, 0.12, 2.1, 0.12);
  box(0x75563a, 1.1, 1.05, 3.7, 0.12, 2.1, 0.12);
  box(0x9f4f35, 0.12, 2.08, 3.7, 2.15, 0.8, 0.12);
  box(0xe1d0a6, 0.12, 2.08, 3.78, 1.95, 0.58, 0.025);
  for (const x of [-5.2, -4.1, 1.4, 5.4]) {
    box(0x393936, x, 0.38, 3.6, 0.12, 0.76, 0.12);
    box(0xe5bc55, x, 0.6, 3.6, 0.13, 0.22, 0.13);
  }
  crate(5.3, -0.8, 0.85, 0.65, 0.75, 0xa57d50);
  box(0x72604a, -5.35, 0.34, -3.25, 0.92, 0.58, 0.75);
}
