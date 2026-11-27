import { buildingEffects } from "./building-effects";
import type { BuildingType, PlacedBuilding } from "./game";

export const factionIds = ["communists", "capitalists", "religious", "intellectuals", "militarists", "environmentalists", "nationalists", "loyalists"] as const;
export type FactionId = typeof factionIds[number];
export type RelationLabel = "Hostile" | "Cold" | "Cool" | "Neutral" | "Cordial" | "Close" | "Allied";
export type IslandRatings = Record<"health" | "religion" | "entertainment" | "education" | "crime" | "liberty" | "environment" | "tourism" | "military" | "media", number>;
export interface FactionState { respect: number; share: number; leader: string }
export type FactionStateMap = Record<FactionId, FactionState>;
export interface IslandModifiers {
  approvalModifier: number;
  crimeModifier: number;
  libertyModifier: number;
  tourismModifier: number;
  tourismIncomeMultiplier: number;
  entertainmentModifier: number;
  superpowerAdjustments: { us: number; ussr: number };
  factionAdjustments: Partial<Record<FactionId, number>>;
  exportPriceMultiplier: number;
  costMultiplier: number;
  airPollutionStandards: boolean;
  electionTrigger: boolean;
  jailCapacity: number;
  rebelsModifier: number;
  environmentModifier: number;
  monthlyIncome: number;
  monthlyCostPerResident: number;
  monthlyCostPerSecurityStaff: number;
  swissSkimRate: number;
  militaryBonus: number;
  protestChanceModifier: number;
  foodQuality: number;
  foodConsumptionMultiplier: number;
  productivityMultiplier: number;
  educationMultiplier: number;
  populationGrowthMultiplier: number;
  factoryUpkeepMultiplier: number;
  crimeMultiplier: number;
  militaryMultiplier: number;
  cancelElections: boolean;
  closedBuildingTypes: BuildingType[];
  halfPriceBuildingTypes: BuildingType[];
  protectedSuperpowers: ("us" | "ussr")[];
  factionShareMultipliers: Partial<Record<FactionId, number>>;
}

