import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Slider,
  IconButton
} from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { useApp } from '../Util/Context';

// AudioControls component for volume management
export const AudioControls = ({ compact = false }) => {
  const { volume, setVolume } = useApp();
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleMuteToggle = () => {
    setVolume(volume > 0 ? 0 : 0.5); // Toggle between muted and 50%
    console.log('Volume:', volume);
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton 
          onClick={handleMuteToggle}
          color="primary"
          size="small"
        >
          {volume > 0 ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.1}
          sx={{ width: 80 }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
        />
        <Typography variant="body2" sx={{ minWidth: '40px' }}>
          {Math.round(volume * 100)}%
        </Typography>
      </Box>
    );
  }

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

export const AudioPlayer = ({ 
  audioSrc,
  loop = false,
  autoPlay = false,
  onEnded = null 
}) => {
  const audioRef = useRef(null);
  const { volume } = useApp();

  useEffect(() => {
    if (audioSrc && volume > 0) {
      // Stop previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Play new audio
      const audio = new Audio(audioSrc);
      audio.loop = loop;
      audio.volume = volume;
      audio.autoplay = autoPlay;
      
      if (onEnded) {
        audio.addEventListener('ended', onEnded);
      }
      
      audio.play().catch(error => console.log('Could not play audio:', error));
      audioRef.current = audio;
    } else {
      // Stop audio when no source or volume is 0
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [audioSrc, volume, loop, autoPlay]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AudioPlayer;