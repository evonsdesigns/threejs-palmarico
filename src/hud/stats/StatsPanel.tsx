import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const tropicoPaper = {
  border: '2px solid #5a3f2e',
  color: '#dcd6c9',
  boxShadow: '0 6px 10px rgba(0,0,0,0.4), inset 0 0 15px rgba(0,0,0,0.7)',
};

const StatsPanel: React.FC = () => (
  <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 32, right: 32, width: 220, borderRadius: 2, p: 2, pointerEvents: 'auto' }}>
    <Typography variant="h6" align="center" fontWeight={700} gutterBottom>Stats</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
      {[{ label: 'Pop', value: 1200, percent: 75 },
        { label: 'Gold', value: '$15K', percent: 50 },
        { label: 'Apprv', value: '85%', percent: 85 },
        { label: 'Res', value: 420, percent: 60 },
      ].map((stat) => (
        <Box key={stat.label} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" color="text.secondary">{stat.label}: {stat.value}</Typography>
          <Box sx={{ width: '100%', height: 10, bgcolor: '#4a4a4a', borderRadius: 5, mt: 0.5 }}>
            <Box sx={{ width: `${stat.percent}%`, height: '100%', bgcolor: 'success.main', borderRadius: 5 }} />
          </Box>
        </Box>
      ))}
    </Box>
  </Paper>
);

export default StatsPanel;
