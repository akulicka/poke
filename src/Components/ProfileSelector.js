import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ProfileManager } from '../Util/ProfileManager';
import { COMPONENT_STYLES, COLORS, getTextColorForRegion } from '../Util/styles';

const ProfileSelector = ({ open, onClose, onProfileCreated }) => {
  const [profileName, setProfileName] = useState('');
  const [error, setError] = useState('');

  const handleCreateProfile = () => {
    if (!profileName.trim()) {
      setError('Profile name is required');
      return;
    }

    const profile = ProfileManager.createProfile(profileName.trim());
    if (profile) {
      ProfileManager.setCurrentProfileId(profile.id);
      onProfileCreated(profile);
      setProfileName('');
      setError('');
      onClose();
    } else {
      setError('Failed to create profile');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateProfile();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLORS.darkOverlay,
          color: COLORS.white,
          backdropFilter: COMPONENT_STYLES.backdropBlur,
          border: `1px solid ${COLORS.border}`,
          minHeight: '75px',
          maxHeight: '200px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1,
        minHeight: '40px'
      }}>
        <Typography component="div" sx={{ color: COLORS.white, fontWeight: 'bold', fontSize: '1.2rem' }}>
          Create New Profile
        </Typography>
        <IconButton onClick={onClose} sx={{ color: COLORS.white, p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, minHeight: '60px' }}>
        <TextField
          fullWidth
          label="Profile Name"
          value={profileName}
          onChange={(e) => {
            setProfileName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          autoFocus
          size="small"
          sx={{ 
            '& .MuiInputLabel-root': {
              color: COLORS.white,
              '&.Mui-focused': {
                color: COLORS.primary
              }
            },
            '& .MuiOutlinedInput-root': {
              color: COLORS.white,
              '& fieldset': {
                borderColor: COLORS.border
              },
              '&:hover fieldset': {
                borderColor: COLORS.primary
              },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.primary
              }
            },
            '& .MuiFormHelperText-root': {
              color: error ? COLORS.secondary : COLORS.white
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ 
        borderTop: `1px solid ${COLORS.border}`,
        p: 1,
        minHeight: '50px'
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ 
            borderColor: COLORS.primary,
            color: COLORS.primary,
            '&:hover': {
              backgroundColor: COLORS.primary,
              color: COLORS.white
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateProfile}
          variant="contained"
          size="small"
          sx={{ 
            backgroundColor: COLORS.primary, 
            '&:hover': { backgroundColor: COLORS.primaryDark } 
          }}
        >
          Create & Play
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileSelector;
