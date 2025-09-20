import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileManager } from './ProfileManager';
import { backgroundFetcher } from './BackgroundFetcher';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [currentRegion, setCurrentRegion] = useState('all');
  // Session stats
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalMoves, setTotalMoves] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Load current profile on mount
  useEffect(() => {
    const profileId = ProfileManager.getCurrentProfileId();
    
    if (profileId) {
      const profile = ProfileManager.getProfile(profileId);
      
      if (profile) {
        setCurrentProfile(profile);
        setCaughtPokemon(profile.caughtPokemon || []);
        
        // Load session stats from profile
        setRoundNumber(profile.roundNumber || 1);
        setTotalMoves(profile.totalMoves || 0);
        setTotalTime(profile.totalTime || 0);
        
        // Start background fetching for this profile
        if (profile.caughtPokemon && profile.caughtPokemon.length > 0) {
          backgroundFetcher.startFetching(profile.caughtPokemon);
        }
      }
    }
  }, []);

  // Save profile whenever caughtPokemon or session stats change
  useEffect(() => {
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        caughtPokemon,
        roundNumber,
        totalMoves,
        totalTime
      };
      ProfileManager.saveProfile(updatedProfile);
      setCurrentProfile(updatedProfile);
    }
  }, [caughtPokemon, roundNumber, totalMoves, totalTime]);

  const addCaughtPokemon = (pokemon) => {
    setCaughtPokemon(prev => {
      const newCaughtPokemon = [...prev, pokemon];
      
      // Start background fetching for new Pokemon
      backgroundFetcher.startFetching(newCaughtPokemon);
      
      return newCaughtPokemon;
    });
  };

  const switchProfile = (profileId) => {
    const profile = ProfileManager.getProfile(profileId);
    
    if (profile) {
      setCurrentProfile(profile);
      setCaughtPokemon(profile.caughtPokemon || []);
      setVolume(0.5);
      setCurrentRegion('all');
      
      // Load session stats from switched profile
      setRoundNumber(profile.roundNumber || 1);
      setTotalMoves(profile.totalMoves || 0);
      setTotalTime(profile.totalTime || 0);
      
      ProfileManager.setCurrentProfileId(profileId);
      
      // Start background fetching for switched profile
      if (profile.caughtPokemon && profile.caughtPokemon.length > 0) {
        backgroundFetcher.startFetching(profile.caughtPokemon);
      }
    }
  };

  const createNewProfile = (name) => {
    const profile = ProfileManager.createProfile(name);
    
    if (profile) {
      setCurrentProfile(profile);
      setCaughtPokemon([]);
      setVolume(0.5);
      setCurrentRegion('all');
      
      // Initialize session stats for new profile
      setRoundNumber(1);
      setTotalMoves(0);
      setTotalTime(0);
      
      ProfileManager.setCurrentProfileId(profile.id);
      return profile;
    }
    return null;
  };

  return (
    <AppContext.Provider value={{ 
      currentProfile,
      volume, 
      setVolume, 
      isLoading, 
      setIsLoading,
      caughtPokemon,
      setCaughtPokemon,
      addCaughtPokemon,
      currentRegion,
      setCurrentRegion,
      switchProfile,
      createNewProfile,
      ProfileManager,
      backgroundFetcher,
      // Session stats
      roundNumber,
      setRoundNumber,
      totalMoves,
      setTotalMoves,
      totalTime,
      setTotalTime
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};