// Background Pokemon details fetcher
class BackgroundFetcher {
    constructor() {
      this.isRunning = false;
      this.queue = [];
      this.cache = new Map();
    }
  
    // Start background fetching for a profile
    startFetching(caughtPokemon) {
      if (this.isRunning) return;
      
      const uniquePokemon = [...new Set(caughtPokemon.map(p => p.pokemonId))];
      const pokemonToFetch = uniquePokemon.filter(id => !this.getCachedDetails(id));
      
      if (pokemonToFetch.length === 0) return;
      
      console.log(`Background fetching ${pokemonToFetch.length} Pokemon details...`);
      this.queue = pokemonToFetch;
      this.isRunning = true;
      this.processQueue();
    }
  
    // Process the fetch queue
    async processQueue() {
      while (this.queue.length > 0 && this.isRunning) {
        const pokemonId = this.queue.shift();
        
        try {
          // Import dynamically to avoid circular dependencies
          const { fetchPokemonSpeciesData } = await import('./PokeApi');
          const details = await fetchPokemonSpeciesData(pokemonId);
          
          this.setCachedDetails(pokemonId, details);
          
          // Rate limiting - 1 second between requests
          if (this.queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (error) {
          console.error(`Background fetch failed for Pokemon ${pokemonId}:`, error);
          // Continue with next Pokemon
        }
      }
      
      this.isRunning = false;
      console.log('Background fetching complete');
    }
  
    // Stop background fetching
    stop() {
      this.isRunning = false;
      this.queue = [];
    }
  
    // Cache management
    getCachedDetails(pokemonId) {
      // Check memory cache first
      if (this.cache.has(pokemonId)) {
        return this.cache.get(pokemonId);
      }
      
      // Check localStorage
      try {
        const cached = localStorage.getItem(`pokemon-details-${pokemonId}`);
        if (cached) {
          const details = JSON.parse(cached);
          this.cache.set(pokemonId, details);
          return details;
        }
      } catch {
        // Ignore localStorage errors
      }
      
      return null;
    }
  
    setCachedDetails(pokemonId, details) {
      // Store in memory cache
      this.cache.set(pokemonId, details);
      
      // Store in localStorage
      try {
        localStorage.setItem(`pokemon-details-${pokemonId}`, JSON.stringify(details));
      } catch (error) {
        console.error('Failed to cache Pokemon details:', error);
      }
    }
  
    // Get cache status
    getCacheStatus(caughtPokemon) {
      const uniquePokemon = [...new Set(caughtPokemon.map(p => p.pokemonId))];
      const cached = uniquePokemon.filter(id => this.getCachedDetails(id));
      
      return {
        total: uniquePokemon.length,
        cached: cached.length,
        missing: uniquePokemon.length - cached.length,
        percentage: Math.round((cached.length / uniquePokemon.length) * 100)
      };
    }
  }
  
  // Singleton instance
  export const backgroundFetcher = new BackgroundFetcher();
