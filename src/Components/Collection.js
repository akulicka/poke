import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  IconButton,
  Button 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useApp } from '../Util/Context';
import { COMPONENT_STYLES, COLORS } from '../Util/styles';

// Simple utility functions
const getBoxSpriteUrl = (pokemonName, isShiny = false) => {
  const type = isShiny ? 'shiny' : 'regular';
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/${type}/${pokemonName}.png`;
};

const Collection = ({ open, onClose }) => {
  const { caughtPokemon } = useApp();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: COMPONENT_STYLES.collectionDialog
      }}
    >
      <DialogTitle sx={COMPONENT_STYLES.collectionHeader}>
        <Typography variant="h4" sx={{ color: COLORS.white, fontWeight: 'bold' }}>
          Pokémon Collection ({caughtPokemon.length})
        </Typography>
        <IconButton onClick={onClose} sx={{ color: COLORS.white }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={COMPONENT_STYLES.collectionContent}>
        {caughtPokemon.length === 0 ? (
          <Box sx={COMPONENT_STYLES.emptyState}>
            <Typography variant="h6" sx={COMPONENT_STYLES.emptyStateText}>
              No Pokémon caught yet!<br />
              <Typography variant="body2" sx={COMPONENT_STYLES.emptyStateSubtext}>
                Start playing to catch your first Pokémon!
              </Typography>
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'flex-start'
          }}>
            {caughtPokemon.map((pokemon, index) => (
              <Box
                key={`${pokemon.pokemonId}-${pokemon.catchDate}`}
                sx={COMPONENT_STYLES.pokemonSpriteHover}
              >
                <Box
                  component="img"
                  src={getBoxSpriteUrl(pokemon.name, pokemon.isShiny)}
                  alt={pokemon.name}
                  sx={pokemon.isShiny ? COMPONENT_STYLES.pokemonSpriteShiny : COMPONENT_STYLES.pokemonSprite}
                  onError={(e) => {
                    e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`;
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={COMPONENT_STYLES.collectionActions}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={COMPONENT_STYLES.collectionButton}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Collection;