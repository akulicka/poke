import React from 'react';
import { Box, Typography, LinearProgress, Grid, Card, CardContent } from '@mui/material';
import { COLORS } from '../../Util/styles';

const CollectionStats = ({ caughtPokemon, uniquePokemon, shinyCount, completionPercentage }) => {
  // Function to create stat cards
  const createStatCard = (value, label, color) => (
    <Card sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
      color: '#333',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.2)'
    }}>
      <CardContent sx={{ textAlign: 'center', py: 1 }}>
        <Typography variant="h6" sx={{ color: color }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#333' }}>{label}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mb: 1 }}>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={4}>
          {createStatCard(caughtPokemon.length, 'Total Caught', COLORS.primary)}
        </Grid>
        <Grid item xs={12} sm={4}>
          {createStatCard(shinyCount, 'Shiny Pokémon', COLORS.gold)}
        </Grid>
        <Grid item xs={12} sm={4}>
          {createStatCard(uniquePokemon.length, 'Unique Species', COLORS.secondary)}
        </Grid>
      </Grid>
      
      {/* Completion Progress */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'white', mb: 0.5, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Collection Progress
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage}
          sx={{
            height: 6,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: COLORS.primary
            }
          }}
        />
        <Typography variant="caption" sx={{ color: 'white', mt: 0.5, display: 'block', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {completionPercentage.toFixed(1)}% Complete
        </Typography>
      </Box>
    </Box>
  );
};

export default CollectionStats;
