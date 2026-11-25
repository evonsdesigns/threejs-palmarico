import React, { useSyncExternalStore } from "react";
import { Paper, Typography } from "@mui/material";
import { game } from "../../logic/game";

const NotificationsPanel: React.FC = () => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  return (
    <Paper role="status" elevation={6} sx={{ border: '2px solid #70553b', boxShadow: '0 6px 10px rgba(0,0,0,0.4)', position: 'absolute', bottom: { xs: 260, lg: 320 }, right: 16, width: { xs: 140, lg: 220 }, boxSizing: 'border-box', borderRadius: 1, p: 1.5, bgcolor: '#e5d19c', pointerEvents: 'auto' }}>
      <Typography variant="caption" color="text.primary">{state.notice}</Typography>
    </Paper>
  );
};

export default NotificationsPanel;
