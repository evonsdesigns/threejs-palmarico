import * as THREE from "three";
import { buildingSurface, buildingTexture } from "./building-textures";

export type SettlementBuildingType =
  | "house" | "apartment" | "condominium" | "luxury-house"
  | "bunkhouse" | "country-house" | "bungalow" | "ranch"
  | "shack" | "farm" | "market" | "clinic";

export function createSettlementBuilding(type: SettlementBuildingType, ghost = false): THREE.Group {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const gableEnd = new THREE.BufferGeometry();
  gableEnd.setAttribute("position", new THREE.Float32BufferAttribute([
    0, 0, -0.5, 0, 0, 0.5, 0, 1, 0,
  ], 3));
  gableEnd.computeVertexNormals();
  const batches = new Map<number, { material: THREE.MeshStandardMaterial; matrices: THREE.Matrix4[] }>();
  const transform = new THREE.Object3D();
  const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, rx = 0, ry = 0) => {
    let batch = batches.get(color);
    if (!batch) {
      batch = {
        material: new THREE.MeshStandardMaterial({
          color: ghost ? 0x8be4b0 : color, roughness: 0.9,
          map: !ghost && buildingSurface(color) ? buildingTexture(buildingSurface(color)!) : null,
          transparent: ghost, opacity: ghost ? 0.6 : 1,
        }),
        matrices: [],
      };
      batches.set(color, batch);
    }
    transform.position.set(x, y, z);
    transform.rotation.set(rx, ry, 0);
    transform.scale.set(w, h, d);
    transform.updateMatrix();
    batch.matrices.push(transform.matrix.clone());
  };
  const gable = (x: number, z: number, width: number, depth: number, y: number, rise: number, color: number, seams: number) => {
    const half = depth / 2;
    const angle = Math.atan2(rise, half);
    const length = Math.hypot(half, rise);
    for (const side of [-1, 1]) {
      box(color, x, y + rise / 2, z + side * half / 2, width, 0.18, length, side * angle);
      for (let i = 1; i < seams; i++) {
        const t = i / seams;
        box(0x514f47, x, y + rise * (1 - t) + 0.12, z + side * half * t, width, 0.045, 0.035);
      }
      for (let dx = -width / 2 + 0.15; dx < width / 2; dx += 0.3) {
        box(0xb4a38c, x + dx, y + rise / 2 + 0.11, z + side * half / 2, 0.025, 0.025, length, side * angle);
      }
    }
    box(color, x, y + rise + 0.1, z, width + 0.1, 0.2, 0.18);
    const material = new THREE.MeshStandardMaterial({
      color: ghost ? 0x8be4b0 : color, roughness: 0.9, side: THREE.DoubleSide,
      map: !ghost && buildingSurface(color) ? buildingTexture(buildingSurface(color)!) : null,
      transparent: ghost, opacity: ghost ? 0.6 : 1,
    });
    for (const side of [-1, 1]) {
      const end = new THREE.Mesh(gableEnd, material);
      end.position.set(x + side * width / 2, y, z);
      end.scale.set(1, rise, depth);
      group.add(end);
    }
  };
  const window = (x: number, y: number, z: number, width = 1, height = 1.2, facing = 0) => {
    const ox = Math.sin(facing);
    const oz = Math.cos(facing);
    box(0x514a40, x, y, z, width + 0.3, height + 0.3, 0.08, 0, facing);
    box(0xe4ddca, x + ox * 0.05, y, z + oz * 0.05, width + 0.2, height + 0.2, 0.1, 0, facing);
    box(0x526e6b, x + ox * 0.12, y, z + oz * 0.12, width, height, 0.06, 0, facing);
    box(0xdcd6c7, x + ox * 0.16, y, z + oz * 0.16, 0.07, height, 0.04, 0, facing);
    box(0xdcd6c7, x + ox * 0.16, y, z + oz * 0.16, width, 0.07, 0.04, 0, facing);
    box(0xddd4bd, x + ox * 0.15, y - height / 2 - 0.12, z + oz * 0.15, width + 0.35, 0.12, 0.25, 0, facing);
  };
  const frontWindow = (x: number, y: number, z: number, width = 1, height = 1.2) => window(x, y, z, width, height);
  const backWindow = (x: number, y: number, z: number, width = 1, height = 1.2) => window(x, y, z, width, height, Math.PI);
  const leftWindow = (x: number, y: number, z: number, width = 1, height = 1.2) => window(x, y, z, width, height, -Math.PI / 2);
  const porch = (x: number, z: number, width: number, y: number, posts = 2) => {
    box(0xb9a382, x, y, z, width, 0.2, 1.25);
    for (let i = 0; i <= posts; i++) {
      const px = x - width / 2 + i * width / posts;
      box(0xe4dfca, px, y + 1.2, z + 0.55, 0.16, 2.4, 0.16);
    }
    box(0xe4dfca, x, y + 2.4, z + 0.55, width, 0.16, 0.18);
    for (const side of [-1, 1]) {
      box(0xd7cfba, x + side * width * 0.35, y + 0.8, z + 0.55, width * 0.3, 0.09, 0.1);
      for (let i = 0; i < 4; i++) {
        box(0xd7cfba, x + side * (width * 0.22 + i * width * 0.08), y + 0.45, z + 0.55, 0.07, 0.7, 0.07);
      }
    }
  };
  const cottage = (x: number, z: number, w: number, d: number, wall: number, roof: number, raised: boolean) => {
    const base = raised ? 0.9 : 0.3;
    if (raised) {
      for (const px of [x - w / 2 + 0.3, x + w / 2 - 0.3]) {
        for (const pz of [z - d / 2 + 0.3, z + d / 2 - 0.3]) box(0x766047, px, 0.45, pz, 0.3, 0.9, 0.3);
      }
    }
    box(0x766047, x, base, z, w + 0.25, 0.3, d + 0.25);
    box(wall, x, base + 1.65, z, w, 3.1, d);
    for (let y = base + 0.6; y < base + 3; y += 0.55) box(0xa6a58f, x, y, z + d / 2 + 0.03, w, 0.035, 0.04);
    gable(x, z, w + 0.55, d + 0.6, base + 3.3, 1.1, roof, 7);
    frontWindow(x - w * 0.29, base + 1.8, z + d / 2 + 0.08, 0.95, 1.2);
    frontWindow(x + w * 0.29, base + 1.8, z + d / 2 + 0.08, 0.95, 1.2);
    window(x + w / 2 + 0.06, base + 1.8, z - d * 0.2, 0.95, 1.2, Math.PI / 2);
    window(x + w / 2 + 0.06, base + 1.8, z + d * 0.18, 0.95, 1.2, Math.PI / 2);
    for (const dx of [-w * 0.27, w * 0.27]) backWindow(x + dx, base + 1.8, z - d / 2 - 0.08, 0.95, 1.2);
    for (const dz of [-d * 0.2, d * 0.18]) leftWindow(x - w / 2 - 0.06, base + 1.8, z + dz, 0.95, 1.2);
    for (const dx of [-w * 0.39, -w * 0.19, w * 0.19, w * 0.39]) {
      box(0x819188, x + dx, base + 1.8, z + d / 2 + 0.17, 0.22, 1.35, 0.08);
      for (let sy = -0.5; sy <= 0.5; sy += 0.2) box(0xd0ccb8, x + dx, base + 1.8 + sy, z + d / 2 + 0.22, 0.2, 0.035, 0.03);
    }
    box(0x604a39, x, base + 1.2, z + d / 2 + 0.08, 1, 2.4, 0.15);
    box(0xc9b16f, x + 0.32, base + 1.15, z + d / 2 + 0.19, 0.08, 0.08, 0.08);
    porch(x, z + d / 2 + 0.45, w * 0.65, base + 0.1);
    box(roof, x, base + 2.75, z + d / 2 + 0.5, w * 0.7, 0.16, 1.3, -0.15);
    box(0x88785f, x, base - 0.03, z + d / 2 + 0.95, 1.6, 0.15, 0.55);
    box(0xbbb19a, x + w * 0.35, base + 3.8, z - d * 0.2, 0.4, 1.15, 0.4);
  };

  if (type === "house") {
    cottage(0, 0, 6.4, 5.4, 0x537a9a, 0x755746, false);
    box(0xe4ddca, -2.85, 1.8, 2.8, 0.18, 3, 0.2);
    box(0xe4ddca, 2.85, 1.8, 2.8, 0.18, 3, 0.2);
    box(0x7d725b, 3.34, 1.1, 0, 0.35, 0.85, 0.5);
    box(0xc8bc9e, 3.35, 1.55, 0, 0.38, 0.1, 0.55);
  } else if (type === "country-house") {
    cottage(0, 0, 5.7, 5, 0xb9b8a2, 0x85867c, false);
    box(0x76845e, -2.35, 1.9, 2.58, 0.38, 2.6, 0.1);
    box(0x76845e, 2.35, 1.9, 2.58, 0.38, 2.6, 0.1);
    for (let x = -2.5; x <= 2.5; x += 0.5) box(0x878b77, x, 1.8, -2.55, 0.04, 2.8, 0.06);
    box(0x7d6b55, 2.5, 0.7, 2.9, 0.55, 1.1, 0.55);
    box(0x595c4e, 2.5, 1.3, 2.9, 0.58, 0.1, 0.58);
  } else if (type === "bungalow") {
    cottage(0, 0, 5, 4.6, 0x65a39b, 0xb06a42, true);
    box(0xcbb99a, 0, 0.35, 3.3, 1.7, 0.2, 0.65);
    for (const x of [-1.4, 1.4]) {
      box(0xeee0bf, x, 1.6, 3.3, 0.08, 1.35, 0.08);
      box(0xeee0bf, x, 2.15, 3.3, 0.75, 0.08, 0.08);
    }
  } else if (type === "bunkhouse") {
    box(0x85745b, 0, 0.25, 0, 14.2, 0.5, 5.8);
    box(0x668374, 0, 1.8, 0, 13.8, 2.7, 5.4);
    gable(0, 0, 14.5, 6, 3.25, 1.2, 0x737b77, 9);
    for (const x of [-5.2, -1.7, 1.7, 5.2]) {
      box(0x394d42, x, 1.35, 2.78, 1.15, 2.2, 0.1);
      frontWindow(x + 1.05, 2.1, 2.78, 0.7, 0.8);
      box(0xcbd0bf, x - 1.5, 1.8, 2.8, 0.13, 2.6, 0.12);
      box(0xcbd0bf, x, 0.2, 3.1, 1.5, 0.2, 0.5);
      box(0xcbd0bf, x, 2.55, 2.85, 1.35, 0.15, 0.2);
    }
    for (let y = 0.75; y <= 2.9; y += 0.32) box(0xb1b5a2, 0, y, 2.75, 13.6, 0.025, 0.025);
    for (const z of [-1.5, 0, 1.5]) {
      window(6.95, 1.9, z, 0.7, 0.9, Math.PI / 2);
      leftWindow(-6.95, 1.9, z, 0.7, 0.9);
    }
    for (const x of [-5.2, -1.7, 1.7, 5.2]) backWindow(x, 1.9, -2.78, 0.9, 1);
    box(0x646e69, -5.8, 4.3, -1.2, 0.28, 1.5, 0.28);
    box(0xb6b8a8, -5.8, 5.1, -1.2, 0.42, 0.12, 0.42);
  } else if (type === "apartment") {
    box(0xbab5a8, 0, 0.3, 0, 12, 0.6, 8);
    box(0xded8c0, 0, 5.1, 0, 11.6, 9, 7.6);
    for (const y of [0.8, 3.8, 6.8, 9.6]) box(0xa34b3e, 0, y, 0, 11.8, 0.22, 7.8);
    box(0x565c54, 0, 9.85, 0, 12, 0.35, 8);
    for (const y of [2.4, 5.4, 8.4]) {
      for (const x of [-4.3, -2.2, 0, 2.2, 4.3]) frontWindow(x, y, 3.87, 1, 1.5);
      box(0xe5dfcf, 0, y - 0.9, 4.15, 10.8, 0.16, 0.7);
      box(0x6a5148, 0, y - 0.35, 4.45, 10.8, 0.08, 0.08);
      for (let x = -5; x <= 5; x += 0.55) box(0x6a5148, x, y - 0.6, 4.45, 0.06, 0.5, 0.06);
    }
    box(0x6a5148, 0, 1.6, 3.99, 1.4, 2.6, 0.15);
    for (const y of [2.4, 5.4, 8.4]) {
      for (const z of [-2.4, -0.8, 0.8, 2.4]) {
        window(5.87, y, z, 0.85, 1.5, Math.PI / 2);
        leftWindow(-5.87, y, z, 0.85, 1.5);
      }
      for (const x of [-4.3, -2.2, 0, 2.2, 4.3]) backWindow(x, y, -3.87, 1, 1.5);
    }
    for (const x of [-5.7, 5.7]) box(0xa34b3e, x, 5.1, 3.95, 0.2, 8.8, 0.2);
    box(0x7d7e72, -3.2, 10.1, -1.6, 2.2, 0.35, 1.6);
    box(0xb8b8a8, -3.2, 10.45, -1.6, 1.1, 0.7, 0.8);
    box(0xb5b6a8, 3.1, 10.3, -1.7, 1.5, 0.7, 1);
    for (const x of [2.6, 3.1, 3.6]) box(0x6d736d, x, 10.68, -1.7, 0.08, 0.08, 0.9);
    box(0xd1c8b7, 0, 2.95, 4.35, 2, 0.2, 1);
  } else if (type === "condominium") {
    box(0xb5b3aa, 0, 0.3, 0, 13, 0.6, 9);
    for (const x of [-3.1, 3.1]) {
      box(0xa8b5b8, x, 4.1, 0, 6, 7, 8);
      gable(x, 0, 6.4, 8.4, 7.7, 2.2, 0x687a80, 9);
      for (const y of [2.1, 5, 7]) {
        for (const dx of [-1.8, 0, 1.8]) {
          frontWindow(x + dx, y, 4.08, 0.9, 1.3);
          backWindow(x + dx, y, -4.08, 0.9, 1.3);
        }
      }
      box(0xe4ded2, x, 3.45, 4.28, 5.8, 0.18, 0.55);
      box(0xe4ded2, x, 6.35, 4.28, 5.8, 0.18, 0.55);
      for (const y of [3.85, 6.75]) {
        box(0xe5e1d3, x, y, 4.56, 5.8, 0.1, 0.1);
        for (let dx = -2.6; dx <= 2.6; dx += 0.4) box(0xe5e1d3, x + dx, y - 0.2, 4.56, 0.07, 0.4, 0.07);
      }
      box(0xd8d6ca, x - 1.8, 8.95, -2, 0.55, 1.7, 0.55);
      box(0xb1a99a, x - 1.8, 9.85, -2, 0.7, 0.15, 0.7);
    }
    for (const y of [2.1, 5, 7]) for (const z of [-2.5, 0, 2.5]) {
      window(6.17, y, z, 0.9, 1.3, Math.PI / 2);
      leftWindow(-6.17, y, z, 0.9, 1.3);
    }
    porch(0, 4.25, 4, 0.8);
    box(0x707c7c, 0, 3.35, 4.3, 4.4, 0.2, 1.2);
    box(0xb4a98f, 0, 0.4, 4.9, 2.2, 0.25, 0.8);
  } else if (type === "luxury-house") {
    box(0xc8bea3, 0, 0.35, 0, 12.6, 0.7, 8.6);
    box(0xe2d3a9, 0, 3.9, 0, 11.8, 6.4, 7.8);
    for (const y of [0.8, 4, 7.15]) box(0xf0e7ce, 0, y, 0, 12, 0.22, 8);
    box(0x484e47, 0, 7.45, 0, 12.2, 0.4, 8.2);
    for (const y of [2.4, 5.6]) {
      for (const x of [-4.4, -2.2, 0, 2.2, 4.4]) {
        frontWindow(x, y, 3.98, 1, 1.6);
        backWindow(x, y, -3.98, 1, 1.6);
      }
    }
    porch(0, 4.25, 10.6, 0.9, 4);
    porch(0, 4.25, 10.6, 4.1, 4);
    box(0xf0e7ce, 0, 6.65, 4.25, 11, 0.22, 1.5);
    box(0x6c5144, 0, 2.1, 4.1, 1.3, 2.4, 0.15);
    for (const y of [2.4, 5.6]) for (const z of [-2.5, 0, 2.5]) {
      window(5.97, y, z, 1, 1.6, Math.PI / 2);
      leftWindow(-5.97, y, z, 1, 1.6);
    }
    for (const z of [-3.8, 3.8]) box(0xf0e7ce, 0, 7.8, z, 12, 0.65, 0.18);
    for (const x of [-5.9, 5.9]) box(0xf0e7ce, x, 7.8, 0, 0.18, 0.65, 7.6);
    box(0x90968a, 3, 7.8, -1, 1.5, 0.35, 1);
    for (let x = -4.8; x <= 4.8; x += 0.4) box(0xe2d6be, x, 4.55, 4.87, 0.07, 0.8, 0.07);
    box(0xe2d6be, 0, 4.95, 4.87, 10, 0.1, 0.12);
  } else if (type === "ranch") {
    box(0x756345, 0, 0.18, 0, 12.5, 0.36, 12.5);
    box(0x9a8967, 0, 1.9, -1.8, 7.8, 3.4, 5.8);
    for (let x = -3.5; x <= 3.5; x += 0.55) box(0x776a51, x, 1.9, 1.12, 0.04, 3.3, 0.06);
    gable(0, -1.8, 8.4, 6.4, 3.65, 1.5, 0x6b6b58, 8);
    box(0x4e493c, 0, 1.4, 1.18, 2.2, 2.6, 0.12);
    for (const x of [-5.8, 5.8]) {
      for (let z = 2; z <= 6; z += 1.4) box(0xc3ac7f, x, 0.8, z, 0.16, 1.6, 0.16);
      for (const y of [0.55, 1.1]) box(0xc3ac7f, x, y, 4, 0.12, 0.12, 4.2);
    }
    for (let x = -5.8; x <= 5.8; x += 1.45) box(0xc3ac7f, x, 0.8, 6, 0.16, 1.6, 0.16);
    for (const y of [0.55, 1.1]) box(0xc3ac7f, 0, y, 6, 11.8, 0.12, 0.12);
    box(0xc6a45e, -4.4, 0.55, 4.3, 1.3, 0.9, 1.1);
    box(0xb59150, -4.4, 1.35, 4.3, 1.1, 0.7, 0.9);
    for (const x of [-2.5, 2.5]) frontWindow(x, 2.2, 1.18, 0.9, 1);
    for (const z of [-3.5, -1.8, 0]) {
      window(3.96, 2.1, z, 0.9, 1, Math.PI / 2);
      leftWindow(-3.96, 2.1, z, 0.9, 1);
    }
    for (const x of [-2.5, 2.5]) backWindow(x, 2.2, -4.78, 0.9, 1);
    box(0x65533b, 4.5, 0.42, 3.8, 1.8, 0.55, 0.8);
    box(0x87938b, 4.5, 0.7, 3.8, 1.55, 0.1, 0.55);
    for (const x of [3.8, 5.2]) for (const z of [-4.6, -3.4]) box(0xa29172, x, 1.6, z, 0.15, 3.2, 0.15);
    box(0x7d8175, 4.5, 3.3, -4, 2, 0.3, 1.6);
    box(0x9ca49a, 4.5, 4, -4, 1.6, 1.2, 1.2);
    box(0x7a8178, 4.5, 4.7, -4, 1.8, 0.15, 1.4);
  } else if (type === "shack") {
    box(0x6a5946, 0, 0.18, 0, 5.2, 0.35, 4.2);
    box(0x7d6b55, 0, 1.55, 0, 4.8, 2.5, 3.8);
    for (let x = -2.2; x <= 2.2; x += 0.4) box(x % 0.8 < 0.4 ? 0x8e7b60 : 0x75634e, x, 1.55, 1.92, 0.36, 2.4, 0.06);
    gable(0, 0, 5.3, 4.3, 2.85, 0.7, 0x858079, 9);
    box(0x705b4a, -1.3, 1.25, 2, 0.85, 2.1, 0.12);
    frontWindow(1, 1.65, 2.02, 0.8, 0.8);
    window(2.42, 1.6, -0.5, 0.75, 0.8, Math.PI / 2);
    backWindow(-0.8, 1.65, -1.98, 0.8, 0.8);
    leftWindow(-2.42, 1.6, 0.5, 0.75, 0.8);
    box(0x9b947f, 1.5, 3.25, 0.8, 1.5, 0.08, 1.2, -0.3);
    box(0xa28c6d, -0.2, 0.35, 2.17, 1.4, 0.2, 0.35);
    box(0x555d52, 2.35, 0.45, 1.65, 0.45, 0.75, 0.45);
  } else if (type === "farm") {
    box(0x72583b, 0, 0.12, 0, 9.2, 0.24, 9.2);
    for (let x = -4; x <= 4; x += 1) {
      box(0x8c704a, x, 0.27, 0.4, 0.7, 0.14, 8);
      for (let z = -3; z <= 4; z += 0.65) {
        if (x < -0.5 && z < -1) continue;
        const height = 0.35 + ((Math.round(x * 7 + z * 10) % 4 + 4) % 4) * 0.07;
        box(0x547b38, x, 0.35 + height / 2, z, 0.13, height, 0.13);
        box(0x83a44c, x, 0.48 + height / 2, z, 0.55, 0.12, 0.22);
        box(0x6e963f, x, 0.55 + height / 2, z, 0.2, 0.12, 0.5);
      }
    }
    box(0x9a8967, -2.2, 1.55, -2.4, 3.8, 2.8, 3.2);
    gable(-2.2, -2.4, 4.1, 3.5, 3.05, 0.8, 0xa6573b, 7);
    box(0x594a38, -2.2, 1.2, -0.75, 1.1, 2, 0.1);
    frontWindow(-3.3, 1.8, -0.72, 0.65, 0.8);
    backWindow(-2.2, 1.8, -4.08, 0.65, 0.8);
    leftWindow(-4.13, 1.8, -2.4, 0.65, 0.8);
    window(-0.27, 1.8, -2.4, 0.65, 0.8, Math.PI / 2);
    box(0xb9a57b, -0.4, 0.45, -3.8, 0.7, 0.7, 0.6);
    box(0x858079, -0.4, 0.85, -3.8, 0.75, 0.1, 0.65);
  } else if (type === "market") {
    box(0xb0a38b, 0, 0.25, 0, 6.4, 0.5, 6.1);
    box(0xe7bd70, 0, 2, -0.25, 6, 3.2, 5.4);
    gable(0, -0.25, 6.3, 5.8, 3.65, 0.9, 0xa6573b, 8);
    for (const x of [-2, 2]) {
      frontWindow(x, 2.1, 2.55, 1.1, 1.25);
      backWindow(x, 2.1, -3.05, 1.1, 1.25);
    }
    for (const z of [-1.5, 0, 1.5]) {
      window(3.05, 2.1, z, 0.8, 1.2, Math.PI / 2);
      leftWindow(-3.05, 2.1, z, 0.8, 1.2);
    }
    box(0x604a39, 0, 1.45, 2.55, 1.1, 2.3, 0.12);
    for (let i = 0; i < 6; i++) {
      box(i % 2 ? 0xc98e69 : 0xeee2ca, -2.5 + i, 3.15, 2.95, 1, 0.12, 0.8, -0.15);
    }
    for (const x of [-2.5, 2.5]) {
      box(0x8c6b4d, x, 0.7, 2.8, 0.9, 0.7, 0.55);
      box(0x7eaa59, x, 1.08, 2.8, 0.75, 0.12, 0.45);
      for (const dx of [-0.25, 0, 0.25]) box(0xd7b65b, x + dx, 1.2, 2.8, 0.16, 0.18, 0.16);
    }
  } else {
    box(0xb4b5aa, 0, 0.25, 0, 6.4, 0.5, 6);
    box(0xece3cd, 0, 2.35, -0.1, 6, 4.1, 5.5);
    for (const y of [0.55, 4.45]) box(0xf0ebdc, 0, y, -0.1, 6.2, 0.18, 5.7);
    gable(0, -0.1, 6.3, 5.8, 4.6, 0.85, 0x737b77, 8);
    for (const x of [-2, 2]) {
      frontWindow(x, 2.25, 2.72, 1.1, 1.5);
      backWindow(x, 2.25, -2.92, 1.1, 1.5);
    }
    for (const z of [-1.5, 0, 1.5]) {
      window(3.05, 2.3, z, 0.8, 1.4, Math.PI / 2);
      leftWindow(-3.05, 2.3, z, 0.8, 1.4);
    }
    box(0x687a72, 0, 1.55, 2.72, 1.2, 2.4, 0.15);
    box(0xeee9dc, 0, 3.3, 2.95, 2.2, 0.35, 0.7);
    for (const x of [-0.95, 0.95]) box(0xf0ebdc, x, 1.9, 3.05, 0.16, 2.6, 0.16);
    box(0xc34d42, 0, 4, 2.8, 1.1, 0.24, 0.12);
    box(0xc34d42, 0, 4, 2.8, 0.24, 1.1, 0.12);
    box(0xa4a69b, 2.15, 4.8, -1, 0.8, 0.4, 0.8);
  }

  for (const { material, matrices } of batches.values()) {
    const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);
  }
  return group;
}
