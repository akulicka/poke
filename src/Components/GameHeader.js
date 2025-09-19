import React from 'react';
import {
  Box,
  Typography,
  Chip
} from '@mui/material';

const GameHeader = ({ 
  gameTime, 
  moves, 
  matchedCards, 
  pokemon, 
  gameWon, 
  formatTime 
}) => {
  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      {/* <Typography variant="h3" component="h1" gutterBottom>
        Pokemon Matching Game
      </Typography> */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <Chip label={`Time: ${formatTime(gameTime)}`} color="primary" />
        <Chip label={`Moves: ${moves}`} color="primary" />
        <Chip 
          label={`Matched: ${matchedCards.length / 2}/${pokemon.length / 2}`} 
          color="secondary" 
        />
      </Box>
      {gameWon && (
        <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
          Congratulations! You won in {moves} moves and {formatTime(gameTime)}!
        </Typography>
      )}
    </Box>
  );
};

export default GameHeader;
