import React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import MenuEdictSubMenu, { EdictMenuSubMenuId } from "./MenuEdictsSubMenu";
import { game, missingRequirement } from "../../logic/game";
import { currentMonthIndex, edictCost, edictDefinitions, edictUnavailableReason, type EdictCategory, type EdictId } from "../../logic/edicts";
import { edictImage } from "./edict-images";
import "./edict-tiles.css";

const categoryByTab: Record<EdictMenuSubMenuId, EdictCategory> = {
  [EdictMenuSubMenuId.PeopleEdict]: "people",
  [EdictMenuSubMenuId.ForeignPolicyEdict]: "foreign",
  [EdictMenuSubMenuId.EconomicEdict]: "economic",
  [EdictMenuSubMenuId.PoliticalReligiousEdict]: "political-religious",
  [EdictMenuSubMenuId.SocialEdict]: "social",
};

const MenuEdicts: React.FC = () => {
  const [subMenu, setSubMenu] = React.useState(EdictMenuSubMenuId.PeopleEdict);
  const [failedImages, setFailedImages] = React.useState<Set<EdictId>>(new Set());
  const state = React.useSyncExternalStore(game.subscribe, game.getSnapshot, game.getSnapshot);
  const category = categoryByTab[subMenu];
  const entries = edictDefinitions.filter((edict) => edict.category === category);

  return (
    <Box sx={{ minWidth: 0, flex: 1, p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <MenuEdictSubMenu subMenu={subMenu} setSubMenu={setSubMenu} />
      <div className="edict-tiles" aria-label={`${category} edicts`}>
        {state.targetingEdict && (
          <div className="edict-tiles__targeting" role="status">
            Click a citizen to confirm {edictDefinitions.find((edict) => edict.id === state.targetingEdict)!.name}.
            <button type="button" onClick={() => game.selectEdictTarget(null)}>Cancel targeting</button>
          </div>
        )}
        {entries.map((edict) => {
          const targeted = edict.category === "people";
          const targeting = state.targetingEdict === edict.id;
          const active = !targeted && state.activeEdicts.some((item) => item.id === edict.id);
          const reason = active && edict.toggle ? null : edictUnavailableReason(edict.id, state, missingRequirement);
          const cooldown = edict.cooldownMonths ? state.edictCooldowns[edict.cooldownKey ?? edict.id] : undefined;
          const onCooldown = Boolean(cooldown && cooldown > currentMonthIndex(state));
          const activeEntry = state.activeEdicts.find((item) => item.id === edict.id);
          const monthsLeft = activeEntry?.expiresAt === null || activeEntry?.expiresAt === undefined ? 0 : Math.max(0, activeEntry.expiresAt - currentMonthIndex(state));
          const status = targeting ? "Click a citizen to pay and issue; Esc cancels" : active
            ? edict.toggle ? "Active — click to cancel" : monthsLeft ? `Active — expires in ${monthsLeft} month${monthsLeft === 1 ? "" : "s"}` : "Active"
            : reason ?? (cooldown && cooldown > currentMonthIndex(state) ? "On cooldown" : targeted ? "Choose a citizen to pay and issue" : "Available");
          const image = edictImage(edict.id);
          const imageFailed = failedImages.has(edict.id);
          const tooltip = [edict.description, status, !image ? "No artwork for this edict on the source page." : imageFailed ? "Edict image could not be loaded." : ""].filter(Boolean).join("\n");
          return (
            <Tooltip key={edict.id} title={tooltip} placement="top" arrow>
              <span className="edict-tile-wrap">
                <button
                  type="button"
                  id={`edict-${edict.id}`}
                  className="edict-tile"
                  aria-label={edict.name}
                  aria-description={`${status}. Cost: $${edictCost(edict.id, state).toLocaleString()}.`}
                  aria-pressed={targeted ? targeting : edict.toggle ? active : undefined}
                  data-active={active || targeting}
                  disabled={!targeting && Boolean(reason)}
                  onClick={() => {
                    const error = targeted ? game.selectEdictTarget(targeting ? null : edict.id)
                      : active && edict.toggle ? game.cancelEdict(edict.id) : game.issueEdict(edict.id);
                    if (error) game.notify(error);
                  }}
                >
                  {image && !imageFailed ? (
                    <img className="edict-tile__image" src={image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
                      onError={() => {
                        console.error(`Unable to load image for edict ${edict.id}: ${image}`);
                        setFailedImages((previous) => new Set(previous).add(edict.id));
                      }} />
                  ) : <span className="edict-tile__placeholder" aria-hidden="true">§<small>{imageFailed ? "Image unavailable" : "No wiki image"}</small></span>}
                  <span className="edict-tile__cost">${edictCost(edict.id, state).toLocaleString()}</span>
                  {(targeting || active || onCooldown) && <span className="edict-tile__status">{targeting ? "Choose citizen" : active ? "✓ Active" : "◷ Cooldown"}</span>}
                  <span className="edict-tile__name">{edict.name}</span>
                </button>
              </span>
            </Tooltip>
          );
        })}
      </div>
    </Box>
  );
};

export default MenuEdicts;
