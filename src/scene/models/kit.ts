import * as THREE from "three";
import { buildingSurface, buildingTexture } from "../building-textures";

export function createKit(ghost: boolean) {
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
  const solid = (shape: THREE.BufferGeometry, color: number, x: number, y: number, z: number, map: THREE.Texture | null = null) => {
    const mesh = new THREE.Mesh(shape, new THREE.MeshStandardMaterial({
      color: ghost ? 0x8be4b0 : color, roughness: 0.85, side: THREE.DoubleSide,
      map: ghost ? null : map, transparent: ghost, opacity: ghost ? 0.6 : 1,
    }));
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };
  const finish = () => {
    for (const { material, matrices } of batches.values()) {
      const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
      matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    }
    return group;
  };
  return { group, ghost, box, gable, window, frontWindow, backWindow, leftWindow, porch, cottage, solid, finish };
}

export type Kit = ReturnType<typeof createKit>;
