// API endpoints
const API_BASE = 'https://pokeapi.co/api/v2';

// Fetch available generations from PokeAPI
export const fetchGenerations = async () => {
  try {
    const genResponse = await fetch(`${API_BASE}/generation/`);
    const genData = await genResponse.json();
    return ['all', ...genData.results.map(gen => gen.name)];
  } catch (error) {
    console.error('Error fetching generations:', error);
    throw error; // Let the component handle fallback
  }
};

// Fetch individual Pokemon data
export const fetchPokemonData = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/pokemon/${id}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      cry: data.cries?.latest || null
    };
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    throw error;
  }
};

// Fetch Pokemon species data for descriptions
export const fetchPokemonSpeciesData = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/pokemon-species/${id}`);
    const data = await response.json();
    
    // Find English description
    const englishEntry = data.flavor_text_entries.find(entry => 
      entry.language.name === 'en'
    );
    
    return {
      id: data.id,
      name: data.name,
      description: englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : 'No description available',
      generation: data.generation.name,
      captureRate: data.capture_rate
    };
  } catch (error) {
    console.error(`Error fetching Pokemon species ${id}:`, error);
    return {
      id,
      name: 'Unknown',
      description: 'Description not available',
      generation: 'unknown',
      captureRate: 45
    };
  }
};

// Fetch Pokemon by generation
export const fetchPokemonByGeneration = async (region, regions, gameConfig) => {
  let pokemonIds = [];
  
  if (region !== 'all') {
    const genId = regions.indexOf(region);
    const response = await fetch(`${API_BASE}/generation/${genId}`);
    const data = await response.json();
    
    const genPokemon = data.pokemon_species;
    while (pokemonIds.length < gameConfig.POKEMON_PAIRS) {
      const randomPokemon = genPokemon[Math.floor(Math.random() * genPokemon.length)];
      const pokemonId = parseInt(randomPokemon.url.split('/').slice(-2, -1)[0]);
      if (!pokemonIds.includes(pokemonId)) {
        pokemonIds.push(pokemonId);
      }
    }
  } else {
    // Random selection from all generations
    while (pokemonIds.length < gameConfig.POKEMON_PAIRS) {
      const randomId = Math.floor(Math.random() * gameConfig.MAX_POKEMON_ID) + 1;
      if (!pokemonIds.includes(randomId)) {
        pokemonIds.push(randomId);
      }
    }
  }
  
  // Fetch Pokemon data for all IDs
  const pokemonData = [];
  for (const id of pokemonIds) {
    try {
      const pokemon = await fetchPokemonData(id);
      pokemonData.push(pokemon);
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error);
      // Continue with other Pokemon even if one fails
    }
  }
  
  // Create pairs and shuffle
  const pairs = [...pokemonData, ...pokemonData];
  const shuffled = pairs.sort(() => Math.random() - 0.5);
  console.log('Pokemon data loaded:', shuffled.length, 'cards');
  
  return shuffled;
};
