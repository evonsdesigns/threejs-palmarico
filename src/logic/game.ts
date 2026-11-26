import { footprintAt, rotatedTiles, type GridFootprint, type Rotation } from "./grid";

export type BuildingType = "palace" | "shack" | "house" | "farm" | "market" | "clinic"
  | "apartment" | "condominium" | "luxury-house" | "bunkhouse" | "country-house"
  | "bungalow" | "ranch" | "tenement" | "pub" | "restaurant" | "teamsters-office";

export const farmCrops = ["corn", "pineapple", "coffee", "sugar", "tobacco", "papaya", "bananas"] as const;
export type FarmCrop = typeof farmCrops[number];
export const farmCropProduction: Record<FarmCrop, { food: number; revenue: number }> = {
  corn: { food: 16, revenue: 180 },
  pineapple: { food: 12, revenue: 220 },
  coffee: { food: 0, revenue: 300 },
  sugar: { food: 0, revenue: 260 },
  tobacco: { food: 0, revenue: 320 },
  papaya: { food: 12, revenue: 200 },
  bananas: { food: 14, revenue: 200 },
};
export const pubDressCodes = ["none", "upscale"] as const;
export type PubDressCode = typeof pubDressCodes[number];
export const pubCapacity = 8;
export const pubCharge = 15;
export const restaurantTableSettings = ["paper", "cloth", "linen"] as const;
export type RestaurantTableSetting = typeof restaurantTableSettings[number];
export const restaurantTableSettingDetails: Record<RestaurantTableSetting, { name: string; upkeep: number; quality: number }> = {
  paper: { name: "Paper Placemats", upkeep: 0.5, quality: 0.9 },
  cloth: { name: "Cloth Napkins", upkeep: 1, quality: 1 },
  linen: { name: "Linen Tablecloths", upkeep: 1.5, quality: 1.2 },
};
export const restaurantCapacity = 10;
export const restaurantCharge = 20;
export const restaurantBaseQuality = 40;
export function restaurantQuality(setting: RestaurantTableSetting = "cloth") {
  return Math.round(restaurantBaseQuality * restaurantTableSettingDetails[setting].quality);
}
export const teamsterWorkModes = ["normal", "sweatshop", "easy"] as const;
export type TeamsterWorkMode = typeof teamsterWorkModes[number];
export const teamsterWorkModeDetails: Record<TeamsterWorkMode, { name: string; hauling: number; approval: number }> = {
  normal: { name: "Normal Hours", hauling: 0.1, approval: 0 },
  sweatshop: { name: "Sweat Shop", hauling: 0.15, approval: -3 },
  easy: { name: "Easy-Does-It", hauling: 0.08, approval: 2 },
};
export const maxHaulingBonus = 0.3;
export const gameSpeeds = [1, 2, 3, 4, 5] as const;
export type GameSpeed = typeof gameSpeeds[number];

export interface BuildingDefinition {
  id: BuildingType;
  name: string;
  icon: string;
  cost: number;
  upkeep: number;
  jobs: number;
  housing: number;
  food: number;
  revenue: number;
  /** Footprint in tiles along x and z at rotation 0 (see docs/game-info.md). */
  tiles: readonly [number, number];
  description: string;
}

