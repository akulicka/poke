# Pokemon Matching Game

A minimal React app for a Pokemon matching game built with Material-UI components.

## Features

- Clean, fast-paced matching game experience
- Pokemon images and names from the Pokemon API
- Pokemon cries played when matches are made
- Move counter and progress tracking
- Responsive design with Material-UI components
- No animations - focuses on speed and clean presentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## How to Play

1. Click on cards to flip them and reveal Pokemon
2. Match pairs of the same Pokemon
3. When you make a match, the Pokemon's cry will play
4. Try to match all pairs in as few moves as possible
5. Click "New Game" to shuffle and start over

## Game Logic

- Cards flip instantly when clicked
- Only 2 cards can be flipped at a time
- Matched cards stay revealed
- Non-matches flip back after 1 second
- Game tracks moves and shows progress
- Win condition: all pairs matched
