import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';

const PokemonCard = ({ pokemon, isFlipped, isMatched, onClick }) => {
  const shouldShowPokemon = isFlipped || isMatched;
  
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('PokemonCard clicked, onClick function:', typeof onClick);
    // Add visible feedback for debugging
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Card 
      data-card-index={pokemon.id}
      sx={{ 
        minWidth: 150,
        minHeight: 150,
        maxWidth: 150,
        maxHeight: 150,
        cursor: 'pointer',
        opacity: isMatched ? 0.5 : 0.8,
        position: 'relative',
        zIndex: 3,
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {shouldShowPokemon ? (
          <>
            <CardMedia
              component="img"
              image={pokemon.image}
              alt={pokemon.name}
              sx={{ 
                
              maxWidth: 100,
              maxHeight: 100,
                objectFit: 'contain' }}
            />
            <Typography variant="h6" component="div">
              {pokemon.name}
            </Typography>
          </>
        ) : (
          <Typography variant="h4" component="div">
            ?
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
