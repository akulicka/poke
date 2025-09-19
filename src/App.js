import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Sidebar from './Components/Sidebar';
import Game from './Components/Game';
import AudioPlayer from './Components/AudioPlayer';
import { REGION_IMAGES, GAME_CONFIG, FALLBACK_REGIONS } from './constants';

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

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [volume, setVolume] = useState(GAME_CONFIG.DEFAULT_VOLUME);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [regions, setRegions] = useState(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonCry, setPokemonCry] = useState(null);

  // Fetch available generations from PokeAPI
  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const genResponse = await fetch('https://pokeapi.co/api/v2/generation/');
        const genData = await genResponse.json();
        const regionList = ['all', ...genData.results.map(gen => gen.name)];
        setRegions(regionList);
      } catch (error) {
        console.error('Error fetching generations:', error);
        // Fallback to hardcoded values
        setRegions(FALLBACK_REGIONS);
      }
    };

    fetchGenerations();
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch Pokemon by generation
  const fetchPokemonByGeneration = async () => {
    setIsLoading(true);
    let pokemonIds = [];
    
    if (selectedRegion !== 'all') {
      const genId = regions.indexOf(selectedRegion);
      const response = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`);
      const data = await response.json();
      
      const genPokemon = data.pokemon_species;
      while (pokemonIds.length < GAME_CONFIG.POKEMON_PAIRS) {
        const randomPokemon = genPokemon[Math.floor(Math.random() * genPokemon.length)];
        const pokemonId = parseInt(randomPokemon.url.split('/').slice(-2, -1)[0]);
        if (!pokemonIds.includes(pokemonId)) {
          pokemonIds.push(pokemonId);
        }
      }
    } else {
      // Random selection from all generations
      while (pokemonIds.length < GAME_CONFIG.POKEMON_PAIRS) {
        const randomId = Math.floor(Math.random() * GAME_CONFIG.MAX_POKEMON_ID) + 1;
        if (!pokemonIds.includes(randomId)) {
          pokemonIds.push(randomId);
        }
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
    
    const pairs = [...pokemonData, ...pokemonData];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    console.log('Pokemon data loaded:', shuffled.length, 'cards');
    setPokemon(shuffled);
    setIsLoading(false);
  };

  // Fetch Pokemon data when regions are loaded and selectedRegion changes
  useEffect(() => {
    if (regions.length > 1) { // Ensure regions are loaded
      fetchPokemonByGeneration();
    }
  }, [selectedRegion, regions]);


  // Get current background image
  const getBackgroundImage = () => {
    if (selectedRegion === 'all') return null;
    const regionIndex = regions.indexOf(selectedRegion) - 1;
    return regionIndex >= 0 && regionIndex < REGION_IMAGES.length ? REGION_IMAGES[regionIndex] : null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AudioPlayer 
          selectedRegion={selectedRegion}
          regions={regions}
          volume={volume}
          pokemonCry={pokemonCry}
        />
        
        <Sidebar 
          regions={regions}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          volume={volume}
          setVolume={setVolume}
          onNewGame={fetchPokemonByGeneration}
        />
        
        <Game
          pokemon={pokemon}
          isLoading={isLoading}
          formatTime={formatTime}
          getBackgroundImage={getBackgroundImage}
          volume={volume}
          setPokemonCry={setPokemonCry}
        />
        
      </Box>
    </ThemeProvider>
  );
};

export default App;
