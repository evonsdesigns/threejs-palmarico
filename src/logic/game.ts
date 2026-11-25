export type BuildingType = "palace" | "shack" | "house" | "farm" | "market" | "clinic"
  | "apartment" | "condominium" | "luxury-house" | "bunkhouse" | "country-house"
  | "bungalow" | "ranch";

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
  radius: number;
  description: string;
}

export const buildings: BuildingDefinition[] = [
  { id: "palace", name: "Palace", icon: "♜", cost: 0, upkeep: 0, jobs: 0, housing: 0, food: 0, revenue: 0, radius: 13, description: "The island's seat of government." },
  { id: "shack", name: "Shack", icon: "⌂", cost: 0, upkeep: 0, jobs: 0, housing: 2, food: 0, revenue: 0, radius: 4, description: "Informal shelter for 2 residents." },
  { id: "house", name: "House", icon: "⌂", cost: 400, upkeep: 10, jobs: 0, housing: 8, food: 0, revenue: 0, radius: 6, description: "Homes for 8 residents." },
  { id: "apartment", name: "Apartment", icon: "▦", cost: 1200, upkeep: 40, jobs: 0, housing: 24, food: 0, revenue: 0, radius: 8, description: "Homes for 24 residents." },
  { id: "condominium", name: "Condominium", icon: "⌂", cost: 1600, upkeep: 55, jobs: 0, housing: 16, food: 0, revenue: 0, radius: 10, description: "Homes for 16 residents." },
  { id: "luxury-house", name: "Luxury House", icon: "⌂", cost: 1000, upkeep: 35, jobs: 0, housing: 4, food: 0, revenue: 0, radius: 8.5, description: "Homes for 4 residents." },
  { id: "bunkhouse", name: "Bunkhouse", icon: "⌂", cost: 300, upkeep: 12, jobs: 0, housing: 12, food: 0, revenue: 0, radius: 9, description: "Homes for 12 residents." },
  { id: "country-house", name: "Country House", icon: "⌂", cost: 250, upkeep: 8, jobs: 0, housing: 4, food: 0, revenue: 0, radius: 5, description: "Homes for 4 residents." },
  { id: "bungalow", name: "Bungalow", icon: "⌂", cost: 300, upkeep: 12, jobs: 0, housing: 0, food: 0, revenue: 0, radius: 5, description: "Tourist accommodation; tourism is not simulated yet." },
  { id: "ranch", name: "Ranch", icon: "✿", cost: 650, upkeep: 35, jobs: 4, housing: 0, food: 12, revenue: 140, radius: 10, description: "Feeds 12 people and creates 4 jobs." },
  { id: "farm", name: "Farm", icon: "✿", cost: 600, upkeep: 30, jobs: 6, housing: 0, food: 16, revenue: 180, radius: 7, description: "Feeds 16 people and creates 6 jobs." },
  { id: "market", name: "Market", icon: "◈", cost: 450, upkeep: 25, jobs: 4, housing: 0, food: 0, revenue: 150, radius: 5, description: "Earns income and creates 4 jobs." },
  { id: "clinic", name: "Clinic", icon: "✚", cost: 500, upkeep: 35, jobs: 3, housing: 0, food: 0, revenue: 0, radius: 5, description: "Improves approval and creates 3 jobs." },
];

export const starterBuildings: readonly BuildingType[] = ["palace", "farm"];

export interface PlacedBuilding {
  type: BuildingType;
  x: number;
  z: number;
}

export interface GameSnapshot {
  money: number;
  slushFund: number;
  population: number;
  month: number;
  year: number;
  paused: boolean;
  selected: BuildingType | null;
  placed: PlacedBuilding[];
  housing: number;
  food: number;
  jobs: number;
  approval: number;
  balance: number;
  notice: string;
}

function calculate(placed: PlacedBuilding[], population: number) {
  const defs = placed.map((building) => buildings.find((item) => item.id === building.type)!);
  const housing = defs.reduce((sum, item) => sum + item.housing, 0);
  const food = defs.reduce((sum, item) => sum + item.food, 0);
  const jobs = defs.reduce((sum, item) => sum + item.jobs, 0);
  const staffing = jobs === 0 ? 0 : Math.min(1, population / jobs);
  const staffedFood = Math.floor(food * staffing);
  const clinic = defs.some((item) => item.id === "clinic") && staffing > 0;
  const housingScore = population ? Math.min(1, housing / population) : 1;
  const foodScore = population ? Math.min(1, staffedFood / population) : 1;
  const approval = Math.round(20 + 30 * housingScore + 35 * foodScore + (clinic ? 15 : 0));
  const balance = 100 + Math.round(defs.reduce((sum, item) => sum + item.revenue * staffing - item.upkeep, 0));
  return { housing, food: staffedFood, jobs, approval, balance };
}

export class GameState {
  private listeners = new Set<() => void>();
  private initialized = false;
  private state: GameSnapshot = {
    money: 3000, slushFund: 0, population: 8, month: 1, year: 1950, paused: false,
    selected: null, placed: [], ...calculate([], 8),
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

  addShack(x: number, z: number): boolean {
    if (this.state.housing >= this.state.population) return false;
    const placed = [...this.state.placed, { type: "shack" as const, x, z }];
    this.update({ placed, ...calculate(placed, this.state.population) });
    return true;
  }

  select(type: BuildingType | null) {
    this.update({ selected: type, notice: type ? `Place a ${buildings.find((item) => item.id === type)!.name} on level land. Esc cancels.` : "Placement cancelled." });
  }

  togglePause() {
    this.update({ paused: !this.state.paused });
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
    const placed = [...this.state.placed, { type, x, z }];
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
