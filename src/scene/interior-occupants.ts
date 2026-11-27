import * as THREE from "three";
import { TENEMENT_DOORS, TENEMENT_FLOORS, tenementStairRoute } from "./models/tenement";

const MAX_CLIMBERS = 3;
const MAX_SILHOUETTES = 8;
const MAX_FIGURES = 96;
const MAX_SHADOWS = 640;
const FIGURE_SCALE = 1.25;
const WALK_SPEED = 1.5;

export interface WindowAnchor {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  width: number;
  height: number;
}

interface Climber {
  route: THREE.Vector3[];
  lengths: number[];
  distance: number;
  level: number;
  pause: number;
  stride: number;
  shirt: THREE.Color;
  skin: THREE.Color;
}

interface Silhouette {
  window: number;
  u: number;
  target: number;
  pause: number;
  fade: number;
  leaving: boolean;
}

interface Occupancy {
  model: THREE.Object3D;
  climbers: Climber[];
  silhouettes: Silhouette[];
}

/**
 * Splits the residents actually inside a building between stair climbers and window silhouettes.
 * The total never exceeds `inside`.
 */
export function allocateOccupants(inside: number, windows: number, stairs: boolean) {
  const people = Math.max(0, Math.floor(inside));
  const climbers = stairs ? Math.min(MAX_CLIMBERS, Math.ceil(people / 2)) : 0;
  const silhouettes = Math.min(people - climbers, windows, MAX_SILHOUETTES);
  return { climbers, silhouettes };
}

/** Finds the glowing window panes of a model, in the model's local space. */
export function findWindowAnchors(model: THREE.Object3D): WindowAnchor[] {
  model.updateWorldMatrix(true, true);
  const toLocal = model.matrixWorld.clone().invert();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const anchors: WindowAnchor[] = [];
  const center = model.userData.windowAnchorCenter instanceof THREE.Vector3
    ? model.userData.windowAnchorCenter : new THREE.Vector3();
  model.traverse((child) => {
    if (!(child instanceof THREE.InstancedMesh) || !(child.material as THREE.Material).userData?.nightLight) return;
    for (let i = 0; i < child.count; i++) {
      child.getMatrixAt(i, matrix);
      matrix.premultiply(child.matrixWorld).premultiply(toLocal).decompose(position, rotation, scale);
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation);
      if (scale.z > 0.1 || scale.x < 0.35 || scale.y < 0.45 || Math.abs(normal.y) > 0.1) continue;
      normal.y = 0;
      normal.normalize();
      if (normal.x * (position.x - center.x) + normal.z * (position.z - center.z) < 0) normal.negate();
      anchors.push({
        position: position.clone().addScaledVector(normal, scale.z / 2 + 0.006),
        normal, width: scale.x, height: scale.y,
      });
    }
  });
  return anchors;
}

/** Soft head-and-shoulders silhouette, generated without a canvas so it also works in tests. */
function silhouetteTexture() {
  const width = 64;
  const height = 96;
  const data = new Uint8Array(width * height * 4);
  const blob = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) =>
    THREE.MathUtils.smoothstep(1.12 - Math.hypot((x - cx) / rx, (y - cy) / ry), 0, 0.24);
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x = (px + 0.5) / width;
      const y = (py + 0.5) / height;
      const head = blob(x, y, 0.5, 0.74, 0.17, 0.15);
      const neck = blob(x, y, 0.5, 0.56, 0.09, 0.1);
      const shoulders = y < 0.5 ? blob(x, y, 0.5, 0.06, 0.48, 0.44) : 0;
      const alpha = Math.max(head, neck, shoulders);
      data.set([255, 255, 255, Math.round(alpha * 255)], (py * width + px) * 4);
    }
  }
  const texture = new THREE.DataTexture(data, width, height);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function figureParts() {
  const torso = new THREE.CylinderGeometry(0.27, 0.2, 0.66, 10);
  torso.scale(1, 1, 0.7).translate(0, 1.05, 0);
  const arms = [-1, 1].map((side) => new THREE.CylinderGeometry(0.09, 0.07, 0.58, 6).translate(side * 0.31, 1.02, 0));
  const body = mergeGeometries([torso, ...arms]);
  const head = mergeGeometries([
    new THREE.SphereGeometry(0.22, 10, 8).scale(0.9, 1.12, 0.9).translate(0, 1.58, 0),
    new THREE.CylinderGeometry(0.085, 0.1, 0.16, 8).translate(0, 1.4, 0),
  ]);
  const leg = mergeGeometries([
    new THREE.CylinderGeometry(0.1, 0.075, 0.58, 6).translate(0, -0.29, 0),
    new THREE.SphereGeometry(0.1, 6, 5).scale(1, 0.65, 1.5).translate(0, -0.61, 0.05),
  ]);
  return { body, head, leg };
}

