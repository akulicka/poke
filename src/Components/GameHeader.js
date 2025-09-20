import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Stack
} from '@mui/material';

  // Timer effect

const GameHeader = ({ gameTime, gameStarted, moves, gameWon, formatTime }) => {
  // No timer logic here, just display
    
  return (
    <AppBar position="static" color="default" elevation={1} sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.35)',}}>
      <Toolbar>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Chip label={`Time: ${formatTime(gameTime)}`} color="primary" />
          <Chip label={`Moves: ${moves}`} color="primary" />
          
          {gameWon && (
            <Typography variant="h6" color="success.main" sx={{ ml: 'auto' }}>
              Congratulations! You won in {moves} moves and {formatTime(gameTime)}!
            </Typography>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default GameHeader;
