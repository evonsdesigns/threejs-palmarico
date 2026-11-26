import { Kit } from "./kit";

export function buildCountryHouse(kit: Kit) {
  const { box, cottage } = kit;
  cottage(0, 0, 5.7, 5, 0xb9b8a2, 0x85867c, false);
  box(0x76845e, -2.35, 1.9, 2.58, 0.38, 2.6, 0.1);
  box(0x76845e, 2.35, 1.9, 2.58, 0.38, 2.6, 0.1);
  for (let x = -2.5; x <= 2.5; x += 0.5) box(0x878b77, x, 1.8, -2.55, 0.04, 2.8, 0.06);
  box(0x7d6b55, 2.5, 0.7, 2.9, 0.55, 1.1, 0.55);
  box(0x595c4e, 2.5, 1.3, 2.9, 0.58, 0.1, 0.58);
}
