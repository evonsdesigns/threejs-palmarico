import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuEdictSubMenu, { EdictMenuSubMenuId } from "./MenuEdictsSubMenu";
import { game, missingRequirement } from "../../logic/game";
import { currentMonthIndex, edictCost, edictDefinitions, edictUnavailableReason, type EdictCategory, type EdictId } from "../../logic/edicts";

const tropicoButton = {
  background: "linear-gradient(to bottom, #e0d8b0 0%, #c8c090 100%)",
  color: "#4a4a4a",
  border: "1px solid #a09870",
  boxShadow: "inset 0 0 5px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.2)",
  textShadow: "1px 1px 0 rgba(255,255,255,0.3)",
  fontWeight: 700,
  borderRadius: 2,
  fontSize: "10px",
  "&:hover": { filter: "brightness(1.05)", transform: "translateY(-1px)" },
  "&:active": { transform: "translateY(0)", boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)" },
};

const categoryByTab: Record<EdictMenuSubMenuId, EdictCategory> = {
  [EdictMenuSubMenuId.PeopleEdict]: "people",
  [EdictMenuSubMenuId.ForeignPolicyEdict]: "foreign",
  [EdictMenuSubMenuId.EconomicEdict]: "economic",
  [EdictMenuSubMenuId.PoliticalReligiousEdict]: "political-religious",
  [EdictMenuSubMenuId.SocialEdict]: "social",
};

const MenuEdicts: React.FC = () => {
  const [subMenu, setSubMenu] = React.useState(EdictMenuSubMenuId.PeopleEdict);
  const state = React.useSyncExternalStore(game.subscribe, game.getSnapshot, game.getSnapshot);
  const category = categoryByTab[subMenu];
  const entries = edictDefinitions.filter((edict) => edict.category === category);

  return (
    <Box sx={{ minWidth: 0, flex: 1, p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <MenuEdictSubMenu subMenu={subMenu} setSubMenu={setSubMenu} />
      <Box aria-label={`${category} edicts`} sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(118px, 1fr))", alignContent: "start", gap: 0.75, p: 1, overflowY: "auto", minHeight: 0 }}>
        {entries.map((edict) => {
          const active = state.activeEdicts.some((item) => item.id === edict.id);
          const reason = active && edict.toggle ? null : edictUnavailableReason(edict.id as EdictId, state, missingRequirement);
          const cooldown = edict.cooldownMonths ? state.edictCooldowns[edict.cooldownKey ?? edict.id] : undefined;
          const onCooldown = Boolean(cooldown && cooldown > currentMonthIndex(state));
          const activeEntry = state.activeEdicts.find((item) => item.id === edict.id);
          const monthsLeft = activeEntry?.expiresAt === null || activeEntry?.expiresAt === undefined ? 0 : Math.max(0, activeEntry.expiresAt - currentMonthIndex(state));
          const status = active
            ? edict.toggle ? "Active — click to cancel" : monthsLeft ? `Active — expires in ${monthsLeft} month${monthsLeft === 1 ? "" : "s"}` : "Active"
            : reason ?? (cooldown && cooldown > currentMonthIndex(state) ? "On cooldown" : "Available");
          const tooltip = [edict.description, status].filter(Boolean).join("\n");
          return (
            <Tooltip key={edict.id} title={tooltip} placement="top" arrow>
              <span>
                <Button
                  id={`edict-${edict.id}`}
                  variant="contained"
                  disabled={Boolean(reason)}
                  onClick={() => {
                    const error = active && edict.toggle ? game.cancelEdict(edict.id) : game.issueEdict(edict.id);
                    if (error) game.notify(error);
                  }}
                  sx={{
                    ...tropicoButton,
                    width: "100%",
                    minHeight: 42,
                    px: 0.75,
                    py: 0.5,
                    lineHeight: 1.15,
                    whiteSpace: "normal",
                    opacity: active ? 1 : undefined,
                    background: active ? "linear-gradient(to bottom, #e0b84c 0%, #c89830 100%)" : tropicoButton.background,
                    "&.Mui-disabled": { color: "#77745f", background: "#c2bda5", borderColor: "#a09870" },
                  }}
                >
                  <Box component="span" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
                    <span>{active ? "✓ " : onCooldown ? "◷ " : ""}{edict.name}</span>
                    <span>${edictCost(edict.id as EdictId, state).toLocaleString()}</span>
                  </Box>
                </Button>
              </span>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default MenuEdicts;
