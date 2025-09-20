import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  Button,
  LinearProgress,
  Pagination
} from '@mui/material';
import { useApp } from '../../Util/Context';
import { COMPONENT_STYLES, COLORS, getTextColorForRegion } from '../../Util/styles';
import { backgroundFetcher } from '../../Util/BackgroundFetcher';
import CollectionStats from './Stats';
import PokemonGrid from './Grid';

const Collection = ({ open, onClose }) => {
  const { caughtPokemon, currentRegion, backgroundFetcher } = useApp();
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [cacheStatus, setCacheStatus] = useState({ total: 0, cached: 0, missing: 0, percentage: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [imageDimensions, setImageDimensions] = useState({ width: 800, height: 600 });

  // Get appropriate text color based on current region
  const textColor = getTextColorForRegion(currentRegion);

  // Load image dimensions when dialog opens
  useEffect(() => {
    if (open) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth * 1.5, // 150% scale
          height: img.naturalHeight * 1.5
        });
      };
      img.src = '/pdex.jpg';
    }
  }, [open]);

  // Calculate pagination - ensure proper ordering
  const totalPages = Math.ceil(caughtPokemon.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Get Pokemon for current page in proper order
  const currentPagePokemon = caughtPokemon.slice(startIndex, endIndex);
  
  // For the last page, pad with empty slots to maintain grid order
  const paddedPokemon = [...currentPagePokemon];
  while (paddedPokemon.length < pageSize && paddedPokemon.length > 0) {
    paddedPokemon.push(null); // Add empty slots
  }

  // Load cached details when collection opens or page changes
  useEffect(() => {
    if (open && currentPagePokemon.length > 0) {
      const details = {};
      const uniquePokemon = [...new Set(currentPagePokemon.map(p => p.pokemonId))];
      
      // Load all cached details for current page
      uniquePokemon.forEach(pokemonId => {
        const cached = backgroundFetcher.getCachedDetails(pokemonId);
        if (cached) {
          details[pokemonId] = cached;
        }
      });
      
      setPokemonDetails(details);
      
      // Update cache status for current page only
      const status = backgroundFetcher.getCacheStatus(currentPagePokemon);
      setCacheStatus(status);
      
      // Start background fetching for current page only
      if (status.missing > 0) {
        backgroundFetcher.startFetching(currentPagePokemon);
      }
    }
  }, [open, currentPage, caughtPokemon]);

  // Calculate completion stats
  const uniquePokemon = [...new Set(caughtPokemon.map(p => p.pokemonId))];
  const shinyCount = caughtPokemon.filter(p => p.isShiny).length;
  const completionPercentage = Math.min(100, (uniquePokemon.length / 1000) * 100);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: `${imageDimensions.width}px`,
          height: `${imageDimensions.height}px`,
          maxWidth: '95vw',
          maxHeight: '95vh',
          backgroundImage: 'url(/pdex.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative'
        }
      }}
    >
      {/* Simple close button in top right */}
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 15,
          right: 15,
          width: 30,
          height: 30,
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        ×
      </Box>

      <DialogContent sx={{
        backgroundColor: 'transparent',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Cache Status */}
        {cacheStatus.missing > 0 && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Loading Pokemon details... ({cacheStatus.cached}/{cacheStatus.total} cached)
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={cacheStatus.percentage}
              sx={{ 
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: COLORS.primary
                }
              }}
            />
          </Box>
        )}
        
        {/* Stats Component */}
        <CollectionStats 
          caughtPokemon={caughtPokemon}
          uniquePokemon={uniquePokemon}
          shinyCount={shinyCount}
          completionPercentage={completionPercentage}
        />

        {/* Pokemon Collection */}
        {caughtPokemon.length === 0 ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" sx={{ color: '#333', textAlign: 'center' }}>
              No Pokémon caught yet!<br />
              <Typography variant="body2" sx={{ color: '#333', mt: 1 }}>
                Start playing to catch your first Pokémon!
              </Typography>
            </Typography>
          </Box>
        ) : (
          <>
            {/* Pokemon Grid Component */}
            <PokemonGrid 
              currentPagePokemon={paddedPokemon}
              pokemonDetails={pokemonDetails}
              cacheStatus={cacheStatus}
              startIndex={startIndex}
              endIndex={endIndex}
              caughtPokemon={caughtPokemon}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&.Mui-selected': {
                        backgroundColor: COLORS.primary,
                        color: 'white'
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{
        backgroundColor: 'transparent',
        padding: '10px 20px'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: '#333',
            color: '#333',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#333'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Collection;