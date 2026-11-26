import { Kit } from "./kit";

export function buildHouse(kit: Kit) {
  const { box, cottage } = kit;
  cottage(0, 0, 6.4, 5.4, 0x537a9a, 0x755746, false);
  box(0xe4ddca, -2.85, 1.8, 2.8, 0.18, 3, 0.2);
  box(0xe4ddca, 2.85, 1.8, 2.8, 0.18, 3, 0.2);
  box(0x7d725b, 3.34, 1.1, 0, 0.35, 0.85, 0.5);
  box(0xc8bc9e, 3.35, 1.55, 0, 0.38, 0.1, 0.55);
}
