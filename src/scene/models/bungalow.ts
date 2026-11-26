import { Kit } from "./kit";

export function buildBungalow(kit: Kit) {
  const { box, cottage } = kit;
  cottage(0, 0, 5, 4.6, 0x65a39b, 0xb06a42, true);
  box(0xcbb99a, 0, 0.35, 3.3, 1.7, 0.2, 0.65);
  for (const x of [-1.4, 1.4]) {
    box(0xeee0bf, x, 1.6, 3.3, 0.08, 1.35, 0.08);
    box(0xeee0bf, x, 2.15, 3.3, 0.75, 0.08, 0.08);
  }
}
