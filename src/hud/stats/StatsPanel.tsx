import React, { useSyncExternalStore } from "react";
import { game } from "../../logic/game";
import "./stats-panel.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const money = (value: number) => `${value < 0 ? "-" : ""}$${Math.abs(value).toLocaleString()}`;

const StatsPanel: React.FC = () => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const readouts = [
    { label: "Treasury", value: money(state.money) },
    { label: "Date", value: `${months[state.month - 1]} ${state.year}` },
    { label: "Slush Fund", value: money(state.slushFund) },
    { label: "Population", value: state.population.toLocaleString() },
  ];

  return (
    <section className="island-stats" aria-label="Island statistics">
      <div className="island-stats__crest-area">
        <div className="island-stats__crest" aria-label="Palmarico">
          <span className="island-stats__crest-sun" aria-hidden="true" />
          <span className="island-stats__crest-name">PALMARICO</span>
          <span className="island-stats__crest-subtitle">REPUBLICA</span>
        </div>
        <div className="island-stats__approval" role="meter" aria-label="Approval" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.approval} title={`Approval: ${state.approval}%`}>
          {[1, 2, 3, 4, 5].map((step) => (
            <span key={step} className={state.approval >= step * 20 ? "is-active" : ""} style={{ height: `${step * 20}%` }} />
          ))}
        </div>
      </div>
      <div className="island-stats__readouts">
        {readouts.map((item) => (
          <div className="island-stats__readout" key={item.label} title={`${item.label}: ${item.value}`} aria-label={`${item.label}: ${item.value}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="island-stats__footer">
        <span title="Food supply / population">Food {state.food}/{state.population}</span>
        <span title="Approval">★ {state.approval}%</span>
        <button type="button" onClick={() => game.togglePause()} aria-label={state.paused ? "Resume simulation" : "Pause simulation"}>
          {state.paused ? "▶" : "❚❚"}
        </button>
      </div>
    </section>
  );
};

export default StatsPanel;
