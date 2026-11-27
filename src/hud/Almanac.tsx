import React, { useSyncExternalStore } from "react";
import { game } from "../logic/game";
import { factionIds, relationLabel } from "../logic/island";
import { buildingEffects } from "../logic/building-effects";

const labels: Record<string, string> = {
  health: "Health", religion: "Religion", entertainment: "Entertainment", education: "Education",
  crime: "Crime", liberty: "Liberty", environment: "Environment", tourism: "Tourism", military: "Military", media: "Media",
};

const Almanac: React.FC = () => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const powerUsers = state.placed.filter((building) => buildingEffects[building.type].powerDemand
    && !state.modifiers.closedBuildingTypes.includes(building.type)).length;
  const disconnected = state.placed.filter((building, index) => buildingEffects[building.type].powerDemand
    && !state.modifiers.closedBuildingTypes.includes(building.type) && !state.power.coverage[index]).length;
  const blackouts = state.placed.filter((building, index) => buildingEffects[building.type].powerDemand
    && !state.modifiers.closedBuildingTypes.includes(building.type) && state.power.coverage[index] && !state.powered[index]).length;
  return (
    <section aria-label="Island almanac" className="almanac">
      <div className="almanac__ratings">
        {Object.entries(state.ratings).map(([key, value]) => (
          <div className="almanac__rating" key={key} title={`${labels[key]}: ${Math.round(value)}`}>
            <span>{labels[key]}</span><div><i style={{ width: `${value}%` }} /></div><strong>{Math.round(value)}</strong>
          </div>
        ))}
      </div>
      <div className="almanac__section"><strong>Factions</strong>
        {factionIds.map((id) => {
          const faction = state.factions[id];
          return <div key={id}>{id}: {Math.round(faction.respect)} ({relationLabel(faction.respect)}) · {faction.leader}</div>;
        })}
      </div>
      <div className="almanac__section">
        <strong>Foreign relations</strong>
        <div>U.S. {Math.round(state.superpowers.us)} ({relationLabel(state.superpowers.us)}) · U.S.S.R. {Math.round(state.superpowers.ussr)} ({relationLabel(state.superpowers.ussr)})</div>
      </div>
      <div className="almanac__section">
        <strong>Electricity</strong>
        <div>Active power plants: {state.placed.filter((building, index) => building.type === "electric-power-plant" && state.buildingOperation[index] > 0).length}</div>
        <div>Generation {state.power.generation.toFixed(1)} MW · Demand {state.power.demand.toFixed(1)} MW · Supplied {state.power.supplied.toFixed(1)} MW</div>
        <div>Supplied facilities: {powerUsers - disconnected - blackouts}/{powerUsers} requiring electricity</div>
        {disconnected > 0 && <div role="status">{disconnected} {disconnected === 1 ? "facility is" : "facilities are"} outside grid coverage. Extend the grid with substations.</div>}
        {blackouts > 0 && <div role="status">{blackouts} {blackouts === 1 ? "facility has" : "facilities have"} rolling blackouts. Add engineers or connected power plants. Supply priority rotates monthly.</div>}
        {state.power.grids.map((grid, index) => <div key={index}>Grid {index + 1}: {grid.generation.toFixed(1)} MW generation / {grid.demand.toFixed(1)} MW demand / {grid.supplied.toFixed(1)} MW supplied</div>)}
      </div>
      <div className="almanac__section">
        <strong>Island</strong>
        <div>Tourists {state.tourists} · Tourism income ${Math.round(state.tourismIncome)}/mo</div>
        <div>Educated: High school {Math.floor(state.educated.highSchool)}, College {Math.floor(state.educated.college)} · Rebels {state.rebels}</div>
        <div>Election: {state.nextElectionYear} · Jail capacity {state.jailCapacity}</div>
        <div>Goods: {Object.entries(state.goods).filter(([, values]) => values.produced || values.processed).map(([good, values]) => `${good} ${values.produced.toFixed(1)}/${values.processed.toFixed(1)}`).join(" · ") || "None"}</div>
      </div>
    </section>
  );
};

export default Almanac;
