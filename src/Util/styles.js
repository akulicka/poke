// src/Util/styles.js

// Essential colors only
export const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#45a049',
  secondary: '#81C784',
  white: '#ffffff',
  darkOverlay: 'rgba(0, 0, 0, 0.95)',
  lightOverlay: 'rgba(255, 255, 255, 0.75)',
  border: 'rgba(255, 255, 255, 0.1)',
  gold: '#FFD700',
  // High contrast color for brown backgrounds
  highContrast: '#1a1a1a' // Dark gray/black for high contrast against #c8a681
};

// Function to get text color based on region
export const getTextColorForRegion = (currentRegion) => {
  // List of regions that have brownish backgrounds requiring high contrast
  const brownBackgroundRegions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'];
  
  if (brownBackgroundRegions.includes(currentRegion)) {
    return COLORS.highContrast;
  }
  
  return COLORS.white; // Default white for other backgrounds
};

// Consolidated common styles
export const COMMON_STYLES = {
  transition: 'all 0.3s ease',
  shadow: '0 2px 8px rgba(0,0,0,0.3)',
  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
  backdropBlur: 'blur(10px)',
  borderRadius: '8px'
};

// Only used component styles
export const COMPONENT_STYLES = {
  // Pokemon Card
  pokemonCard: {
    minWidth: 150,
    minHeight: 150,
    maxWidth: 150,
    maxHeight: 150,
    cursor: 'pointer',
    opacity: 0.8,
    position: 'relative',
    zIndex: 3,
    '&:hover': {
      transform: 'scale(1.05)',
      transition: COMMON_STYLES.transition
    }
  },

  pokemonCardMatched: {
    opacity: 0.5
  },

  pokemonCardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    p: 1
  },

  pokemonCardImage: {
    maxWidth: 100,
    maxHeight: 100,
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto'
  },

  pokemonCardName: {
    textAlign: 'center',
    mt: 1,
    fontSize: '0.9rem',
    lineHeight: 1.2
  },

  pokemonCardQuestionMark: {
    textAlign: 'center',
    fontSize: '3rem'
  },

  // Card flip animation styles
  pokemonCardFlipContainer: {
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
    transformStyle: 'preserve-3d'
  },

  pokemonCardFlipSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    transition: 'transform 0.6s ease-in-out'
  },

  pokemonCardFlipSideQuestion: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    transition: 'transform 0.6s ease-in-out'
  },

  pokemonCardFlipSidePokemon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    transition: 'transform 0.6s ease-in-out'
  },

  pokemonCardNameContainer: {
    height: '1.2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Collection Dialog
  collectionDialog: {
    backgroundColor: COLORS.darkOverlay,
    color: COLORS.white,
    backdropFilter: COMMON_STYLES.backdropBlur,
    border: `1px solid ${COLORS.border}`,
    minHeight: '80vh'
  },
  
  collectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${COLORS.border}`
  },
  
  collectionContent: {
    p: 3,
    minHeight: '60vh',
    overflow: 'auto'
  },
  
  collectionActions: {
    borderTop: `1px solid ${COLORS.border}`,
    p: 2
  },
  
  // Collection Button
  collectionButton: {
    borderColor: COLORS.primary,
    color: COLORS.primary,
    '&:hover': {
      backgroundColor: COLORS.primary,
      color: COLORS.white
    }
  },
  
  // Pokemon Sprites
  pokemonSprite: {
    width: '68px',
    height: '56px',
    borderRadius: COMMON_STYLES.borderRadius,
    border: `1px solid ${COLORS.border}`,
    boxShadow: COMMON_STYLES.shadow
  },
  
  pokemonSpriteShiny: {
    width: '68px',
    height: '56px',
    borderRadius: COMMON_STYLES.borderRadius,
    border: `2px solid ${COLORS.gold}`,
    boxShadow: COMMON_STYLES.shadow,
    filter: 'brightness(1.2) saturate(1.5)'
  },
  
  pokemonSpriteHover: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      transition: COMMON_STYLES.transition
    }
  },
  
  // Navbar
  navbar: {
    backgroundColor: COLORS.lightOverlay,
    backdropFilter: COMMON_STYLES.backdropBlur,
    boxShadow: 'none',
    margin: 0,
    padding: 0
  },
  
  // Empty State
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: COLORS.white
  },
  
  emptyStateText: {
    textAlign: 'center'
  },
  
  emptyStateSubtext: {
    opacity: 0.7,
    mt: 1
  },

  // Loading Spinner
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: COLORS.darkOverlay,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: COMMON_STYLES.backdropBlur
  },

  loadingSpinner: {
    color: COLORS.primary,
    mb: 3
  },

  loadingText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textShadow: COMMON_STYLES.textShadow,
    textAlign: 'center'
  },

  loadingSubtext: {
    color: COLORS.white,
    opacity: 0.7,
    mt: 1,
    textAlign: 'center'
  }
};

// Animation keyframes
export const ANIMATIONS = {
  pulse: {
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' }
    }
  }
};
