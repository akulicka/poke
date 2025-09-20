import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton
} from '@mui/material';
import { AudioPlayer, AudioControls } from './AudioPlayer';
import { REGION_AUDIO, FALLBACK_REGIONS } from '../Util/constants';
import Collection from './Collection';
import { COMPONENT_STYLES, COLORS } from '../Util/styles';

const Navbar = ({ 
  onNewGame,
}) => {
  const [collectionOpen, setCollectionOpen] = useState(false);
  
  const resetGame = () => {
    onNewGame?.();
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={COMPONENT_STYLES.navbar}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button 
              variant="contained" 
              onClick={resetGame}
              size="small"
            >
              New Game
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => setCollectionOpen(true)}
              size="small"
              sx={COMPONENT_STYLES.collectionButton}
            >
              Collection
            </Button>
            

          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AudioControls compact={true} />
          </Box>
        </Toolbar>
    </AppBar>

      <Collection 
        open={collectionOpen} 
        onClose={() => setCollectionOpen(false)} 
      />
    </>
  );
};

export default Navbar;
