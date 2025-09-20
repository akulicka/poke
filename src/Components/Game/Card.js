import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box
} from '@mui/material';
import { COMPONENT_STYLES } from '../../Util/styles';

const PokemonCard = ({ pokemon, isFlipped, isMatched, onClick }) => {
  const shouldShowPokemon = isFlipped || isMatched;
  
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Card 
      data-card-index={pokemon.id}
      sx={{
        ...COMPONENT_STYLES.pokemonCard,
        ...(isMatched && COMPONENT_STYLES.pokemonCardMatched),
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s ease-in-out'
      }}
      onClick={handleClick}
    >
      <CardContent sx={COMPONENT_STYLES.pokemonCardContent}>
        <Box sx={COMPONENT_STYLES.pokemonCardFlipContainer}>
          {/* Question Mark Side */}
          <Box sx={{
            ...COMPONENT_STYLES.pokemonCardFlipSideQuestion,
            transform: shouldShowPokemon ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}>
            <Typography 
              variant="h4" 
              component="div"
              sx={COMPONENT_STYLES.pokemonCardQuestionMark}
            >
              ?
            </Typography>
          </Box>

          {/* Pokemon Side */}
          <Box sx={{
            ...COMPONENT_STYLES.pokemonCardFlipSidePokemon,
            transform: shouldShowPokemon ? 'rotateY(0deg)' : 'rotateY(-180deg)'
          }}>
            <CardMedia
              component="img"
              image={pokemon.image}
              alt={pokemon.name}
              sx={{
                ...COMPONENT_STYLES.pokemonCardImage,
                mb: 1
              }}
            />
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                ...COMPONENT_STYLES.pokemonCardName,
                ...COMPONENT_STYLES.pokemonCardNameContainer
              }}
            >
              {pokemon.name}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
