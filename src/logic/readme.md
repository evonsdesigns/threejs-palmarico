# Simulation logic

`game.ts` owns island state, construction, monthly progression and the public `GameSnapshot`.
`building-effects.ts` is the typed per-building mechanics registry; `island.ts` contains pure ratings,
faction, and relation helpers (`calculateIsland`, `relationLabel`, `atLeast`).

The snapshot exposes `buildingStaffing`, `buildingOperation`, `buildingIncome`, `goods`, `powered`, `ratings`, `educated`,
`factions`, `superpowers`, `tourists`, `tourismIncome`, `military`, `police`, `jailCapacity`, `rebels`,
`nextElectionYear`, `gameOver`, `activeEdicts`, `edictCooldowns`, `issuedOnce`, and `jailUsed`. `missingRequirement(type, state)` serves the construction menu and
`buildingCost(type, state)` includes construction-office discounts and active edict price modifiers. `game.issueEdict(id)` / `game.cancelEdict(id)` return `null` on success or an explanatory error string; active effects, expiry, cooldown and once-only state are in the snapshot.

## Electricity

Staffed power plants supply a 24-tile radius. A substation inside a live plant's
or substation's coverage extends the grid by another 10 tiles; chains work in
any placement order, but disconnected loops cannot generate electricity.
Closed or unstaffed plants and closed substations cannot supply the network.

`buildingStaffing` tracks allocated workers. `buildingOperation` tracks the
operating fraction: buildings marked `needsPower` operate at zero without
coverage, retaining their staff and normal staffed upkeep. Their services,
entertainment income, tourist beds and attractions stop until electricity returns.
Colleges and cathedrals do not require electricity; substations require a power plant
before construction. See the [official manual](../../docs/tropico1_manual_en.pdf),
Appendix A (PDF pages 29–30), and the [strategy guide](../../docs/manual.md),
infrastructure and human-services sections. Ordinary buildings and optional powered bonuses retain
their existing behavior. Building details and the almanac report outages.
Coverage radii are existing Palmarico balance values, not verified original-game
distances. Megawatt production, demand and overloads are not yet modeled.

## Edict integration hooks

Call `game.setSimulationModifiers(patch: Partial<IslandModifiers>)`; the merged values are available as
`GameSnapshot.modifiers` and affect the next simulation calculation/month:

- Numeric rating adjustments: `approvalModifier`, `crimeModifier`, `libertyModifier`,
  `tourismModifier`, `entertainmentModifier`, and `environmentModifier`.
- `tourismIncomeMultiplier`, `exportPriceMultiplier`, and `costMultiplier` scale tourism receipts,
  export revenue, and construction costs respectively (neutral value `1`).
- `superpowerAdjustments: { us, ussr }` adds monthly relation points; `factionAdjustments` is a
  partial `Record<FactionId, number>` of respect-point changes.
- `airPollutionStandards` halves pollution. `jailCapacity` adds cells; `rebelsModifier` and
  `protestChanceModifier` adjust rebel activity. `closedBuildingTypes`, `productivityMultiplier`,
  `educationMultiplier`, `foodQuality`, and `foodConsumptionMultiplier` affect operations and services.
- `monthlyIncome`, `monthlyCostPerResident`, `monthlyCostPerSecurityStaff`, and `factoryUpkeepMultiplier`
  apply recurring treasury changes. `halfPriceBuildingTypes`, `swissSkimRate`, and `costMultiplier`
  affect construction; `protectedSuperpowers` prevents the listed invasion check.
- `electionTrigger` requests an election during the next month advance and is then cleared, so it is
  suitable for early-election edicts.

Modifier fields are intentionally general-purpose; timed edict durations and cooldowns belong in the
edict layer, which should set/restore the relevant modifier values as effects activate and expire.
