import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, face, door, wallLamp } from "./services-parts";

function cannon(kit: Kit, x: number, z: number, direction: "north" | "south" | "east" | "west") {
  const { box, solid } = kit;
  const alongZ = direction === "north" || direction === "south";
  const sign = direction === "north" || direction === "east" ? 1 : -1;
  box(0x655441, x, 4.55, z, 1.05, 0.18, 0.75);
  for (const side of [-1, 1]) {
    const wx = x + (alongZ ? side * 0.5 : 0);
    const wz = z + (alongZ ? 0 : side * 0.5);
    const wheel = solid(new THREE.CylinderGeometry(0.34, 0.34, 0.13, 10), 0x393a35, wx, 4.55, wz);
    wheel.rotation.z = Math.PI / 2;
    box(0x9a8b6a, wx, 4.55, wz, 0.08, 0.08, 0.08);
  }
  const barrel = solid(new THREE.CylinderGeometry(0.22, 0.31, 1.55, 10), 0x45473f, x, 5.05, z);
  if (alongZ) barrel.rotation.x = sign * Math.PI / 2;
  else barrel.rotation.z = -sign * Math.PI / 2;
  const muzzle = solid(new THREE.CylinderGeometry(0.3, 0.3, 0.16, 10), 0x30332f, x + (alongZ ? 0 : sign * 0.8), 5.05, z + (alongZ ? sign * 0.8 : 0));
  if (alongZ) muzzle.rotation.x = sign * Math.PI / 2;
  else muzzle.rotation.z = -sign * Math.PI / 2;
  for (const side of [-1, 1]) box(0x4c4436, x + (alongZ ? side * 0.42 : 0), 5.04, z + (alongZ ? 0 : side * 0.42), 0.06, 0.7, 0.06);
}

