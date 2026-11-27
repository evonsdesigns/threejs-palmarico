# Tropico 1 Game Info

Reference notes on how Tropico (2001) lays out construction, used as the source
of truth for Palmarico building footprints.

## Tile Grid System

Tropico uses an isometric terrain mesh divided into discrete square tiles
(called squares or tiles in the manual and interface). Every structure, road
segment and landscape decoration snaps to whole integer coordinates on this
grid; there are no half-tile placements or diagonal building rotations.

- **Grid overlays:** pressing G toggles the fine terrain mesh overlay showing
  every individual 1×1 tile and terrain elevation contours. Pressing C toggles a
  larger macro-grid overlay (yellow lines) used for high-level island planning.
- **Orientation and rotation:** buildings can only be rotated in 90-degree
  increments (`[`, `]`, or right-click during placement) along the two cardinal
  axes of the map grid. A W×L building becomes L×W when rotated 90 degrees.
- **Terrain grading and slope rules:** a building's entire W×L footprint must sit
  on valid, non-water terrain (except coastal structures, which require
  specific shoreline tile alignments). Placing a footprint across uneven
  elevation triggers terrain grading by construction workers before assembly
  begins; steeper slopes drastically increase construction time, while cliffs
  block placement entirely.
- **Road connections:** unlike Tropico 3–6, buildings in Tropico 1 do not require
  road adjacency to function. Citizens and teamsters walk across open ground and
  between tightly packed buildings, though roads (1×1 tiles) speed up foot and
  cart movement between distant zones.

## Building Dimensions (Base Game + Paradise Island)

Dimensions are in tiles (W×L) along the orthogonal grid axes. Buildings marked
(PI) were added in the Paradise Island expansion.

### Housing

| Building | Tiles | Notes |
| --- | --- | --- |
| Shack | 1×1 | Built automatically by homeless citizens; cannot be manually placed. |
| Country House | 2×2 | Basic rural housing. |
| Bunkhouse | 2×3 | Holds 2 families. |
| House | 2×3 | Standard single-family home. |
| Luxury House | 3×3 | High-quality single-family home. |
| Condominium (PI) | 3×4 | Multi-family middle-to-upper-class housing. Long rectangular block like the original game (widened from 3×3 to match its in-game look). |
| Tenement | 3×4 | High-density, low-quality multi-family housing. |
| Apartment | 3×4 | High-density, medium-quality multi-family housing. |

### Industry

| Building | Tiles | Notes |
| --- | --- | --- |
| Jewelry Factory | 3×3 | Processes gold into jewelry. |
| Furniture Factory (PI) | 3×4 | Processes lumber into furniture. |
| Cigar Factory | 4×4 | Processes tobacco into cigars. |
| Rum Distillery | 4×4 | Processes sugar into rum. |
| Lumber Mill | 4×5 | Processes logs into lumber. |
| Cannery | 4×6 | Processes fish, coffee or pineapples into canned goods. |

### Farms, Mines and Resource Extraction

| Building | Tiles | Notes |
| --- | --- | --- |
| Logging Camp | 2×2 | Workers harvest trees in a wide surrounding radius. |
| Mine | 3×3 | Must be placed directly over a bauxite, iron or gold deposit. |
| Ranch | 3×3 | Livestock graze in surrounding open tiles. |
| Farm | 3×4 | Planted crops occupy adjacent open tiles around the farmhouse. |
| Fisherman's Wharf | 3×4 | Must be placed along a coastline with water access. |

### Infrastructure and Logistics

| Building | Tiles | Notes |
| --- | --- | --- |
| Road | 1×1 | Per individual tile segment. |
| Electric Substation | 1×1 | Extends a live power grid by 10 tiles; can chain from other connected substations but cannot generate power. |
| Construction Office | 2×3 | Houses construction builders. |
| Teamster's Office | 2×3 | Houses transport workers. |
| Bank | 3×3 | Generates interest/slush funds or lowers building costs. |
| Electric Power Plant | 4×5 | Staffed college engineers supply a 24-tile radius. Power-dependent facilities stop operating without coverage, retaining staff and upkeep. |
| Dock | 4×6 | Coastal; handles imports, exports and immigrants. |
| Airport | 6×12 | Largest standard footprint; requires a long, flat stretch of land. |

### Government, Military and Media

| Building | Tiles | Notes |
| --- | --- | --- |
| Guard Station | 2×2 | Basic military post. |
| Immigration Office | 2×2 | Controls immigration and emigration policies. |
| Newspaper | 2×3 | Print media influence. |
| Radio Station | 2×3 | Broadcast media influence. |
| Police Station | 3×3 | Reduces crime in surrounding tiles. |
| Diplomatic Ministry | 3×3 | Manages US/USSR relations and foreign aid. |
| TV Station | 3×3 | Island-wide media influence. |
| Armory | 3×4 | Trains generals and increases army capacity. |
| Prison | 3×4 | Detains criminals and political dissidents. |
| Army Base (PI) | 4×5 | Houses soldiers and tanks. |
| Palace | 5×6 | Pre-placed at map start; cannot be demolished or rebuilt. |
| Colonial Fort | 4×4 | Scenario landmark; Palmarico shows it only in the developer showcase (size estimated). |

### Human Services

| Building | Tiles | Notes |
| --- | --- | --- |
| Clinic | 2×3 | Basic healthcare facility; stepped flat-roofed yellow-plaster wings, red plinth and recessed entrance. |
| Marketplace | 3×3 | Distributes food from farms, ranches and wharves. |
| Church | 3×4 | Basic religious service. |
| High School | 3×4 | Educates workers to high school level. |
| Hospital | 4×4 | Advanced healthcare facility. |
| College | 4×4 | Educates workers to college level. |
| Cathedral | 4×6 | High-capacity, high-quality religious service. |

