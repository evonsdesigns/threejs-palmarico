import React, { useSyncExternalStore } from "react";
import { buildings, game, planCitizens } from "../logic/game";
import { citizenStatus, citizenOrderStatusLabels } from "../logic/citizens";
import { currentMonthIndex, edictDefinitions } from "../logic/edicts";
import GameScene from "../scene/GameScene";
import "./building-details.css";

const CitizenDetails: React.FC = () => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const id = state.inspectedCitizen;
  if (id === null) return null;
  const status = citizenStatus(state, id);
  if (!status) throw new Error("Cannot display a citizen who has left the island.");
  const index = state.citizenIds.indexOf(id);
  const plan = planCitizens(state)[index];
  const home = plan.home;
  const prisoner = status.prisoner;
  const order = status.order;
  const buildingName = (buildingIndex: number) => buildings.find((entry) => entry.id === state.placed[buildingIndex].type)!.name;
  const viewBuilding = (buildingIndex: number) => {
    const building = state.placed[buildingIndex];
    game.inspectBuilding(buildingIndex);
    GameScene.instance.moveCameraTo(building.x, building.z);
  };
  const browse = (direction: number) => {
    game.inspectCitizen(state.citizenIds[(index + direction + state.population) % state.population]);
  };

  return (
    <section className="building-details citizen-details" aria-label="Citizen details">
      <header>
        <strong>Citizen #{id}</strong>
        <button type="button" aria-label="Close citizen details" onClick={() => game.inspectCitizen(null)}>×</button>
      </header>
      <nav className="citizen-details__navigation" aria-label="Browse citizens">
        <button type="button" aria-label="Previous citizen" disabled={state.population < 2} onClick={() => browse(-1)}>Previous</button>
        <button type="button" onClick={() => GameScene.instance.locateCitizen(id)}>Locate</button>
        <button type="button" aria-label="Next citizen" disabled={state.population < 2} onClick={() => browse(1)}>Next</button>
      </nav>
      <p>Estimated respect: {status.respect}%</p>
      <p>Home: {home === null ? "Homeless" : <button type="button" onClick={() => viewBuilding(home)}>{buildingName(home)}</button>}</p>
      <p>Work: {prisoner ? "Unavailable while detained" : plan.work === null ? "Unemployed" : buildingName(plan.work)}</p>
      {order && (
        <div role="status">
          <p>{edictDefinitions.find((edict) => edict.id === order.action)!.name} pending: {citizenOrderStatusLabels[order.status]}.</p>
          <p>Dispatched from <button type="button" onClick={() => viewBuilding(order.source)}>{buildingName(order.source)}</button>. ${order.cost} reserved.</p>
          <button type="button" onClick={() => {
            const error = game.cancelCitizenOrder(order.id);
            if (error) game.notify(error);
          }}>Cancel order and refund</button>
        </div>
      )}
      {prisoner && (
        <p role="status">
          Detained at <button type="button" onClick={() => viewBuilding(prisoner.buildingIndex)}>{buildingName(prisoner.buildingIndex)}</button>.
          {" "}{prisoner.releaseAt - currentMonthIndex(state)} months until release.
        </p>
      )}
      {status.bribeMonths > 0 && <p>Bribe benefit: ${status.bribeBenefit.toLocaleString()} · {status.bribeMonths} months remaining. Benefits decline monthly.</p>}
      {status.heretic && <p>Marked as heretic. Excluded from protest and rebel recruitment.</p>}
      {!status.order && !status.prisoner && !status.heretic && !status.bribeMonths && <p>No personal edicts.</p>}
    </section>
  );
};

export default CitizenDetails;
