import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container,
  Stack,
  Box,
  AppBar,
  Toolbar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './Components/Navbar';
import Game from './Components/Game';
import { REGION_IMAGES, GAME_CONFIG, FALLBACK_REGIONS } from './Util/constants';
import { fetchGenerations, fetchPokemonByGeneration } from './Util/PokeApi';
import Menu from './Components/Menu';
import Collection from './Components/Collection';
import Loading from './Components/Loading';

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
  const [gameStarted, setGameStarted] = useState(false);
  const [pokemon, setPokemon] = useState([]);
  const [currentRegion, setCurrentRegion] = useState('all'); // Add thi
  const [regions, setRegions] = useState(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionOpen, setCollectionOpen] = useState(false);

  // Fetch available generations from PokeAPI
  useEffect(() => {
    const loadGenerations = async () => {
      try {
        const regionList = await fetchGenerations();
        setRegions(regionList);
      } catch (error) {
        console.error('Error fetching generations:', error);
        // Fallback to hardcoded values
        setRegions(FALLBACK_REGIONS);
      }
    };

    loadGenerations();
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch Pokemon by generation - now accepts region parameter
  const fetchPokemonByGenerationHandler = async (region = currentRegion) => {
    setIsLoading(true);
    
    // Use the passed region or fall back to selectedRegion
    const targetRegion = region || currentRegion;
    
    try {
      const pokemonData = await fetchPokemonByGeneration(targetRegion, regions, GAME_CONFIG);
      setPokemon(pokemonData);
      
      // Update background and music for the new region
      if (region && region !== currentRegion) {
        setSelectedRegion(region);
      }
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Pokemon data when regions are loaded and selectedRegion changes
  useEffect(() => {
    if (regions.length > 1) { // Ensure regions are loaded
      fetchPokemonByGenerationHandler();
    }
  }, [currentRegion, regions]);


  // Get current background image
  const getBackgroundImage = () => {
    const regionIndex = regions.indexOf(currentRegion);
    return regionIndex >= 0 && regionIndex < REGION_IMAGES.length ? REGION_IMAGES[regionIndex] : null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'fixed',
          minHeight: '100vh',
          width: '100vw',
          top: 0,
          left: 0,
          zIndex: -1
        }}>
      { isLoading ? <Loading /> : (
        <>
      { !gameStarted ? <Menu setGameStarted={setGameStarted}/> : (
        <Stack sx={{ 
          height: '100%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar 
            regions={regions}
            onNewGame={fetchPokemonByGenerationHandler}
            setCollectionOpen={setCollectionOpen}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Game
              regions={regions}
              pokemon={pokemon}
              isLoading={isLoading}
              formatTime={formatTime}
              onNewGame={fetchPokemonByGenerationHandler}
              getBackgroundImage={getBackgroundImage}
              currentRegion={currentRegion}
              setCurrentRegion={setCurrentRegion}
            />
          </Box>
        </Stack>
        )}
      </>
      )}
    </Box>

      {/* Collection Dialog */}
      <Collection 
        open={collectionOpen} 
        onClose={() => setCollectionOpen(false)} 
      />
    </ThemeProvider>
  );
};

export default App;
