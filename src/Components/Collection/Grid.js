import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CollectionCard from './Card';

const PokemonGrid = ({ 
  currentPagePokemon, 
  pokemonDetails, 
  cacheStatus, 
  startIndex, 
  endIndex, 
  caughtPokemon 
}) => {
  return (
    <>
      {/* Page Info */}
      <Box sx={{ mb: 1, textAlign: 'center' }}> {/* Reduced from mb: 2 to mb: 1 */}
        <Typography variant="body2" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Showing {startIndex + 1}-{Math.min(endIndex, caughtPokemon.length)} of {caughtPokemon.length} Pokémon
        </Typography>
      </Box>

      <Box sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '20px 15px', // Reduced padding from 30px 20px to 20px 15px
        borderRadius: '10px',
        backdropFilter: 'blur(5px)',
        flex: 1,
        maxWidth: 'fit-content',
        margin: '0 auto',
        minHeight: '250px' // Reduced from implicit 300px to 250px
      }}>
        <Grid container spacing={1.5} justifyContent="center" alignItems="center"> {/* Reduced spacing from 2 to 1.5 */}
          {currentPagePokemon.map((pokemon, index) => {
            // Handle empty slots
            if (!pokemon) {
              return (
                <Grid item xs={3} key={`empty-${index}`}>
                  <Box sx={{ width: '68px', height: '56px', margin: '0 auto' }} />
                </Grid>
              );
            }

            return (
              <Grid item xs={3} key={`${pokemon.pokemonId}-${pokemon.catchDate}`}>
                <CollectionCard 
                  pokemon={pokemon}
                  pokemonDetails={pokemonDetails}
                  cacheStatus={cacheStatus}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default PokemonGrid;

