import type { Kit } from "./kit";

const LETTERS: Record<string, string[]> = {
  A: ["111", "101", "111", "101", "101"], B: ["110", "101", "110", "101", "110"],
  C: ["111", "100", "100", "100", "111"], D: ["110", "101", "101", "101", "110"],
  E: ["111", "100", "110", "100", "111"], F: ["111", "100", "110", "100", "100"],
  G: ["111", "100", "101", "101", "111"], H: ["101", "101", "111", "101", "101"],
  I: ["111", "010", "010", "010", "111"], J: ["001", "001", "001", "101", "111"],
  K: ["101", "101", "110", "101", "101"], L: ["100", "100", "100", "100", "111"],
  M: ["101", "111", "111", "101", "101"], N: ["101", "111", "111", "111", "101"],
  O: ["111", "101", "101", "101", "111"], P: ["110", "101", "110", "100", "100"],
  R: ["110", "101", "110", "101", "101"], S: ["111", "100", "111", "001", "111"],
  T: ["111", "010", "010", "010", "010"], U: ["101", "101", "101", "101", "111"],
  V: ["101", "101", "101", "101", "010"], Y: ["101", "101", "010", "010", "010"],
};

export function sign(kit: Kit, text: string, x: number, y: number, z: number, px: number, ink: number, panel: number, facing = 0) {
  const glyphs = [...text.toUpperCase()].map((char) => LETTERS[char] ?? ["000", "000", "000", "000", "000"]);
  const cell = px * 4;
  const width = glyphs.length * cell - px;
  kit.box(panel, x, y, z, width + px * 1.4, px * 6.8, 0.12, 0, facing);
  for (let i = 0; i < glyphs.length; i++) {
    for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
      if (glyphs[i][row][col] !== "1") continue;
      const gx = x - width / 2 + i * cell + col * px;
      const gy = y + (2 - row) * px;
      const ox = Math.sin(facing) * 0.08;
      const oz = Math.cos(facing) * 0.08;
      kit.box(ink, gx + ox, gy, z + oz, px * 0.9, px * 0.9, 0.025, 0, facing);
    }
  }
}

export function stripedAwning(kit: Kit, x: number, y: number, z: number, width: number, run: number, drop: number, a: number, b: number) {
  const count = Math.ceil(width / 0.26);
  const stripe = width / count;
  const tilt = Math.atan2(drop, run);
  const length = Math.hypot(run, drop);
  for (let i = 0; i < count; i++) {
    const px = x - width / 2 + stripe * (i + 0.5);
    const color = i % 2 ? b : a;
    kit.box(color, px, y - drop / 2, z + run / 2, stripe + 0.012, 0.04, length, tilt);
    kit.box(color, px, y - drop - 0.12, z + run, stripe + 0.012, 0.24, 0.04);
    kit.box(color, px, y - drop - 0.26, z + run, stripe * 0.5, 0.05, 0.04);
  }
  kit.box(0x443b32, x, y + 0.04, z + 0.04, width + 0.12, 0.08, 0.12);
}

export function beam(kit: Kit, color: number, a: [number, number, number], b: [number, number, number], thickness = 0.06) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const length = Math.hypot(dx, dy, dz);
  const yaw = Math.asin(Math.max(-1, Math.min(1, dx / length)));
  const pitch = Math.atan2(-dy, dz);
  kit.box(color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, thickness, thickness, length, pitch, yaw);
}
