import * as THREE from "three";
import type { Kit } from "./kit";

export function buildFishermansWharf(kit: Kit) {
  const { box, solid } = kit;
  const createBoat = (x: number, z: number, yaw: number, hullColor: number, net = false) => {
    const place = (lx: number, lz: number) => [x + lx * Math.cos(yaw) + lz * Math.sin(yaw), z - lx * Math.sin(yaw) + lz * Math.cos(yaw)] as const;
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-1.38, 0);
    hullShape.lineTo(-1.0, 0.31);
    hullShape.lineTo(0.83, 0.27);
    hullShape.lineTo(1.38, 0);
    hullShape.lineTo(0.83, -0.27);
    hullShape.lineTo(-1.0, -0.31);
    hullShape.closePath();
    const hullGeometry = new THREE.ExtrudeGeometry(hullShape, { depth: 0.38, bevelEnabled: false });
    hullGeometry.rotateX(-Math.PI / 2);
    const boat = solid(hullGeometry, hullColor, x, -1.34, z);
    boat.rotation.y = yaw;
    const [dx, dz] = place(0, 0);
    box(0x503b2b, dx, -1.34, dz, 2.6, 0.12, 0.66, 0, yaw);
    box(0x765940, dx, -0.96, dz, 2.28, 0.06, 0.5, 0, yaw);
    for (const side of [-1, 1]) {
      const [rx, rz] = place(0, side * 0.32);
      box(0x6b5138, rx, -1.06, rz, 2.5, 0.12, 0.08, 0, yaw);
    }
    for (const lx of [-0.8, 0.1, 0.85]) {
      const [sx, sz] = place(lx, 0);
      box(0x94724c, sx, -0.89, sz, 0.12, 0.12, 0.5, 0, yaw);
    }
    const [seatX, seatZ] = place(-0.15, 0);
    box(0x72583d, seatX, -0.7, seatZ, 0.65, 0.08, 0.48, 0, yaw);
    const [mastX, mastZ] = place(0.55, 0);
    box(0x765a3c, mastX, -0.1, mastZ, 0.06, 1.7, 0.06);
    const [oarX, oarZ] = place(-0.2, 0.58);
    box(0x7d6040, oarX, -0.8, oarZ, 1.5, 0.05, 0.07, 0, yaw + 0.8);
    if (net) {
      const [nx, nz] = place(-0.78, 0);
      for (let i = 0; i < 5; i++) box(0x6f8475, nx + i * 0.1, -0.58 + (i % 2) * 0.1, nz + (i % 2) * 0.08, 0.08, 0.32, 0.08);
    }
    for (const side of [-1, 1]) {
      const [cleatX, cleatZ] = place(side * 1.08, 0.2);
      box(0x332f2a, cleatX, -1.0, cleatZ, 0.1, 0.08, 0.12);
    }
  };

  // Land occupies the rear half (z < 0); the front half is open sea below datum.
  box(0x777154, 0, 0.02, -3.0, 15.8, 0.04, 5.9);
  box(0x8f8268, 0, 0.055, -3.55, 8.8, 0.03, 4.7);
  for (let x = -7.7; x <= 7.7; x += 0.5) box(0x6f715f, x, 0.08, -0.68, 0.035, 0.02, 0.7);
  box(0x358e91, 0.2, -1.58, 3.0, 15.4, 0.04, 5.7);
  for (let i = 0; i < 22; i++) {
    const x = -7.4 + (i * 3.37) % 14.8;
    const z = 0.45 + (i * 1.17) % 4.8;
    box(i % 3 ? 0x47a5a3 : 0x68b4ae, x, -1.55 + (i % 2) * 0.035, z, 0.42, 0.015, 0.045, 0, (i % 4) * 0.25);
  }

  // Weathered fish shed on shore: raised floor, whitewashed plank walls, orange tile gable roof.
  box(0x705038, -0.2, 0.26, -3.6, 7.9, 0.5, 3.65);
  box(0xe4ddc8, -0.2, 1.88, -3.6, 7.4, 2.8, 3.3);
  box(0x8c7657, -0.2, 0.52, -1.92, 7.52, 0.3, 3.48);
  for (const x of [-3.8, -2.1, 1.7, 3.4]) {
    box(0x684d34, x, 0.84, -1.82, 0.14, 1.62, 0.14);
    box(0xe9e3d0, x, 1.9, -1.86, 0.12, 2.55, 0.1);
  }
  box(0x6b5138, -0.2, 3.4, -3.6, 7.75, 0.14, 3.6);
  box(0xb35131, -0.2, 4.12, -3.6, 8.0, 0.15, 1.92, -0.42);
  box(0xb85c37, -0.2, 4.12, -3.6, 8.0, 0.15, 1.92, 0.42);
  box(0x903d2b, -0.2, 4.88, -3.6, 8.1, 0.19, 0.18);
  for (let x = -4.05; x <= 3.8; x += 0.34) {
    box(x % 3 ? 0xc3764b : 0x933f2d, x, 4.14, -3.6, 0.06, 0.05, 2.05, -0.42);
    box(x % 2 ? 0xc3764b : 0x9a482f, x, 4.14, -3.6, 0.06, 0.05, 2.05, 0.42);
  }
  for (const x of [-2.75, 2.35]) kit.frontWindow(x, 2.25, -1.93, 1.0, 1.05);
  box(0x583f2c, 0, 1.42, -1.88, 1.3, 2.15, 0.1);
  box(0xcbb486, 0.42, 1.37, -1.81, 0.08, 0.08, 0.04);
  box(0xa74d33, -0.2, 2.95, -1.82, 1.85, 0.62, 0.12);
  box(0xe4d2a8, -0.2, 2.95, -1.74, 1.68, 0.44, 0.03);
  box(0x446450, -0.2, 2.93, -1.7, 1.1, 0.09, 0.025);
  // Gutting bench and hanging nets on the shore side of the shed.
  box(0x6a4c34, 2.9, 0.62, -1.05, 1.75, 0.14, 0.62);
  for (const x of [2.25, 3.55]) box(0x64482f, x, 0.3, -1.05, 0.1, 0.6, 0.1);
  for (let i = 0; i < 6; i++) box(0x78877c, 2.45 + i * 0.14, 1.5 + (i % 2) * 0.15, -1.4, 0.1, 0.72, 0.04, 0, (i % 2) * 0.12);
  for (let i = 0; i < 4; i++) box(0x5c6358, -3.25 + i * 0.16, 1.18 + (i % 2) * 0.12, -1.38, 0.06, 0.55, 0.04);

  // Long wooden pier and two side fingers reach from the beach out over water.
  box(0x5c4935, 0, 0.12, 2.45, 2.4, 0.24, 6.8);
  for (let z = -0.72; z <= 5.8; z += 0.48) {
    box(0x92724d, 0, 0.27, z, 2.38, 0.12, 0.42);
    for (const x of [-0.92, 0.92]) {
      box(0x6b5036, x, 0.14, z, 0.16, 0.08, 0.4);
      box(0x9a7952, x, 0.34, z, 0.08, 0.025, 0.42);
    }
  }
  for (const x of [-1.05, 1.05]) {
    box(0x513c2c, x, 0.06, 2.5, 0.2, 0.18, 6.8);
    for (let z = -0.5; z <= 5.8; z += 1.2) {
      box(0x60452f, x, -1.43, z, 0.2, 3.2, 0.2);
      box(0x816243, x, 0.56, z, 0.32, 0.16, 0.32);
      box(0x483a2d, x, 0.35, z, 0.24, 0.08, 0.24);
    }
    box(0x624a34, x, 0.28, 2.45, 0.1, 0.12, 6.6);
  }
  for (const x of [-5.15, 5.15]) {
    box(0x634b35, x, 0.12, 2.8, 1.75, 0.24, 4.25);
    for (const z of [1.0, 2.2, 3.4, 4.55]) {
      for (const sx of [-1, 1]) {
        const px = x + sx * 0.65;
        box(0x5c432e, px, -1.43, z, 0.16, 3.2, 0.16);
      }
      box(0x8a6a47, x, 0.28, z, 1.7, 0.12, 0.38);
    }
    for (const sx of [-0.65, 0.65]) box(0x5d462f, x + sx, 0.12, 2.8, 0.12, 0.1, 4.2);
  }
  // Mooring bollards, rope coils, lifebuoys and paired fish-cleaning stations.
  for (const [x, z] of [[-0.8, -0.25], [0.8, 5.8], [-5.75, 3.8], [5.75, 1.0]] as const) {
    box(0x4f412f, x, 0.53, z, 0.22, 0.62, 0.22);
    box(0x9b7951, x, 0.86, z, 0.34, 0.1, 0.34);
    const ring = solid(new THREE.TorusGeometry(0.3, 0.07, 5, 12), 0x7a5a3b, x + 0.34, 0.14, z - 0.18);
    ring.rotation.x = Math.PI / 2;
  }
  for (const x of [-1.0, 1.0]) {
    box(0xe2c968, x, 0.72, -0.48, 0.46, 0.48, 0.45);
    box(0x67523a, x, 0.98, -0.48, 0.48, 0.08, 0.48);
    for (const dx of [-0.12, 0.05, 0.16]) box(dx > 0 ? 0xd3c58a : 0x889b9c, x + dx, 1.1, -0.48, 0.12, 0.12, 0.12);
  }

  // Fish crates, ice boxes, lobster pots and net mending gear along both pier edges.
  const fishCrate = (x: number, z: number, fish: number) => {
    box(0x8a6541, x, 0.56, z, 0.72, 0.58, 0.72);
    box(0x755337, x, 0.86, z, 0.78, 0.07, 0.78);
    for (const side of [-1, 1]) {
      box(0xb18a5c, x + side * 0.32, 0.56, z, 0.06, 0.54, 0.75);
      box(0xb18a5c, x, 0.56, z + side * 0.32, 0.75, 0.54, 0.06);
    }
    for (let i = 0; i < 4; i++) box(fish, x - 0.23 + i * 0.15, 0.96 + (i % 2) * 0.07, z + (i % 2) * 0.08, 0.11, 0.1, 0.32, 0, -0.25 + i * 0.12);
  };
  fishCrate(-0.7, 1.0, 0xc5a34d);
  fishCrate(0.7, 3.15, 0x9aadb0);
  fishCrate(-0.72, 4.4, 0xc5a34d);
  for (const [x, z] of [[-1.6, 2.1], [1.6, 4.1], [-5.2, 4.7]] as const) {
    box(0x76583a, x, 0.5, z, 0.68, 0.48, 0.62);
    for (let y = 0.3; y < 0.8; y += 0.16) box(0x4d493d, x, y, z, 0.72, 0.035, 0.66);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0x9a7952, x + sx * 0.28, 0.5, z + sz * 0.26, 0.05, 0.55, 0.05);
  }
  box(0x826443, -1.6, 0.62, 4.85, 0.8, 0.18, 0.55);
  for (let x = -1.95; x <= -1.25; x += 0.1) box(0x7b927f, x, 1.0, 4.85, 0.035, 0.6, 0.05);
  // Two moored open fishing skiffs with oars, benches, fish basket and net load.
  createBoat(-3.3, 2.2, 0.34, 0x332f2b, true);
  createBoat(3.35, 4.15, -0.28, 0x514138, false);
  for (const [x, z, yaw] of [[-2.25, 0.6, 0.5], [2.25, 5.15, -0.3]] as const) {
    box(0x5d4530, x, 0.24, z, 0.1, 0.08, 0.7, 0, yaw);
    box(0x6f5136, x, 0.4, z, 0.55, 0.08, 0.55, 0, yaw);
  }
  // Landing ladder and net-drying frames at the very end of the pier.
  for (const x of [-0.62, 0.62]) box(0x8a7658, x, -0.82, 5.52, 0.08, 1.8, 0.08);
  for (const y of [-0.2, -0.55, -0.9, -1.25]) box(0x9a8766, 0, y, 5.52, 1.25, 0.06, 0.07);
  for (const x of [-6.25, -5.15]) box(0x75583b, x, 1.15, -0.55, 0.08, 2.3, 0.08);
  box(0x75583b, -5.7, 2.28, -0.55, 1.2, 0.08, 0.08);
  for (let i = 0; i < 7; i++) box(0x7f9580, -6.2 + i * 0.16, 1.25 + (i % 2) * 0.12, -0.5, 0.06, 1.95, 0.035);
}
