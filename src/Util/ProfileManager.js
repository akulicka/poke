// Profile data structure
export const createProfile = (name) => ({
  id: `profile-${name.toLowerCase()}`, // Use prefixed ID
  name: name.trim(),
  caughtPokemon: [],
  createdAt: Date.now(),
  lastPlayed: Date.now(),
  // Session stats
  roundNumber: 1,
  totalMoves: 0,
  totalTime: 0
});

// Profile import function
export const importProfilesFromFile = async () => {
  try {
    const response = await fetch('/src/Data/profile.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const profilesData = await response.json();
    
    // Handle both single profile and array of profiles
    const profiles = Array.isArray(profilesData) ? profilesData : [profilesData];
    
    let importedCount = 0;
    for (const profile of profiles) {
      if (profile && profile.id && profile.name) {
        // Ensure the profile has the correct structure
        const profileData = {
          id: profile.id,
          name: profile.name,
          caughtPokemon: profile.caughtPokemon || [],
          createdAt: profile.createdAt || Date.now(),
          lastPlayed: profile.lastPlayed || Date.now(),
          // Session stats with defaults for imported profiles
          roundNumber: profile.roundNumber || 1,
          totalMoves: profile.totalMoves || 0,
          totalTime: profile.totalTime || 0
        };
        
        // Save to localStorage
        localStorage.setItem(profileData.id, JSON.stringify(profileData));
        importedCount++;
      }
    }
    
    return { success: true, importedCount };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//file management functions
export const ProfileManager = {
  getAllProfiles: () => {
    const profiles = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('profile-')) {
        try {
          profiles[key] = JSON.parse(localStorage.getItem(key));
        } catch (error) {
          // Handle parsing error silently
        }
      }
    }
    return profiles;
  },

  getProfile: (profileId) => {
    try {
      const profile = localStorage.getItem(profileId);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  },

  saveProfile: (profile) => {
    try {
      const key = profile.id || `profile-${profile.name.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(profile));
      return true;
    } catch (error) {
      return false;
    }
  },

  createProfile: (name) => {
    const profile = createProfile(name);
    return ProfileManager.saveProfile(profile) ? profile : null;
  },

  deleteProfile: (profileId) => {
    try {
      localStorage.removeItem(profileId);
      return true;
    } catch (error) {
      return false;
    }
  },

  getCurrentProfileId: () => {
    return localStorage.getItem('currentProfileId');
  },

  setCurrentProfileId: (profileId) => {
    localStorage.setItem('currentProfileId', profileId);
  }
};
