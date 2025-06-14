import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const tropicoPaper = {
  border: '2px solid #5a3f2e',
  color: '#dcd6c9',
  boxShadow: '0 6px 10px rgba(0,0,0,0.4), inset 0 0 15px rgba(0,0,0,0.7)',
};
const tropicoButton = {
  background: 'linear-gradient(to bottom, #e0d8b0 0%, #c8c090 100%)',
  color: '#4a4a4a',
  border: '1px solid #a09870',
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.2)',
  textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
  fontWeight: 700,
  borderRadius: 2,
  '&:hover': {
    filter: 'brightness(1.05)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
  },
};

const Minimap: React.FC = () => {
  return (
    <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 32, left: 32, width: 192, height: 192, borderRadius: 2, p: 1, pointerEvents: 'auto' }}>
      <Button id="minimap-zoom-out" size="small" sx={{ ...tropicoButton, position: 'absolute', top: 8, left: 8, minWidth: 0, p: 1 }}><span>-</span></Button>
      <Button id="minimap-zoom-in" size="small" sx={{ ...tropicoButton, position: 'absolute', top: 8, right: 8, minWidth: 0, p: 1 }}><span>+</span></Button>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, bgcolor: '#3b423b', border: '2px solid #4a4a4a' }}>
        <Typography variant="h6" color="#fff" sx={{ fontWeight: 'bold' }}>MAP</Typography>
      </Box>
      <Button id="minimap-rotate-left" size="small" sx={{ ...tropicoButton, position: 'absolute', bottom: 8, left: 8, minWidth: 0, p: 1 }}>&#8634;</Button>
      <Button id="minimap-rotate-right" size="small" sx={{ ...tropicoButton, position: 'absolute', bottom: 8, right: 8, minWidth: 0, p: 1 }}>&#8635;</Button>
    </Paper>
  );
};

export default Minimap;
