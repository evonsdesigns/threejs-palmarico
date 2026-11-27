import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, door, type Face } from "./services-parts";

export function cross(kit: Kit, x: number, y: number, z: number, height: number, color = 0xb18a43, depth = 0.14) {
  kit.box(color, x, y, z, depth, height, depth);
  kit.box(color, x, y + height * 0.2, z, height * 0.58, depth, depth);
}

export function arch(F: Face, lat: number, spring: number, radius: number, out: number, color: number, thickness = 0.14) {
  const segments = 10;
  for (let i = 0; i < segments; i++) {
    const a = Math.PI * i / segments;
    const b = Math.PI * (i + 1) / segments;
    const p0 = F.at(lat + Math.cos(a) * radius, out);
    const p1 = F.at(lat + Math.cos(b) * radius, out);
    beam(F.kit, color, [p0[0], spring + Math.sin(a) * radius, p0[1]], [p1[0], spring + Math.sin(b) * radius, p1[1]], thickness);
  }
}

export function archedDoor(F: Face, lat: number, y0: number, width: number, height: number, color: number, trim: number) {
  const spring = y0 + height;
  door(F, lat, y0, width, height, { leaf: color, frame: trim, trim, double: true, glazed: true, glass: 0x637b7c });
  arch(F, lat, spring, width / 2 + 0.2, 0.13, trim, 0.18);
  F.put(trim, lat, spring + width / 2 + 0.2, 0.12, 0.25, 0.28, 0.16);
}

export function gableRoof(kit: Kit, x: number, z0: number, z1: number, halfWidth: number, eave: number, rise: number, color: number, tile = 0x9b5135) {
  const points = [
    -halfWidth, eave, z0, halfWidth, eave, z0, 0, eave + rise, z0,
    -halfWidth, eave, z1, 0, eave + rise, z1, halfWidth, eave, z1,
    -halfWidth, eave, z0, 0, eave + rise, z0, 0, eave + rise, z1,
    0, eave + rise, z0, halfWidth, eave, z0, halfWidth, eave, z1,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.computeVertexNormals();
  kit.solid(geometry, color, x, 0, 0);
  const spacing = 0.38;
  for (let xx = -halfWidth + spacing / 2; xx < halfWidth; xx += spacing) {
    const y = eave + rise * (1 - Math.abs(xx) / halfWidth) + 0.045;
    beam(kit, tile, [x + xx, y, z0 + 0.15], [x + xx, y, z1 - 0.15], 0.045, 0.045);
  }
  for (let z = z0 + 0.55; z < z1; z += 0.65) {
    for (const side of [-1, 1]) {
      const a: [number, number, number] = [x, eave + rise + 0.035, z];
      const b: [number, number, number] = [x + side * halfWidth, eave + 0.035, z];
      beam(kit, tile, a, b, 0.04, 0.04);
    }
  }
  beam(kit, 0x7d432f, [x, eave + rise + 0.12, z0], [x, eave + rise + 0.12, z1], 0.16, 0.16);
  return eave + rise;
}

export function windowBay(F: Face, lat: number, y: number, width: number, height: number, frame: number, shutter?: number) {
  F.put(frame, lat, y, 0.035, width + 0.28, height + 0.28, 0.12);
  F.win(lat, y, width, height, 0.1);
  F.put(0xece7da, lat, y, 0.2, 0.06, height, 0.035);
  F.put(0xece7da, lat, y, 0.2, width, 0.06, 0.035);
  if (shutter !== undefined) {
    for (const side of [-1, 1]) {
      F.put(shutter, lat + side * (width / 2 + 0.23), y, 0.08, 0.28, height + 0.2, 0.08);
      for (let yy = y - height / 2 + 0.12; yy < y + height / 2; yy += 0.2) {
        F.put(0x5c655c, lat + side * (width / 2 + 0.23), yy, 0.13, 0.22, 0.035, 0.025);
      }
    }
  }
  F.put(0xd7c8a9, lat, y - height / 2 - 0.13, 0.13, width + 0.5, 0.16, 0.28);
  F.put(0xf0ebdc, lat, y + height / 2 + 0.16, 0.09, width + 0.4, 0.16, 0.22);
}

export function stairs(kit: Kit, x: number, z: number, width: number, count: number, rise = 0.22, run = 0.28, color = 0xd4cbb8) {
  for (let i = 0; i < count; i++) {
    const h = rise * (i + 1);
    kit.box(color, x, h / 2, z + i * run, width, h, run * (count - i), 0, 0);
    kit.box(0xeee7d8, x, h + 0.025, z + i * run, width + 0.04, 0.05, run * (count - i));
  }
}