export function buildColonialFort(kit: Kit) {
  const { box, solid, window: addWindow } = kit;
  const stone = 0xcbbd94;
  const lightStone = 0xe0d1a5;
  const mortar = 0xb5a780;

  box(0x787858, 0, 0.03, 0, 15.8, 0.06, 15.8);
  box(0x9c947a, 0, 0.1, 0, 15.2, 0.08, 15.2);
  for (let x = -7.3; x <= 7.3; x += 0.55) box(0x8e876f, x, 0.15, 0, 0.025, 0.015, 14.6);
  for (let z = -7.3; z <= 7.3; z += 0.55) box(0x8e876f, 0, 0.15, z, 14.6, 0.015, 0.025);
  for (const [x, z] of [[-6.1, -6.1], [6.1, -6.1], [-6.1, 6.1], [6.1, 6.1]] as const) {
    box(0xb9ac8a, x, 0.18, z, 2.6, 0.14, 2.6);
    box(0xd0c29e, x, 0.28, z, 1.7, 0.12, 1.7);
  }

  const sideWall = (x: number, z: number, w: number, d: number) => {
    box(0x8e8162, x, 1.02, z, w + 0.25, 2.0, d + 0.25);
    box(stone, x, 2.85, z, w, 2.05, d);
    box(lightStone, x, 3.95, z, w + 0.18, 0.18, d + 0.18);
    box(0x81785f, x, 4.15, z, w + 0.28, 0.18, d + 0.28);
    box(lightStone, x, 4.3, z, w + 0.36, 0.14, d + 0.36);
  };
  sideWall(0, -6.55, 13.1, 0.95);
  sideWall(-6.55, 0, 0.95, 13.1);
  sideWall(6.55, 0, 0.95, 13.1);
  box(0x8e8162, -4.05, 1.02, 6.55, 4.95, 2.0, 0.95);
  box(0x8e8162, 4.05, 1.02, 6.55, 4.95, 2.0, 0.95);
  box(stone, -4.05, 2.85, 6.55, 4.7, 2.05, 0.95);
  box(stone, 4.05, 2.85, 6.55, 4.7, 2.05, 0.95);
  box(0xe0d1a5, 0, 4.03, 6.55, 3.7, 0.5, 1.0);
  box(0x8f8262, 0, 3.55, 6.55, 3.7, 0.55, 1.04);
  box(lightStone, 0, 4.22, 6.55, 4.2, 0.18, 1.18);
  box(stone, 0, 4.48, 6.55, 4.25, 0.42, 1.25);

  for (const x of [-6.55, 6.55]) {
    for (let z = -5.8; z <= 5.81; z += 0.7) {
      box(0xa99a76, x, 1.18, z, 1.04, 0.28, 0.96);
      box(0xd2c29c, x, 2.88, z, 1.02, 0.22, 0.92);
      box(0xa39470, x, 4.35, z, 0.62, 0.7, 0.63);
    }
  }
  for (const x of [-5.8, -4.6, -3.4, -2.2, 2.2, 3.4, 4.6, 5.8]) {
    for (const z of [-6.55, 6.55]) {
      box(0xa99a76, x, 1.18, z, 1.08, 0.28, 0.92);
      box(0xd2c29c, x, 2.88, z, 1.06, 0.22, 0.92);
    }
  }
  for (const z of [-5.8, -4.6, -3.4, -2.2, 2.2, 3.4, 4.6, 5.8]) {
    for (const x of [-6.55, 6.55]) box(0xe1d2aa, x, 4.85, z, 0.75, 0.78, 0.74);
  }
  for (const x of [-5.8, -4.6, -3.4, -2.2, 2.2, 3.4, 4.6, 5.8]) {
    box(0xe1d2aa, x, 4.85, 6.55, 0.74, 0.78, 0.74);
    box(0xe1d2aa, x, 4.85, -6.55, 0.74, 0.78, 0.74);
  }

  for (const faceZ of [-7.05, 7.05]) {
    for (let x = -5.9; x <= 5.9; x += 0.56) {
      if (faceZ > 0 && Math.abs(x) < 2.0) continue;
      for (let row = 0; row < 5; row++) {
        const y = 0.62 + row * 0.72 + (Math.round((x + 8) * 2) % 2) * 0.34;
        if (y > 3.9) continue;
        box((Math.floor(x * 3 + row) % 4 === 0) ? lightStone : mortar, x, y, faceZ, 0.46, 0.44, 0.045);
      }
    }
  }
  for (const faceX of [-7.05, 7.05]) {
    for (let z = -5.9; z <= 5.9; z += 0.56) {
      for (let row = 0; row < 5; row++) {
        const y = 0.62 + row * 0.72 + (Math.round((z + 8) * 2) % 2) * 0.34;
        if (y > 3.9) continue;
        box((Math.floor(z * 3 + row) % 4 === 0) ? lightStone : mortar, faceX, y, z, 0.045, 0.44, 0.46);
      }
    }
  }
  for (const x of [-6.55, 6.55]) {
    for (const z of [-6.55, 6.55]) {
      const bastion = solid(new THREE.CylinderGeometry(1.05, 1.24, 2.15, 10), 0xb2a47f, x, 2.9, z);
      bastion.material.roughness = 1;
      solid(new THREE.CylinderGeometry(1.32, 1.32, 0.22, 10), lightStone, x, 4.05, z);
      solid(new THREE.CylinderGeometry(0.95, 0.98, 1.85, 12), 0xc7b68d, x, 5.15, z);
      solid(new THREE.CylinderGeometry(1.14, 1.14, 0.16, 12), 0xe0d1a5, x, 6.12, z);
      const dome = new THREE.SphereGeometry(1.12, 12, 7, 0, Math.PI * 2, 0, Math.PI / 2);
      solid(dome, 0xcab17c, x, 6.22, z);
      solid(new THREE.CylinderGeometry(0.12, 0.12, 0.38, 8), 0x7d6949, x, 7.34, z);
      for (const [dx, dz, yaw] of [[0, 1.0, 0], [1.0, 0, Math.PI / 2], [0, -1.0, Math.PI], [-1.0, 0, -Math.PI / 2]] as const) {
        box(0x574b36, x + dx, 5.18, z + dz, 0.12, 0.62, 0.1, 0, yaw);
        box(0x766648, x + dx * 0.68, 5.1, z + dz * 0.68, 0.28, 0.11, 0.28);
      }
    }
  }
  for (const [x, z, rx] of [[-5.3, 5.95, 0], [5.3, 5.95, 0], [-5.95, -2.3, Math.PI / 2], [5.95, 2.3, Math.PI / 2], [-5.95, 2.3, Math.PI / 2], [5.95, -2.3, Math.PI / 2]] as const) {
    box(0x8d7c5e, x, 4.65, z, 1.28, 0.24, 1.0);
    cannon(kit, x, z, rx === 0 ? "north" : (x < 0 ? "west" : "east"));
  }
  for (const x of [-1.05, 1.05]) {
    box(0x514330, x, 1.7, 7.08, 0.18, 2.8, 0.15);
    for (let y = 0.5; y < 3.1; y += 0.28) box(0x785738, x, y, 7.17, 0.13, 0.06, 0.05);
  }
  box(0x352f26, 0, 1.85, 7.13, 2.1, 2.85, 0.12);
  box(0x5d4931, 0, 1.82, 7.22, 1.9, 2.7, 0.1);
  for (const x of [-0.48, 0.48]) {
    box(0x765638, x, 1.8, 7.3, 0.88, 2.6, 0.08);
    for (const y of [0.75, 1.55, 2.45]) box(0x4f3d2c, x, y, 7.36, 0.72, 0.08, 0.04);
    box(0xa88755, x + (x < 0 ? 0.32 : -0.32), 1.85, 7.4, 0.06, 0.28, 0.06);
  }
  box(0xd4c59c, 0, 3.45, 7.03, 3.3, 0.24, 0.4);
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * i / 8;
    const x = Math.cos(a) * 1.75;
    const y = 1.62 + Math.sin(a) * 1.75;
    box(i === 4 ? 0xe0d1a5 : 0xb8a77e, x, y, 7.18, 0.62, 0.55, 0.3, 0, a - Math.PI / 2);
  }
  for (let y = 0.75; y <= 3.05; y += 0.48) {
    for (const x of [-5.9, -4.7, -3.5, 3.5, 4.7, 5.9]) box(0xdbcda5, x, y, 7.05, 0.12, 0.1, 0.08);
  }

  for (let x = -5.55; x <= 5.55; x += 1.35) {
    if (Math.abs(x) < 2.3) continue;
    box(0xddd0a8, x, 2.2, -5.92, 0.45, 2.5, 0.18);
    box(0xb7a67d, x, 3.62, -5.92, 0.72, 0.18, 0.4);
    for (const [dx, y] of [[-0.65, 2.8], [-0.2, 3.4], [0.25, 3.4], [0.7, 2.8]] as const) {
      beam(kit, 0xd8c9a0, [x + dx, y, -5.9], [x + dx * 0.72, 3.0, -5.9], 0.12);
    }
  }
  for (const side of [-1, 1]) {
    for (let z = -5.55; z <= 5.55; z += 1.35) {
      box(0xddd0a8, side * 5.92, 2.2, z, 0.18, 2.5, 0.45);
      box(0xb7a67d, side * 5.92, 3.62, z, 0.4, 0.18, 0.72);
      for (const dz of [-0.65, -0.2, 0.25, 0.7]) beam(kit, 0xd8c9a0, [side * 5.9, 2.8, z + dz], [side * 5.9, 3.0, z + dz * 0.72], 0.12);
    }
  }

  box(0xb3a47e, 0, 0.19, -0.25, 6.4, 0.3, 5.4);
  box(0x887a5e, 0, 0.4, -0.25, 6.1, 0.16, 5.1);
  box(0xe1d2aa, 0, 2.05, -0.4, 5.6, 3.2, 4.6);
  box(0xf0e3c2, 0, 0.66, 1.95, 5.7, 0.28, 0.18);
  box(0xc9ae7b, 0, 3.68, -0.4, 5.9, 0.2, 4.9);
  box(0xc49a61, 0, 3.82, -0.4, 5.6, 0.14, 4.5);
  box(0xb88a54, 0, 4.16, -0.4, 5.9, 0.5, 4.9);
  box(0x9e663f, 0, 4.45, -0.4, 6.1, 0.15, 5.05);
  for (let x = -2.8; x <= 2.8; x += 0.3) box(0x8f5637, x, 4.52, -0.4, 0.035, 0.03, 4.95);
  box(0x795b3b, 0, 4.78, -0.4, 0.18, 0.36, 0.18);
  const museumFront = face(kit, 0, 1.92, 0);
  door(museumFront, 0, 0.68, 1.25, 2.5, { leaf: 0x46618a, frame: 0xe8dfc7, trim: 0x394f70, handle: 0xd2b568, double: true, glazed: true, glass: 0x78a4a8 });
  for (const x of [-2.0, 2.0]) {
    addWindow(x, 2.35, 2.1, 0.85, 1.15, 0);
    box(0x416b91, x, 2.35, 2.23, 0.16, 1.35, 0.08);
    for (const side of [-1, 1]) box(0x4e77a0, x + side * 0.53, 2.35, 2.23, 0.16, 1.38, 0.08);
  }
  wallLamp(museumFront, -1.2, 2.85, 0xf2d88c);
  wallLamp(museumFront, 1.2, 2.85, 0xf2d88c);
  for (const x of [-2.8, 2.8]) {
    box(0x9b865e, x, 2.0, 1.9, 0.18, 3.0, 0.18);
    box(0xe5d6b1, x, 3.55, 1.9, 0.42, 0.18, 0.42);
  }
  box(0x6a6d60, 0, 5.25, -0.4, 0.12, 1.2, 0.12);
  box(0x6a6d60, 0, 5.83, -0.4, 0.08, 0.08, 0.08);
  box(0x8e2f2c, 0.48, 5.57, -0.4, 0.9, 0.56, 0.04);
  box(0xf0d990, 0.48, 5.57, -0.375, 0.3, 0.56, 0.02);
  box(0x314d79, 0.48, 5.57, -0.35, 0.3, 0.56, 0.02);

  for (const x of [-4.2, 4.2]) {
    box(0x8d835f, x, 0.43, 3.65, 1.2, 0.72, 1.2);
    solid(new THREE.CylinderGeometry(0.56, 0.48, 0.92, 10), 0xb3a17a, x, 1.18, 3.65);
    box(0xc8b589, x, 1.72, 3.65, 1.28, 0.16, 1.28);
    solid(new THREE.SphereGeometry(0.68, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xc6b17d, x, 1.8, 3.65);
    box(0x574b35, x, 1.25, 4.16, 0.14, 0.42, 0.08);
  }
  for (const [x, z] of [[-3.7, -4.4], [3.7, -4.4], [-4.3, 3.1], [4.3, 3.1]] as const) {
    box(0x887754, x, 0.32, z, 0.75, 0.54, 0.75);
    solid(new THREE.ConeGeometry(0.55, 1.0, 8), 0x548047, x, 1.0, z);
  }
  for (const x of [-3.1, 3.1]) {
    box(0x70553a, x, 0.58, 5.0, 1.05, 0.12, 0.35);
    for (const z of [4.72, 5.28]) box(0x55452f, x, 0.32, z, 0.08, 0.52, 0.08);
    box(0x70553a, x, 0.85, 4.82, 1.05, 0.08, 0.08);
  }
  box(0xddd0ad, 0, 0.13, 4.2, 3.4, 0.12, 1.2);
  for (let x = -1.4; x < 1.5; x += 0.3) box(0xb9ab8a, x, 0.2, 4.2, 0.035, 0.02, 1.1);
}
