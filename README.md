# Palmarico

Palmarico is an original island-management prototype inspired by classic city builders.

## Run

Development and production builds use Vite 8 (Node.js 20.19+ or 22.12+).

```sh
npm install
npm run dev
```

Open the address printed by Vite. Run `npm run build` for a production build and
`npm test` for simulation and grid tests (Node.js 22.12 or newer).

Building footprints and grid rules follow the Tropico 1 reference in
[docs/game-info.md](docs/game-info.md).

## Play

When running the development server (`npm run dev`), the island starts as a
developer showcase with one of every implemented building laid out in a grid
for quick inspection. Open `http://127.0.0.1:5173/?normal-start` (or your dev
URL with `?normal-start`) for the regular start described below; production
builds always use the regular start.

Each new island starts with a palace and a farm. Residents without housing
automatically build shacks that shelter two people each, so the eight starting
residents build four shacks. None of these starting buildings incur a construction charge.

Open **Build** and select a building image from its category; the bottom bar
shows the selected building and its cost. Find houses, apartments,
condominiums, bunkhouses, tenements and country houses under Housing; farms and ranches
under Farms and Mines; bungalows under Tourist Accommodations; pubs and restaurants under
Entertainment; the Teamster's Office under Infrastructure; and Marketplace and
Clinic under Human Services. Tourism requires staffed docks or airports and staffed accommodations; visitor totals and tourism income appear in the Almanac.
The island uses a square construction grid of 4-unit tiles. Each building
occupies the W×L tile footprint listed in `docs/game-info.md` (for example a
1×1 shack, 2×3 house, 4×3 farm or 6×5 palace); the faint terrain grid and
highlighted squares show placement. Press G to show the tile grid and C for the
yellow macro grid. The land is a Tropico-style height field of sand, grass,
jungle, dirt and rock tiles with a mountain in the north-west. Construction
grades each footprint to a level pad, and coastal buildings must sit on the shore
facing the sea (see `docs/game-info.md`). Press `[` or `]`, or right-click, while
placing to rotate the building 90 degrees, which swaps its width and length.
Move the cursor over dry land and click to build; trees on the site are cleared. Green previews indicate valid sites; red previews
indicate an obstruction (another building or a resident), terrain too steep to grade, rock, water, or insufficient funds. Press
Escape or click the selected building again to cancel. With no construction
selected, click a building to inspect it and change a farm's crop, a pub's
dress code, a restaurant's table setting or a Teamster's Office's work hours. Escape closes the details. Drag or use the arrow
keys to pan; scroll or use the minimap buttons to zoom. The minimap buttons also
rotate the camera. The minimap outlines the camera's view at sea level; click
the map to move there, or focus it and use the arrow keys to pan. In the stats panel, click the green bars to select game speed
from 1× to 5×; the pause button pauses or resumes at the selected speed. Building options include crops, pub dress code, restaurant table settings, teamster work hours, and immigration policy. Open **Edicts** to browse the five policy categories; each entry shows its cost, requirements, effect, active status, and cooldown, and toggle edicts can be cancelled.

The visual day–night cycle lasts two minutes at 1× speed, follows the selected
simulation speed and pauses with the game. Buildings and trees cast sunlight
shadows; the water darkens at night. Windows and lamps glow after dusk, with
local exterior lighting on buildings near the camera.

Open the music player with the music-note button in the bottom-right panel.
Playback starts when you press Play and continues independently of simulation
pause. The player cycles through audio files in `public/sounds/music`; add or
remove MP3, OGG, WAV, M4A, AAC, FLAC or WebM files and restart the development
server (or rebuild for production) to refresh the playlist. Supported playback
formats depend on the browser.

Choose a crop when placing a farm: corn, pineapple, coffee, sugar, tobacco,
papaya or bananas. As in Tropico 1, a farm's 4×3 footprint holds the farmhouse,
and it plants up to 24 tiles of its crop on open, dry, fairly level land within
two tiles of the farmhouse (away from trees and other buildings). Neighbouring
farms do not share tiles. You may build over crop tiles; the crops give way, and
residents' automatically built shacks avoid them. Field size is visual only and
does not yet change production. The starting farm grows corn. Change crops by inspecting a placed farm. Corn and
fruit provide food and income, while coffee, sugar and tobacco are cash crops
that provide more income but no food. The crop selector shows each crop's
monthly income and food output at full staffing, before upkeep; actual output
scales with the island-wide staffing ratio. These values are prototype balancing,
not a simulation of crop inventories or market prices. Farms cost $1,000 and
provide four jobs.