export const defaultIslandModifiers: IslandModifiers = {
  approvalModifier: 0,
  crimeModifier: 0,
  libertyModifier: 0,
  tourismModifier: 0,
  tourismIncomeMultiplier: 1,
  entertainmentModifier: 0,
  superpowerAdjustments: { us: 0, ussr: 0 },
  factionAdjustments: {},
  exportPriceMultiplier: 1,
  costMultiplier: 1,
  airPollutionStandards: false,
  electionTrigger: false,
  jailCapacity: 0,
  rebelsModifier: 0,
  environmentModifier: 0,
  monthlyIncome: 0,
  monthlyCostPerResident: 0,
  monthlyCostPerSecurityStaff: 0,
  swissSkimRate: 0,
  militaryBonus: 0,
  protestChanceModifier: 0,
  foodQuality: 0,
  foodConsumptionMultiplier: 1,
  productivityMultiplier: 1,
  educationMultiplier: 1,
  populationGrowthMultiplier: 1,
  factoryUpkeepMultiplier: 1,
  crimeMultiplier: 1,
  militaryMultiplier: 1,
  cancelElections: false,
  closedBuildingTypes: [],
  halfPriceBuildingTypes: [],
  protectedSuperpowers: [],
  factionShareMultipliers: {},
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const counts = (placed: PlacedBuilding[], types: BuildingType[]) => placed.filter((building) => types.includes(building.type)).length;

export function relationLabel(value: number): RelationLabel {
  if (value < 15) return "Hostile";
  if (value < 30) return "Cold";
  if (value < 45) return "Cool";
  if (value < 56) return "Neutral";
  if (value < 70) return "Cordial";
  if (value < 85) return "Close";
  return "Allied";
}

export function atLeast(value: number, label: RelationLabel): boolean {
  const order: RelationLabel[] = ["Hostile", "Cold", "Cool", "Neutral", "Cordial", "Close", "Allied"];
  return order.indexOf(relationLabel(value)) >= order.indexOf(label);
}

export interface IslandInput {
  placed: PlacedBuilding[];
  population: number;
  buildingStaffing: number[];
  powered?: boolean[];
  jobs: number;
  educated: { highSchool: number; college: number };
  money: number;
  superpowers: { us: number; ussr: number };
  food: number;
  modifiers?: IslandModifiers;
}
export interface IslandResult {
  ratings: IslandRatings;
  factions: FactionStateMap;
  military: number;
  media: number;
  jailCapacity: number;
  beauty: number;
  pollution: number;
  tourismAttraction: number;
}

const leaders: Record<FactionId, string[]> = {
  communists: ["Mateo Alvarez", "Rosa Castillo", "Javier Morales"],
  capitalists: ["Esteban Fuentes", "Lucia Navarro", "Carlos Vega"],
  religious: ["Padre Miguel Santos", "Bishop Rafael Cruz", "Sister Isabel Ruiz"],
  intellectuals: ["Prof. Elena Marquez", "Dr. Tomas Reyes", "Ana Valdez"],
  militarists: ["General Diego Herrera", "Captain Luis Ortega", "Sgt. Ramon Flores"],
  environmentalists: ["Marina Solis", "Clara Mendez", "Pablo Rios"],
  nationalists: ["Andres Delgado", "Sofia Campos", "Manuel Paredes"],
  loyalists: ["Isabel Dominguez", "Felipe Romero", "Carmen Torres"],
};
const baseShares: Record<FactionId, number> = {
  communists: 0.25, capitalists: 0.1, religious: 0.2, intellectuals: 0.08,
  militarists: 0.12, environmentalists: 0.06, nationalists: 0.1, loyalists: 0.09,
};

export function calculateIsland(input: IslandInput): IslandResult {
  const { placed, population, buildingStaffing, educated } = input;
  const modifiers = input.modifiers ?? defaultIslandModifiers;
  const staff = (i: number) => buildingStaffing[i] ?? 0;
  const countStaff = (types: BuildingType[]) => placed.reduce((sum, item, i) => sum + (types.includes(item.type) ? staff(i) : 0), 0);
  const sumField = (field: "capacity" | "attraction" | "beauty" | "pollution", poweredBonus = false) => placed.reduce((sum, item, i) => {
    const effect = buildingEffects[item.type];
    const value = effect[field] ?? 0;
    const power = poweredBonus && (item.type === "hotel" || item.type === "luxury-hotel" || item.type === "casino" || item.type === "nightclub" || item.type === "movie-theater" || item.type === "airport" || item.type === "hospital" || item.type === "college") && input.powered?.[i] ? 1.1 : 1;
    return sum + value * staff(i) * power;
  }, 0);
  const visitorServices: BuildingType[] = ["pub", "restaurant", "gourmet-restaurant", "cabaret", "nightclub", "casino", "movie-theater", "conservatory", "sports-complex"];
  const serviceCapacity = placed.reduce((sum, item, i) => visitorServices.includes(item.type) ? sum + (buildingEffects[item.type].capacity ?? 0) * staff(i) * (buildingEffects[item.type].quality ?? 50) / 100 * (buildingEffects[item.type].powerDemand && input.powered?.[i] ? 1.1 : 1) : sum, 0);
  const religionCapacity = placed.reduce((sum, item, i) => item.type === "church" || item.type === "cathedral" ? sum + (buildingEffects[item.type].capacity ?? 0) * staff(i) : sum, 0);
  const healthCapacity = placed.reduce((sum, item, i) => item.type === "clinic" || item.type === "hospital" ? sum + (buildingEffects[item.type].capacity ?? 0) * staff(i) * (buildingEffects[item.type].quality ?? 50) / 50 * (item.type === "hospital" && input.powered?.[i] ? 1.1 : 1) : sum, 0);
  const schoolCapacity = placed.reduce((sum, item, i) => item.type === "high-school" || item.type === "college" ? sum + (buildingEffects[item.type].capacity ?? 0) * staff(i) * (item.type === "college" && input.powered?.[i] ? 1.1 : 1) : sum, 0);
  const police = countStaff(["police-station"]);
  const soldiers = countStaff(["guard-station"]) * 3 + countStaff(["army-base"]) * 15;
  const generals = countStaff(["armory"]) * 3;
  const military = (soldiers + generals + modifiers.militaryBonus) * modifiers.militaryMultiplier;
  const media = placed.reduce((sum, item, i) => sum + (["newspaper", "radio-station", "tv-station"].includes(item.type) ? staff(i) * (item.type === "tv-station" && input.powered?.[i] ? 1.1 : 1) : 0), 0);
  const populationSafe = Math.max(1, population);
  const unemploymentShare = population ? clamp((population - input.jobs) / population, 0, 1) : 0;
  const crime = clamp((10 + 30 * unemploymentShare - police * 8 - counts(placed, ["prison"]) * 4) * modifiers.crimeMultiplier + modifiers.crimeModifier);
  const liberty = clamp(70 - counts(placed, ["police-station"]) * 6 - counts(placed, ["army-base", "guard-station", "armory"]) * 3 - counts(placed, ["prison"]) * 8 + media * 5 + modifiers.libertyModifier);
  const beauty = sumField("beauty");
  let pollution = sumField("pollution") + counts(placed, ["cigar-factory", "rum-distillery", "lumber-mill", "cannery", "jewelry-factory", "furniture-factory"]) * 4 + counts(placed, ["dock"]) * 2;
  if (modifiers.airPollutionStandards) pollution *= 0.5;
  const environment = clamp(60 + beauty - pollution + modifiers.environmentModifier);
  const attraction = sumField("attraction") + counts(placed, ["beach-site", "pool", "spa", "tennis-court", "miniature-golf", "marina", "duty-free-shop", "souvenir-shop", "scenic-outlook"]) * 2;
  const tourism = clamp(attraction * 3 + beauty * 2 + serviceCapacity / populationSafe * 15 - crime + 40 + modifiers.tourismModifier);
  const ratings: IslandRatings = {
    health: clamp(healthCapacity / populationSafe * 100),
    religion: clamp(religionCapacity / populationSafe * 100),
    entertainment: clamp(serviceCapacity / populationSafe * 100 + modifiers.entertainmentModifier),
    education: clamp((educated.highSchool + educated.college * 2) / populationSafe * 60 + schoolCapacity / populationSafe * 40),
    crime,
    liberty,
    environment,
    tourism,
    military: clamp(military * 8),
    media: clamp(media * 20),
  };
  const shares: Record<FactionId, number> = { ...baseShares };
  shares.communists += Math.min(0.1, counts(placed, ["tenement", "bunkhouse"]) * 0.015);
  shares.capitalists += Math.min(0.1, counts(placed, ["luxury-house", "bank", "luxury-hotel"]) * 0.02);
  shares.religious += Math.min(0.1, counts(placed, ["church", "cathedral"]) * 0.02);
  shares.intellectuals += Math.min(0.1, counts(placed, ["high-school", "college", "newspaper", "radio-station", "tv-station"]) * 0.01);
  shares.militarists += Math.min(0.1, counts(placed, ["guard-station", "army-base", "armory"]) * 0.02);
  shares.environmentalists += Math.min(0.1, counts(placed, ["nature-preserve", "small-fountain", "large-fountain", "statue"]) * 0.02);
  shares.loyalists += Math.min(0.1, counts(placed, ["palace", "statue", "el-prez-home"]) * 0.015);
  for (const id of factionIds) shares[id] *= modifiers.factionShareMultipliers[id] ?? 1;
  const shareTotal = Object.values(shares).reduce((sum, value) => sum + value, 0);
  const respect: Record<FactionId, number> = {
    communists: clamp(35 + (population ? Math.min(20, placed.reduce((sum, item) => sum + (item.type === "house" || item.type === "apartment" || item.type === "tenement" || item.type === "bunkhouse" || item.type === "country-house" ? 8 : 0), 0) / population * 20) : 0) + (population ? Math.min(20, input.jobs / population * 20) : 0) + (population ? Math.min(20, input.food / population * 20) : 0) + (input.superpowers.ussr - 50) * 0.1),
    capitalists: clamp(40 + Math.min(15, input.money / 10000 * 15) + counts(placed, ["luxury-house", "bank"]) * 7 + (input.superpowers.us - 50) * 0.1),
    religious: clamp(25 + ratings.religion * 0.65),
    intellectuals: clamp(30 + ratings.education * 0.45 + ratings.liberty * 0.2),
    militarists: clamp(25 + ratings.military * 0.65),
    environmentalists: clamp(30 + ratings.environment * 0.55),
    nationalists: clamp(65 - counts(placed, ["airport", "dock", "hotel", "cheap-motel", "luxury-hotel", "beach-villa"]) * 2),
    loyalists: clamp(35 + counts(placed, ["palace", "statue", "el-prez-home"]) * 8),
  };
  const factions = Object.fromEntries(factionIds.map((id, i) => [id, {
    respect: clamp(respect[id] + (modifiers.factionAdjustments[id] ?? 0)),
    share: shares[id] / shareTotal,
    leader: leaders[id][(counts(placed, ["palace", "bank", "church", "college", "army-base", "nature-preserve"]) + i) % leaders[id].length],
  }])) as FactionStateMap;
  const jailCapacity = placed.reduce((sum, item, i) => sum + (item.type === "prison" ? 8 * staff(i) : item.type === "colonial-fort" ? 4 : 0), 0) + modifiers.jailCapacity;
  return { ratings, factions, military, media, jailCapacity, beauty, pollution, tourismAttraction: attraction };
}
