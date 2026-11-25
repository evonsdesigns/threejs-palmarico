import * as THREE from "three";
import { buildingSurface, buildingTexture } from "./building-textures";

type InstanceBatch = {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
  matrices: THREE.Matrix4[];
};

export function createPalace(ghost = false): THREE.Group {
  const palace = new THREE.Group();
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const column = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
  const octagon = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
  const dome = new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const arcadeArch = new THREE.TorusGeometry(0.62, 0.075, 6, 16, Math.PI);
  const frond = new THREE.BufferGeometry();
  const frondVertices: number[] = [];
  const frondIndices: number[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const width = Math.sin(Math.PI * t) * 0.4;
    const y = Math.sin(Math.PI * t) * 0.2 - t * t * 1.15;
    frondVertices.push(-width, y, t * 2.8, 0, y + 0.12, t * 2.8, width, y, t * 2.8);
    if (i < 8) {
      const a = i * 3;
      frondIndices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
    }
  }
  frond.setAttribute("position", new THREE.Float32BufferAttribute(frondVertices, 3));
  frond.setIndex(frondIndices);
  frond.computeVertexNormals();
  const archShape = new THREE.Shape();
  archShape.moveTo(-0.5, 0);
  archShape.lineTo(-0.5, 1.5);
  archShape.absarc(0, 1.5, 0.5, Math.PI, 0, true);
  archShape.lineTo(0.5, 0);
  archShape.closePath();
  const arch = new THREE.ExtrudeGeometry(archShape, { depth: 0.08, bevelEnabled: false, curveSegments: 10 });
  const batches = new Map<string, InstanceBatch>();
  const transform = new THREE.Object3D();

  const add = (
    geometry: THREE.BufferGeometry, color: number,
    x: number, y: number, z: number, sx: number, sy: number, sz: number,
    rx = 0, ry = 0, rz = 0,
  ) => {
    const key = `${geometry.uuid}:${color}`;
    let batch = batches.get(key);
    if (!batch) {
      batch = {
        geometry,
        material: new THREE.MeshStandardMaterial({
          color: ghost ? 0x8be4b0 : color,
          roughness: 0.88,
          map: !ghost && buildingSurface(color) ? buildingTexture(buildingSurface(color)!) : null,
          side: geometry === frond ? THREE.DoubleSide : THREE.FrontSide,
          transparent: ghost,
          opacity: ghost ? 0.6 : 1,
        }),
        matrices: [],
      };
      batches.set(key, batch);
    }
    transform.position.set(x, y, z);
    transform.rotation.set(rx, ry, rz);
    transform.scale.set(sx, sy, sz);
    transform.updateMatrix();
    batch.matrices.push(transform.matrix.clone());
  };
  const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, rx = 0, ry = 0, rz = 0) =>
    add(cube, color, x, y, z, w, h, d, rx, ry, rz);
  const pillar = (x: number, y: number, z: number, height: number, radius = 0.2) => {
    add(column, 0xe9e3d3, x, y + height / 2, z, radius * 2, height, radius * 2);
    box(0xe9e3d3, x, y + 0.09, z, radius * 2.8, 0.18, radius * 2.8);
    box(0xf7f0df, x, y + height - 0.08, z, radius * 3, 0.16, radius * 3);
  };
  const window = (x: number, y: number, z: number, facing = 0, width = 0.95, height = 1.9) => {
    const outward = new THREE.Vector3(Math.sin(facing), 0, Math.cos(facing));
    add(arch, 0xf3eddd, x, y, z, width, height / 2, 1, 0, facing);
    add(arch, 0x4e5e59, x + outward.x * 0.09, y + 0.1, z + outward.z * 0.09, width * 0.76, height / 2 * 0.83, 1, 0, facing);
    box(0xdad1bd, x + outward.x * 0.19, y + 0.07, z + outward.z * 0.19, width * 1.15, 0.12, 0.23, 0, facing);
    box(0xc5c8b7, x + outward.x * 0.19, y + height * 0.42, z + outward.z * 0.19, 0.07, height * 0.66, 0.08, 0, facing);
    box(0xc5c8b7, x + outward.x * 0.19, y + height * 0.42, z + outward.z * 0.19, width * 0.7, 0.07, 0.08, 0, facing);
  };
  const railing = (x1: number, x2: number, z: number, y: number) => {
    box(0xeee7d7, (x1 + x2) / 2, y + 0.62, z, x2 - x1, 0.12, 0.16);
    box(0xd2c7af, (x1 + x2) / 2, y + 0.08, z, x2 - x1, 0.12, 0.18);
    for (let x = x1; x <= x2 + 0.01; x += 0.45) {
      box(0xe9e1d0, x, y + 0.34, z, 0.11, 0.5, 0.13);
    }
  };
  const tiledRoof = (x: number, z: number, width: number, depth: number, y: number, rise: number) => {
    const halfDepth = depth / 2;
    const slope = Math.atan2(rise, halfDepth);
    const length = Math.hypot(halfDepth, rise);
    for (const side of [-1, 1]) {
      box(0xa34e35, x, y + rise / 2, z + side * halfDepth / 2, width, 0.18, length, side * slope);
      for (let row = 0; row < 7; row++) {
        const t = (row + 0.5) / 7;
        const tileY = y + rise * (1 - t) + 0.12;
        const tileZ = z + side * halfDepth * t;
        box(row % 2 ? 0xbe6544 : 0xb85b3e, x, tileY, tileZ, width, 0.065, 0.075);
        for (let tile = -Math.floor(width / 0.55); tile <= Math.floor(width / 0.55); tile++) {
          box(0x873f2e, x + tile * 0.27, tileY + 0.015, tileZ, 0.025, 0.025, length / 7, side * slope);
        }
      }
    }
    box(0xc87851, x, y + rise + 0.1, z, width + 0.12, 0.18, 0.18);
  };

  const stone = 0xece7da;
  const trim = 0xf5efdf;
  const shadow = 0xc3b9a5;
  box(0xbab09b, 0, 0.3, 0, 20, 0.6, 14.5);
  box(stone, 0, 4.65, 0, 18.5, 8.1, 12);
  for (const y of [1, 4.6, 8.75]) {
    box(trim, 0, y, 0, 19, 0.24, 12.5);
    box(shadow, 0, y - 0.17, 0, 18.8, 0.1, 12.3);
  }
  box(0xc9c0ad, 0, 8.95, 0, 17.8, 0.18, 11.6);

  for (const x of [-6.4, -4.8, -3.2, -1.6, 1.6, 3.2, 4.8, 6.4]) {
    window(x, 1.5, 6.05, 0, 1.05, 2.3);
    window(x, 5.2, 6.05, 0, 0.95, 2.5);
  }
  for (const z of [-3.6, -1.8, 0, 1.8, 3.6]) {
    window(9.3, 1.5, z, Math.PI / 2, 1.05, 2.3);
    window(9.3, 5.2, z, Math.PI / 2, 0.95, 2.5);
  }
  for (const x of [-5.6, -2.4, 2.4, 5.6]) {
    box(trim, x, 6.7, 6.15, 0.18, 3.5, 0.22);
    box(trim, x, 4.75, 6.15, 0.32, 0.2, 0.35);
    box(trim, x, 8.45, 6.15, 0.32, 0.2, 0.35);
  }
  for (const z of [-2.7, 0.9, 4.5]) box(trim, 9.4, 6.7, z, 0.22, 3.5, 0.18);

  for (const [left, right] of [[-6.1, -1.9], [1.9, 6.1]]) {
    box(0xd7cfbe, (left + right) / 2, 4.7, 6.55, right - left + 0.4, 0.2, 1.2);
    box(0x45473c, (left + right) / 2, 5.45, 7.05, right - left, 0.1, 0.1);
    for (let x = left; x <= right; x += 0.3) box(0x45473c, x, 5.1, 7.05, 0.05, 0.7, 0.05);
  }
  for (const x of [-5.6, -4.3, -3, 3, 4.3, 5.6]) {
    add(arcadeArch, trim, x, 7.45, 6.55, 1, 1, 1);
    pillar(x - 0.62, 4.85, 6.55, 2.6, 0.09);
    pillar(x + 0.62, 4.85, 6.55, 2.6, 0.09);
  }

  add(arch, trim, 0, 0.9, 6.1, 2.5, 1.75, 1);
  add(arch, 0x59483a, 0, 1.02, 6.2, 1.95, 1.55, 1);
  box(trim, 0, 4.55, 6.4, 3.3, 0.35, 0.9);
  pillar(-1.35, 1, 6.5, 3.5, 0.22);
  pillar(1.35, 1, 6.5, 3.5, 0.22);
  for (let step = 0; step < 3; step++) {
    box(0xd7cfbe, 0, 0.2 + step * 0.22, 7.6 - step * 0.25, 4.3 - step * 0.2, 0.22, 1.4);
  }

  const towerZ = 5.15;
  add(octagon, stone, -7.1, 5.8, towerZ, 4.5, 10.2, 4.5, 0, Math.PI / 8);
  for (const y of [0.8, 4.6, 8.8, 10.9]) {
    add(octagon, trim, -7.1, y, towerZ, 4.8, 0.25, 4.8, 0, Math.PI / 8);
  }
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const x = -7.1 + Math.sin(angle) * 2.08;
    const z = towerZ + Math.cos(angle) * 2.08;
    window(x, 1.6, z, angle, 0.85, 2.1);
    window(x, 5.25, z, angle, 0.85, 2.3);
  }
  add(octagon, trim, -7.1, 11.15, towerZ, 4.9, 0.3, 4.9, 0, Math.PI / 8);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    pillar(-7.1 + Math.sin(angle) * 1.55, 11.3, towerZ + Math.cos(angle) * 1.55, 1.8, 0.14);
  }
  add(octagon, trim, -7.1, 13.2, towerZ, 4.2, 0.28, 4.2, 0, Math.PI / 8);
  add(dome, 0xa6553c, -7.1, 13.35, towerZ, 1.95, 1.65, 1.95);
  add(column, trim, -7.1, 15, towerZ, 0.28, 0.3, 0.28);

  const rightTowerX = 7.1;
  box(stone, rightTowerX, 5.75, towerZ, 4, 10.1, 4);
  for (const y of [0.8, 4.6, 8.8, 10.9]) box(trim, rightTowerX, y, towerZ, 4.3, 0.25, 4.3);
  for (const y of [1.6, 5.25]) {
    window(rightTowerX, y, towerZ + 2.05, 0, 1.1, 2.3);
    window(rightTowerX + 2.05, y, towerZ, Math.PI / 2, 1.1, 2.3);
  }
  for (const dx of [-1.25, 1.25]) {
    for (const z of [4, 6.3]) pillar(rightTowerX + dx, 11, z, 2.3, 0.16);
  }
  box(trim, rightTowerX, 13.4, towerZ, 4, 0.28, 4);
  add(column, trim, rightTowerX, 13.9, towerZ, 3.8, 0.8, 3.8);
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6;
    box(trim, rightTowerX + Math.cos(angle) * 1.8, 14.45, towerZ + Math.sin(angle) * 1.8, 0.45, 0.5, 0.45, 0, -angle);
  }
  add(dome, 0xb35e3f, rightTowerX, 14.3, towerZ, 1.15, 0.75, 1.15);

  tiledRoof(0, 3.4, 12.5, 3.6, 9.1, 0.85);
  railing(-5.4, 5.4, 6.25, 8.95);
  railing(-5.4, 5.4, -5.8, 8.95);
  box(stone, -6.8, 11.2, -3.8, 3.3, 4.5, 3.3);
  window(-6.8, 9.9, -2.1, 0, 1, 2);
  box(trim, -6.8, 13.5, -3.8, 3.6, 0.2, 3.6);
  tiledRoof(-6.8, -3.8, 3.9, 3.9, 13.6, 0.8);
  for (const x of [-3.6, 0, 3.6]) {
    pillar(x, 9.05, -2.6, 2.4, 0.16);
    pillar(x, 9.05, 0.9, 2.4, 0.16);
    box(trim, x, 11.55, -0.85, 0.19, 0.18, 4.3);
  }
  for (let z = -2.8; z <= 1.1; z += 0.55) box(trim, 0, 11.7, z, 7.8, 0.16, 0.14);

  for (const x of [-3.6, 3.6]) {
    box(0x687d49, x, 0.45, 7.65, 2.4, 0.3, 0.9);
    add(column, 0x806850, x, 3.1, 7.65, 0.48, 5.3, 0.48);
    for (let i = 0; i < 9; i++) {
      add(frond, i % 2 ? 0x3f7544 : 0x538449, x, 5.8, 7.65, 1, 1, 1, 0, i * Math.PI * 2 / 9);
    }
  }

  for (const batch of batches.values()) {
    const mesh = new THREE.InstancedMesh(batch.geometry, batch.material, batch.matrices.length);
    batch.matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    palace.add(mesh);
  }
  return palace;
}
