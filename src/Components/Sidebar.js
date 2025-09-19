import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Chip,
  Divider
} from '@mui/material';
import { AudioControls } from './AudioPlayer';

const Sidebar = ({ 
  regions, 
  selectedRegion, 
  setSelectedRegion, 
  volume, 
  setVolume,
  onNewGame
}) => {
  const resetGame = () => {
    onNewGame?.();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Game Controls
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={resetGame}
          fullWidth
          sx={{ mb: 2 }}
        >
          New Game
        </Button>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Audio Settings
        </Typography>
        
        <AudioControls volume={volume} setVolume={setVolume} />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Region Selection
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {regions.map(region => (
            <Chip
              key={region}
              label={region.charAt(0).toUpperCase() + region.slice(1)}
              onClick={() => setSelectedRegion(region)}
              color={selectedRegion === region ? 'primary' : 'default'}
              clickable
              variant={selectedRegion === region ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
