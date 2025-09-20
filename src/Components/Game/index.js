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
import GameHeader from './Header';
import GameGrid from './Grid';
import { GAME_CONFIG, FALLBACK_REGIONS } from '../../Util/constants';
import { COMPONENT_STYLES } from '../../Util/styles';
import { useApp } from '../../Util/Context';


const Game = ({ 
  pokemon,
  isLoading,
  formatTime,
  onNewGame,
  regions,
  onSaveAndQuit
}) => {
  const { 
    currentRegion, 
    setCurrentRegion,
    roundNumber,
    setRoundNumber,
    totalMoves,
    setTotalMoves,
    totalTime,
    setTotalTime
  } = useApp();

  // Current round stats
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const incMoves = () => {
    setMoves(moves + 1);
    setTotalMoves(prev => prev + 1);
  };

  // Handle new round with selected region
  const handleNewRound = useCallback(() => {
    // Reset round state
    setMoves(0);
    setGameWon(false);
    setGameTime(0);
    setGameStarted(false);
    setRoundNumber(prev => prev + 1);
    
    // Update the current playing region to match selection (only if different)
    if (currentRegion !== selectedRegion) {
      setCurrentRegion(selectedRegion);
    }
    
    // Trigger new game with current region selection
    onNewGame(selectedRegion);
  }, [selectedRegion, onNewGame, setCurrentRegion, setRoundNumber]);

  // Reset game when pokemon changes (new session)
  useEffect(() =>  setGameWon(false), []);

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
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon, setTotalTime]);

  return (
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <GameHeader 
          gameTime={gameTime}
          gameStarted={gameStarted}
          moves={moves}
          gameWon={gameWon}
          formatTime={formatTime}
          onNewGame={onNewGame}
          onSaveAndQuit={onSaveAndQuit}
          roundNumber={roundNumber}
          totalMoves={totalMoves}
          totalTime={totalTime}
        />

        {isLoading ? <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}> Loading Pokemon...</Typography> : (
          <>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GameGrid  
                pokemon={pokemon} 
                gameStarted={gameStarted} 
                setGameStarted={setGameStarted} 
                incMoves={incMoves} 
                setGameWon={setGameWon}
              />
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
        
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 1, color: 'Black' }}>
          {gameWon ? `You won the round in ${formatTime(gameTime)}` : 'Click cards to play!'}
        </Typography>
        
      </Stack>
  );
};

export default Game;
