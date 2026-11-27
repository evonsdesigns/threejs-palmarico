# Simulation logic

`game.ts` owns island state, construction, monthly progression and the public `GameSnapshot`.
`building-effects.ts` is the typed per-building mechanics registry; `island.ts` contains pure ratings,
faction, and relation helpers (`calculateIsland`, `relationLabel`, `atLeast`).

The snapshot exposes `buildingStaffing`, `buildingOperation`, `buildingIncome`, `goods`, `powered`, `power`, `ratings`, `educated`,
`factions`, `superpowers`, `tourists`, `tourismIncome`, `military`, `police`, `jailCapacity`, `rebels`,
`nextElectionYear`, `gameOver`, `activeEdicts`, `edictCooldowns`, `issuedOnce`, and `jailUsed`. `missingRequirement(type, state)` serves the construction menu and
`buildingCost(type, state)` includes construction-office discounts and active edict price modifiers. `game.issueEdict(id)` / `game.cancelEdict(id)` return `null` on success or an explanatory error string; active effects, expiry, cooldown and once-only state are in the snapshot.

## Citizen-targeted edicts

`selectEdictTarget(id)` arms a People Edict without payment; passing `null`
cancels. `issueEdict(id, citizenId)` requires a currently valid citizen for every
People Edict and atomically rechecks requirements and funds before payment.
`citizenIds` remain stable across population changes; departed IDs are never
reused. `targetingEdict` tracks the armed action, `lastCitizenEdict` records its
confirmed target, and timed bribes store their `citizenId` in `activeEdicts`
so their repeat restriction applies per person. `inspectCitizen(id)` opens the
citizen inspector; map clicks and the population readout provide access.
Construction, citizen inspection and building inspection are mutually exclusive.

Only Bribe and Heretic apply immediately. Arrest and Capture reserve a cell and
dispatch police from a staffed Police Station; Eliminate dispatches a soldier
from a staffed Guard Station (guard tower), not an Armory or Army Base.
`citizenOrders` holds stable targets, source facilities, reservations and progress.
The map simulation walks a uniformed unit along safe resident paths and reports
arrival through `completeCitizenOrder`. Calendar ticks alone never execute orders.
One unit operates per source facility, with further orders queued. Units chase
moving citizens, wait outside occupied buildings, and visit the detention facility
for an imprisoned elimination target. Unreachable routes retry with a visible
blocked status; lost staffing or prison capacity pauses the order.
The citizen inspector shows progress and offers cancellation. Payment is reserved
once on confirmation; cancellation or target emigration refunds it. Any Swiss skim
is settled only on successful completion, preventing cancellation from creating
money. Orange map tags distinguish pending orders from completed personal effects.

`prisoners` is the authoritative list of detained citizens, their facility and
release month. `jailUsed` and `jailReleases` are derived compatibility readouts.
Arrest requires a staffed prison cell; Capture requires a Colonial Fort dungeon
cell. They cannot borrow capacity from each other or detain the same person twice.
Prisoners are hidden from street routines and interior crowds, cannot emigrate,
and are removed from available labor. Aggregate educated worker pools scale with
the available population share; individual qualifications are not yet tracked.
Existing inmates remain detained when staffing drops, but new admissions stop
when their own facility has no staffed free cells.

The official manual's edict table specifies seven years for Arrest and three for
Capture. The strategy guide describes variable arrest outcomes; this version
uses the manual's fixed terms and successful detention once the officer arrives.
Sentences begin at completion, not at order time. Sentence expiry
restores the same citizen and model. Open the Jails exiles the actual detainees.
Eliminate removes exactly the selected identity, recalculates population, and
discards that citizen's personal effects.

`citizens.ts` derives personal status. Bribes give an estimated +25 respect and
$1,000 temporary benefit, both declining over 36 months. Heresy is permanent,
lowers estimated personal respect by 25, and excludes its target from the pool
used for protest/rebel recruitment. Prison arrest applies an estimated -35 respect.
Personal respect adjustments influence the election estimate rather than adding
blanket loyalist/religious faction bonuses. The inspector's baseline respect uses
island approval; these numbers are explicit Palmarico balance approximations,
not the original game's private formulas. Family relations, permanent personal
wealth, individual faction membership, dungeon-survival respect bonuses, prisoner
escort animations and resistance/escape AI are not yet modeled. Dispatched units
represent the facility's pooled staffing rather than additional citizen workers.
Gold and purple map tags identify bribed and heretic citizens;
the selection ring follows a visible inspected citizen.

This follows the official manual's **Individual Edicts** interaction and the
strategy guide's **Bribery and Intimidation** example: choose an edict, then
click a person on the main map.

## Electricity

Staffed power plants supply a 24-tile radius. A substation inside a live plant's
or substation's coverage extends the grid by another 10 tiles; chains work in
any placement order, but disconnected loops cannot generate electricity.
Closed or unstaffed plants and closed substations cannot supply the network.

`buildingStaffing` tracks allocated workers. `buildingOperation` tracks the
operating fraction: buildings with a positive `powerDemand` operate at zero without
electricity, retaining their staff and normal staffed upkeep. Their services,
entertainment income, tourist beds and attractions stop until electricity returns.
Colleges and cathedrals do not require electricity; substations require a power plant
before construction. See the [official manual](../../docs/tropico1_manual_en.pdf),
Appendix A (PDF pages 29–30), and the [strategy guide](../../docs/manual.md),
infrastructure and human-services sections. Ordinary buildings and optional powered bonuses retain
their existing behavior. Building details and the almanac report outages.
Coverage radii are existing Palmarico balance values, not verified original-game
distances.

`power.ts` calculates connected grids, generation, demand and supplied MW.
Plants generate 100 MW at full staffing, following the official manual (PDF
page 30); connected plants pool generation, but separate grids cannot share it.
Overlapping supplier coverage joins grids. Nominal facility demands are defined
in `building-effects.ts`, using the manual's Appendix A and the strategy guide.
As a Palmarico aggregate-simulation simplification, both generation and facility
demand scale with allocated staffing; closed and unstaffed facilities draw no MW.
The existing optional power bonuses do not reserve additional MW.

When a grid is overloaded, facilities receive either their entire current load
or no power. Allocation follows placement order with the first consumer rotating
monthly, providing deterministic rolling blackouts. Same-month recalculations
do not rotate priority. `power.coverage` distinguishes lack of coverage from a
capacity blackout; `power.buildingGrid` indexes `power.grids`. Island totals
include disconnected demand, while each grid reports its own load and generation.
Details and the almanac show MW figures and the appropriate corrective action.
Worker skill and optional electrically powered building upgrades are not yet modeled.

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
