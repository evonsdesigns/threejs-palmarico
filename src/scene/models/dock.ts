import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, door, face } from "./services-parts";

export function buildDock(kit: Kit) {
  const { box, solid } = kit;
  kit.group.userData.windowAnchorCenter = new THREE.Vector3(-7.15, 0, -4.7);
  const wood = 0x705038;
  const plank = [0x987653, 0x866548, 0xa18462, 0x77583e];
  const stone = 0xaaa18d;
  const mortar = 0x7d786b;

  // The warehouse sits on the landward half of the coastal footprint.
  box(0x9a998d, -7.15, 0.08, -4.75, 7.7, 0.16, 5.8);
  for (let x = -10.6; x <= -3.8; x += 0.85) box(0x888a80, x, 0.17, -4.75, 0.025, 0.02, 5.5);
  for (let z = -7.2; z <= -2.3; z += 0.85) box(0x888a80, -7.15, 0.17, z, 7.4, 0.02, 0.025);
  box(0x857f70, -7.15, 0.28, -4.7, 5.3, 0.35, 4.9);
  box(stone, -7.15, 1.98, -4.7, 5.0, 3.15, 4.65);
  box(0xd6d0bb, -7.15, 3.57, -4.7, 5.15, 0.18, 4.8);

  // Fine masonry courses and staggered joints on all four walls.
  for (let y = 0.55; y < 3.5; y += 0.32) {
    for (const z of [-7.04, -2.36]) box(mortar, -7.15, y, z, 4.95, 0.025, 0.025);
    for (const x of [-9.66, -4.64]) box(mortar, x, y, -4.7, 0.025, 0.025, 4.6);
    const shift = Math.round((y - 0.55) / 0.32) % 2 * 0.4;
    for (let x = -9.45 + shift; x < -4.7; x += 0.8) {
      for (const z of [-7.05, -2.35]) box(mortar, x, y + 0.16, z, 0.025, 0.3, 0.025);
    }
    for (let z = -6.9 + shift; z < -2.4; z += 0.8) {
      for (const x of [-9.67, -4.63]) box(mortar, x, y + 0.16, z, 0.025, 0.3, 0.025);
    }
  }
  const warehouseFront = face(kit, -7.15, -2.34, 0);
  door(warehouseFront, 0, 0.43, 1.15, 2.35, {
    leaf: 0x434b4c, frame: 0xd7d0bc, trim: 0x596568, handle: 0xc9ad72, double: true,
  });
  for (const x of [-8.85, -5.45]) kit.window(x, 1.95, -2.34, 0.6, 1.75);
  for (const side of [-1, 1]) {
    for (const z of [-6.25, -4.55, -3.0]) kit.window(-7.15 + side * 2.51, 1.95, z, 0.58, 1.7, side * Math.PI / 2);
  }
  for (const x of [-8.9, -5.4]) kit.window(x, 1.95, -7.06, 0.6, 1.7, Math.PI);

  // Shallow barrel-vault roof and solid curved gable ends.
  const radius = 2.58;
  const roof = new THREE.CylinderGeometry(radius, radius, 4.85, 32, 1, true, Math.PI / 2, Math.PI);
  roof.rotateX(Math.PI / 2);
  roof.scale(1, 0.48, 1);
  solid(roof, 0x7a8984, -7.15, 3.64, -4.7);
  const gable = new THREE.Shape();
  gable.moveTo(-radius, 0);
  for (let i = 0; i <= 32; i++) {
    const x = -radius + radius * 2 * i / 32;
    gable.lineTo(x, Math.sqrt(Math.max(0, radius * radius - x * x)) * 0.48);
  }
  gable.lineTo(radius, 0);
  gable.closePath();
  for (const z of [-7.14, -2.26]) {
    solid(new THREE.ShapeGeometry(gable), 0xaaa18d, -7.15, 3.64, z);
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 16;
      const b = (i + 1) * Math.PI / 16;
      beam(kit, 0xe1dcc8,
        [-7.15 + radius * Math.cos(a), 3.65 + radius * 0.48 * Math.sin(a), z],
        [-7.15 + radius * Math.cos(b), 3.65 + radius * 0.48 * Math.sin(b), z], 0.12);
    }
  }
  for (let i = 1; i < 12; i++) {
    const angle = i * Math.PI / 12;
    box(0x596c69, -7.15 + radius * Math.cos(angle), 3.65 + radius * 0.48 * Math.sin(angle), -4.7, 0.045, 0.045, 4.8);
  }

  // Separate timber pier runs from shore toward +z and ends in a wider platform.
  const deck = (x0: number, x1: number, z0: number, z1: number) => {
    box(wood, (x0 + x1) / 2, 0.22, (z0 + z1) / 2, x1 - x0, 0.32, z1 - z0);
    let row = 0;
    for (let z = z0 + 0.2; z < z1; z += 0.42) {
      box(plank[row % plank.length], (x0 + x1) / 2, 0.41, z, x1 - x0 - 0.08, 0.08, 0.39);
      for (const x of [x0 + 0.16, x1 - 0.16]) box(0x514132, x, 0.46, z, 0.045, 0.015, 0.045);
      row++;
    }
  };
  deck(1.0, 5.0, -7.2, 5.3);
  deck(-1.45, 7.45, 5.3, 7.75);
  for (const z of [-6.7, -4.4, -2.1, 0.2, 2.5, 4.8, 7.35]) {
    for (const x of [1.18, 4.82]) box(0x5d4532, x, -1.08, z, 0.28, 2.95, 0.28);
  }
  for (const x of [-1.25, 7.25]) {
    for (const z of [5.5, 7.5]) box(0x5d4532, x, -1.08, z, 0.28, 2.95, 0.28);
  }
  for (const z of [-5.7, -2.8, 0.1, 3.0]) {
    for (const x of [1.1, 4.9]) {
      box(0x6a4b33, x, 0.76, z, 0.22, 0.7, 0.22);
      box(0xb4986f, x, 1.13, z, 0.26, 0.08, 0.26);
    }
  }

  // Simple railings leave the centre of the landing open for cargo.
  for (const x of [-1.3, 7.3]) {
    for (const z of [5.45, 6.5, 7.6]) box(0x805a3b, x, 1.0, z, 0.15, 1.15, 0.15);
    box(0x956b45, x, 1.56, 6.5, 0.16, 0.12, 2.3);
  }
  for (const x of [-1.3, -0.2, 6.2, 7.3]) box(0x805a3b, x, 1.0, 7.6, 0.15, 1.15, 0.15);
  for (const x of [-0.75, 6.75]) box(0x956b45, x, 1.56, 7.6, 1.25, 0.12, 0.16);

  // Crates, covered bales, rope and cleats give the landing its working-dock character.
  for (const [x, z, size] of [[-0.8, 5.85, 0.8], [0.05, 5.85, 0.75], [6.45, 6.1, 0.75]]) {
    box(0x967047, x, 0.47 + size / 2, z, size, size, size);
    for (const dx of [-size * 0.34, size * 0.34]) box(0x624a32, x + dx, 0.47 + size / 2, z + size / 2 + 0.02, 0.05, size * 0.9, 0.04);
    box(0x624a32, x, 0.47 + size * 0.8, z + size / 2 + 0.02, size * 0.9, 0.05, 0.04);
  }
  for (const [x, z] of [[0.35, 6.85], [1.05, 6.8], [0.7, 6.15]]) {
    box(0x71898a, x, 0.72, z, 0.7, 0.5, 0.6);
    box(0x546a6b, x, 0.99, z, 0.12, 0.04, 0.62);
  }
  const rope = solid(new THREE.TorusGeometry(0.35, 0.05, 6, 24), 0xd2c6a1, 5.65, 0.49, 6.75);
  rope.rotation.x = Math.PI / 2;
  for (const x of [1.5, 4.5]) {
    box(0x474742, x, 0.52, 4.8, 0.12, 0.18, 0.12);
    box(0x474742, x, 0.63, 4.8, 0.45, 0.12, 0.13);
  }
}
