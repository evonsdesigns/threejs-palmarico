# Palmarico

Palmarico is an original island-management prototype inspired by classic city builders.

## Run

```sh
npm install
npm run dev
```

Open the address printed by Vite. Run `npm run build` for a production build and
`node --experimental-strip-types --test tests/game.test.mjs` for simulation tests
(Node.js 22.6 or newer).

## Play

Each new island starts with a palace and a farm. Residents without housing
automatically build shacks that shelter two people each, so the eight starting
residents build four shacks. None of these starting buildings incur a construction charge.

Open **Build** and select a building from its category: houses, apartments,
condominiums, bunkhouses and country houses under Housing; farms and ranches
under Farms and Mines; bungalows under Tourist Accommodations; and Marketplace
and Clinic under Human Services. Bungalows are placeable, but tourism is not
simulated yet.
Move the cursor over level dry land and click to build. Green previews indicate valid sites; red previews
indicate an obstruction (including trees), uneven terrain, water, or insufficient funds. Press
Escape or click the selected building again to cancel. Drag or use the arrow
keys to pan; scroll or use the minimap buttons to zoom. The minimap buttons also
rotate the camera. Pause or resume in the stats panel. The remaining building
options and edicts are placeholders and are not implemented yet.

Every five seconds, one month passes. Construction costs are paid immediately;
each month the treasury receives a $100 grant plus staffed building revenue
minus upkeep. Farms supply food, houses provide capacity, and clinics improve
approval. Ranches also produce food and income. Production scales with the
population available for all jobs. The slush fund starts at $0; ways to add to
or spend it have not been implemented. If
approval is at least 60%, residents arrive when there are spare homes and jobs;
if it falls below 35%, residents leave. The game currently has no save system,
individual citizens, elections, roads, or win/loss conditions.

Ground textures: [Cethiel's texture collection](https://opengameart.org/content/textures-collection).
