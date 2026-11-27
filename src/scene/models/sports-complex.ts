import * as THREE from "three";
import { createKit, type Kit } from "./kit";
import { beam, face, wallLamp, type Face } from "./services-parts";
import { sign } from "./tourism-a-parts";

const WALL = 0xe7bd70;
const BRICK = 0x965b43;
const BLUE = 0x408a9c;
const TRIM = 0xd5cc96;
const ROOF = 0x343b3c;

function arch(kit: Kit, F: Face, lat: number, base: number, width: number, height: number) {
  const radius = width / 2;
  const spring = height - radius;
  const shape = new THREE.Shape();
  shape.moveTo(-radius, 0);
  shape.lineTo(radius, 0);
  shape.lineTo(radius, spring);
  shape.absarc(0, spring, radius, 0, Math.PI, false);
  shape.closePath();
  const [x, z] = F.at(lat, 0.045);
  const panel = kit.solid(new THREE.ShapeGeometry(shape, 16), 0x285864, x, base, z);
  panel.rotation.y = F.f;
  for (const side of [-1, 1]) F.put(BLUE, lat + side * (radius + 0.045), base + spring / 2, 0.08, 0.1, spring, 0.12);
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 16;
    const b = (i + 1) * Math.PI / 16;
    const p = F.at(lat + Math.cos(a) * (radius + 0.045), 0.08);
    const q = F.at(lat + Math.cos(b) * (radius + 0.045), 0.08);
    beam(kit, BLUE, [p[0], base + spring + Math.sin(a) * (radius + 0.045), p[1]],
      [q[0], base + spring + Math.sin(b) * (radius + 0.045), q[1]], 0.1);
  }
  F.put(TRIM, lat, base + 0.035, 0.09, width + 0.2, 0.07, 0.22);
  F.put(0xb6bda1, lat, base + spring * 0.52, 0.09, 0.045, spring, 0.04);
  const [gx, gz] = F.at(lat, 0.07);
  kit.litBox(0x5e8585, gx, base + spring * 0.65, gz, width * 0.63, spring * 0.42, 0.025, 0, F.f);
}

