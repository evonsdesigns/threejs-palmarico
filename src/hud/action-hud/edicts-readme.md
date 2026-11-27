# Edict menu presentation

The menu uses square image tiles with persistent names, prices, active/cooldown
badges and requirement tooltips. Issuing and cancelling edicts use the existing
simulation actions.

People Edict tiles select a citizen-targeting mode; they do not pay or activate
on the menu click. Click a visible citizen on the map to confirm the target and
pay once. Empty terrain, buildings, hidden citizens and camera drags do not
activate edicts. The card, HUD prompt and crosshair indicate targeting.
Escape, right-click, the selected tile or **Cancel targeting** cancel for free;
selecting construction also cancels it. Funds and requirements are checked again
at confirmation. A citizen's active bribe does not prevent bribing someone else.

After confirmation, the citizen inspector shows personal effects and remaining
sentence time. Click an unselected citizen on the map or the Population readout
to inspect residents; Previous/Next also reaches people indoors or detained.
Locate pans to their current building or map position. Gold tags show active
bribes, purple tags show heresy, and a ground ring follows the inspected resident.
Bribe and Heretic apply immediately. Arrest/Capture dispatch police from a staffed
Police Station; Eliminate dispatches a soldier from a staffed Guard Station
(guard tower). An orange target tag and the inspector show pending orders and
officer progress. The target stays free until the unit reaches them. Police then
remove the target from street routines and labor until release; Eliminate removes
that exact resident. Sentences start on arrival. Blocked routes, missing staff and
reserved-cell shortages wait instead of completing remotely. Cancel order and
refund releases the reservation and stops the unit. Open the Jails exiles actual detainees.
Implementation details and remaining approximations are in
[the simulation readme](../../logic/readme.md#citizen-targeted-edicts).

`edict-images.ts` links the 23 edict images available on
[the Tropico Wiki edicts page](https://tropico.fandom.com/wiki/Edicts_(Tropico_1)).
The images remain externally hosted; no ownership or redistribution license is
claimed. Source attribution is kept here rather than in the HUD. Entries without an image on that page
show a named parchment tile, rather than borrowing a different edict's artwork.
Network image failures are logged and visibly marked as unavailable; gameplay
and labels remain usable without images.

# People Edicts
Bribe
Cost: $1000
Requirements: A bank and a banker.
Effects: The targeted citizen will be given some money from the state's coffers. This will increase the wealth and respect of the target and their relatives for a period of 3 years. Note that occasionally bribes will not work.
	
Arrest
Cost: $500
Requirements: A police station, a policeman and a prison with at least 1 cell available.
Effects: A policeman is sent to arrest the target. If successful, the target stays jailed for a period of 5 to 8 years. The target and their family significantly lose respect for El Presidente, and the people within a 10 cells radius from the arrest location have their respect influenced as well. The target might flee or fight back, in which case the policeman will shoot to kill. If the target succeeds, they become a rebel.
	
Capture
Cost: $500
Requirements: A dungeon with at least one empty cell (Note: dungeons are extensions built inside colonial forts. These are randomly generated on random maps.)
Effects:
	
Heretic
Cost: $500
Requirements: A Cathedral and a bishop
Effects: A bishop will tag the target as heretic, making them unable to lead or join protests, coups or uprisings. The target and their family will lose respect for El Presidente.




Eliminate
Cost: $500
Requirements in Palmarico: A staffed Guard Station (guard tower). An Armory or Army Base alone cannot dispatch the order.
Effects: A soldier will shoot to murder the targeted citizen. If successful, the target is killed, and their family's respect for El Presidente drops. The respect from people within a 10 cell radius from the murder location will also be influenced. The target may run or fight back, and if they succeed, the target becomes a rebel.
	
# Foreign Policy Edicts
Praise U.S.
Cost: $500
Requirements: A Diplomatic Ministry and a minimum 3 years of distance from a previous praising.
Effects: El Presidente will perform a speech praising the US. Relations with Russia will decrease, but not as much as they increase with the U.S.
	
Trade Delegation to U.S.
Cost: $1000
Requirements: A diplomatic ministry, an airport and cold or better relations with the U.S.
Effects: El Presidente is given the chance to receive higher export prices, free buildings, educated workers or a one-time foreign aid.
U.S. Development Aid
Cost: $2000
Requirements: A diplomatic ministry and cool or better relations with the U.S.
Effects: El Presidente is granted blueprints from the U.S. allowing airports and Power Plants to be built for half the price. (Note: Can be used along with the Russian counterpart, see "Russian Development Aid" below)
Alliance with U.S.
Cost: $6000
Requirements: A diplomatic ministry and close or better relations with the U.S.
Effects: A U.S. military base is installed on the island (you obviously can't remove it) for an annual fee of $1000 paid to the Tropican state coffers. This will prevent Russia from invading in case of bad relationship, on the other hand the U.S. will invade instantly if relations turn bad.
Praise Russia
Cost: $500
Requirements: A diplomatic ministry and a minimum 3 years of distance from a previous praising.
Effects: El Presidente will perform a speech praising Russia. Relations with the U.S. will decrease, but not as much as they increase with the U.S.
	
Trade Delegation to Russia
Cost: $1000
Requirements: A diplomatic ministry, an airport and cold or better relations with Russia.
Effects: El Presidente is given the chance to receive higher export prices, free buildings, educated workers or a one-time foreign development aid.
Russian Development Aid
Cost: $2000
Requirements: A diplomatic ministry and cool or better relations with Russia.
Effects: El Presidente is granted blueprints from Russia allowing tenements and apartments to be built for half the price. (Note: Can be used along with the U.S. counterpart, see "U.S. Development Aid" above)

Alliance with Russia
Cost: $6000
Requirements: A diplomatic ministry and close or better relations with Russia.
Effects: A Russian military base is installed on the island (you obviously can't remove it) for an annual fee of $1000 paid to the Tropican state coffers. This will prevent The U.S. from invading in case of bad relationship, on the other hand Russia will invade instantly if relations turn bad.

# Economic Edicts
Industry Ad Campaign
Cost: $8000
Requirements: Two factories of any kind and a television broadcasting station.
Effects: Due to the advertisement campaign export prices will rise by 20% during the 3 years period the campaign lasts.
	
Air Pollution Standards
Cost: $500
Requirements: A factory of any kind.
Effects: The pollution coming from factories will decrease by 50%, but their maintenance costs rise by 20%.
	
Tourism Ad Campaign
Cost: $5000
Requirements: A hotel of any kind and a television broadcasting station.
Effects: The 3 year advertisement campaign will attract extra tourists,and those arriving due to the campaign pay twice the regular hotel rate.
	
The Headliner!
Cost: $5000
Requirements: A nightclub.
Effects: The Headliner, a world-famous rock music star, is invited to Tropico for 3 years. This will increase the tourism rating by 20%, the citizens' entertaining by 10%. The relation with the U.S. increases by 10% as well, it's thus speculated that the Headliner hails from the U.S.
	
Spring Break Package
Cost: $
Requirements:
Effects:
	
Tax Cut
Cost: Varies depending on the total residents,$100 per resident
Requirements: At least 3 years of distance from the previous tax cut.
Effects: Raises wealth, respect and happiness of each citizen (at least for a while), giving a good economic boost and helping El Presidente win elections.
'Special' Building Permit
Cost: $500
Requirements: A bank
Effects: The price of all buildings is padded up by 20% and 10% is given back on El Presidente's Swiss bank account (unless El Presidente has the "Incorruptible" trait, in that case Swiss banking isn't allowed). The Intellectuals will notice something is off, and their respect will dive by 10%.

Pan-Caribbean Games
Cost: $7500
Requirements: A sports complex.
Effects: For 3 years the Pan-Caribbean games will be hosted on the island, this will increase the tourism rating by a stunning 50% and the citizens' entertainment by 20%. (NOTE: Tropico may host the games ONLY ONCE!)

Mardi Gras
Cost: $3000
Requirements: A pub.
Effects: A Mardi Gras day is promoted, this boosts the citizen's entertainment by 30% and tourism rating by 20%, but also gives a 20% boost to crime.
	
World Geographic Package
Cost:
Requirements:
Effects:

# Political/Religious Edicts
Amnesty
Cost: $500
Requirements: An armory and a cordial or better relation with the militarists.
Effects: El Presidente officially gives rebels the chance to return to their ordinary lives for 3 years. Rebels will re-join society with an improvement between 5 and 10% of the social conditions. If the edict is issued after the improvements, rebels are 4 times more incline to embrace the regime.
	
Early Elections
Cost: $2000
Requirements: None
Effects: As the name states, El Presidente calls for an election before the citizens do.
Inquisition
Cost:
Requirements:
Effects:
	
Book BBQ
Cost:
Requirements:
Effects:
	
Military Modernization
Cost:
Requirements:
Effects:
	
Martial Law
Cost: $6,500
Requirements:
Effects:
Open the Jails
Cost:
Requirements:
Effects:
	
Papal Visit
Cost:
Requirements:
Effects:
	
Conscription
Cost:
Requirements:
Effects:

# Social Edicts
Prohibition
Cost:
Requirements:
Effects:
	
Literacy Program
Cost:
Requirements:
Effects:
Contraception Ban
Cost:
Requirements:
Effects:
	
Social Security
Cost:
Requirements:
Effects:
Anti-Litter Ordinance
Cost:
Requirements:
Effects:
	
Sensitivity Training
Cost:
Requirements:
Effects:
	
Food for the People
Cost:
Requirements:
Effects: