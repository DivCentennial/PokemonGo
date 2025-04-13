const API_URL = 'http://localhost:3000/api';
const map = L.map('map').setView([43.7701, -79.2109], 13);
const player = document.getElementById('player');
let gameState = {};

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch game state from API
async function fetchGameState() {
    try {
        const response = await fetch(`${API_URL}/game-state`);
        gameState = await response.json();
        renderGame();
    } catch (error) {
        console.error('Error fetching game state:', error);
    }
}

// Move player via API
async function movePlayer() {
    try {
        const response = await fetch(`${API_URL}/move-player`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        gameState = await response.json();
        renderGame();
    } catch (error) {
        console.error('Error moving player:', error);
    }
}

// Catch pokemon via API
async function catchPokemon(pokemonId) {
    try {
        const response = await fetch(`${API_URL}/catch-pokemon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pokemonId })
        });
        const result = await response.json();
        if (result.success) {
            fetchGameState(); // Refresh game state
        }
    } catch (error) {
        console.error('Error catching pokemon:', error);
    }
}

// Render game state
function renderGame() {
    // Update player position
    const playerPx = map.latLngToContainerPoint(
        L.latLng(gameState.playerPosition.lat, gameState.playerPosition.lng)
    );
    player.style.left = `${playerPx.x}px`;
    player.style.top = `${playerPx.y}px`;

    // Update pokemons
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';
    
    gameState.pokemons.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'pokemon';
        pokemonElement.id = pokemon.id;
        pokemonElement.style.backgroundImage = `url('assets/pokemon-sprites/${pokemon.type}.png')`;
        
        const pokemonPx = map.latLngToContainerPoint(
            L.latLng(pokemon.position.lat, pokemon.position.lng)
        );
        pokemonElement.style.left = `${pokemonPx.x}px`;
        pokemonElement.style.top = `${pokemonPx.y}px`;
        
        container.appendChild(pokemonElement);
    });
}

// Catch button handler
document.getElementById('catch-btn').addEventListener('click', () => {
    if (gameState.pokemons.length > 0) {
        // Simple implementation - catches first pokemon
        catchPokemon(gameState.pokemons[0].id);
    }
});

// Initialize game
fetchGameState();
setInterval(movePlayer, 3000); // Move player every 3 seconds
