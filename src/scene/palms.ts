import * as THREE from "three";

export type TreeKind = "palm" | "fan-palm" | "broadleaf" | "tall-broadleaf";
export type TreePosition = { x: number; y: number; z: number; seed: number; kind: TreeKind };

function trunkGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();
  const sides = 8;
  const segments = 9;
  const vertex = (x: number, y: number, z: number, shade: number) => {
    positions.push(x, y, z);
    color.setHex(shade);
    colors.push(color.r, color.g, color.b);
  };
  for (let i = 0; i < segments; i++) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;
    for (let j = 0; j < sides; j++) {
      const a = j * Math.PI * 2 / sides;
      const b = (j + 1) * Math.PI * 2 / sides;
      const point = (t: number, angle: number, shade: number) => {
        const radius = 0.4 - 0.2 * t;
        vertex(0.65 * t * t + Math.cos(angle) * radius, 7.2 * t, Math.sin(angle) * radius, shade);
      };
      const shade = (i + j) % 3 === 0 ? 0x7d694d : 0x998365;
      point(t0, a, shade); point(t1, b, shade); point(t1, a, shade);
      point(t0, a, shade); point(t0, b, shade); point(t1, b, shade);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function canopyGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();
  const triangle = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, shade: number) => {
    color.setHex(shade);
    for (const point of [a, b, c]) {
      positions.push(point.x, point.y, point.z);
      colors.push(color.r, color.g, color.b);
    }
  };
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI * 2 / 12;
    const direction = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
    const side = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
    const length = i % 2 === 0 ? 3.5 : 2.9;
    const spine = (t: number) => new THREE.Vector3(0.65, 7.2, 0)
      .addScaledVector(direction, length * t)
      .add(new THREE.Vector3(0, 0.65 * Math.sin(Math.PI * t) - 1.5 * t * t + (i % 2) * 0.18 * t, 0));
    const shade = i % 3 === 0 ? 0x496a2c : i % 3 === 1 ? 0x627d35 : 0x526f2c;
    for (let j = 0; j < 11; j++) {
      const t = 0.08 + j * 0.08;
      const next = Math.min(t + 0.1, 1);
      const root = spine(t);
      const nextRoot = spine(next);
      const width = 0.75 * Math.pow(Math.sin(Math.PI * t), 0.7);
      for (const sign of [-1, 1]) {
        const tip = spine(Math.min(t + 0.14, 1))
          .addScaledVector(side, width * sign)
          .add(new THREE.Vector3(0, -0.18 - width * 0.4, 0));
        triangle(root, nextRoot, tip, (i + j) % 4 === 0 ? 0x3f6028 : shade);
      }
    }
    const base = spine(0);
    const tip = spine(1);
    const middle = spine(0.5);
    triangle(base, middle.clone().addScaledVector(side, 0.055), middle.clone().addScaledVector(side, -0.055), shade);
    triangle(middle.clone().addScaledVector(side, 0.055), tip, middle.clone().addScaledVector(side, -0.055), shade);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function fanCanopyGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();
  for (let leaf = 0; leaf < 9; leaf++) {
    const angle = leaf * Math.PI * 2 / 9;
    const direction = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
    const side = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
    const base = new THREE.Vector3(0.65, 7.2, 0);
    const fanBase = base.clone().addScaledVector(direction, 0.85)
      .add(new THREE.Vector3(0, 0.45 + (leaf % 3) * 0.16, 0));
    color.setHex(leaf % 3 === 0 ? 0x3f632d : leaf % 3 === 1 ? 0x627d38 : 0x4f702e);
    for (const point of [base, fanBase.clone().addScaledVector(side, -0.035), fanBase.clone().addScaledVector(side, 0.035)]) {
      positions.push(point.x, point.y, point.z);
      colors.push(color.r, color.g, color.b);
    }
    for (let blade = -3; blade <= 3; blade++) {
      const spread = blade * 0.22;
      const axis = direction.clone().addScaledVector(side, spread).normalize();
      const middle = fanBase.clone().addScaledVector(axis, 0.8).add(new THREE.Vector3(0, -0.1, 0));
      const tip = fanBase.clone().addScaledVector(axis, 1.75 - Math.abs(blade) * 0.12)
        .add(new THREE.Vector3(0, -1.25 - Math.abs(blade) * 0.09, 0));
      const width = 0.08 + (3 - Math.abs(blade)) * 0.015;
      const left = middle.clone().addScaledVector(side, -width);
      const right = middle.clone().addScaledVector(side, width);
      for (const point of [fanBase, left, right, left, tip, right]) {
        positions.push(point.x, point.y, point.z);
        colors.push(color.r, color.g, color.b);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function broadleafGeometry(tall: boolean) {
  const positions: number[] = [];
  const colors: number[] = [];
  let seed = tall ? 6187 : 1579;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const vertex = (point: THREE.Vector3, color: THREE.Color) => {
    positions.push(point.x, point.y, point.z);
    colors.push(color.r, color.g, color.b);
  };
  const add = (geometry: THREE.BufferGeometry, color: number) => {
    const flat = geometry.index ? geometry.toNonIndexed() : geometry;
    const vertices = flat.getAttribute("position");
    const shade = new THREE.Color(color);
    for (let i = 0; i < vertices.count; i++) {
      positions.push(vertices.getX(i), vertices.getY(i), vertices.getZ(i));
      colors.push(shade.r, shade.g, shade.b);
    }
    if (flat !== geometry) flat.dispose();
    geometry.dispose();
  };
  const height = tall ? 7.4 : 4.7;
  const trunk = new THREE.CylinderGeometry(0.16, 0.34, height, 10, 4);
  trunk.translate(0, height / 2, 0);
  add(trunk, tall ? 0x85745a : 0x75634d);
  const crown: THREE.Vector3[] = [new THREE.Vector3(0, height + 1, 0)];
  for (let i = 0; i < 7; i++) {
    const angle = i * Math.PI * 2 / 7 + 0.2;
    const start = new THREE.Vector3(0, height - 1.45 + random() * 0.45, 0);
    const end = new THREE.Vector3(Math.cos(angle) * (1.55 + random() * 0.5), height + 0.1 + random() * 0.9, Math.sin(angle) * (1.55 + random() * 0.5));
    const branch = new THREE.CylinderGeometry(0.055, 0.16, start.distanceTo(end), 7);
    branch.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize()));
    branch.translate((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2);
    add(branch, 0x776a51);
    crown.push(end);
  }
  const shades = tall ? [0x34592f, 0x416b36, 0x507b3b, 0x5d8343] : [0x3f632f, 0x4d7134, 0x628444, 0x6a8b48];
  for (const cluster of crown) {
    for (let i = 0; i < 42; i++) {
      const azimuth = random() * Math.PI * 2;
      const distance = Math.sqrt(random()) * 1.15;
      const center = cluster.clone().add(new THREE.Vector3(Math.cos(azimuth) * distance, (random() - 0.5) * 2.1, Math.sin(azimuth) * distance));
      const angle = random() * Math.PI * 2;
      const length = (tall ? 0.72 : 0.62) * (0.8 + random() * 0.6);
      const width = length * (0.32 + random() * 0.12);
      const along = new THREE.Vector3(Math.cos(angle), (random() - 0.5) * 0.7, Math.sin(angle)).normalize();
      const across = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
      const stem = center.clone().addScaledVector(along, -length * 0.5);
      const tip = center.clone().addScaledVector(along, length * 0.5).add(new THREE.Vector3(0, -0.1, 0));
      const left = center.clone().addScaledVector(across, -width);
      const right = center.clone().addScaledVector(across, width);
      const ridge = center.clone().add(new THREE.Vector3(0, 0.12, 0));
      const shade = new THREE.Color(shades[Math.floor(random() * shades.length)]);
      for (const point of [stem, left, ridge, left, tip, ridge, tip, right, ridge, right, stem, ridge]) vertex(point, shade);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function treeKindForTerrain(terrain: string, value: number): TreeKind {
  if (terrain === "sand") return value < 0.8 ? "palm" : "fan-palm";
  if (terrain === "jungle") return value < 0.35 ? "palm" : value < 0.55 ? "fan-palm" : value < 0.85 ? "broadleaf" : "tall-broadleaf";
  return value < 0.3 ? "palm" : value < 0.45 ? "fan-palm" : value < 0.85 ? "broadleaf" : "tall-broadleaf";
}

export function createTreeGrove(positions: TreePosition[]) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 1 });
  const slots: { meshes: THREE.InstancedMesh[]; index: number }[] = [];
  const kinds: TreeKind[] = ["palm", "fan-palm", "broadleaf", "tall-broadleaf"];
  const transform = new THREE.Object3D();
  for (const kind of kinds) {
    const entries = positions.map((position, index) => ({ position, index })).filter(({ position }) => position.kind === kind);
    if (!entries.length) continue;
    const geometries = kind === "palm" ? [trunkGeometry(), canopyGeometry()]
      : kind === "fan-palm" ? [trunkGeometry(), fanCanopyGeometry()]
      : [broadleafGeometry(kind === "tall-broadleaf")];
    const meshes = geometries.map((geometry) => {
      const mesh = new THREE.InstancedMesh(geometry, material, entries.length);
      mesh.castShadow = true;
      group.add(mesh);
      return mesh;
    });
    entries.forEach(({ position, index }, instance) => {
      transform.position.set(position.x, position.y, position.z);
      transform.rotation.y = position.seed * Math.PI * 2;
      const scale = 0.85 + position.seed * 0.3;
      transform.scale.set(scale, scale, scale);
      transform.updateMatrix();
      meshes.forEach((mesh) => mesh.setMatrixAt(instance, transform.matrix));
      slots[index] = { meshes, index: instance };
    });
    meshes.forEach((mesh) => { mesh.instanceMatrix.needsUpdate = true; });
  }
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  return {
    group,
    remove(index: number) {
      const slot = slots[index];
      if (!slot) throw new Error("Cannot remove a missing tree.");
      slot.meshes.forEach((mesh) => {
        mesh.setMatrixAt(slot.index, hidden);
        mesh.instanceMatrix.needsUpdate = true;
      });
    },
  };
}
