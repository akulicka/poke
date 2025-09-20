import React, { useState } from 'react';
import { GAME_CONFIG } from '../Util/constants';
import {
    Box,
    Grid
} from '@mui/material';
import PokemonCard from './PokemonCard';
import AudioPlayer from './AudioPlayer';
import CatchEffect from './CatchEffect'; // Add this import
import { useApp } from '../Util/Context'; // Add this import


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
    const [catchEffect, setCatchEffect] = useState(null); // Add this state
    
    const { addCaughtPokemon } = useApp(); // Get the function from context

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
                    // Add to collection
                    addCaughtPokemon({
                        pokemonId: firstPokemon.id,
                        name: firstPokemon.name,
                        catchDate: Date.now(),
                        catchRate: firstPokemon.catchRate || 190,
                        isShiny: Math.random() < 0.1 // 10% shiny chance
                    });
                    
                    // Show catch effect
                    setCatchEffect({
                        pokemonName: firstPokemon.name,
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
                    onComplete={catchEffect.onComplete}
                />
            )}
            
            <Grid container display="flex" justifyContent="center" spacing={3} sx={{position: 'relative', zIndex: 2, maxWidth: '100%' }}>
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
