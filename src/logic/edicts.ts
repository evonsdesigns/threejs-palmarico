import type { BuildingType, GameSnapshot } from "./game";
import { atLeast, type FactionId, type RelationLabel, type IslandModifiers as SimulationModifiers } from "./island";

export type EdictCategory = "people" | "foreign" | "economic" | "political-religious" | "social";
export type EdictEvent = "bribe" | "arrest" | "capture" | "heretic" | "eliminate" | "praise-us" | "praise-ussr" | "trade-us" | "trade-ussr" | "amnesty" | "early-election" | "open-jails" | "papal-visit" | "tax-cut";
export type EdictId = "bribe" | "arrest" | "capture" | "heretic" | "eliminate" | "praise-us" | "praise-ussr" | "trade-us" | "trade-ussr" | "us-aid" | "ussr-aid" | "us-alliance" | "ussr-alliance" | "industry-ad-campaign" | "air-pollution-standards" | "tourism-ad-campaign" | "headliner" | "spring-break-package" | "tax-cut" | "special-building-permit" | "pan-caribbean-games" | "mardi-gras" | "world-geographic-package" | "amnesty" | "early-elections" | "inquisition" | "book-bbq" | "military-modernization" | "martial-law" | "open-jails" | "papal-visit" | "conscription" | "prohibition" | "literacy-program" | "contraception-ban" | "social-security" | "anti-litter-ordinance" | "sensitivity-training" | "food-for-the-people";
export type EdictSnapshot = Pick<GameSnapshot,
  "placed" | "population" | "money" | "buildingStaffing" | "factions" | "superpowers" | "month" | "year" |
  "activeEdicts" | "edictCooldowns" | "issuedOnce" | "jailCapacity" | "jailUsed" | "gameOver" | "rebels" | "prisoners" | "citizenOrders"
>;
export type MissingRequirement = (type: BuildingType, state: Pick<GameSnapshot, "placed">) => string | null;

export interface EdictDefinition {
  id: EdictId;
  name: string;
  category: EdictCategory;
  description: string;
  cost: (state: Pick<EdictSnapshot, "population">) => number;
  requiredBuildings?: BuildingType[];
  requiredAnyBuildings?: BuildingType[][];
  requiredFaction?: { id: FactionId; label: RelationLabel };
  requiredRelation?: { id: "us" | "ussr"; label: RelationLabel };
  requirement?: (state: EdictSnapshot) => string | null;
  cooldownMonths?: number;
  cooldownKey?: string;
  once?: boolean;
  toggle?: boolean;
  durationMonths?: number;
  estimated?: boolean;
  event?: EdictEvent;
  modifiers?: Partial<SimulationModifiers>;
}

const requiredAnyHotel: BuildingType[] = ["hotel", "luxury-hotel", "cheap-motel", "beach-villa", "bungalow"];
const factories: BuildingType[] = ["jewelry-factory", "furniture-factory", "cigar-factory", "rum-distillery", "lumber-mill", "cannery"];
export function detentionSite(state: EdictSnapshot, action: "arrest" | "capture"): number | null {
  const index = state.placed.findIndex((building, buildingIndex) => {
    if (building.type !== (action === "arrest" ? "prison" : "colonial-fort")) return false;
    const capacity = building.type === "prison" ? Math.floor(8 * state.buildingStaffing[buildingIndex]) : 4;
    const used = state.prisoners.filter((prisoner) => prisoner.buildingIndex === buildingIndex).length
      + state.citizenOrders.filter((order) => order.destination === buildingIndex).length;
    return capacity > used;
  });
  return index < 0 ? null : index;
}
export function citizenOrderSource(state: EdictSnapshot, action: "arrest" | "capture" | "eliminate"): number | null {
  const type = action === "eliminate" ? "guard-station" : "police-station";
  let source: number | null = null;
  let queued = Infinity;
  state.placed.forEach((building, index) => {
    if (building.type !== type || !(state.buildingStaffing[index] > 0)) return;
    const count = state.citizenOrders.filter((order) => order.source === index).length;
    if (count < queued) {
      source = index;
      queued = count;
    }
  });
  return source;
}
const prisonCellRequirement = (state: EdictSnapshot) => detentionSite(state, "arrest") === null ? "Requires a prison with a free cell" : null;
const staffedRequirement = (types: BuildingType[], reason: string) => (state: EdictSnapshot) => state.placed.some((building, index) => types.includes(building.type) && state.buildingStaffing[index] > 0) ? null : reason;
const powerRequirement = (id: "us" | "ussr", label: RelationLabel) => (state: EdictSnapshot) => atLeast(state.superpowers[id], label) ? null : `Requires ${label} or better ${id === "us" ? "U.S." : "U.S.S.R."} relations`;

