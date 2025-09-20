import React, { useState, useEffect, useCallback } from 'react';
import { 
  Stack,
  Box
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Game from './Components/Game';
import { REGION_IMAGES, GAME_CONFIG, FALLBACK_REGIONS, REGION_AUDIO } from './Util/constants';
import { fetchGenerations, fetchPokemonByGeneration } from './Util/PokeApi';
import Menu from './Components/Menu';
import Loading from './Components/Loading';
import AudioPlayer from './Components/AudioPlayer';
import { AppProvider, useApp } from './Util/Context';

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

const AppContent = () => {
  const { currentRegion, setCurrentRegion } = useApp();
  const [gameStarted, setGameStarted] = useState(false);
  const [pokemon, setPokemon] = useState([]);
  const [regions, setRegions] = useState(['all']);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available generations from PokeAPI
  useEffect(() => {
    const loadGenerations = async () => {
      try {
        const regionList = await fetchGenerations();
        setRegions(regionList);
      } catch (error) {
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

  // Fetch Pokemon by generation - memoized to prevent infinite loops
  const fetchPokemonByGenerationHandler = useCallback(async (region = currentRegion) => {
    setIsLoading(true);
    
    const targetRegion = region || currentRegion;
    
    try {
      const pokemonData = await fetchPokemonByGeneration(targetRegion, regions, GAME_CONFIG);
      setPokemon(pokemonData);
      
      if (region && region !== currentRegion) {
        setCurrentRegion(region);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, [currentRegion, regions]);

  // Fetch Pokemon data when regions are loaded and currentRegion changes
  useEffect(() => {
    if (regions.length > 1) {
      fetchPokemonByGenerationHandler();
    }
  }, [currentRegion, regions, fetchPokemonByGenerationHandler]);

  // Fetch fresh Pokemon when game starts (separate effect)
  useEffect(() => {
    if (gameStarted && regions.length > 1) {
      fetchPokemonByGenerationHandler();
    }
  }, [gameStarted]);

  // Get current background image
  const getBackgroundImage = () => {
    const regionIndex = regions.indexOf(currentRegion);
    return regionIndex >= 0 && regionIndex < REGION_IMAGES.length ? REGION_IMAGES[regionIndex] : null;
  };

  const handleSaveAndQuit = () => {
    // Profile is automatically saved via Context useEffect
    // Just return to menu
    setGameStarted(false);
  };

  // Get current audio source
  const getCurrentAudio = () => {
    // Play PokemonTheme.mp3 on main menu
    if (!gameStarted) {
      return '/PokemonTheme.mp3';
    }
    
    // Play region-specific music during game
    const regionIndex = regions.indexOf(currentRegion);
    return regionIndex >= 0 && regionIndex < REGION_AUDIO.length ? REGION_AUDIO[regionIndex] : null;
  };

  return (
    <>
      {/* Audio Player - Always mounted to prevent interruption during loading */}
      <AudioPlayer audioSrc={getCurrentAudio()} loop={true} />
      
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
          <Box sx={{ flexGrow: 1 }}>
            <Game
              regions={regions}
              pokemon={pokemon}
              isLoading={isLoading}
              formatTime={formatTime}
              onNewGame={fetchPokemonByGenerationHandler}
              onSaveAndQuit={handleSaveAndQuit}
            />
          </Box>
        </Stack>
        )}
      </>
      )}    

      </Box>
    </>

  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