Pubs cost $800, provide two jobs, and have a capacity of eight and base service
quality of 35. Choose a dress code when placing or inspecting one. As a temporary
aggregate model, half the residents (rounded down) are eligible for upscale
pubs; everyone can visit pubs with no dress code. Each resident makes at most
one estimated pub visit per month. Upscale pubs are allocated eligible visitors
first, then unrestricted pubs use the remaining residents; each group is
allocated in construction order. Capacity is reduced by the island-wide
staffing ratio, rounded down, and each visit earns $15 before upkeep. Inspect a
pub to see its estimated visits and income. These are prototype assumptions:
individual citizens, actual wealth, tourists and service quality effects are
not included in pub visit estimates yet; service quality does not alter visit routing.

Restaurants cost $2,000, provide two cook jobs, and seat up to ten diners with
base service quality 40. Choose a table setting when placing or inspecting one:
paper placemats halve upkeep but reduce quality by 10%; cloth napkins keep the
base $40 upkeep and quality; linen tablecloths raise upkeep by 50% and quality
by 20%. As a temporary aggregate model, each resident makes at most one
estimated restaurant visit per month, residents fill higher-quality restaurants
first (then in construction order), capacity is reduced by the island-wide
staffing ratio, and each visit earns $20 before upkeep.

Teamster's Offices cost $2,000, provide eight teamster jobs and $40 monthly
upkeep, and occupy 3×2 tiles. As a temporary aggregate model of teamsters
hauling goods, each staffed office raises farm and ranch income: normal hours
by 10%; Sweat Shop (extra long hours) by 15% but lowers approval by 3; and
Easy-Does-It (workers leave 20% earlier) by 8% while raising approval by 2. The
combined bonus is capped at 30% and scales with the island-wide staffing ratio.
Choose work hours when placing or inspecting an office. Individual teamsters,
goods and job happiness are not simulated yet.

Mines produce one load per month at full staffing. Inspect a mine to select
gold, iron or bauxite: their estimated raw export prices are $260, $160 and
$200 per load respectively, before bonuses and upkeep. Jewelry factories use
gold but not iron or bauxite. Existing mines default to gold. This selector is
provisional: mineral deposits, depletion and deposit-dependent placement are
not yet simulated.

At 1× speed, one month passes every five seconds; higher speeds accelerate
both the calendar and resident movement. Construction costs are paid immediately;
each month the treasury receives a $100 grant plus building revenue minus
operating upkeep and active edict costs, with recurring edict income added. Farms
supply food, houses provide capacity, and clinics improve approval. Ranches also
produce food and income. Production scales with the population available for all
jobs. The slush fund starts at $0 and receives proceeds from the Special Building
Permit edict. If
approval is at least 60%, residents arrive when there are spare homes and jobs;
if it falls below 35%, residents leave.

Visible residents move between assigned homes, jobs and available services
such as clinics, marketplaces, pubs and restaurants. Residents appear when the island starts
and as the population grows. They take varied routes around buildings, trees
and one another on dry land, including gaps between buildings that are wide
enough to pass. When they reach a home, workplace or service they go inside and
disappear from view for a while before stepping out again. Residents only enter
their own home; they never go inside other residents' housing. These routines are a visual first step: people do not yet use roads, and their
individual movements do not yet drive production, needs or the aggregate pub
visit estimates. The game currently has no save system, individual citizen needs or roads. Elections and superpower relations now create win/loss conditions.

Ground textures: [Cethiel's texture collection](https://opengameart.org/content/textures-collection).

Newly added buildings pay operating upkeep in proportion to their staffed fraction (staffless landscape items retain fixed upkeep), keeping the development showcase affordable while preserving the original buildings’ monthly balance rules.
