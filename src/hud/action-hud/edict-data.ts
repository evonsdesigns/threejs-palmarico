// Common interface for all edicts
export interface Edict {
  name: string;
  cost: string;
  requirements: string;
  effects: string;
}

// People Edicts
export const peopleEdicts: Edict[] = [
  {
    name: "Bribe",
    cost: "$1000",
    requirements: "A bank and a banker.",
    effects: "The targeted citizen will be given some money from the state's coffers. This will increase the wealth and respect of the target and their relatives for a period of 3 years. Note that occasionally bribes will not work."
  },
  {
    name: "Arrest",
    cost: "$500",
    requirements: "A police station, a policeman and a prison with at least 1 cell available.",
    effects: "A policeman is sent to arrest the target. If successful, the target stays jailed for a period of 5 to 8 years. The target and their family significantly lose respect for El Presidente, and the people within a 10 cells radius from the arrest location have their respect influenced as well. The target might flee or fight back, in which case the policeman will shoot to kill. If the target succeeds, they become a rebel."
  },
  {
    name: "Capture",
    cost: "$500",
    requirements: "A dungeon with at least one empty cell (Note: dungeons are extensions built inside colonial forts. These are randomly generated on random maps.)",
    effects: ""
  },
  {
    name: "Heretic",
    cost: "$500",
    requirements: "A Cathedral and a bishop",
    effects: "A bishop will tag the target as heretic, making them unable to lead or join protests, coups or uprisings. The target and their family will lose respect for El Presidente."
  },
  {
    name: "Eliminate",
    cost: "$500",
    requirements: "At least one soldier.",
    effects: "A soldier will shoot to murder the targeted citizen. If successful, the target is killed, and their family's respect for El Presidente drops. The respect from people within a 10 cell radius from the murder location will also be influenced. The target may run or fight back, and if they succeed, the target becomes a rebel."
  }
];

// Foreign Policy Edicts
export const foreignPolicyEdicts: Edict[] = [
  {
    name: "Praise U.S.",
    cost: "$500",
    requirements: "A Diplomatic Ministry and a minimum 3 years of distance from a previous praising.",
    effects: "El Presidente will perform a speech praising the US. Relations with Russia will decrease, but not as much as they increase with the U.S."
  },
  {
    name: "Trade Delegation to U.S.",
    cost: "$1000",
    requirements: "A diplomatic ministry, an airport and cold or better relations with the U.S.",
    effects: "El Presidente is given the chance to receive higher export prices, free buildings, educated workers or a one-time foreign aid."
  },
  {
    name: "U.S. Development Aid",
    cost: "$2000",
    requirements: "A diplomatic ministry and cool or better relations with the U.S.",
    effects: "El Presidente is granted blueprints from the U.S. allowing airports and Power Plants to be built for half the price. (Note: Can be used along with the Russian counterpart, see 'Russian Development Aid' below)"
  },
  {
    name: "Alliance with U.S.",
    cost: "$6000",
    requirements: "A diplomatic ministry and close or better relations with the U.S.",
    effects: "A U.S. military base is installed on the island (you obviously can't remove it) for an annual fee of $1000 paid to the Tropican state coffers. This will prevent Russia from invading in case of bad relationship, on the other hand the U.S. will invade instantly if relations turn bad."
  },
  {
    name: "Praise Russia",
    cost: "$500",
    requirements: "A diplomatic ministry and a minimum 3 years of distance from a previous praising.",
    effects: "El Presidente will perform a speech praising Russia. Relations with the U.S. will decrease, but not as much as they increase with the U.S."
  },
  {
    name: "Trade Delegation to Russia",
    cost: "$1000",
    requirements: "A diplomatic ministry, an airport and cold or better relations with Russia.",
    effects: "El Presidente is given the chance to receive higher export prices, free buildings, educated workers or a one-time foreign development aid."
  },
  {
    name: "Russian Development Aid",
    cost: "$2000",
    requirements: "A diplomatic ministry and cool or better relations with Russia.",
    effects: "El Presidente is granted blueprints from Russia allowing tenements and apartments to be built for half the price. (Note: Can be used along with the U.S. counterpart, see 'U.S. Development Aid' above)"
  },
  {
    name: "Alliance with Russia",
    cost: "$6000",
    requirements: "A diplomatic ministry and close or better relations with Russia.",
    effects: "A Russian military base is installed on the island (you obviously can't remove it) for an annual fee of $1000 paid to the Tropican state coffers. This will prevent The U.S. from invading in case of bad relationship, on the other hand Russia will invade instantly if relations turn bad."
  }
];

