const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Game state
let gameState = {
  playerPosition: { lat: 43.7701, lng: -79.2109 },
  pokemons: []
};

// Spawn random pokemon
function spawnPokemon() {
  const types = ['pikachu', 'bulbasaur', 'charmander', 'squirtle'];
  return {
    id: Math.random().toString(36).substring(7),
    type: types[Math.floor(Math.random() * types.length)],
    position: {
      lat: gameState.playerPosition.lat + (Math.random() * 0.02 - 0.01),
      lng: gameState.playerPosition.lng + (Math.random() * 0.02 - 0.01)
    }
  };
}

// Endpoints
app.get('/api/game-state', (req, res) => {
  res.json(gameState);
});

app.post('/api/move-player', (req, res) => {
  // In real app, would use actual location data
  gameState.playerPosition = {
    lat: gameState.playerPosition.lat + (Math.random() * 0.01 - 0.005),
    lng: gameState.playerPosition.lng + (Math.random() * 0.01 - 0.005)
  };
  
  // Spawn new pokemon occasionally
  if (Math.random() > 0.7) {
    gameState.pokemons.push(spawnPokemon());
  }
  
  res.json(gameState);
});

app.post('/api/catch-pokemon', (req, res) => {
  const { pokemonId } = req.body;
  gameState.pokemons = gameState.pokemons.filter(p => p.id !== pokemonId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
