import React, { useEffect, useRef, useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import GameScene from "../../scene/GameScene";
import { game } from "../../logic/game";

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
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    for (let z = 0; z < 96; z++) {
      for (let x = 0; x < 96; x++) {
        const height = GameScene.instance.getMapHeight((x / 95 - 0.5) * 1024, (z / 95 - 0.5) * 1024);
        context.fillStyle = height < 0 ? "#327c81" : height < 1 ? "#d5c695" : height < 5 ? "#83965b" : "#547b4f";
        context.fillRect(x, z, 1, 1);
      }
    }
    context.fillStyle = "#f4e3b2";
    for (const building of state.placed) {
      context.fillRect((building.x / 1024 + 0.5) * 96 - 1, (building.z / 1024 + 0.5) * 96 - 1, 3, 3);
    }
  }, [state.placed]);

  return (
    <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 16, left: 16, width: { xs: 120, lg: 192 }, height: { xs: 120, lg: 192 }, borderRadius: 1, p: 1, bgcolor: '#4c4a3b', pointerEvents: 'auto' }}>
      <Button aria-label="Zoom out" onClick={() => GameScene.instance.zoom(0.8)} id="minimap-zoom-out" size="small" sx={{ ...tropicoButton, zIndex: 1, position: 'absolute', top: 8, left: 8, minWidth: 0, p: 1 }}><span>-</span></Button>
      <Button aria-label="Zoom in" onClick={() => GameScene.instance.zoom(1.25)} id="minimap-zoom-in" size="small" sx={{ ...tropicoButton, zIndex: 1, position: 'absolute', top: 8, right: 8, minWidth: 0, p: 1 }}><span>+</span></Button>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 1, bgcolor: '#2d4d4a', border: '2px solid #4a4a4a' }}>
        <canvas ref={canvas} width={96} height={96} aria-label="Island overview" style={{ width: '72%', height: '72%', transform: 'rotate(45deg)', imageRendering: 'pixelated', border: '2px solid #bca879' }} />
      </Box>
      <Button aria-label="Rotate left" onClick={() => GameScene.instance.rotate(Math.PI / 4)} id="minimap-rotate-left" size="small" sx={{ ...tropicoButton, position: 'absolute', bottom: 8, left: 8, minWidth: 0, p: 1 }}>&#8634;</Button>
      <Button aria-label="Rotate right" onClick={() => GameScene.instance.rotate(-Math.PI / 4)} id="minimap-rotate-right" size="small" sx={{ ...tropicoButton, position: 'absolute', bottom: 8, right: 8, minWidth: 0, p: 1 }}>&#8635;</Button>
    </Paper>
  );
};

export default Minimap;
