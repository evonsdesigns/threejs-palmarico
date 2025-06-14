import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const tropicoPaper = {
  border: '2px solid #5a3f2e',
  color: '#dcd6c9',
  boxShadow: '0 6px 10px rgba(0,0,0,0.4), inset 0 0 15px rgba(0,0,0,0.7)',
};

const NotificationsPanel: React.FC = () => (
  <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 32 + 128 + 32, right: 32, width: 128, height: 128, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', bgcolor: 'warning.light' }}>
    <Typography variant="h4" color="warning.main">!</Typography>
    <Typography variant="caption" color="text.secondary">New Event!</Typography>
  </Paper>
);

export default NotificationsPanel;
