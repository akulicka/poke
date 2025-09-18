import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PokemonCard = ({ pokemon, isFlipped, isMatched, onClick }) => {
  const shouldShowPokemon = isFlipped || isMatched;
  
  return (
    <Card 
      sx={{ 
        height: 200, 
        cursor: 'pointer',
        opacity: isMatched ? 0.5 : 1,
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {shouldShowPokemon ? (
          <>
            <CardMedia
              component="img"
              height="120"
              image={pokemon.image}
              alt={pokemon.name}
              sx={{ objectFit: 'contain' }}
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

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isVolumeDisabled, setIsVolumeDisabled] = useState(false);

  // Fetch random Pokemon data
  const fetchRandomPokemon = async () => {
    // Generate 8 random Pokemon IDs (Pokemon go up to ~1000+)
    const pokemonIds = [];
    while (pokemonIds.length < 8) {
      const randomId = Math.floor(Math.random() * 1000) + 1;
      if (!pokemonIds.includes(randomId)) {
        pokemonIds.push(randomId);
      }
    }
    
    const pokemonData = [];
    
    for (const id of pokemonIds) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        pokemonData.push({
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          cry: data.cries?.latest || null
        });
      } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error);
      }
    }
    
    // Create pairs and shuffle
    const pairs = [...pokemonData, ...pokemonData];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setPokemon(shuffled);
  };

  // Fetch Pokemon data on initial load
  useEffect(() => fetchRandomPokemon(), []);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
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
        setFlippedCards([]); // Clear flipped cards immediately
        
        // Play Pokemon cry if available and volume is enabled
        if (firstPokemon.cry && !isVolumeDisabled) {
          const audio = new Audio(firstPokemon.cry);
          audio.play().catch(error => console.log('Could not play audio:', error));
        }
        
        // Check if game is won
        if (matchedCards.length + 2 === pokemon.length) {
          setGameWon(true);
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = async () => {
    await fetchRandomPokemon();
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Pokemon Matching Game
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Chip label={`Moves: ${moves}`} color="primary" />
            <Chip 
              label={`Matched: ${matchedCards.length / 2}/${pokemon.length / 2}`} 
              color="secondary" 
            />
          </Box>
          {gameWon && (
            <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
              Congratulations! You won in {moves} moves!
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Button variant="contained" onClick={resetGame}>
              New Game
            </Button>
            <IconButton 
              onClick={() => setIsVolumeDisabled(!isVolumeDisabled)}
              color="primary"
            >
              {isVolumeDisabled ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {pokemon.map((poke, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <PokemonCard
                pokemon={poke}
                isFlipped={flippedCards.includes(index)}
                isMatched={matchedCards.includes(index)}
                onClick={() => handleCardClick(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