function mergeGeometries(parts: THREE.BufferGeometry[]) {
  const positions: number[] = [];
  const normals: number[] = [];
  for (const part of parts) {
    const geometry = part.index ? part.toNonIndexed() : part;
    positions.push(...geometry.getAttribute("position").array);
    normals.push(...geometry.getAttribute("normal").array);
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  return merged;
}

const SHIRTS = [0xd6c285, 0x7197a0, 0xe4ddca, 0xa7644f, 0x818e71, 0xc2493f];
const SKINS = [0x6f4936, 0xa86d4d, 0xd49d70];

/**
 * Shows the residents who are inside buildings: tenement dwellers walking the galleries and stairs,
 * and shadows moving behind lit windows. Never shows more figures than people inside.
 */
export class InteriorOccupants {
  private readonly occupancy = new Map<number, Occupancy>();
  private readonly anchors = new WeakMap<THREE.Object3D, WindowAnchor[]>();
  private readonly shadowFade = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SHADOWS), 1);
  private readonly shadowMaterial = new THREE.ShaderMaterial({
    uniforms: { map: { value: silhouetteTexture() }, color: { value: new THREE.Color(0x24170e) }, opacity: { value: 0.3 } },
    vertexShader: `
      attribute float fade;
      varying vec2 vUv;
      varying float vFade;
      void main() {
        vUv = uv;
        vFade = fade;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D map;
      uniform vec3 color;
      uniform float opacity;
      varying vec2 vUv;
      varying float vFade;
      void main() {
        float alpha = texture2D(map, vUv).a * opacity * vFade;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(color, alpha);
      }`,
    transparent: true,
    depthWrite: false,
  });
  readonly shadows: THREE.InstancedMesh;
  readonly bodies: THREE.InstancedMesh;
  readonly heads: THREE.InstancedMesh;
  readonly legs: THREE.InstancedMesh;
  private readonly matrix = new THREE.Matrix4();
  private readonly local = new THREE.Matrix4();
  private readonly part = new THREE.Matrix4();
  private readonly quaternion = new THREE.Quaternion();
  private readonly position = new THREE.Vector3();
  private readonly scale = new THREE.Vector3();
  private readonly forward = new THREE.Vector3(0, 0, 1);
  private readonly up = new THREE.Vector3(0, 1, 0);

  constructor(scene: THREE.Scene) {
    const plane = new THREE.PlaneGeometry(1, 1);
    plane.setAttribute("fade", this.shadowFade);
    this.shadows = new THREE.InstancedMesh(plane, this.shadowMaterial, MAX_SHADOWS);
    const { body, head, leg } = figureParts();
    this.bodies = new THREE.InstancedMesh(body, new THREE.MeshStandardMaterial({ roughness: 0.9 }), MAX_FIGURES);
    this.heads = new THREE.InstancedMesh(head, new THREE.MeshStandardMaterial({ roughness: 0.8 }), MAX_FIGURES);
    this.legs = new THREE.InstancedMesh(leg, new THREE.MeshStandardMaterial({ color: 0x4d463a, roughness: 0.9 }), MAX_FIGURES * 2);
    for (const mesh of [this.shadows, this.bodies, this.heads, this.legs]) {
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);
    }
    this.shadows.renderOrder = 1;
    for (const mesh of [this.bodies, this.heads]) mesh.setColorAt(0, new THREE.Color(0xffffff));
  }

  /** Number of figures currently drawn for a building (stair walkers plus window shadows). */
  shown(index: number) {
    const occupancy = this.occupancy.get(index);
    if (!occupancy) return 0;
    return occupancy.climbers.filter((climber) => climber.pause <= 0).length
      + occupancy.silhouettes.filter((silhouette) => silhouette.fade > 0).length;
  }

  update(
    delta: number,
    inside: ReadonlyMap<number, number>,
    types: readonly { type: string }[],
    modelAt: (index: number) => THREE.Object3D | undefined,
    daylight: number,
  ) {
    for (const index of [...this.occupancy.keys()]) {
      if (!inside.get(index) || modelAt(index) !== this.occupancy.get(index)!.model) this.occupancy.delete(index);
    }
    let figures = 0;
    let shadows = 0;
    for (const [index, count] of inside) {
      const model = modelAt(index);
      if (!model || count <= 0) continue;
      let windows = this.anchors.get(model);
      if (!windows) {
        windows = findWindowAnchors(model);
        this.anchors.set(model, windows);
      }
      const stairs = types[index]?.type === "tenement";
      const wanted = allocateOccupants(count, windows.length, stairs);
      let occupancy = this.occupancy.get(index);
      if (!occupancy) {
        occupancy = { model, climbers: [], silhouettes: [] };
        this.occupancy.set(index, occupancy);
      }
      occupancy.climbers.length = Math.min(occupancy.climbers.length, wanted.climbers);
      while (occupancy.climbers.length < wanted.climbers) occupancy.climbers.push(this.createClimber(index * 7 + occupancy.climbers.length));
      occupancy.silhouettes.length = Math.min(occupancy.silhouettes.length, wanted.silhouettes);
      while (occupancy.silhouettes.length < wanted.silhouettes) {
        occupancy.silhouettes.push(this.createSilhouette(occupancy.silhouettes, windows.length));
      }
      model.updateWorldMatrix(true, false);
      for (const climber of occupancy.climbers) {
        this.moveClimber(climber, delta);
        if (climber.pause <= 0 && figures < MAX_FIGURES) this.drawClimber(climber, model.matrixWorld, figures++);
      }
      for (const silhouette of occupancy.silhouettes) {
        this.moveSilhouette(silhouette, occupancy.silhouettes, windows, delta);
        if (silhouette.fade > 0 && shadows < MAX_SHADOWS) this.drawSilhouette(silhouette, windows[silhouette.window], model.matrixWorld, shadows++);
      }
    }
    this.bodies.count = figures;
    this.heads.count = figures;
    this.legs.count = figures * 2;
    this.shadows.count = shadows;
    for (const mesh of [this.bodies, this.heads, this.legs, this.shadows]) mesh.instanceMatrix.needsUpdate = true;
    for (const mesh of [this.bodies, this.heads]) if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    this.shadowFade.needsUpdate = true;
    this.shadowMaterial.uniforms.opacity.value = 0.22 + 0.6 * (1 - daylight);
  }

  private createClimber(seed: number): Climber {
    const level = Math.floor(Math.random() * (TENEMENT_FLOORS - 1));
    const climber: Climber = {
      route: [], lengths: [], distance: 0, level, pause: 0, stride: Math.random() * 6,
      shirt: new THREE.Color(SHIRTS[seed % SHIRTS.length]), skin: new THREE.Color(SKINS[seed % SKINS.length]),
    };
    this.planRoute(climber, true);
    climber.distance = Math.random() * climber.lengths[climber.lengths.length - 1];
    return climber;
  }

  private planRoute(climber: Climber, up: boolean) {
    const from = climber.level;
    const to = up ? from + 1 : from - 1;
    const pick = (list: number[]) => list[Math.floor(Math.random() * list.length)];
    const fromX = pick(TENEMENT_DOORS[from]);
    const toX = pick(TENEMENT_DOORS[to]);
    const points = (up ? tenementStairRoute(from, fromX, toX) : tenementStairRoute(to, toX, fromX).reverse())
      .map(([x, y, z]) => new THREE.Vector3(x, y, z));
    climber.route = points;
    climber.lengths = [0];
    for (let i = 1; i < points.length; i++) climber.lengths.push(climber.lengths[i - 1] + points[i].distanceTo(points[i - 1]));
    climber.distance = 0;
    climber.level = to;
  }

  private moveClimber(climber: Climber, delta: number) {
    if (climber.pause > 0) {
      climber.pause -= delta;
      if (climber.pause <= 0) {
        const up = climber.level === 0 || (climber.level < TENEMENT_FLOORS - 1 && Math.random() < 0.5);
        this.planRoute(climber, up);
      }
      return;
    }
    climber.distance += WALK_SPEED * delta;
    climber.stride += WALK_SPEED * delta * 3.2;
    if (climber.distance >= climber.lengths[climber.lengths.length - 1]) climber.pause = 2 + Math.random() * 5;
  }

  private drawClimber(climber: Climber, world: THREE.Matrix4, slot: number) {
    const { route, lengths } = climber;
    const distance = Math.min(climber.distance, lengths[lengths.length - 1]);
    let segment = 1;
    while (segment < route.length - 1 && lengths[segment] < distance) segment++;
    const a = route[segment - 1];
    const b = route[segment];
    const span = lengths[segment] - lengths[segment - 1];
    const t = span > 0 ? (distance - lengths[segment - 1]) / span : 1;
    this.position.lerpVectors(a, b, t);
    this.quaternion.setFromAxisAngle(this.up, Math.atan2(b.x - a.x, b.z - a.z));
    this.scale.setScalar(FIGURE_SCALE);
    this.local.compose(this.position, this.quaternion, this.scale);
    this.matrix.multiplyMatrices(world, this.local);
    this.bodies.setMatrixAt(slot, this.matrix);
    this.heads.setMatrixAt(slot, this.matrix);
    this.bodies.setColorAt(slot, climber.shirt);
    this.heads.setColorAt(slot, climber.skin);
    for (const side of [0, 1]) {
      const swing = Math.sin(climber.stride) * 0.55 * (side ? -1 : 1);
      this.part.makeRotationX(swing).setPosition(side ? 0.12 : -0.12, 0.73, 0);
      this.legs.setMatrixAt(slot * 2 + side, this.part.premultiply(this.matrix));
    }
  }

  private createSilhouette(others: Silhouette[], windows: number): Silhouette {
    const free = Array.from({ length: windows }, (_, i) => i).filter((i) => !others.some((other) => other.window === i));
    const window = free.length ? free[Math.floor(Math.random() * free.length)] : Math.floor(Math.random() * windows);
    const u = Math.random() * 2 - 1;
    return { window, u, target: u, pause: Math.random() * 3, fade: 0, leaving: false };
  }

  private moveSilhouette(silhouette: Silhouette, others: Silhouette[], windows: WindowAnchor[], delta: number) {
    if (silhouette.leaving) {
      silhouette.fade = Math.max(0, silhouette.fade - delta * 1.5);
      if (silhouette.fade === 0) Object.assign(silhouette, this.createSilhouette(others.filter((other) => other !== silhouette), windows.length));
      return;
    }
    silhouette.fade = Math.min(1, silhouette.fade + delta * 1.5);
    if (silhouette.pause > 0) {
      silhouette.pause -= delta;
      if (silhouette.pause <= 0) {
        if (Math.random() < 0.3) silhouette.leaving = true;
        else silhouette.target = Math.random() * 2 - 1;
      }
      return;
    }
    const step = delta * 0.6;
    const gap = silhouette.target - silhouette.u;
    silhouette.u += Math.sign(gap) * Math.min(Math.abs(gap), step);
    if (Math.abs(gap) <= step) silhouette.pause = 1.5 + Math.random() * 4;
  }

  private drawSilhouette(silhouette: Silhouette, anchor: WindowAnchor, world: THREE.Matrix4, slot: number) {
    const height = Math.min(anchor.height * 0.92, 1.5);
    const width = Math.min(height * 0.72, anchor.width * 0.9);
    const travel = Math.max(0, (anchor.width - width) / 2);
    const tangentX = anchor.normal.z;
    const tangentZ = -anchor.normal.x;
    this.position.set(
      anchor.position.x + tangentX * silhouette.u * travel,
      anchor.position.y - anchor.height / 2 + height / 2,
      anchor.position.z + tangentZ * silhouette.u * travel,
    );
    this.quaternion.setFromUnitVectors(this.forward, anchor.normal);
    this.scale.set(width, height, 1);
    this.local.compose(this.position, this.quaternion, this.scale);
    this.shadows.setMatrixAt(slot, this.matrix.multiplyMatrices(world, this.local));
    this.shadowFade.setX(slot, silhouette.fade);
  }
}
