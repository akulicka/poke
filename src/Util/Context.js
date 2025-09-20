import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [caughtPokemon, setCaughtPokemon] = useState([]);

  const addCaughtPokemon = (pokemon) => {
    setCaughtPokemon([...caughtPokemon, pokemon]);
  };

  return (
    <AppContext.Provider value={{ 
      volume, 
      setVolume, 
      isLoading, 
      setIsLoading,
      caughtPokemon,
      setCaughtPokemon,
      addCaughtPokemon
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