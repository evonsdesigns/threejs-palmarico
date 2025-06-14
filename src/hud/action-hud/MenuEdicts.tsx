import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const tropicoButton = {
  background: 'linear-gradient(to bottom, #e0d8b0 0%, #c8c090 100%)',
  color: '#4a4a4a',
  border: '1px solid #a09870',
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.2)',
  textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
  fontWeight: 700,
  borderRadius: 2,
  fontSize: '10px',
  '&:hover': {
    filter: 'brightness(1.05)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
  },
};

const MenuEdicts: React.FC = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, width: 320, pl: 2 }}>
    <Button variant="contained" color="primary" id="edict-1" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 1
    </Button>
    <Button variant="contained" color="primary" id="edict-2" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 2
    </Button>
    <Button variant="contained" color="primary" id="edict-3" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 3
    </Button>
    <Button variant="contained" color="primary" id="edict-4" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 4
    </Button>
    <Button variant="contained" color="primary" id="edict-5" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 5
    </Button>
    <Button variant="contained" color="primary" id="edict-6" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 6
    </Button>
    <Button variant="contained" color="primary" id="edict-7" sx={{ ...tropicoButton, width: 100, borderRadius: 2 }}>
      Edict 7
    </Button>
  </Box>
);

export default MenuEdicts;