export const buildings: BuildingDefinition[] = [
  { id: "palace", name: "Palace", icon: "♜", cost: 0, upkeep: 0, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [6, 5], description: "The island's seat of government." },
  { id: "shack", name: "Shack", icon: "⌂", cost: 0, upkeep: 0, jobs: 0, housing: 2, food: 0, revenue: 0, tiles: [1, 1], description: "Informal shelter for 2 residents." },
  { id: "house", name: "House", icon: "⌂", cost: 400, upkeep: 10, jobs: 0, housing: 8, food: 0, revenue: 0, tiles: [2, 3], description: "Homes for 8 residents." },
  { id: "apartment", name: "Apartment", icon: "▦", cost: 1200, upkeep: 40, jobs: 0, housing: 24, food: 0, revenue: 0, tiles: [4, 3], description: "Homes for 24 residents." },
  { id: "tenement", name: "Tenement", icon: "▦", cost: 800, upkeep: 30, jobs: 0, housing: 32, food: 0, revenue: 0, tiles: [4, 3], description: "Inexpensive homes for 32 residents." },
  { id: "condominium", name: "Condominium", icon: "⌂", cost: 1600, upkeep: 55, jobs: 0, housing: 16, food: 0, revenue: 0, tiles: [3, 3], description: "Homes for 16 residents." },
  { id: "luxury-house", name: "Luxury House", icon: "⌂", cost: 1000, upkeep: 35, jobs: 0, housing: 4, food: 0, revenue: 0, tiles: [3, 3], description: "Homes for 4 residents." },
  { id: "bunkhouse", name: "Bunkhouse", icon: "⌂", cost: 300, upkeep: 12, jobs: 0, housing: 12, food: 0, revenue: 0, tiles: [3, 2], description: "Homes for 12 residents." },
  { id: "country-house", name: "Country House", icon: "⌂", cost: 250, upkeep: 8, jobs: 0, housing: 4, food: 0, revenue: 0, tiles: [2, 2], description: "Homes for 4 residents." },
  { id: "bungalow", name: "Bungalow", icon: "⌂", cost: 300, upkeep: 12, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [2, 3], description: "Tourist accommodation; tourism is not simulated yet." },
  { id: "ranch", name: "Ranch", icon: "✿", cost: 650, upkeep: 35, jobs: 4, housing: 0, food: 12, revenue: 140, tiles: [3, 3], description: "Feeds 12 people and creates 4 jobs." },
  { id: "farm", name: "Farm", icon: "✿", cost: 1000, upkeep: 30, jobs: 4, housing: 0, food: 16, revenue: 180, tiles: [4, 3], description: "Produces food or cash crops and creates 4 farming jobs." },
  { id: "market", name: "Market", icon: "◈", cost: 450, upkeep: 25, jobs: 4, housing: 0, food: 0, revenue: 150, tiles: [3, 3], description: "Earns income and creates 4 jobs." },
  { id: "clinic", name: "Clinic", icon: "✚", cost: 500, upkeep: 35, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Improves approval and creates 3 jobs." },
  { id: "pub", name: "Pub", icon: "♨", cost: 800, upkeep: 25, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "A pub with 2 barmaid jobs, 8 visitor spaces and base service quality 35." },
  { id: "restaurant", name: "Restaurant", icon: "🍽", cost: 2000, upkeep: 40, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "A restaurant with 2 cook jobs, 10 visitor spaces and base service quality 40." },
  { id: "teamsters-office", name: "Teamster's Office", icon: "⛟", cost: 2000, upkeep: 40, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Employs 8 teamsters who haul farm and ranch goods to market." },
];

export function buildingUpkeep(building: PlacedBuilding): number {
  const upkeep = buildings.find((item) => item.id === building.type)!.upkeep;
  return building.type === "restaurant"
    ? Math.round(upkeep * restaurantTableSettingDetails[building.tableSetting ?? "cloth"].upkeep)
    : upkeep;
}

export function buildingFootprint(building: Pick<PlacedBuilding, "type" | "x" | "z" | "rotation">): GridFootprint {
  const [sizeX, sizeZ] = rotatedTiles(buildings.find((item) => item.id === building.type)!.tiles, building.rotation ?? 0);
  return footprintAt(building.x, building.z, sizeX, sizeZ);
}

export const starterBuildings: readonly BuildingType[] = ["palace", "farm"];

export interface PlacedBuilding {
  type: BuildingType;
  x: number;
  z: number;
  rotation?: Rotation;
  crop?: FarmCrop;
  dressCode?: PubDressCode;
  tableSetting?: RestaurantTableSetting;
  workMode?: TeamsterWorkMode;
}

export interface ResidentPlan {
  home: number | null;
  work: number | null;
  service: number | null;
}

export function planResidents(placed: PlacedBuilding[], population: number): ResidentPlan[] {
  const defs = placed.map((building) => buildings.find((item) => item.id === building.type)!);
  const homes: number[] = [];
  const jobs: number[] = [];
  const addSlots = (slots: number[], index: number, capacity: number) => {
    for (let i = 0; i < capacity && slots.length < population; i++) slots.push(index);
  };
  placed.forEach((building, index) => {
    if (building.type !== "shack") addSlots(homes, index, defs[index].housing);
    addSlots(jobs, index, defs[index].jobs);
  });
  placed.forEach((building, index) => {
    if (building.type === "shack") addSlots(homes, index, defs[index].housing);
  });
  const fallback = placed.findIndex((building) => building.type === "palace");
  return Array.from({ length: population }, (_, resident) => {
    const services = placed.flatMap((building, index) => {
      if (building.type === "clinic" || building.type === "market" || building.type === "restaurant") return [index];
      if (building.type === "pub" && (building.dressCode !== "upscale" || resident < Math.floor(population / 2))) return [index];
      return [];
    });
    return {
      home: homes[resident] ?? (fallback === -1 ? null : fallback),
      work: jobs[resident] ?? null,
      service: services.length ? services[resident % services.length] : null,
    };
  });
}

export interface GameSnapshot {
  money: number;
  slushFund: number;
  population: number;
  month: number;
  year: number;
  paused: boolean;
  speed: GameSpeed;
  selected: BuildingType | null;
  inspectedBuilding: number | null;
  farmCrop: FarmCrop;
  pubDressCode: PubDressCode;
  restaurantTableSetting: RestaurantTableSetting;
  placed: PlacedBuilding[];
  housing: number;
  food: number;
  jobs: number;
  approval: number;
  balance: number;
  pubVisitors: number[];
  pubStaffedCapacity: number;
  restaurantVisitors: number[];
  restaurantStaffedCapacity: number;
  /** Fractional boost to farm and ranch income from staffed teamster offices. */
  haulingBonus: number;
  teamsterWorkMode: TeamsterWorkMode;
  placementRotation: Rotation;
  notice: string;
}

function calculate(placed: PlacedBuilding[], population: number) {
  const defs = placed.map((building) => buildings.find((item) => item.id === building.type)!);
  const housing = defs.reduce((sum, item) => sum + item.housing, 0);
  const production = placed.map((building, index) => building.type === "farm"
    ? farmCropProduction[building.crop ?? "corn"]
    : defs[index]);
  const food = production.reduce((sum, item) => sum + item.food, 0);
  const jobs = defs.reduce((sum, item) => sum + item.jobs, 0);
  const staffing = jobs === 0 ? 0 : Math.min(1, population / jobs);
  const pubStaffedCapacity = Math.floor(pubCapacity * staffing);
  const pubVisitors = placed.map(() => 0);
  let upscaleResidents = Math.floor(population / 2);
  let otherResidents = population - upscaleResidents;
  placed.forEach((building, index) => {
    if (building.type !== "pub" || building.dressCode !== "upscale") return;
    const visitors = Math.min(pubStaffedCapacity, upscaleResidents);
    pubVisitors[index] = visitors;
    upscaleResidents -= visitors;
  });
  placed.forEach((building, index) => {
    if (building.type !== "pub" || building.dressCode === "upscale") return;
    const otherVisitors = Math.min(pubStaffedCapacity, otherResidents);
    const upscaleVisitors = Math.min(pubStaffedCapacity - otherVisitors, upscaleResidents);
    pubVisitors[index] = otherVisitors + upscaleVisitors;
    otherResidents -= otherVisitors;
    upscaleResidents -= upscaleVisitors;
  });
  const staffedFood = Math.floor(food * staffing);
  const clinic = defs.some((item) => item.id === "clinic") && staffing > 0;
  const housingScore = population ? Math.min(1, housing / population) : 1;
  const foodScore = population ? Math.min(1, staffedFood / population) : 1;
  const teamsterOffices = placed.filter((building) => building.type === "teamsters-office");
  const haulingBonus = staffing * Math.min(maxHaulingBonus,
    teamsterOffices.reduce((sum, building) => sum + teamsterWorkModeDetails[building.workMode ?? "normal"].hauling, 0));
  const teamsterMorale = staffing > 0
    ? teamsterOffices.reduce((sum, building) => sum + teamsterWorkModeDetails[building.workMode ?? "normal"].approval, 0)
    : 0;
  const approval = Math.max(0, Math.min(100, Math.round(20 + 30 * housingScore + 35 * foodScore + (clinic ? 15 : 0) + teamsterMorale)));
  const restaurantStaffedCapacity = Math.floor(restaurantCapacity * staffing);
  const restaurantVisitors = placed.map(() => 0);
  let diners = population;
  placed.map((_, index) => index)
    .filter((index) => placed[index].type === "restaurant")
    .sort((a, b) => restaurantQuality(placed[b].tableSetting) - restaurantQuality(placed[a].tableSetting) || a - b)
    .forEach((index) => {
      restaurantVisitors[index] = Math.min(restaurantStaffedCapacity, diners);
      diners -= restaurantVisitors[index];
    });
  const pubRevenue = pubVisitors.reduce((sum, visitors) => sum + visitors * pubCharge, 0);
  const restaurantRevenue = restaurantVisitors.reduce((sum, visitors) => sum + visitors * restaurantCharge, 0);
  const balance = 100 + pubRevenue + restaurantRevenue
    + Math.round(placed.reduce((sum, building, index) => {
      const hauled = building.type === "farm" || building.type === "ranch" ? 1 + haulingBonus : 1;
      return sum + production[index].revenue * staffing * hauled - buildingUpkeep(building);
    }, 0));
  return { housing, food: staffedFood, jobs, approval, balance, pubVisitors, pubStaffedCapacity, restaurantVisitors, restaurantStaffedCapacity, haulingBonus };
}

export class GameState {
  private listeners = new Set<() => void>();
  private initialized = false;
  private elapsed = 0;
  private state: GameSnapshot = {
    money: 3000, slushFund: 0, population: 8, month: 1, year: 1950, paused: false, speed: 1,
    selected: null, inspectedBuilding: null, farmCrop: "corn", pubDressCode: "none", restaurantTableSetting: "cloth", teamsterWorkMode: "normal", placementRotation: 0, placed: [], ...calculate([], 8),
    notice: "Loading the island...",
  };

  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update(patch: Partial<GameSnapshot>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  initializeIsland(placed: PlacedBuilding[]) {
    if (this.initialized) throw new Error("The island has already been initialized.");
    if (placed.length !== starterBuildings.length || placed.some((item, index) => item.type !== starterBuildings[index])) {
      throw new Error("Invalid starting settlement.");
    }
    this.initialized = true;
    this.update({
      placed: placed.map((item) => ({ ...item })),
      ...calculate(placed, this.state.population),
      notice: "Your palace and farm are ready. Residents will build shacks if they need shelter.",
    });
  }

  /** Developer start: one of every building, so models can be inspected side by side. */
  initializeShowcase(placed: PlacedBuilding[]) {
    if (this.initialized) throw new Error("The island has already been initialized.");
    const types = placed.map((item) => item.type);
    if (types.length !== buildings.length || buildings.some((item) => !types.includes(item.id))) {
      throw new Error("The showcase must contain exactly one of every building.");
    }
    this.initialized = true;
    this.update({
      placed: placed.map((item) => ({ ...item })),
      ...calculate(placed, this.state.population),
      notice: "Developer showcase: one of every building. Add ?normal-start to the URL for a regular island.",
    });
  }

  addShack(x: number, z: number): boolean {
    if (this.state.housing >= this.state.population) return false;
    const placed = [...this.state.placed, { type: "shack" as const, x, z }];
    this.update({ placed, ...calculate(placed, this.state.population) });
    return true;
  }

  select(type: BuildingType | null) {
    this.update({ selected: type, inspectedBuilding: null, notice: type ? `Place a ${buildings.find((item) => item.id === type)!.name} on level land. Esc cancels.` : "Placement cancelled." });
  }

  inspectBuilding(index: number | null) {
    if (index !== null && !this.state.placed[index]) throw new Error("Cannot inspect a missing building.");
    this.update({ inspectedBuilding: index });
  }

  setBuildingCrop(index: number, crop: FarmCrop) {
    const building = this.state.placed[index];
    if (!building || building.type !== "farm") throw new Error("Cannot set a crop on a non-farm building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, crop } : item);
    this.update({ placed, ...calculate(placed, this.state.population), notice: `Farm crop changed to ${crop}.` });
  }

  setBuildingDressCode(index: number, dressCode: PubDressCode) {
    const building = this.state.placed[index];
    if (!building || building.type !== "pub") throw new Error("Cannot set a dress code on a non-pub building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, dressCode } : item);
    this.update({ placed, ...calculate(placed, this.state.population), notice: `Pub dress code changed to ${dressCode === "none" ? "none" : "upscale"}.` });
  }

  setBuildingTableSetting(index: number, tableSetting: RestaurantTableSetting) {
    const building = this.state.placed[index];
    if (!building || building.type !== "restaurant") throw new Error("Cannot set table settings on a non-restaurant building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, tableSetting } : item);
    this.update({ placed, ...calculate(placed, this.state.population), notice: `Restaurant now uses ${restaurantTableSettingDetails[tableSetting].name.toLowerCase()}.` });
  }

  setBuildingWorkMode(index: number, workMode: TeamsterWorkMode) {
    const building = this.state.placed[index];
    if (!building || building.type !== "teamsters-office") throw new Error("Cannot set work hours on a non-teamster building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, workMode } : item);
    this.update({ placed, ...calculate(placed, this.state.population), notice: `Teamster's Office now works ${teamsterWorkModeDetails[workMode].name.toLowerCase()}.` });
  }

  selectTeamsterWorkMode(workMode: TeamsterWorkMode) {
    this.update({ teamsterWorkMode: workMode });
  }

  rotatePlacement(direction: 1 | -1) {
    this.update({ placementRotation: ((this.state.placementRotation + direction + 4) % 4) as Rotation });
  }

  selectRestaurantTableSetting(tableSetting: RestaurantTableSetting) {
    this.update({ restaurantTableSetting: tableSetting });
  }

  selectFarmCrop(crop: FarmCrop) {
    this.update({ farmCrop: crop });
  }

  selectPubDressCode(dressCode: PubDressCode) {
    this.update({ pubDressCode: dressCode });
  }

  togglePause() {
    this.update({ paused: !this.state.paused });
  }

  setSpeed(speed: GameSpeed) {
    if (!gameSpeeds.some((option) => option === speed)) throw new Error("Invalid game speed.");
    this.update({ speed });
  }

  advanceTime(seconds: number): number {
    if (!Number.isFinite(seconds) || seconds < 0) throw new Error("Invalid elapsed time.");
    if (this.state.paused) return 0;
    const elapsed = seconds * this.state.speed;
    this.elapsed += elapsed;
    while (this.elapsed >= 5) {
      this.elapsed -= 5;
      this.advanceMonth();
    }
    return elapsed;
  }

  notify(notice: string) {
    this.update({ notice });
  }

  place(type: BuildingType, x: number, z: number): boolean {
    const definition = buildings.find((item) => item.id === type)!;
    if (type === "palace" || type === "shack") {
      this.notify(type === "palace" ? "The island already has a palace." : "Residents build shacks themselves when they need shelter.");
      return false;
    }
    if (this.state.money < definition.cost) {
      this.notify(`Not enough treasury funds for a ${definition.name}.`);
      return false;
    }
    const building: PlacedBuilding = { type, x, z, rotation: this.state.placementRotation };
    if (type === "farm") building.crop = this.state.farmCrop;
    if (type === "pub") building.dressCode = this.state.pubDressCode;
    if (type === "restaurant") building.tableSetting = this.state.restaurantTableSetting;
    if (type === "teamsters-office") building.workMode = this.state.teamsterWorkMode;
    const placed = [...this.state.placed, building];
    this.update({
      placed,
      money: this.state.money - definition.cost,
      ...calculate(placed, this.state.population),
      notice: `${definition.name} built for $${definition.cost}. Click to build another, or press Esc.`,
    });
    return true;
  }

  advanceMonth() {
    if (this.state.paused) return;
    const { placed, population, month, year } = this.state;
    const current = calculate(placed, population);
    let nextPopulation = population;
    if (current.approval >= 60 && current.housing > population && current.jobs > population) {
      nextPopulation++;
    } else if (current.approval < 35 && population > 0) {
      nextPopulation--;
    }
    this.update({
      money: this.state.money + current.balance,
      population: nextPopulation,
      month: month === 12 ? 1 : month + 1,
      year: month === 12 ? year + 1 : year,
      ...calculate(placed, nextPopulation),
    });
  }
}

export const game = new GameState();
