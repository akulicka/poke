import React, { useState } from 'react';
import { GAME_CONFIG } from '../../Util/constants';
import {
    Box,
    Grid
} from '@mui/material';
import PokemonCard from './Card';
import AudioPlayer from '../AudioPlayer';
import CatchEffect from './CatchEffect'; // Add this import
import { useApp } from '../../Util/Context'; // Add this import


const GameGrid = ({
  pokemon, 
  gameStarted,
  setGameStarted,
  setGameWon,
  incMoves,
}) => {
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [pokemonCry, setPokemonCry] = useState(null);
    const [catchEffect, setCatchEffect] = useState(null);
    
    const { addCaughtPokemon, currentRegion } = useApp(); // Get from context

    const handleCardFlip = (index) => {
        console.log('Card clicked:', index, 'Pokemon:', pokemon[index]);
        
        // Start game on first click
        if (!gameStarted) {
            setGameStarted(true);
        }

        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            incMoves();
            
            const [firstIndex, secondIndex] = newFlippedCards;
            const firstPokemon = pokemon[firstIndex];
            const secondPokemon = pokemon[secondIndex];

            if (firstPokemon.id === secondPokemon.id) {
                // Match found
                setMatchedCards([...matchedCards, firstIndex, secondIndex]);
                setFlippedCards([]);
                
                // 🎯 CATCH LOGIC - Add this block
                const catchSuccess = Math.random() * 255 <= (firstPokemon.catchRate || 190);
                if (catchSuccess) {
                    const isShiny = Math.random() < 0.1; // 10% shiny chance
                    
                    // Add to collection
                    addCaughtPokemon({
                        pokemonId: firstPokemon.id,
                        name: firstPokemon.name,
                        catchDate: Date.now(),
                        catchRate: firstPokemon.catchRate || 190,
                        isShiny: isShiny
                    });
                    
                    // Show catch effect
                    setCatchEffect({
                        pokemonName: firstPokemon.name,
                        isShiny: isShiny,
                        onComplete: () => setCatchEffect(null)
                    });
                }
                
                // Trigger Pokemon cry playback
                if (firstPokemon.cry) {
                    setPokemonCry(firstPokemon.cry);
                }
                
                // Check if game is won
                if (matchedCards.length + 2 === pokemon.length) {
                    setGameWon(true);
                }
            } else {
                // No match, flip cards back after delay
                setTimeout(() => {
                    setFlippedCards([]);
                }, GAME_CONFIG.CARD_FLIP_DELAY);
            }
        }
    };

    return (
        <>
            <AudioPlayer audioSrc={pokemonCry} />
            {catchEffect && (
                <CatchEffect 
                    pokemonName={catchEffect.pokemonName}
                    isShiny={catchEffect.isShiny}
                    onComplete={catchEffect.onComplete}
                />
            )}
            
            <Grid container display="flex" justifyContent="center" spacing={1} sx={{position: 'relative', zIndex: 2, maxWidth: '50%', minWidth: '50%' }}>
                {pokemon.map((poke, index) => (
                    <Grid md={3} sm={3} xs={3} item key={index} sx={{ display: 'flex', justifyContent: 'center', flexShrink: 1}}>
                        <PokemonCard
                            pokemon={poke}
                            isFlipped={flippedCards.includes(index)}
                            isMatched={matchedCards.includes(index)}
                            onClick={() => flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index) && handleCardFlip(index)}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default GameGrid;
