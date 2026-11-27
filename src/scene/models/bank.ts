import * as THREE from "three";
import type { Kit } from "./kit";

export function buildBank(kit: Kit) {
  const { box, solid } = kit;
  const limestone = 0xd9d3be;
  const trim = 0xf0e9d8;
  const shadow = 0x817c6c;
  const bronze = 0x655440;
  const brass = 0xc3a363;
  const cylinder = (color: number, x: number, y: number, z: number, rt: number, rb: number, h: number, segments = 12) =>
    solid(new THREE.CylinderGeometry(rt, rb, h, segments), color, x, y, z);

  // Tiled forecourt and monumental approach, aligned to the +z entrance.
  box(0x8c8069, 0, 0.035, 0, 11.8, 0.07, 11.8);
  box(0xb6ab91, 0, 0.08, 3.85, 9.2, 0.04, 3.55);
  for (let x = -4.35; x <= 4.35; x += 0.6) box(0x988b72, x, 0.11, 3.85, 0.025, 0.015, 3.5);
  for (let z = 2.3; z <= 5.4; z += 0.55) box(0x988b72, 0, 0.11, z, 9.1, 0.015, 0.025);

  // Heavy ashlar plinth, symmetrical classical body, quoins and deep entablature.
  box(0x9a927f, 0, 0.46, -0.95, 9.6, 0.92, 7.1);
  box(limestone, 0, 3.05, -0.95, 9.15, 4.3, 6.72);
  box(0xb0a58d, 0, 0.9, -0.95, 9.32, 0.24, 6.88);
  box(trim, 0, 5.28, -0.95, 9.55, 0.28, 7.05);
  box(0x9c4334, 0, 5.47, -0.95, 9.6, 0.11, 7.08);
  box(trim, 0, 5.74, -0.95, 9.75, 0.36, 7.22);
  box(0xeee7d6, 0, 5.95, -0.95, 9.88, 0.1, 7.3);
  for (const x of [-4.45, 4.45]) {
    for (const z of [-4.1, 2.2]) {
      for (let y = 1.15; y < 5.05; y += 0.55) {
        const wide = Math.round(y * 10) % 2 === 0;
        box(trim, x, y, z, wide ? 0.42 : 0.3, 0.48, wide ? 0.3 : 0.42);
      }
    }
  }
  // Front central portico: six fluted stone columns with plinths, necks and carved capitals.
  for (const x of [-3.7, -2.25, -0.75, 0.75, 2.25, 3.7]) {
    box(0xa49a84, x, 0.92, 2.32, 0.82, 0.32, 0.82);
    cylinder(trim, x, 2.94, 2.32, 0.34, 0.42, 3.7, 14);
    cylinder(0xd6cfbb, x, 1.05, 2.32, 0.48, 0.48, 0.18, 14);
    cylinder(trim, x, 4.87, 2.32, 0.47, 0.37, 0.25, 12);
    box(trim, x, 5.08, 2.32, 0.92, 0.18, 0.92);
    box(0xd0c7b2, x, 2.94, 2.32, 0.06, 3.35, 0.68);
    for (const dx of [-0.12, 0.12]) box(0xf5eddb, x + dx, 2.75, 2.69, 0.035, 3.2, 0.035);
  }
  box(trim, 0, 5.34, 2.25, 9.7, 0.38, 1.0);
  box(0xb6a98f, 0, 5.1, 2.3, 9.55, 0.14, 0.9);

  // Shallow pediment with inset tympanum, raking cornice and central seal.
  const pediment = new THREE.Shape();
  pediment.moveTo(-4.75, 0);
  pediment.lineTo(4.75, 0);
  pediment.lineTo(0, 1.72);
  pediment.closePath();
  const tympanum = solid(new THREE.ExtrudeGeometry(pediment, { depth: 0.26, bevelEnabled: false }), 0xe7e0ce, 0, 5.52, 2.76);
  tympanum.geometry.translate(0, 0, -0.13);
  box(trim, 0, 5.54, 2.7, 9.95, 0.18, 0.46);
  box(trim, 0, 7.27, 2.7, 0.22, 0.18, 0.46);
  for (const side of [-1, 1]) {
    box(trim, side * 2.35, 6.37, 2.7, 5.25, 0.2, 0.4, 0, side * -0.35);
    box(0xc5b99e, side * 2.32, 6.19, 2.48, 5.15, 0.09, 0.08, 0, side * -0.35);
  }
  cylinder(brass, 0, 6.28, 3.02, 0.48, 0.48, 0.08, 16).rotation.x = Math.PI / 2;
  box(bronze, 0, 6.28, 3.1, 0.72, 0.08, 0.08);
  box(0xe0c878, 0, 6.29, 3.15, 0.24, 0.26, 0.08);
  // Low flat-topped roof and perimeter balustrade visible at the high isometric viewpoint.
  box(0x655c4d, 0, 6.16, -0.95, 9.25, 0.2, 6.9);
  box(0xaba58f, 0, 6.32, -0.95, 8.95, 0.12, 6.6);
  for (const z of [-4.18, 2.28]) {
    box(trim, 0, 7.2, z, 8.95, 0.12, 0.14);
    for (let x = -4.35; x <= 4.36; x += 0.33) {
      box(0xe9e3d3, x, 6.76, z, 0.1, 0.85, 0.1);
      box(0xe9e3d3, x, 6.57, z, 0.16, 0.1, 0.16);
    }
  }
  for (const x of [-4.42, 4.42]) {
    box(trim, x, 7.2, -0.95, 0.14, 0.12, 6.45);
    for (let z = -4.0; z <= 2.1; z += 0.34) box(0xe9e3d3, x, 6.76, z, 0.1, 0.85, 0.1);
  }
  // Three front bays with grilles, keystones and shadowed glazing.
  for (const x of [-3.0, 0, 3.0]) {
    box(shadow, x, 2.52, 0.25, 1.75, 2.75, 0.08);
    box(0x536762, x, 2.58, 0.31, 1.46, 2.45, 0.05);
    for (const dx of [-0.48, 0, 0.48]) box(0xd4cbb5, x + dx, 2.56, 0.39, 0.055, 2.48, 0.06);
    for (const y of [1.68, 2.48, 3.28]) box(0xd4cbb5, x, y, 0.39, 1.48, 0.055, 0.06);
    for (let dx = -0.58; dx <= 0.6; dx += 0.29) box(0x393a37, x + dx, 2.48, 0.49, 0.045, 2.2, 0.04);
    box(trim, x, 3.98, 0.22, 1.96, 0.16, 0.28);
    box(0xc2b59b, x, 4.08, 0.23, 0.48, 0.28, 0.22);
  }
  // Tall central bronze double doors, fanlight, brass pulls and lamps.
  box(0x302d28, 0, 1.76, 0.28, 1.58, 2.84, 0.1);
  box(0x654a31, -0.38, 1.77, 0.36, 0.7, 2.68, 0.1);
  box(0x75563a, 0.38, 1.77, 0.36, 0.7, 2.68, 0.1);
  for (const x of [-0.38, 0.38]) {
    for (const y of [0.8, 1.7, 2.65]) box(0x4e3b2b, x, y, 0.42, 0.5, 0.52, 0.03);
    box(brass, x + (x < 0 ? 0.23 : -0.23), 1.7, 0.46, 0.06, 0.3, 0.06);
  }
  box(trim, 0, 3.27, 0.33, 1.85, 0.28, 0.16);
  for (const x of [-1.23, 1.23]) {
    box(bronze, x, 3.6, 0.42, 0.09, 0.4, 0.09);
    box(brass, x, 3.34, 0.5, 0.25, 0.32, 0.23);
    box(bronze, x, 3.14, 0.5, 0.32, 0.06, 0.32);
  }
  // Three broad stone steps, cheek walls, and paired planter urns.
  for (let i = 0; i < 4; i++) {
    const z = 2.9 + i * 0.55;
    const y = 0.15 + i * 0.13;
    box(i % 2 ? 0xd3cbb7 : 0xe2dbc9, 0, y, z, 3.15 + i * 0.25, 0.24, 0.68);
    box(0x9e9581, 0, y - 0.11, z + 0.26, 3.25 + i * 0.25, 0.04, 0.06);
  }
  for (const x of [-2.4, 2.4]) {
    box(0xa49b88, x, 0.58, 4.65, 0.48, 1.16, 0.48);
    cylinder(0xc3b89e, x, 1.32, 4.65, 0.3, 0.16, 0.44, 10);
    cylinder(0xa7a08d, x, 1.63, 4.65, 0.12, 0.24, 0.2, 10);
    box(0x4d7041, x, 1.92, 4.65, 0.5, 0.55, 0.5);
  }
  // Three tall pilasters on the rear elevation echo the formal facade.
  for (const x of [-3.5, 0, 3.5]) {
    box(trim, x, 3.05, -4.34, 0.3, 4.05, 0.14);
    box(0xbdb39d, x, 1.02, -4.42, 0.62, 0.18, 0.24);
    box(trim, x, 5.1, -4.42, 0.62, 0.2, 0.24);
  }
  for (const x of [-3.0, 3.0]) kit.backWindow(x, 3.05, -4.37, 1.2, 1.55);
}
