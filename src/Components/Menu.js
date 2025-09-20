import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Stack, 
  Chip
} from '@mui/material';
import { AudioControls } from './AudioPlayer';
import ProfileSelector from './ProfileSelector';
import { useApp } from '../Util/Context';
import { ProfileManager } from '../Util/ProfileManager';

const Menu = ({ setGameStarted }) => {
  const { currentProfile, switchProfile } = useApp();
  const [profiles, setProfiles] = useState({});
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load profiles on mount
  useEffect(() => {
    const allProfiles = ProfileManager.getAllProfiles();
    setProfiles(allProfiles);
    
    // Set current profile as selected
    const currentProfileId = ProfileManager.getCurrentProfileId();
    if (currentProfileId && allProfiles[currentProfileId]) {
      setSelectedProfileId(currentProfileId);
    } else if (Object.keys(allProfiles).length > 0) {
      // Select first profile if no current profile
      const firstProfileId = Object.keys(allProfiles)[0];
      setSelectedProfileId(firstProfileId);
    }
  }, []);

  const handlePlay = () => {
    if (selectedProfileId) {
      // Switch to selected profile and start game
      switchProfile(selectedProfileId);
      setGameStarted(true);
    } else {
      // No profile selected, show create dialog
      setShowCreateDialog(true);
    }
  };

  const handleProfileCreated = (profile) => {
    setProfiles(prev => ({ ...prev, [profile.id]: profile }));
    setSelectedProfileId(profile.id);
    setGameStarted(true);
  };

  const handleProfileChange = (profileId) => {
    setSelectedProfileId(profileId);
    // Actually switch the profile in context
    switchProfile(profileId);
  };

  const handleEmptyProfileClick = () => {
    setShowCreateDialog(true);
  };

  // Opens a file dialog for .json files, reads and imports the selected profile(s)
  const handleImportProfile = async (event) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const profileData = JSON.parse(text);

        // If multiple profiles, import each; else, import single
        if (Array.isArray(profileData)) {
          profileData.forEach(profile => {
            ProfileManager.saveProfile(profile);
          });
          // Optionally select the first imported profile
          if (profileData[0] && profileData[0].id) {
            setSelectedProfileId(profileData[0].id);
          }
        } else {
          ProfileManager.saveProfile(profileData);
          setSelectedProfileId(profileData.id);
        }

        const allProfiles = ProfileManager.getAllProfiles();
        setProfiles(allProfiles);
      } catch (error) {
        // Handle import error silently or show a message as needed
      }
    };
    fileInput.click();
  };

  // Remove unused function

  // Create array of up to 3 profile slots
  const getProfileSlots = () => {
    const profileArray = Object.values(profiles);
    const slots = [];
    
    // Add existing profiles
    profileArray.forEach(profile => {
      slots.push({
        id: profile.id,
        name: profile.name,
        count: profile.caughtPokemon?.length || 0,
        isEmpty: false
      });
    });
    
    // Add empty slots to reach 3 total
    while (slots.length < 3) {
      slots.push({
        id: `empty-${slots.length}`,
        name: 'no data',
        count: 0,
        isEmpty: true
      });
    }
    
    return slots;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ height: '80vh' }}>
        <Typography variant="h3" sx={{ mt: 4 }}>
          Welcome to Pokemon Match & Catch!
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Test your memory and catch 'em all!
        </Typography>
        
        {currentProfile && (
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Current Profile: <strong>{currentProfile.name}</strong> - {currentProfile.caughtPokemon?.length || 0} Pokemon caught
          </Typography>
        )}
        
        {/* Profile Selection */}
        <Box sx={{ minWidth: 300, maxWidth: 500 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Select Profile
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2 }}>
            {getProfileSlots().map((slot) => (
              <Chip
                key={slot.id}
                label={slot.isEmpty ? 'no data' : `${slot.name} (${slot.count})`}
                onClick={() => slot.isEmpty ? handleEmptyProfileClick() : handleProfileChange(slot.id)}
                variant={selectedProfileId === slot.id ? 'filled' : 'outlined'}
                color={selectedProfileId === slot.id ? 'primary' : 'default'}
                sx={{
                  minWidth: 120,
                  opacity: slot.isEmpty ? 0.6 : 1,
                  cursor: slot.isEmpty ? 'pointer' : 'pointer',
                  '&:hover': {
                    backgroundColor: slot.isEmpty 
                      ? 'rgba(0, 0, 0, 0.1)' 
                      : selectedProfileId === slot.id 
                        ? undefined 
                        : 'rgba(76, 175, 80, 0.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2 }}
        >
          Import Profile
          <input
            type="file"
            accept=".json,application/json"
            hidden
            onChange={async (e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const profileData = JSON.parse(event.target.result);

                  // If multiple profiles, import each; else, import single
                  if (Array.isArray(profileData)) {
                    profileData.forEach(profile => {
                      ProfileManager.saveProfile(profile);
                    });
                    // Optionally select the first imported profile
                    if (profileData[0] && profileData[0].id) {
                      setSelectedProfileId(profileData[0].id);
                    }
                  } else {
                    ProfileManager.saveProfile(profileData);
                    setSelectedProfileId(profileData.id);
                  }

                  const allProfiles = ProfileManager.getAllProfiles();
                  setProfiles(allProfiles);
                } catch (err) {
                  // handle edge cases as needed (e.g., show error)
                }
              };
              reader.readAsText(file);
              // Reset input so user can re-import same file if needed
              e.target.value = '';
            }}
          />
        </Button>


        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button 
            onClick={handlePlay} 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Play
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Audio:
            </Typography>
            <AudioControls compact={true} />
          </Box>
        </Box>
      </Stack>

      <ProfileSelector 
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onProfileCreated={handleProfileCreated}
      />
    </Box>
  );
};

export default Menu;
