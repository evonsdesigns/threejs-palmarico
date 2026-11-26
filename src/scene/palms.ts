import * as THREE from "three";

type PalmPosition = { x: number; y: number; z: number; seed: number };

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

export function createPalmGrove(positions: PalmPosition[]) {
  const grove = new THREE.Group();
  const trunk = new THREE.InstancedMesh(trunkGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), positions.length);
  const canopy = new THREE.InstancedMesh(canopyGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 1 }), positions.length);
  trunk.castShadow = true;
  canopy.castShadow = true;
  const transform = new THREE.Object3D();
  positions.forEach(({ x, y, z, seed }, index) => {
    transform.position.set(x, y, z);
    transform.rotation.y = seed * Math.PI * 2;
    const scale = 0.85 + seed * 0.3;
    transform.scale.set(scale, scale, scale);
    transform.updateMatrix();
    trunk.setMatrixAt(index, transform.matrix);
    canopy.setMatrixAt(index, transform.matrix);
  });
  trunk.instanceMatrix.needsUpdate = true;
  canopy.instanceMatrix.needsUpdate = true;
  grove.add(trunk, canopy);
  return grove;
}