// Economic Edicts
export const economicEdicts: Edict[] = [
  {
    name: "Industry Ad Campaign",
    cost: "$8000",
    requirements: "Two factories of any kind and a television broadcasting station.",
    effects: "Due to the advertisement campaign export prices will rise by 20% during the 3 years period the campaign lasts."
  },
  {
    name: "Air Pollution Standards",
    cost: "$500",
    requirements: "A factory of any kind.",
    effects: "The pollution coming from factories will decrease by 50%, but their maintenance costs rise by 20%."
  },
  {
    name: "Tourism Ad Campaign",
    cost: "$5000",
    requirements: "A hotel of any kind and a television broadcasting station.",
    effects: "The 3 year advertisement campaign will attract extra tourists,and those arriving due to the campaign pay twice the regular hotel rate."
  },
  {
    name: "The Headliner!",
    cost: "$5000",
    requirements: "A nightclub.",
    effects: "The Headliner, a world-famous rock music star, is invited to Tropico for 3 years. This will increase the tourism rating by 20%, the citizens' entertaining by 10%. The relation with the U.S. increases by 10% as well, it's thus speculated that the Headliner hails from the U.S."
  },
  {
    name: "Spring Break Package",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Tax Cut",
    cost: "Varies depending on the total residents,$100 per resident",
    requirements: "At least 3 years of distance from the previous tax cut.",
    effects: "Raises wealth, respect and happiness of each citizen (at least for a while), giving a good economic boost and helping El Presidente win elections."
  },
  {
    name: "'Special' Building Permit",
    cost: "$500",
    requirements: "A bank",
    effects: "The price of all buildings is padded up by 20% and 10% is given back on El Presidente's Swiss bank account (unless El Presidente has the 'Incorruptible' trait, in that case Swiss banking isn't allowed). The Intellectuals will notice something is off, and their respect will dive by 10%."
  },
  {
    name: "Pan-Caribbean Games",
    cost: "$7500",
    requirements: "A sports complex.",
    effects: "For 3 years the Pan-Caribbean games will be hosted on the island, this will increase the tourism rating by a stunning 50% and the citizens' entertainment by 20%. (NOTE: Tropico may host the games ONLY ONCE!)"
  },
  {
    name: "Mardi Gras",
    cost: "$3000",
    requirements: "A pub.",
    effects: "A Mardi Gras day is promoted, this boosts the citizen's entertainment by 30% and tourism rating by 20%, but also gives a 20% boost to crime."
  },
  {
    name: "World Geographic Package",
    cost: "",
    requirements: "",
    effects: ""
  }
];

// Political/Religious Edicts
export const politicalReligiousEdicts: Edict[] = [
  {
    name: "Amnesty",
    cost: "$500",
    requirements: "An armory and a cordial or better relation with the militarists.",
    effects: "El Presidente officially gives rebels the chance to return to their ordinary lives for 3 years. Rebels will re-join society with an improvement between 5 and 10% of the social conditions. If the edict is issued after the improvements, rebels are 4 times more incline to embrace the regime."
  },
  {
    name: "Early Elections",
    cost: "$2000",
    requirements: "None",
    effects: "As the name states, El Presidente calls for an election before the citizens do."
  },
  {
    name: "Inquisition",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Book BBQ",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Military Modernization",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Martial Law",
    cost: "$6,500",
    requirements: "",
    effects: ""
  },
  {
    name: "Open the Jails",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Papal Visit",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Conscription",
    cost: "",
    requirements: "",
    effects: ""
  }
];

// Social Edicts
export const socialEdicts: Edict[] = [
  {
    name: "Prohibition",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Literacy Program",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Contraception Ban",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Social Security",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Anti-Litter Ordinance",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Sensitivity Training",
    cost: "",
    requirements: "",
    effects: ""
  },
  {
    name: "Food for the People",
    cost: "",
    requirements: "",
    effects: ""
  }
];
