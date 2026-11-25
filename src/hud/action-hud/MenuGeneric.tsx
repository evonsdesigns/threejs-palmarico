import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const tropicoButton = {
  background: 'linear-gradient(to bottom, #e0d8b0 0%, #c8c090 100%)',
  color: '#4a4a4a',
  border: '1px solid #a09870',
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.2)',
  textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
  fontWeight: 700,
  borderRadius: 0.5,
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


interface MenuGenericProps<T extends { id: string; name: string; available?: boolean; description?: string }> {
  buttons: T[];
  onButtonClick: (id: string) => void;
}

const MenuGeneric = <T extends { id: string; name: string; available?: boolean; description?: string }>({ buttons, onButtonClick }: MenuGenericProps<T>) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(75px, 1fr))', gap: 1, p: 1, overflow: 'auto', maxHeight: 140 }}>
    {buttons.map((btn) => (
      <Button
        key={btn.id}
        variant="contained"
        color="primary"
        id={btn.id}
        disabled={btn.available === false}
        title={btn.description}
        sx={{ ...tropicoButton, minWidth: 0, minHeight: 42, '&.Mui-disabled': { opacity: 0.45, color: '#4a4a4a' } }}
        onClick={(event) => {
          event.stopPropagation();
          onButtonClick(btn.id);
        }}
      >
        {btn.name}
      </Button>
    ))}
  </Box>
);

export default MenuGeneric;
