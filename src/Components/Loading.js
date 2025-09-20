// src/Components/Loading.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { COMPONENT_STYLES } from '../Util/styles';

const Loading = () => {
  return (
    <Box sx={COMPONENT_STYLES.loadingOverlay}>
      <CircularProgress
        size={80}
        thickness={4}
        sx={COMPONENT_STYLES.loadingSpinner}
      />
      
      <Typography
        variant="h5"
        sx={COMPONENT_STYLES.loadingText}
      >
        Loading Pokémon...
      </Typography>
      
      <Typography
        variant="body2"
        sx={COMPONENT_STYLES.loadingSubtext}
      >
        Gathering data from the PokéAPI
      </Typography>
    </Box>
  );
};

export default Loading;
