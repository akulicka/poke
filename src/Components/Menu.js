import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import AudioControls from './AudioPlayer';




// Minimal landing page with navbar fields
const Menu = ({setGameStarted}) => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pokemon Memory Game
          </Typography>
          <Button color="inherit">Home</Button>
          <Button onClick={() => setGameStarted(true)} color="inherit">Play</Button>
          <Button color="inherit">Leaderboard</Button>
          <Button color="inherit">Settings</Button>
        </Toolbar>
      </AppBar> */}
      <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ height: '80vh' }}>
        <Typography variant="h3" sx={{ mt: 4 }}>
          Welcome to Pokemon Match & Catch!
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Test your memory and catch 'em all!
        </Typography>
        <Box>
          <Button onClick={() => setGameStarted(true)} variant="contained" color="primary" sx={{ mr: 2 }}>
            Play
          </Button>
          <AudioControls />
        </Box>
      </Stack>
    </Box>
  );
};

export default Menu;