### Entertainment

| Building | Tiles | Notes |
| --- | --- | --- |
| Pub | 2×2 | Low-cost entertainment. |
| Restaurant | 2×3 | Mid-tier dining entertainment. |
| Gourmet Restaurant | 2×3 | High-end dining entertainment. |
| Cabaret | 3×3 | Mid-tier entertainment. |
| Movie Theater (PI) | 3×3 | Family/general entertainment. |
| Nightclub | 3×3 | High-end nightlife entertainment. |
| Casino | 3×4 | High-profit gambling entertainment. |
| Conservatory (PI) | 3×4 | High-end cultural entertainment. |
| El Prez' Childhood Home (PI) | 3×3 | Generates tourism and loyalty; one per island. |
| Sports Complex | 4×6 | Enclosed rounded arena with layered dark roofs, turquoise arcades and four decorative towers. |
| Archaeological Site | 4×4 | Must be placed directly over ancient ruins. |

### Tourism (Accommodations and Attractions)

| Building | Tiles | Notes |
| --- | --- | --- |
| Duty Free Shop (PI) | 2×2 | Tourist shopping attraction. |
| Souvenir Shop | 2×2 | Basic tourist shopping attraction. |
| Scenic Outlook | 2×2 | Must be placed on high elevation overlooking scenic terrain. |
| Bungalow | 2×3 | Eco/mid-tier tourist accommodation. |
| Beach Villa (PI) | 2×3 | Beachfront tourist accommodation. |
| Pool | 2×3 | Tourist attraction. |
| Spa | 2×3 | Luxury tourist attraction. |
| Tennis Court (PI) | 4×4 | Square twin-court complex with a steep-gabled clubhouse; enlarged in Palmarico to match the reference layout. |
| Beach Site | 3×3 | Must be placed on sand tiles along the shore. |
| Cheap Motel | 3×3 | Budget tourist accommodation. |
| Marina (PI) | 3×4 | Coastal; yachting attraction. |
| Miniature Golf (PI) | 3×4 | Family tourist attraction. |
| Nature Preserve (PI) | 3×3 | Relies on surrounding untouched forest/beauty. |
| Hotel | 3×4 | Standard multi-room tourist accommodation. |
| Luxury Hotel | 4×5 | High-end multi-room tourist accommodation. |

### Landscape and Decorations

| Item | Tiles | Notes |
| --- | --- | --- |
| Bushes and Shrubs | 1×1 | Increases local beauty rating. |
| Small Fountain | 1×1 | Increases local beauty rating. |
| Statue | 1×1 | Increases local beauty and El Presidente respect. |
| Large Fountain | 2×2 | Higher beauty radius and magnitude than the 1×1 fountain. |

Tropico 1 stores building footprints in binary scenario and prototype files, so
community wikis omit dimensions for several buildings. Dimensions not
documented in wiki infoboxes reflect standard engine grid footprints verified
against the isometric tile mesh.

## How Palmarico Uses These Dimensions

- One tile is `GRID_TILE_SIZE` (4) world units, so a W×L building occupies
  W×4 by L×4 world units.
- Each building's tile size is defined once in `src/logic/game.ts` (`tiles`)
  and drives placement, overlap checks, the placement preview and resident
  navigation.
- Models are built centered on the origin with their main entrance facing +z
  at rotation 0, and must stay inside their footprint. Placement rotation
  (`[` / `]`) turns a building in 90-degree steps and swaps W and L.
- A farm's 3×4 footprint holds the farmhouse; its crops are planted on nearby
  open tiles and give way when other buildings are built over them.

## How Palmarico Models the Land

The island is a height field on the same tile grid as the buildings
(`src/logic/terrain.ts`, rendered by `src/map/TerrainMesh.ts`):

- **Corner heights:** a 256×256-tile map stores one height per tile corner, so
  each tile is a flat-shaded quad that can tilt; anything placed on the ground
  reads the same interpolated height. Sea level is 0.
- **Tile types:** every tile is water, sand, grass, jungle, dirt or rock. Sand
  rims the coast, jungle and dirt patches cover the lowlands, and rock forms
  cliffs and the high massif. The ground shader and minimap colour each tile by
  its type.
- **Building rules:** land buildings need every footprint corner on dry ground
  (at least 0.6 above sea level), may not touch rock, and fail as too steep
  when grading would move any corner by more than 3 units. Coastal buildings
  (dock, fisherman's wharf, marina, beach site) need their back on dry land and
  their front edge in the sea.
- **Grading:** placing a building levels its footprint to a pad (the average
  height, or an adjacent pad's level so terraces line up), locks those corners
  so later grading cannot disturb them, blends a two-tile skirt into the
  surrounding ground, and turns the footprint to dirt.
- **Trees:** palms, fan palms and broadleaf trees grow per tile by type:
  dense in jungle, scattered on grass and sand. Construction crews clear trees from a building's footprint;
  automatically built shacks and starting buildings stay on open ground.
- **Overlays:** G toggles the 1×1 tile grid and C the yellow 8×8 macro grid.

## Electricity in Palmarico

Staffed power plants cover 24 tiles; connected substations extend coverage by
10 tiles and can be chained. Substations require an existing plant and do not
generate electricity. Facilities marked as requiring power stop services and
income during an outage, retaining workers and upkeep, and resume automatically
when reconnected. Colleges and cathedrals do not require power.

These dependencies follow the official manual's construction guidance and
Appendix A (PDF pages 15, 29–30), cross-checked against the strategy guide's
infrastructure and human-services sections. Coverage distances are Palmarico's
current balance values. Generation capacity, megawatt demand and overload
blackouts described by the sources are not yet simulated.
