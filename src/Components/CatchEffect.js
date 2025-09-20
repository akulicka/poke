import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const CatchEffect = ({ pokemonName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState(0);

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
          color: '#4CAF50',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontSize: { xs: '2rem', sm: '3rem' },
          animation: 'pulse 0.5s ease-in-out'
        }}
      >
        Caught!
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: '#81C784',
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