export function buildSportsComplex(siteKit: Kit) {
  const kit = createKit(siteKit.ghost);
  const { box, solid } = kit;
  box(0xa6a08b, 0, 0.08, 0, 19.7, 0.16, 15.7);
  box(0xbdb6a0, 0, 0.19, 0, 19.25, 0.08, 15.25);

  const perimeter = (radius: number, straight: number) => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 32;
      points.push(new THREE.Vector2(straight + Math.cos(a) * radius, Math.sin(a) * radius));
    }
    for (let i = 1; i < 24; i++) points.push(new THREE.Vector2(straight - i * straight * 2 / 24, radius));
    for (let i = 0; i <= 32; i++) {
      const a = Math.PI / 2 + i * Math.PI / 32;
      points.push(new THREE.Vector2(-straight + Math.cos(a) * radius, Math.sin(a) * radius));
    }
    for (let i = 1; i < 24; i++) points.push(new THREE.Vector2(-straight + i * straight * 2 / 24, -radius));
    return points;
  };
  const shell = (profile: [number, number][], color: number, tiled = false) => {
    const rings = profile.map(([radius, y]) => perimeter(radius, 3.05).map((p) => new THREE.Vector3(p.x, y, p.y)));
    const vertices: number[] = [];
    const uv: number[] = [];
    for (let row = 1; row < rings.length; row++) {
      const a = rings[row - 1];
      const b = rings[row];
      for (let i = 0; i < a.length; i++) {
        const n = (i + 1) % a.length;
        for (const p of [a[i], b[i], b[n], a[i], b[n], a[n]]) {
          vertices.push(p.x, p.y, p.z);
          uv.push(p.x / 3, (p.z + p.y) / 3);
        }
        if (tiled) {
          beam(kit, row % 2 ? 0x4a4b46 : 0x252e2d,
            [b[i].x, b[i].y + 0.018, b[i].z], [b[n].x, b[n].y + 0.018, b[n].z], 0.022);
          if (i % 3 === row % 3) beam(kit, 0x4d504a,
            [a[i].x, a[i].y + 0.025, a[i].z], [b[i].x, b[i].y + 0.025, b[i].z], 0.016);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.computeVertexNormals();
    solid(geometry, color, 0, 0, 0);
  };
  shell([[5.55, 0.25], [5.55, 3.1]], WALL);
  shell([[5.59, 0.3], [5.59, 0.64]], BRICK);
  shell([[5.65, 2.85], [5.65, 3.15]], BRICK);
  shell([[5.73, 3.16], [5.73, 3.28]], BLUE);
  const lowerRoof: [number, number][] = [];
  for (let i = 0; i <= 17; i++) {
    const t = i / 17;
    lowerRoof.push([5.78 - 2.72 * (1 - Math.cos(t * Math.PI / 2)), 3.3 + 3.1 * Math.sin(t * Math.PI / 2)]);
  }
  shell(lowerRoof, ROOF, true);
  shell([[3.09, 6.38], [3.09, 7.16]], BRICK);
  shell([[3.18, 6.35], [3.18, 6.5]], BLUE);
  shell([[3.18, 7.1], [3.18, 7.23]], TRIM);
  const upperRoof: [number, number][] = [];
  for (let i = 0; i <= 15; i++) {
    const t = i / 15;
    upperRoof.push([3.25 * Math.cos(t * Math.PI / 2), 7.25 + 1.65 * Math.sin(t * Math.PI / 2)]);
  }
  shell(upperRoof, ROOF, true);
  box(0x7d9690, 0, 8.94, 0, 6.25, 0.075, 0.1);

  const wallPoints = perimeter(5.58, 3.05);
  for (let i = 0; i < wallPoints.length; i += 4) {
    const p = wallPoints[i];
    const previous = wallPoints[(i + wallPoints.length - 1) % wallPoints.length];
    const next = wallPoints[(i + 1) % wallPoints.length];
    const normal = new THREE.Vector2(next.y - previous.y, previous.x - next.x).normalize();
    const F = face(kit, p.x, p.y, Math.atan2(normal.x, normal.y));
    arch(kit, F, 0, 0.35, 0.58, 2.1);
    F.put(BRICK, -0.5, 1.58, 0.02, 0.18, 2.4, 0.15);
    F.put(TRIM, -0.5, 2.78, 0.04, 0.28, 0.16, 0.2);
  }
  const upperPoints = perimeter(3.12, 3.05);
  for (let i = 0; i < upperPoints.length; i += 4) {
    const p = upperPoints[i];
    const previous = upperPoints[(i + upperPoints.length - 1) % upperPoints.length];
    const next = upperPoints[(i + 1) % upperPoints.length];
    const normal = new THREE.Vector2(next.y - previous.y, previous.x - next.x).normalize();
    const F = face(kit, p.x, p.y, Math.atan2(normal.x, normal.y));
    F.win(0, 6.82, 0.38, 0.35);
    F.put(BLUE, -0.3, 6.8, 0.08, 0.1, 0.57, 0.08);
  }

  for (const x of [-6.6, 6.6]) for (const z of [-4.7, 4.7]) {
    box(BRICK, x, 0.38, z, 2.45, 0.35, 2.45);
    box(WALL, x, 3.0, z, 1.95, 5.2, 1.95);
    for (const dx of [-0.88, 0.88]) for (const dz of [-0.88, 0.88]) {
      box(BRICK, x + dx, 3.05, z + dz, 0.2, 5.25, 0.2);
    }
    for (const facing of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      const F = face(kit, x + Math.sin(facing) * 0.99, z + Math.cos(facing) * 0.99, facing);
      arch(kit, F, 0, 0.44, 0.84, 2.05);
      arch(kit, F, 0, 3.45, 0.58, 1.3);
    }
    for (const [y, width, color] of [[3.02, 2.15, TRIM], [5.55, 2.2, BRICK], [5.8, 2.65, BRICK], [5.96, 2.5, TRIM]]) {
      box(color, x, y, z, width, 0.14, width);
    }
    box(0x635e4c, x, 6.02, z, 2.15, 0.06, 2.15);
    for (const side of [-1, 1]) {
      for (let t = -0.96; t <= 0.97; t += 0.24) {
        box(BLUE, x + t, 6.32, z + side * 0.99, 0.055, 0.55, 0.055);
        box(BLUE, x + side * 0.99, 6.32, z + t, 0.055, 0.55, 0.055);
      }
      box(TRIM, x, 6.61, z + side * 1.01, 2.22, 0.08, 0.08);
      box(TRIM, x + side * 1.01, 6.61, z, 0.08, 0.08, 2.22);
      for (const other of [-1, 1]) {
        box(BLUE, x + side * 1.02, 6.5, z + other * 1.02, 0.13, 0.98, 0.13);
        solid(new THREE.ConeGeometry(0.13, 0.35, 8), BLUE, x + side * 1.02, 7.13, z + other * 1.02);
      }
    }
  }

  const arena = kit.finish();
  arena.rotation.y = -Math.PI / 2;
  arena.scale.x = 1.2;
  siteKit.group.add(arena);

  const front = face(siteKit, 0, 10.4, 0);
  sign(siteKit, "DEPORTES", 0, 2.6, 10.57, 0.085, 0x305b65, TRIM);
  for (const x of [-2.4, 2.4]) {
    wallLamp(front, x, 2.32);
    siteKit.box(0xb7af97, x, 0.22, 10.95, 1.1, 0.22, 1.35);
  }
  for (const x of [-3.5, 0, 3.5]) {
    siteKit.box(0xc9c4ae, x, 0.21, 11.45, 0.65, 0.18, 0.65);
    siteKit.solid(new THREE.CylinderGeometry(0.11, 0.16, 1.14, 10), 0xbec5b6, x, 0.86, 11.45);
    siteKit.solid(new THREE.SphereGeometry(0.18, 12, 8), 0xd1d2bd, x, 1.5, 11.45);
  }
}
