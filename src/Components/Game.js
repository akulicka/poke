import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Stack,
  Typography,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import GameHeader from './GameHeader';
import GameGrid from './GameGrid';
import { GAME_CONFIG, REGION_AUDIO, FALLBACK_REGIONS } from '../Util/constants';
import Collection from './Collection';
import { COMPONENT_STYLES } from '../Util/styles';
import AudioPlayer from './AudioPlayer';

const Game = ({ 
  pokemon,
  isLoading,
  formatTime,
  onNewGame,
  currentRegion,
  setCurrentRegion,
  regions,
}) => {

  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const incMoves = () => {
    setMoves(moves + 1);
  };

  // Handle new round with selected region
  const handleNewRound = useCallback(() => {
    // Reset game state
    setMoves(0);
    setGameWon(false);
    setGameTime(0);
    setGameStarted(false);
    
    // Update the current playing region to match selection
    setCurrentRegion(selectedRegion);
    
    // Trigger new game with current region selection
    onNewGame(selectedRegion);
  }, [selectedRegion, onNewGame]);

  const audio = useMemo(() => REGION_AUDIO[regions.indexOf(currentRegion)], [currentRegion]);
  // Reset game when pokemon changes
  useEffect(() => {
    setMoves(0);
    setGameWon(false);
    setGameTime(0);
    setGameStarted(false);
  }, []);
  useEffect(() => { console.log('selectedRegion', selectedRegion); }, [selectedRegion]);
  useEffect(() => { console.log('currentRegion', currentRegion); }, [currentRegion]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setGameStarted(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    let interval = null;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setGameTime(gameTime => gameTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  return (
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <GameHeader 
          gameTime={gameTime}
          gameStarted={gameStarted}
          moves={moves}
          gameWon={gameWon}
          formatTime={formatTime}
        />

        {isLoading ? <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}> Loading Pokemon...</Typography> : (
          <>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GameGrid  pokemon={pokemon} gameStarted={gameStarted} setGameStarted={setGameStarted} incMoves={incMoves} setGameWon={setGameWon}/>
            </Box>
            
            {/* Next Round Button - Only visible when game is won */}
            {gameWon && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={selectedRegion}
                    label="Region"
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 1.0)' }}
                  >
                    {regions.map((region, index) => (
                      <MenuItem key={region} value={region}>
                        {FALLBACK_REGIONS[index].charAt(0).toUpperCase() + FALLBACK_REGIONS[index].slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleNewRound}
                >
                  Next Round
                </Button>
              </Box>
            )}
          </>
        )}
        
        {/* Use currentRegion instead of selectedRegion for audio */}
        <AudioPlayer audioSrc={audio} loop={true} />
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, color: 'green' }}> Pokemon loaded! Click cards to play.</Typography>
        
      </Stack>
  );
};

export default Game;
