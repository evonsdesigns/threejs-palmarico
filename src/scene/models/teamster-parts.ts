import type { Kit } from "./kit";

export type Face = { x: number; z: number; yaw: number };

export function createParts(kit: Kit) {
  const { box } = kit;

  // Box placed in wall-local coordinates: u runs along the wall, n points outward.
  const onFace = (face: Face, color: number, u: number, y: number, n: number, w: number, h: number, d: number, rx = 0) => {
    const c = Math.cos(face.yaw);
    const s = Math.sin(face.yaw);
    box(color, face.x + u * c + n * s, y, face.z - u * s + n * c, w, h, d, rx, face.yaw);
  };

  // Thin square bar between two arbitrary points.
  const beam = (color: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, t = 0.06) => {
    const dx = bx - ax;
    const dy = by - ay;
    const dz = bz - az;
    const length = Math.hypot(dx, dy, dz);
    const ux = dx / length;
    const uy = dy / length;
    const uz = dz / length;
    const s = Math.sqrt(Math.max(0, 1 - ux * ux));
    const ry = Math.acos(Math.max(-1, Math.min(1, ux)));
    const rx = s < 1e-6 ? 0 : Math.atan2(uy, -uz);
    box(color, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, length, t, t, rx, ry);
  };

  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return { onFace, beam, rand };
}
