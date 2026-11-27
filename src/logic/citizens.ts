import type { GameSnapshot } from "./game";
import { currentMonthIndex } from "./edicts";

export interface Prisoner {
  citizenId: number;
  buildingIndex: number;
  releaseAt: number;
}

export type CitizenOrderAction = "arrest" | "capture" | "eliminate";
export type CitizenOrderStatus = "queued" | "en-route" | "waiting-for-target" | "waiting-for-staff" | "waiting-for-cell" | "blocked";

export interface CitizenOrder {
  id: number;
  action: CitizenOrderAction;
  citizenId: number;
  source: number;
  destination: number | null;
  cost: number;
  skim: number;
  status: CitizenOrderStatus;
}

export type CitizenOrderEvent = { type: "arrived"; orderId: number }
  | { type: "status"; orderId: number; status: CitizenOrderStatus };

export const citizenOrderStatusLabels: Record<CitizenOrderStatus, string> = {
  queued: "Waiting for an available officer",
  "en-route": "Officer travelling to the target",
  "waiting-for-target": "Waiting for the target to appear outside",
  "waiting-for-staff": "Waiting for security staff",
  "waiting-for-cell": "Waiting for a staffed reserved cell",
  blocked: "No safe walking route; officer will retry",
};

export function citizenOrderBlock(state: GameSnapshot, order: CitizenOrder): "waiting-for-staff" | "waiting-for-cell" | null {
  const sourceType = order.action === "eliminate" ? "guard-station" : "police-station";
  if (state.placed[order.source]?.type !== sourceType || !(state.buildingStaffing[order.source] > 0)) return "waiting-for-staff";
  if (order.action === "eliminate") return null;
  const destination = order.destination;
  if (destination === null) throw new Error("A detention order has no reserved facility.");
  const type = order.action === "arrest" ? "prison" : "colonial-fort";
  if (state.placed[destination]?.type !== type) return "waiting-for-cell";
  const capacity = type === "prison" ? Math.floor(8 * state.buildingStaffing[destination]) : 4;
  const occupied = state.prisoners.filter((entry) => entry.buildingIndex === destination).length;
  const ahead = state.citizenOrders.filter((entry) => entry.destination === destination && entry.id < order.id).length;
  return occupied + ahead < capacity ? null : "waiting-for-cell";
}

export function citizenStatus(state: GameSnapshot, citizenId: number) {
  if (!state.citizenIds.includes(citizenId)) return null;
  const month = currentMonthIndex(state);
  const effects = state.activeEdicts.filter((entry) => entry.citizenId === citizenId);
  const bribe = effects.find((entry) => entry.id === "bribe");
  const bribeMonths = bribe?.expiresAt ? Math.max(0, bribe.expiresAt - month) : 0;
  const heretic = effects.some((entry) => entry.id === "heretic");
  const prisoner = state.prisoners.find((entry) => entry.citizenId === citizenId);
  const order = state.citizenOrders.find((entry) => entry.citizenId === citizenId);
  const arrested = prisoner && state.placed[prisoner.buildingIndex].type === "prison";
  const respectAdjustment = 25 * Math.min(1, bribeMonths / 36) - (heretic ? 25 : 0) - (arrested ? 35 : 0);
  return {
    bribeMonths,
    bribeBenefit: Math.round(1000 * Math.min(1, bribeMonths / 36)),
    heretic,
    prisoner,
    order,
    respectAdjustment,
    respect: Math.max(0, Math.min(100, Math.round(state.approval + respectAdjustment))),
  };
}