export const edictDefinitions: EdictDefinition[] = [
  { id: "bribe", name: "Bribe", category: "people", cost: () => 1000, description: "Raises a target's respect and wealth; the benefit declines over three years.", requiredBuildings: ["bank"], requirement: staffedRequirement(["bank"], "Requires a staffed Bank and banker."), durationMonths: 36, event: "bribe" },
  { id: "arrest", name: "Arrest", category: "people", cost: () => 500, description: "Dispatches police to arrest the target. A seven-year prison term starts when the officer reaches them.", requiredBuildings: ["police-station"], requirement: (state: EdictSnapshot) => staffedRequirement(["police-station"], "Requires a staffed Police Station.")(state) ?? prisonCellRequirement(state), event: "arrest" },
  { id: "capture", name: "Capture", category: "people", cost: () => 500, description: "Dispatches police to capture the target for a three-year Colonial Fort dungeon term.", requiredBuildings: ["colonial-fort", "police-station"], requirement: (state: EdictSnapshot) => staffedRequirement(["police-station"], "Requires a staffed Police Station.")(state) ?? (detentionSite(state, "capture") === null ? "Requires the Colonial Fort and a free dungeon cell" : null), event: "capture" },
  { id: "heretic", name: "Heretic", category: "people", cost: () => 500, description: "Permanently marks the selected citizen as a heretic, reducing personal respect and excluding rebel recruitment.", requiredBuildings: ["cathedral"], requirement: staffedRequirement(["cathedral"], "Requires a staffed Cathedral and bishop."), event: "heretic" },
  { id: "eliminate", name: "Eliminate", category: "people", cost: () => 500, description: "Dispatches a soldier from a staffed guard tower. The target is removed only when the soldier reaches them.", requiredBuildings: ["guard-station"], requirement: staffedRequirement(["guard-station"], "Requires a staffed Guard Station (guard tower)."), event: "eliminate" },

  { id: "praise-us", name: "Praise U.S.", category: "foreign", cost: () => 500, description: "Raises U.S. relations and lowers U.S.S.R. relations by a smaller amount.", requirement: staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry."), cooldownMonths: 36, cooldownKey: "praise", event: "praise-us" },
  { id: "praise-ussr", name: "Praise Russia", category: "foreign", cost: () => 500, description: "Raises U.S.S.R. relations and lowers U.S. relations by a smaller amount.", requirement: staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry."), cooldownMonths: 36, cooldownKey: "praise", event: "praise-ussr" },
  { id: "trade-us", name: "Trade Delegation to U.S.", category: "foreign", cost: () => 1000, description: "A deterministic random benefit: exports, aid, educated workers, or a building grant.", requiredBuildings: ["diplomatic-ministry", "airport"], requirement: (state: EdictSnapshot) => staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry.")(state) ?? staffedRequirement(["airport"], "Requires a staffed Airport.")(state) ?? powerRequirement("us", "Cold")(state), event: "trade-us" },
  { id: "trade-ussr", name: "Trade Delegation to Russia", category: "foreign", cost: () => 1000, description: "A deterministic random benefit: exports, aid, educated workers, or a building grant.", requiredBuildings: ["diplomatic-ministry", "airport"], requirement: (state: EdictSnapshot) => staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry.")(state) ?? staffedRequirement(["airport"], "Requires a staffed Airport.")(state) ?? powerRequirement("ussr", "Cold")(state), event: "trade-ussr" },
  { id: "us-aid", name: "U.S. Development Aid", category: "foreign", cost: () => 2000, description: "Airport and Electric Power Plant blueprints cost half price.", requiredBuildings: ["diplomatic-ministry"], requirement: (state: EdictSnapshot) => staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry.")(state) ?? powerRequirement("us", "Cool")(state), once: true, modifiers: { halfPriceBuildingTypes: ["airport", "electric-power-plant"] } },
  { id: "ussr-aid", name: "Russian Development Aid", category: "foreign", cost: () => 2000, description: "Tenement and Apartment blueprints cost half price.", requiredBuildings: ["diplomatic-ministry"], requirement: (state: EdictSnapshot) => staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry.")(state) ?? powerRequirement("ussr", "Cool")(state), once: true, modifiers: { halfPriceBuildingTypes: ["tenement", "apartment"] } },
  { id: "us-alliance", name: "Alliance with U.S.", category: "foreign", cost: () => 6000, description: "A U.S. base pays $1,000 per year and protects against U.S.S.R. invasion.", requiredBuildings: ["diplomatic-ministry"], requirement: (state: EdictSnapshot) => staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry.")(state) ?? powerRequirement("us", "Close")(state), once: true, modifiers: { monthlyIncome: 1000 / 12, protectedSuperpowers: ["ussr"] } },
  { id: "ussr-alliance", name: "Alliance with Russia", category: "foreign", cost: () => 6000, description: "A Russian base pays $1,000 per year and protects against U.S. invasion.", requiredBuildings: ["diplomatic-ministry"], requirement: (state: EdictSnapshot) => staffedRequirement(["diplomatic-ministry"], "Requires a staffed Diplomatic Ministry.")(state) ?? powerRequirement("ussr", "Close")(state), once: true, modifiers: { monthlyIncome: 1000 / 12, protectedSuperpowers: ["us"] } },

  { id: "industry-ad-campaign", name: "Industry Ad Campaign", category: "economic", cost: () => 8000, description: "Raises export prices by 20% for three years.", requirement: (state: EdictSnapshot) => state.placed.filter((building) => factories.includes(building.type)).length >= 2 && state.placed.some((building) => building.type === "tv-station") ? null : "Requires two factories and a TV Station", durationMonths: 36, modifiers: { exportPriceMultiplier: 1.2 } },
  { id: "air-pollution-standards", name: "Air Pollution Standards", category: "economic", cost: () => 500, description: "Halves pollution and raises factory upkeep by 20%.", requirement: (state: EdictSnapshot) => state.placed.some((building) => factories.includes(building.type)) ? null : "Requires a factory", toggle: true, modifiers: { airPollutionStandards: true, factoryUpkeepMultiplier: 1.2 } },
  { id: "tourism-ad-campaign", name: "Tourism Ad Campaign", category: "economic", cost: () => 5000, description: "Tourists pay twice the normal accommodation rate for three years.", requiredBuildings: ["tv-station"], requirement: (state: EdictSnapshot) => state.placed.some((building) => building.type === "tv-station") && state.placed.some((building) => requiredAnyHotel.includes(building.type)) ? null : "Requires a TV Station and hotel, motel, villa, or bungalow", durationMonths: 36, modifiers: { tourismIncomeMultiplier: 2 } },
  { id: "headliner", name: "The Headliner!", category: "economic", cost: () => 5000, description: "Tourism +20, entertainment +10 and U.S. relations +10 for three years.", requiredBuildings: ["nightclub"], durationMonths: 36, modifiers: { tourismModifier: 20, entertainmentModifier: 10, superpowerAdjustments: { us: 10, ussr: 0 } } },
  { id: "spring-break-package", name: "Spring Break Package (estimated)", category: "economic", cost: () => 2500, description: "Estimated: seasonal tourism +15 and tourism receipts ×1.5 for one year.", requiredAnyBuildings: [requiredAnyHotel], durationMonths: 12, estimated: true, modifiers: { tourismModifier: 15, tourismIncomeMultiplier: 1.5 } },
  { id: "tax-cut", name: "Tax Cut", category: "economic", cost: (state) => state.population * 100, description: "$100 per resident; raises approval and faction respect for one year. Three-year cooldown.", cooldownMonths: 36, modifiers: { approvalModifier: 8, factionAdjustments: { communists: 5, capitalists: 5, religious: 5, intellectuals: 5, militarists: 5, environmentalists: 5, nationalists: 5, loyalists: 5 } }, durationMonths: 12, event: "tax-cut" },
  { id: "special-building-permit", name: "'Special' Building Permit", category: "economic", cost: () => 500, description: "Construction prices rise 20%; 10% of paid costs goes to the Swiss account. Toggleable.", requiredBuildings: ["bank"], toggle: true, modifiers: { costMultiplier: 1.2, swissSkimRate: 0.1, factionAdjustments: { intellectuals: -10 } } },
  { id: "pan-caribbean-games", name: "Pan-Caribbean Games", category: "economic", cost: () => 7500, description: "Tourism +50 and entertainment +20 for three years. Island may host once.", requiredBuildings: ["sports-complex"], once: true, durationMonths: 36, modifiers: { tourismModifier: 50, entertainmentModifier: 20 } },
  { id: "mardi-gras", name: "Mardi Gras", category: "economic", cost: () => 3000, description: "Entertainment +30, tourism +20 and crime +20 for one month.", requiredBuildings: ["pub"], durationMonths: 1, modifiers: { entertainmentModifier: 30, tourismModifier: 20, crimeModifier: 20 } },
  { id: "world-geographic-package", name: "World Geographic Package (estimated)", category: "economic", cost: () => 3500, description: "Estimated: international promotion raises tourism +15 for three years.", requiredAnyBuildings: [["scenic-outlook", "nature-preserve", "archaeological-site"]], durationMonths: 36, estimated: true, modifiers: { tourismModifier: 15 } },

  { id: "amnesty", name: "Amnesty", category: "political-religious", cost: () => 500, description: "Returns rebels to society and raises militarist respect for three years.", requiredBuildings: ["armory"], requiredFaction: { id: "militarists", label: "Cordial" }, durationMonths: 36, event: "amnesty", modifiers: { factionAdjustments: { militarists: 5 } } },
  { id: "early-elections", name: "Early Elections", category: "political-religious", cost: () => 2000, description: "Calls an election at the next monthly simulation advance.", event: "early-election" },
  { id: "inquisition", name: "Inquisition", category: "political-religious", cost: () => 500, description: "Protest chance and tourism/liberty each fall 25; rebel activity rises.", requiredBuildings: ["cathedral"], requiredFaction: { id: "religious", label: "Cordial" }, toggle: true, modifiers: { tourismModifier: -25, libertyModifier: -25, protestChanceModifier: -50, rebelsModifier: 0.01 } },
  { id: "book-bbq", name: "Book BBQ", category: "political-religious", cost: () => 500, description: "Intellectual faction share and education progress fall 50%. Toggleable.", requiredBuildings: ["church"], toggle: true, modifiers: { educationMultiplier: 0.5, factionShareMultipliers: { intellectuals: 0.5 } } },
  { id: "military-modernization", name: "Military Modernization (estimated)", category: "political-religious", cost: () => 3000, description: "Estimated: military strength +20% and annual military maintenance +$300. Toggleable.", requiredAnyBuildings: [["armory", "guard-station", "army-base"]], estimated: true, toggle: true, modifiers: { militaryMultiplier: 1.2, monthlyIncome: -25 } },
  { id: "martial-law", name: "Martial Law", category: "political-religious", cost: () => 6500, description: "Crime −40, productivity ×0.8, liberty/tourism −50; cancels elections. Toggleable.", requiredFaction: { id: "militarists", label: "Cordial" }, toggle: true, modifiers: { crimeModifier: -40, productivityMultiplier: 0.8, libertyModifier: -50, tourismModifier: -50, cancelElections: true, protestChanceModifier: -50 } },
  { id: "open-jails", name: "Open the Jails", category: "political-religious", cost: () => 3000, description: "Releases and exiles imprisoned residents; U.S. relations −10. Once only.", requiredBuildings: ["prison"], once: true, event: "open-jails" },
  { id: "papal-visit", name: "Papal Visit", category: "political-religious", cost: () => 10000, description: "Religious respect +50, all other factions +15, approval +25. Once only.", requiredBuildings: ["cathedral"], requiredFaction: { id: "religious", label: "Cordial" }, once: true, event: "papal-visit" },
  { id: "conscription", name: "Conscription (estimated)", category: "political-religious", cost: () => 2000, description: "Estimated: adds soldiers to military strength but reduces liberty by 10. Toggleable.", estimated: true, toggle: true, modifiers: { militaryBonus: 5, libertyModifier: -10, factionAdjustments: { militarists: 5 } } },

  { id: "prohibition", name: "Prohibition", category: "social", cost: () => 500, description: "Crime doubles; pubs, nightclubs and rum distilleries close. Religious respect +10 and productivity +10%. Toggleable.", toggle: true, modifiers: { crimeMultiplier: 2, closedBuildingTypes: ["pub", "nightclub", "rum-distillery"], factionAdjustments: { religious: 10 }, productivityMultiplier: 1.1 } },
  { id: "literacy-program", name: "Literacy Program", category: "social", cost: () => 500, description: "Education progress +30%; costs $2 per resident per year. Toggleable.", requiredBuildings: ["high-school"], toggle: true, modifiers: { educationMultiplier: 1.3, monthlyCostPerResident: 2 / 12 } },
  { id: "contraception-ban", name: "Contraception Ban", category: "social", cost: () => 500, description: "Religious respect +10, population growth +30%, intellectual respect −30. Toggleable.", requiredBuildings: ["church"], requiredFaction: { id: "religious", label: "Cool" }, toggle: true, modifiers: { factionAdjustments: { religious: 10, intellectuals: -30 }, populationGrowthMultiplier: 1.3 } },
  { id: "social-security", name: "Social Security (estimated)", category: "social", cost: () => 1000, description: "Estimated: modest approval and loyalist respect boost; costs $1 per resident monthly. Toggleable.", estimated: true, toggle: true, modifiers: { approvalModifier: 5, factionAdjustments: { loyalists: 5 }, monthlyCostPerResident: 1 } },
  { id: "anti-litter-ordinance", name: "Anti-Litter Ordinance (estimated)", category: "social", cost: () => 500, description: "Estimated: improves environment by 10; costs $1 per resident monthly. Toggleable.", estimated: true, toggle: true, modifiers: { environmentModifier: 10, monthlyCostPerResident: 1 } },
  { id: "sensitivity-training", name: "Sensitivity Training", category: "social", cost: () => 500, description: "Military respect +10; costs $50 per soldier and police officer yearly. Toggleable.", requiredBuildings: ["college"], toggle: true, modifiers: { factionAdjustments: { militarists: 10 }, monthlyCostPerSecurityStaff: 50 / 12 } },
  { id: "food-for-the-people", name: "Food for the People", category: "social", cost: () => 500, description: "Food quality becomes 100%; consumption doubles. Toggleable.", toggle: true, modifiers: { foodQuality: 100, foodConsumptionMultiplier: 2 } },
];

export function currentMonthIndex(state: Pick<EdictSnapshot, "year" | "month">) {
  return state.year * 12 + state.month - 1;
}

export function edictCost(id: EdictId, state: Pick<EdictSnapshot, "population">): number {
  return Math.max(0, Math.round(edictDefinitions.find((edict) => edict.id === id)!.cost(state)));
}

export function edictRequirement(id: EdictId, state: EdictSnapshot, missingRequirement: MissingRequirement): string | null {
  const edict = edictDefinitions.find((entry) => entry.id === id)!;
  for (const type of edict.requiredBuildings ?? []) {
    if (state.placed.some((building) => building.type === type)) continue;
    const name = type.replaceAll("-", " ");
    const prerequisite = missingRequirement(type, state);
    return prerequisite ? `Requires ${name}; ${prerequisite.toLowerCase()}` : `Requires ${name}`;
  }
  for (const alternatives of edict.requiredAnyBuildings ?? []) {
    if (state.placed.some((building) => alternatives.includes(building.type))) continue;
    return `Requires one of: ${alternatives.map((type) => type.replaceAll("-", " ")).join(", ")}`;
  }
  if (edict.requiredFaction && !atLeast(state.factions[edict.requiredFaction.id].respect, edict.requiredFaction.label)) {
    return `Requires ${edict.requiredFaction.label} or better ${edict.requiredFaction.id} respect`;
  }
  if (edict.requiredRelation && !atLeast(state.superpowers[edict.requiredRelation.id], edict.requiredRelation.label)) {
    return `Requires ${edict.requiredRelation.label} or better ${edict.requiredRelation.id === "us" ? "U.S." : "U.S.S.R."} relations`;
  }
  return edict.requirement?.(state) ?? null;
}

export function edictUnavailableReason(id: EdictId, state: EdictSnapshot, missingRequirement: MissingRequirement, citizenId?: number): string | null {
  const edict = edictDefinitions.find((entry) => entry.id === id)!;
  if ((id === "arrest" || id === "capture" || id === "eliminate") && citizenId !== undefined && state.citizenOrders.some((order) => order.citizenId === citizenId)) return "A security order is already pending for this citizen";
  if ((id === "arrest" || id === "capture") && citizenId !== undefined && state.prisoners.some((entry) => entry.citizenId === citizenId)) return "This citizen is already detained";
  if (edict.once && state.issuedOnce[id]) return "This edict can only be issued once";
  const isActive = state.activeEdicts.some((active) => active.id === id
    && (edict.category !== "people" || (citizenId !== undefined && active.citizenId === citizenId)));
  if (isActive && !edict.toggle) return "This edict is already active";
  if (edict.cooldownMonths) {
    const cooldown = state.edictCooldowns[edict.cooldownKey ?? id] ?? 0;
    const remaining = cooldown - currentMonthIndex(state);
    if (remaining > 0) return remaining < 12 ? `Available in ${remaining} month${remaining === 1 ? "" : "s"}` : `Available in ${Math.ceil(remaining / 12)} year${remaining >= 24 ? "s" : ""}`;
  }
  const requirement = edictRequirement(id, state, missingRequirement);
  if (requirement) return requirement;
  const cost = edictCost(id, state);
  if (state.money < cost) return `Requires $${cost.toLocaleString()}`;
  return null;
}

export function combineEdictModifiers(base: SimulationModifiers, activeIds: EdictId[]): SimulationModifiers {
  const result: SimulationModifiers = {
    ...base,
    superpowerAdjustments: { ...base.superpowerAdjustments },
    factionAdjustments: { ...base.factionAdjustments },
    factionShareMultipliers: { ...base.factionShareMultipliers },
    closedBuildingTypes: [...base.closedBuildingTypes],
    halfPriceBuildingTypes: [...base.halfPriceBuildingTypes],
    protectedSuperpowers: [...base.protectedSuperpowers],
  };
  const additive: (keyof SimulationModifiers)[] = ["approvalModifier", "crimeModifier", "libertyModifier", "tourismModifier", "entertainmentModifier", "environmentModifier", "monthlyIncome", "monthlyCostPerResident", "monthlyCostPerSecurityStaff", "swissSkimRate", "militaryBonus", "protestChanceModifier", "rebelsModifier", "jailCapacity"];
  const multiplicative: (keyof SimulationModifiers)[] = ["tourismIncomeMultiplier", "exportPriceMultiplier", "costMultiplier", "productivityMultiplier", "educationMultiplier", "populationGrowthMultiplier", "foodConsumptionMultiplier", "factoryUpkeepMultiplier", "crimeMultiplier", "militaryMultiplier"];
  for (const id of activeIds) {
    const modifiers = edictDefinitions.find((entry) => entry.id === id)!.modifiers;
    if (!modifiers) continue;
    for (const key of additive) (result[key] as number) += (modifiers[key] as number | undefined) ?? 0;
    for (const key of multiplicative) (result[key] as number) *= (modifiers[key] as number | undefined) ?? 1;
    if (modifiers.airPollutionStandards) result.airPollutionStandards = true;
    if (modifiers.cancelElections) result.cancelElections = true;
    if (modifiers.foodQuality !== undefined) result.foodQuality = Math.max(result.foodQuality, modifiers.foodQuality);
    if (modifiers.superpowerAdjustments) {
      result.superpowerAdjustments.us += modifiers.superpowerAdjustments.us;
      result.superpowerAdjustments.ussr += modifiers.superpowerAdjustments.ussr;
    }
    if (modifiers.factionAdjustments) for (const [id, value] of Object.entries(modifiers.factionAdjustments)) result.factionAdjustments[id as FactionId] = (result.factionAdjustments[id as FactionId] ?? 0) + (value ?? 0);
    if (modifiers.factionShareMultipliers) for (const [id, value] of Object.entries(modifiers.factionShareMultipliers)) result.factionShareMultipliers[id as FactionId] = (result.factionShareMultipliers[id as FactionId] ?? 1) * (value ?? 1);
    result.closedBuildingTypes = [...new Set([...result.closedBuildingTypes, ...(modifiers.closedBuildingTypes ?? [])])];
    result.halfPriceBuildingTypes = [...new Set([...result.halfPriceBuildingTypes, ...(modifiers.halfPriceBuildingTypes ?? [])])];
    result.protectedSuperpowers = [...new Set([...result.protectedSuperpowers, ...(modifiers.protectedSuperpowers ?? [])])];
  }
  return result;
}
