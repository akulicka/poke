import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getTextColorForRegion } from '../../Util/styles';
import { useApp } from '../../Util/Context';

const CatchEffect = ({ pokemonName, onComplete, isShiny = false }) => {
  const { currentRegion } = useApp(); // Get from context
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState(0);

  // Get appropriate text color based on current region
  const textColor = getTextColorForRegion(currentRegion);

  useEffect(() => {
    // Start animation immediately
    const animationDuration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;
      
      if (progress >= 1) {
        setIsVisible(false);
        onComplete?.();
        return;
      }

      // Move upward slowly (from 0 to -100px)
      setPosition(-100 * progress);
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, calc(-50% + ${position}px))`,
        zIndex: 9999,
        pointerEvents: 'none',
        textAlign: 'center'
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: isShiny ? '#FFD700' : '#4CAF50',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontSize: { xs: '2rem', sm: '3rem' },
          animation: 'pulse 0.5s ease-in-out'
        }}
      >
        {isShiny ? 'Shiny Caught!' : 'Caught!'}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: isShiny ? '#FFD700' : textColor,
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          mt: 1
        }}
      >
        {pokemonName}
      </Typography>
    </Box>
  );
};

export default CatchEffect;
