import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Slider,
  IconButton
} from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { REGION_AUDIO, GAME_CONFIG } from '../constants';

// AudioControls component for volume management
export const AudioControls = ({ volume, setVolume }) => {
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleMuteToggle = () => {
    setVolume(volume > 0 ? 0 : 0.5); // Toggle between muted and 50%
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <IconButton 
          onClick={handleMuteToggle}
          color="primary"
          size="small"
        >
          {volume > 0 ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: '40px' }}>
          {Math.round(volume * 100)}%
        </Typography>
      </Box>
      
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        min={0}
        max={1}
        step={0.1}
        sx={{ mb: 2 }}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
      />
    </>
  );
};

const AudioPlayer = ({ 
  selectedRegion, 
  regions, 
  volume, 
  pokemonCry 
}) => {
  const backgroundAudioRef = useRef(null);
  const cryAudioRef = useRef(null);

  // Handle background music based on region and volume
  useEffect(() => {
    if (selectedRegion !== 'all' && volume > 0) {
      const regionIndex = regions.indexOf(selectedRegion) - 1; // -1 because 'all' is at index 0
      if (regionIndex >= 0 && regionIndex < REGION_AUDIO.length) {
        // Stop previous audio
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.pause();
          backgroundAudioRef.current.currentTime = 0;
        }
        
        // Play new audio
        const audio = new Audio(REGION_AUDIO[regionIndex]);
        audio.loop = true;
        audio.volume = volume * GAME_CONFIG.BACKGROUND_VOLUME;
        audio.play().catch(error => console.log('Could not play background audio:', error));
        backgroundAudioRef.current = audio;
      }
    } else {
      // Stop audio when 'all' is selected or volume is 0
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    }
  }, [selectedRegion, volume, regions]);

  // Update background audio volume when volume changes
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = volume * GAME_CONFIG.BACKGROUND_VOLUME;
    }
  }, [volume]);

  // Play Pokemon cry when provided
  useEffect(() => {
    if (pokemonCry && volume > 0) {
      // Stop any existing cry audio
      if (cryAudioRef.current) {
        cryAudioRef.current.pause();
      }
      
      const audio = new Audio(pokemonCry);
      audio.volume = volume;
      audio.play().catch(error => console.log('Could not play Pokemon cry:', error));
      cryAudioRef.current = audio;
    }
  }, [pokemonCry, volume]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      if (cryAudioRef.current) {
        cryAudioRef.current.pause();
      }
    };
  }, []);

  // This component doesn't render anything - it's just for audio management
  return null;
};

export default AudioPlayer;