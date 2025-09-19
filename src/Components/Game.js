import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box
} from '@mui/material';
import GameHeader from './GameHeader';
import PokemonCard from './PokemonCard';
import { GAME_CONFIG } from '../constants';

const Game = ({ 
  pokemon,
  isLoading,
  formatTime,
  getBackgroundImage,
  volume,
  setPokemonCry,
  onGameStart,
  onGameReset
}) => {

  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setGameTime(time => time + 1);
      }, 1000);
    } else if (!gameStarted || gameWon) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Reset game when pokemon changes
  useEffect(() => {
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
    setGameTime(0);
    setGameStarted(false);
  }, [pokemon]);

  const handleCardClick = (index) => {
    console.log('Card clicked:', index, 'Pokemon:', pokemon[index]);
    
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      console.log('Card click ignored - already flipped/matched or two cards already flipped');
      return;
    }

    // Start game on first click
    if (!gameStarted) {
      setGameStarted(true);
      onGameStart?.();
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstPokemon = pokemon[firstIndex];
      const secondPokemon = pokemon[secondIndex];

      if (firstPokemon.id === secondPokemon.id) {
        // Match found
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setFlippedCards([]);
        
        // Trigger Pokemon cry playback
        if (firstPokemon.cry && volume > 0) {
          setPokemonCry(firstPokemon.cry);
        }
        
        // Check if game is won
        if (matchedCards.length + 2 === pokemon.length) {
          setGameWon(true);
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, GAME_CONFIG.CARD_FLIP_DELAY);
      }
    }
  };
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 2,
        backgroundImage: getBackgroundImage() ? `url(${getBackgroundImage()})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        height: '100vh',
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Add overlay for better text readability
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          zIndex: 0,
          pointerEvents: 'none' // Allow clicks to pass through
        }}
      /> */}
      
      <GameHeader 
        gameTime={gameTime}
        moves={moves}
        matchedCards={matchedCards}
        pokemon={pokemon}
        gameWon={gameWon}
        formatTime={formatTime}
      />

      {isLoading ? (
        <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>
          Loading Pokemon...
        </Typography>
      ) : (
        <>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, color: 'green' }}>
            Pokemon loaded! Click cards to play.
          </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid container spacing={1} sx={{ position: 'relative', zIndex: 2, maxWidth: '100%' }}>
            {pokemon.map((poke, index) => (
              <Grid item xs={3} sm={3} md={3} key={index}>
                <PokemonCard
                  pokemon={poke}
                  isFlipped={flippedCards.includes(index)}
                  isMatched={matchedCards.includes(index)}
                  onClick={() => handleCardClick(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        </>
      )}
    </Container>
  );
};

export default Game;
