import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
  IconButton,
  Slider
} from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { useApp } from '../../Util/Context';
import Collection from '../Collection';

const GameHeader = ({ 
  gameTime, 
  gameStarted, 
  moves, 
  gameWon, 
  formatTime,
  onNewGame,
  onSaveAndQuit,
  roundNumber,
  totalMoves,
  totalTime
}) => {
  const { volume, setVolume, ProfileManager, currentProfile } = useApp();
  const [collectionOpen, setCollectionOpen] = useState(false);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleMuteToggle = () => {
    setVolume(volume > 0 ? 0 : 0.5);
  };

  const handleExportProfiles = () => {
    const profiles = ProfileManager.getAllProfiles();
    const profilesArray = Object.values(profiles);
    
    const dataStr = JSON.stringify(profilesArray, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pokemon-profiles.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Game Stats */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Chip label={`${currentProfile?.name || 'Player'}`} color="primary" size="small" />
            <Chip label={`Round ${roundNumber}`} color="secondary" size="small" />
            <Chip label={`Caught: ${currentProfile?.caughtPokemon?.length || 0}`} color="success" size="small" />
            <Chip label={`Total Time: ${formatTime(totalTime)}`} color="info" size="small" />
            <Chip label={`Total Moves: ${totalMoves}`} color="info" size="small" />
            {gameWon && (
              <Typography variant="h6" color="success.main" sx={{ ml: 1 }}>
                Won in {moves} moves!
              </Typography>
            )}
          </Stack>

          {/* Session Stats */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Chip label={`Time: ${formatTime(gameTime)}`} color="primary" size="small" />
            <Chip label={`Moves: ${moves}`} color="primary" size="small" />
          </Stack>

          {/* Controls */}  
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" onClick={onSaveAndQuit} size="small">
              Save & Quit
            </Button>
            <Button variant="outlined" onClick={() => setCollectionOpen(true)} size="small">
              Collection
            </Button>
            <Button variant="outlined" onClick={handleExportProfiles} size="small">
              Export
            </Button>
            
            {/* Volume Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
              <IconButton onClick={handleMuteToggle} size="small">
                {volume > 0 ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.1}
                sx={{ width: 80 }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Collection open={collectionOpen} onClose={() => setCollectionOpen(false)} />
    </>
  );
};

export default GameHeader;
