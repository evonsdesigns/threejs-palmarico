import { FarmCrop } from "../../logic/game";
import { GRID_TILE_SIZE } from "../../logic/grid";
import { Kit } from "./kit";

export interface CropTile {
  x: number;
  z: number;
}

const SOIL = 0x72583b;
const RIDGE = 0x815b36;
const FURROW = 0x5a432d;

const hash = (x: number, z: number, k: number) => {
  const s = Math.sin(x * 12.9898 + z * 78.233 + k * 37.719) * 43758.5453;
  return s - Math.floor(s);
};

// Plants one crop on each tile; tile coordinates are tile centers in the group's local space.
export function buildCropField(kit: Kit, crop: FarmCrop, tiles: readonly CropTile[], groundHeight: (x: number, z: number) => number) {
  const { box } = kit;
  const half = GRID_TILE_SIZE / 2;
  for (const tile of tiles) {
    const cx = tile.x;
    const cz = tile.z;
    let lift = 0;
    let px = 0;
    let pz = 0;
    const at = (x: number, z: number) => {
      px = x;
      pz = z;
      lift = groundHeight(x, z);
    };
    const rnd = (k: number) => hash(px, pz, k);
    const p = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, rx = 0, ry = 0) => box(color, x, y + lift, z, w, h, d, rx, ry);
    const ground = (color: number, x: number, y: number, z: number, w: number, h: number, d: number) => box(color, x, y + groundHeight(x, z), z, w, h, d);

    // Directional segment from (x, y, z): heading psi (0 = +z), pitch phi (+ = downward). Clamped to the tile.
    const seg = (color: number, x: number, y: number, z: number, psi: number, phi: number, len: number, w: number, h: number, broad = false) => {
      const dx = Math.sin(psi) * Math.cos(phi);
      const dy = -Math.sin(phi);
      const dz = Math.cos(psi) * Math.cos(phi);
      const limit = half - 0.06 - Math.max(w, h) / 2;
      let l = len;
      if (dx > 1e-4) l = Math.min(l, (cx + limit - x) / dx);
      if (dx < -1e-4) l = Math.min(l, (cx - limit - x) / dx);
      if (dz > 1e-4) l = Math.min(l, (cz + limit - z) / dz);
      if (dz < -1e-4) l = Math.min(l, (cz - limit - z) / dz);
      l = Math.max(0.05, l);
      const mx = x + dx * l / 2;
      const my = y + dy * l / 2;
      const mz = z + dz * l / 2;
      if (broad) {
        const tilt = Math.abs(Math.cos(psi)) > 0.7 ? Math.atan2(-dy, dz) : 0;
        const yaw = Math.abs(Math.cos(psi)) > 0.7 ? Math.asin(Math.max(-1, Math.min(1, dx))) : psi;
        p(color, mx, my, mz, w, h, tilt ? l : l * Math.cos(phi), tilt, yaw);
      } else {
        p(color, mx, my, mz, w, h, l, Math.atan2(-dy, dz), Math.asin(Math.max(-1, Math.min(1, dx))));
      }
      return [x + dx * l, y + dy * l, z + dz * l] as const;
    };

    // Tilled soil: base quadrants plus ridged rows along x with dark furrows between them.
    const soil = (rows: readonly number[], ridgeWidth: number) => {
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) ground(SOIL, cx + sx * 0.99, -0.08, cz + sz * 0.99, 1.96, 0.3, 1.96);
      for (const rz of rows) {
        for (const sx of [-1, 1]) ground(RIDGE, cx + sx * 0.96, 0.1, cz + rz, 1.86, 0.16, ridgeWidth);
      }
      for (let i = 0; i < rows.length - 1; i++) {
        const fz = (rows[i] + rows[i + 1]) / 2;
        for (const sx of [-1, 1]) ground(FURROW, cx + sx * 0.96, 0.075, cz + fz, 1.86, 0.02, 0.18);
      }
    };

    if (crop === "corn") {
      const rows = [-1.4, -0.47, 0.47, 1.4];
      soil(rows, 0.5);
      for (const rz of rows) {
        for (const rx of [-1.35, -0.45, 0.45, 1.35]) {
          at(cx + rx + (hash(cx + rx, cz + rz, 1) - 0.5) * 0.12, cz + rz + (hash(cx + rx, cz + rz, 2) - 0.5) * 0.1);
          const height = 1.9 + rnd(3) * 0.45;
          const stalk = rnd(4) > 0.75 ? 0x8f9a4c : 0x6f8f3f;
          p(stalk, px, 0.18 + height / 2, pz, 0.1, height, 0.1);
          const base = rnd(5) * Math.PI * 2;
          for (let i = 0; i < 5; i++) {
            const y = 0.5 + i * (height - 0.75) / 5;
            const psi = base + i * Math.PI + (rnd(10 + i) - 0.5) * 0.9;
            const colour = i < 2 && rnd(20 + i) > 0.5 ? 0xa59a58 : i % 2 ? 0x6d9a3f : 0x7fa848;
            const [ex, ey, ez] = seg(colour, px, 0.18 + y, pz, psi, i < 4 ? -0.35 : -0.9, i < 4 ? 0.38 : 0.45, 0.1, 0.04);
            if (i < 4) seg(colour, ex, ey, ez, psi, 0.75, 0.32, 0.09, 0.04);
          }
          if (rnd(6) > 0.15) {
            const side = rnd(7) > 0.5 ? 1 : -1;
            p(0x9fb760, px + side * 0.1, 0.18 + height * 0.55, pz, 0.13, 0.38, 0.13);
            p(0xe0c25a, px + side * 0.12, 0.18 + height * 0.55 + 0.05, pz + 0.04, 0.08, 0.22, 0.09);
            p(0x8a5a35, px + side * 0.1, 0.18 + height * 0.55 + 0.24, pz, 0.05, 0.1, 0.05);
          }
          p(0xd8c27a, px, 0.18 + height + 0.2, pz, 0.05, 0.4, 0.05);
          p(0xc9b06a, px, 0.18 + height + 0.12, pz, 0.36, 0.04, 0.04, 0, base);
        }
      }
    } else if (crop === "pineapple") {
      const rows = [-1.45, -0.5, 0.5, 1.45];
      soil(rows, 0.62);
      for (const rz of rows) {
        for (const rx of [-1.5, -0.75, 0, 0.75, 1.5]) {
          at(cx + rx + (hash(cx + rx, cz + rz, 1) - 0.5) * 0.12, cz + rz + (hash(cx + rx, cz + rz, 2) - 0.5) * 0.1);
          const base = rnd(3) * Math.PI;
          p(0x587a45, px, 0.3, pz, 0.26, 0.2, 0.26, 0, base);
          for (let i = 0; i < 6; i++) {
            const psi = base + i * Math.PI / 3 + (rnd(10 + i) - 0.5) * 0.4;
            const colour = i % 3 === 0 ? 0x7b8a4e : i % 2 ? 0x5f8048 : 0x6e9256;
            seg(colour, px, 0.3, pz, psi, -0.55 - rnd(20 + i) * 0.35, 0.5 + rnd(30 + i) * 0.12, 0.1, 0.035);
          }
          if (rnd(4) > 0.35) {
            const ripe = rnd(5) > 0.45;
            p(ripe ? 0xcf9a3a : 0x9aa04a, px, 0.6, pz, 0.24, 0.32, 0.24);
            p(ripe ? 0xa8742a : 0x7c8a3a, px, 0.6, pz, 0.27, 0.05, 0.27, 0, Math.PI / 4);
            p(0x5a7f3e, px, 0.86, pz, 0.06, 0.24, 0.16);
            p(0x5a7f3e, px, 0.86, pz, 0.16, 0.2, 0.06);
          } else {
            p(0x6a9050, px, 0.5, pz, 0.08, 0.35, 0.08);
          }
        }
      }
    } else if (crop === "coffee") {
      const rows = [-1.3, 0, 1.3];
      soil(rows, 0.7);
      for (const rz of rows) {
        for (const rx of [-1.3, 0, 1.3]) {
          at(cx + rx + (hash(cx + rx, cz + rz, 1) - 0.5) * 0.1, cz + rz + (hash(cx + rx, cz + rz, 2) - 0.5) * 0.1);
          const s = 0.9 + rnd(3) * 0.2;
          p(0x6a5136, px, 0.4, pz, 0.1, 0.5, 0.1);
          p(0x5a4a33, px, 0.21, pz, 0.62, 0.04, 0.62);
          const tiers = [[0.75, 1.0, 0x3d6634], [1.15, 0.82, 0x4a7a3c], [1.5, 0.56, 0x3f6d36], [1.78, 0.28, 0x55843f]] as const;
          for (const [y, size, colour] of tiers) {
            p(colour, px, y * s, pz, size * s, 0.36 * s, size * s * 0.72, 0, rnd(4) * 0.4);
            p(colour === 0x3d6634 ? 0x48733a : 0x3a6232, px, y * s + 0.04, pz, size * s * 0.72, 0.3 * s, size * s, 0, Math.PI / 4 + rnd(4) * 0.4);
          }
          for (let i = 0; i < 4; i++) {
            const psi = i * Math.PI / 2 + Math.PI / 4 + (rnd(10 + i) - 0.5) * 0.3;
            seg(0x456f38, px, 0.85 * s, pz, psi, 0.35, 0.48, 0.2, 0.08, true);
          }
          const berries = [0xb3362a, 0x8c2a22, 0xc94a2c, 0x8fa040, 0xb3362a, 0x9c3a26];
          for (let i = 0; i < 6; i++) {
            const a = i * 1.05 + rnd(40) * 2;
            const r = (0.36 - (i % 3) * 0.07) * s;
            p(berries[i], px + Math.sin(a) * r, (0.72 + (i % 3) * 0.33) * s, pz + Math.cos(a) * r, 0.1, 0.13, 0.1);
          }
          if (rnd(8) > 0.5) p(0xf1ede0, px - 0.2 * s, 1.35 * s, pz + 0.25 * s, 0.09, 0.06, 0.09);
        }
      }
    } else if (crop === "sugar") {
      const rows = [-1.45, -0.48, 0.48, 1.45];
      soil(rows, 0.5);
      for (const rz of rows) {
        for (const rx of [-1.5, -0.75, 0, 0.75, 1.5]) {
          at(cx + rx + (hash(cx + rx, cz + rz, 1) - 0.5) * 0.12, cz + rz + (hash(cx + rx, cz + rz, 2) - 0.5) * 0.1);
          const height = 2.4 + rnd(3) * 0.6;
          for (let i = 0; i < 3; i++) {
            const psi = i * 2.1 + rnd(10 + i) * 0.8;
            const lean = -Math.PI / 2 + 0.06 + rnd(20 + i) * 0.1;
            const colour = rnd(30 + i) > 0.6 ? 0x8b7058 : i === 1 ? 0xa3a453 : 0x8f9b4a;
            const h = height * (0.85 + i * 0.07);
            const [tx, ty, tz] = seg(colour, px, 0.18, pz, psi, lean, h, 0.08, 0.08);
            p(0x6f6a3c, px + (tx - px) * 0.45, 0.18 + (ty - 0.18) * 0.45, pz + (tz - pz) * 0.45, 0.1, 0.04, 0.1);
            if (i < 2) seg(0x79a04a, tx, ty - 0.1, tz, psi + Math.PI * i, 0.25, 0.65, 0.09, 0.035);
          }
          const top = 0.18 + height * 0.92;
          seg(0x6c9442, px, top, pz, rnd(5) * Math.PI * 2, 0.1, 0.6, 0.09, 0.035);
          seg(0x86ad52, px, top - 0.3, pz, rnd(6) * Math.PI * 2, 0.45, 0.6, 0.09, 0.035);
          seg(0xa8915a, px, 0.6, pz, rnd(7) * Math.PI * 2, 0.9, 0.45, 0.1, 0.03);
        }
      }
    } else if (crop === "tobacco") {
      const rows = [-1.25, 0, 1.25];
      soil(rows, 0.62);
      for (const rz of rows) {
        for (const rx of [-1.35, -0.45, 0.45, 1.35]) {
          at(cx + rx + (hash(cx + rx, cz + rz, 1) - 0.5) * 0.1, cz + rz + (hash(cx + rx, cz + rz, 2) - 0.5) * 0.08);
          const height = 1.25 + rnd(3) * 0.35;
          p(0x7d9a4c, px, 0.18 + height / 2, pz, 0.09, height, 0.09);
          const base = Math.PI / 4 + (rnd(4) > 0.5 ? Math.PI / 2 : 0);
          for (let i = 0; i < 6; i++) {
            const tier = Math.floor(i / 2);
            const y = 0.32 + tier * height * 0.27;
            const psi = base + (i % 2) * Math.PI + tier * 0.35;
            const size = 0.62 - tier * 0.13;
            const colour = tier === 0 && rnd(10 + i) > 0.55 ? 0xb5aa5a : tier === 2 ? 0x8fb35a : 0x76a04a;
            const [ex, ey, ez] = seg(colour, px, y, pz, psi, 0.12, size * 0.55, 0.34 - tier * 0.05, 0.04, true);
            seg(colour === 0x76a04a ? 0x6a9443 : colour, ex, ey, ez, psi, 0.55, size * 0.45, 0.27 - tier * 0.05, 0.04, true);
          }
          p(0x8fb35a, px, 0.18 + height, pz, 0.2, 0.18, 0.2, 0, base);
          if (rnd(5) > 0.3) {
            p(0xdf8fa5, px, 0.18 + height + 0.16, pz, 0.08, 0.14, 0.08);
            p(0xe9a3b6, px + 0.08, 0.18 + height + 0.1, pz + 0.05, 0.07, 0.12, 0.07);
            p(0xd97c96, px - 0.07, 0.18 + height + 0.12, pz - 0.05, 0.07, 0.12, 0.07);
          }
        }
      }
    } else if (crop === "papaya") {
      soil([-0.95, 0.95], 0.9);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          at(cx + sx * 0.95 + (hash(cx + sx, cz + sz, 1) - 0.5) * 0.1, cz + sz * 0.95 + (hash(cx + sx, cz + sz, 2) - 0.5) * 0.1);
          ground(0x6a5034, px, 0.17, pz, 0.8, 0.1, 0.8);
          ground(0x8a7a50, px + 0.25, 0.23, pz - 0.2, 0.35, 0.03, 0.18);
          const height = 2.6 + rnd(3) * 0.5;
          p(0x8a7851, px, 0.2 + height * 0.2, pz, 0.24, height * 0.4, 0.24);
          p(0x938159, px, 0.2 + height * 0.6, pz, 0.19, height * 0.4, 0.19);
          p(0x9c8a60, px, 0.2 + height * 0.9, pz, 0.15, height * 0.2, 0.15);
          for (const t of [0.3, 0.52, 0.72]) p(0x6f6142, px, 0.2 + height * t, pz, 0.23 - t * 0.08, 0.04, 0.23 - t * 0.08);
          const top = 0.2 + height;
          for (let i = 0; i < 8; i++) {
            const psi = i * Math.PI / 4 + rnd(10 + i) * 0.4;
            const lower = i % 2 === 1;
            const [ex, ey, ez] = seg(0x9fb36a, px, top - (lower ? 0.25 : 0.05), pz, psi, lower ? 0.05 : -0.45, 0.62, 0.05, 0.05);
            const blade = lower ? 0x4f8a3f : 0x5f9a48;
            seg(blade, ex, ey, ez, psi, 0.35, 0.38, 0.42, 0.04, true);
            seg(blade, ex, ey + 0.02, ez, psi + 0.6, 0.35, 0.25, 0.2, 0.04, true);
          }
          seg(0x8c7c4d, px, top - 0.35, pz, rnd(15) * Math.PI * 2, 1.15, 0.6, 0.05, 0.05);
          for (let i = 0; i < 7; i++) {
            const a = i * 0.9 + rnd(20) * 3;
            const y = top - 0.4 - (i % 3) * 0.22;
            const colour = i % 3 === 0 ? 0xdf9a3a : i % 3 === 1 ? 0xa3ad48 : 0x86a03e;
            p(colour, px + Math.sin(a) * 0.16, y, pz + Math.cos(a) * 0.16, 0.15, 0.28, 0.15);
          }
        }
      }
    } else {
      soil([-0.95, 0.95], 0.9);
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        at(cx + sx * 0.95 + (hash(cx + sx, cz + sz, 1) - 0.5) * 0.1, cz + sz * 0.95 + (hash(cx + sx, cz + sz, 2) - 0.5) * 0.1);
        ground(0x6a5034, px, 0.17, pz, 0.9, 0.1, 0.9);
        ground(0x9a8152, px - 0.3, 0.23, pz + 0.25, 0.5, 0.03, 0.2);
        const height = 2.1 + rnd(3) * 0.4;
        p(0x6f8a4a, px, 0.2 + height * 0.3, pz, 0.32, height * 0.6, 0.32);
        p(0x7f9a52, px, 0.2 + height * 0.78, pz, 0.24, height * 0.4, 0.24);
        p(0x5d5a35, px + 0.13, 0.2 + height * 0.25, pz + 0.1, 0.08, height * 0.4, 0.14);
        const top = 0.2 + height;
        for (let i = 0; i < 7; i++) {
          const psi = i * 2 * Math.PI / 7 + rnd(10 + i) * 0.5;
          const blade = i === 3 ? 0x9a8a4a : i % 2 ? 0x5f9a42 : 0x72aa4c;
          const [ax, ay, az] = seg(0x86a050, px, top - 0.1, pz, psi, -0.9, 0.35, 0.06, 0.06);
          const [bx, by, bz] = seg(blade, ax, ay, az, psi, -0.15, 0.55, 0.42, 0.04, true);
          seg(blade, bx, by, bz, psi, 0.6, 0.45, 0.38, 0.04, true);
          p(0x6b8a3a, (ax + bx) / 2, (ay + by) / 2 + 0.03, (az + bz) / 2, 0.05, 0.04, 0.05);
        }
        seg(0x8a7a48, px, top - 0.4, pz, rnd(20) * Math.PI * 2, 1.2, 0.8, 0.3, 0.04, true);
        if (rnd(4) > 0.2) {
          const psi = rnd(5) * Math.PI * 2;
          const [hx, hy, hz] = seg(0x6b7a3a, px, top - 0.35, pz, psi, 0.4, 0.4, 0.06, 0.06);
          const ripe = rnd(6) > 0.7;
          for (let i = 0; i < 4; i++) {
            const r = 0.2 - i * 0.03;
            p(ripe ? 0xdcc24a : 0x8fae46, hx, hy - 0.12 - i * 0.16, hz, r * 2, 0.13, r * 1.6, 0, i * 0.7);
          }
          p(0x7a2f45, hx, hy - 0.8, hz, 0.12, 0.22, 0.12);
        }
      }
      at(cx, cz);
      p(0x6f8a4a, px, 0.5, pz, 0.16, 0.7, 0.16);
      for (let i = 0; i < 3; i++) seg(0x72aa4c, px, 0.8, pz, i * 2.1 + rnd(9), -0.5, 0.5, 0.25, 0.04, true);
    }
  }
}
