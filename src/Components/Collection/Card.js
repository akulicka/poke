import React from 'react';
import { Box, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { COLORS } from '../../Util/styles';

// Simple utility functions
const getBoxSpriteUrl = (pokemonName, isShiny = false) => {
  const type = isShiny ? 'shiny' : 'regular';
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/${type}/${pokemonName.toLowerCase()}.png`;
};

const CollectionCard = ({ pokemon, pokemonDetails, cacheStatus }) => {
  const details = pokemonDetails[pokemon.pokemonId];
  const displayName = details?.name || pokemon.name;
  const description = details?.description || 'Loading description...';

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {description}
          </Typography>
          {pokemon.isShiny && (
            <Chip 
              icon={<StarIcon />} 
              label="Shiny" 
              size="small" 
              sx={{ backgroundColor: COLORS.gold, color: 'black' }}
            />
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <span>
        <IconButton
          sx={{
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
          disabled={cacheStatus.missing > 0}
        >
          <Box
            component="img"
            src={getBoxSpriteUrl(pokemon.name, pokemon.isShiny)}
            alt={pokemon.name}
            sx={{
              width: '68px',
              height: '56px',
              borderRadius: '8px',
              border: pokemon.isShiny ? `2px solid ${COLORS.gold}` : `1px solid rgba(255, 255, 255, 0.5)`,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '4px',
              ...(pokemon.isShiny && {
                filter: 'brightness(1.2) saturate(1.5)'
              })
            }}
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`;
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default CollectionCard;
