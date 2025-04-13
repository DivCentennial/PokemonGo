// Initialize map
const map = L.map('map').setView([43.7701, -79.2109], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Player position
let playerPos = map.getCenter();
const player = document.getElementById('player');

// Update player position on map
function updatePlayerPosition() {
    const playerPx = map.latLngToContainerPoint(playerPos);
    player.style.left = `${playerPx.x}px`;
    player.style.top = `${playerPx.y}px`;
}

// Spawn random pokemon
function spawnPokemon() {
    const bounds = map.getBounds();
    const pokemon = document.createElement('div');
    pokemon.className = 'pokemon';
    
    // Random position within map bounds
    const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
    const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
    const pos = L.latLng(lat, lng);
    
    // Random pokemon (placeholder - would use actual sprites in full implementation)
    const pokemonTypes = ['pikachu', 'bulbasaur', 'charmander', 'squirtle'];
    const type = pokemonTypes[Math.floor(Math.random() * pokemonTypes.length)];
    pokemon.style.backgroundImage = `url('assets/pokemon-sprites/${type}.png')`;
    
    // Position pokemon
    const pokemonPx = map.latLngToContainerPoint(pos);
    pokemon.style.left = `${pokemonPx.x}px`;
    pokemon.style.top = `${pokemonPx.y}px`;
    
    pokemon.dataset.lat = lat;
    pokemon.dataset.lng = lng;
    pokemon.dataset.type = type;
    
    document.getElementById('pokemon-container').appendChild(pokemon);
    return pokemon;
}

// Move player randomly (simulated movement)
function movePlayer() {
    const bounds = map.getBounds();
    const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
    const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
    playerPos = L.latLng(lat, lng);
    updatePlayerPosition();
    checkPokemonProximity();
}

// Check if player is near any pokemon
function checkPokemonProximity() {
    const pokemons = document.querySelectorAll('.pokemon');
    pokemons.forEach(pokemon => {
        const pokemonPos = L.latLng(
            parseFloat(pokemon.dataset.lat),
            parseFloat(pokemon.dataset.lng)
        );
        const distance = playerPos.distanceTo(pokemonPos);
        if (distance < 50) { // 50 meters
            pokemon.style.boxShadow = '0 0 10px 5px yellow';
        } else {
            pokemon.style.boxShadow = 'none';
        }
    });
}

// Catch pokemon
document.getElementById('catch-btn').addEventListener('click', () => {
    const pokemons = document.querySelectorAll('.pokemon');
    pokemons.forEach(pokemon => {
        const pokemonPos = L.latLng(
            parseFloat(pokemon.dataset.lat),
            parseFloat(pokemon.dataset.lng)
        );
        const distance = playerPos.distanceTo(pokemonPos);
        if (distance < 50) {
            alert(`You caught a ${pokemon.dataset.type}!`);
            pokemon.remove();
        }
    });
});

// Initialize game
updatePlayerPosition();
setInterval(movePlayer, 3000); // Move every 3 seconds
setInterval(spawnPokemon, 5000); // Spawn new pokemon every 5 seconds

// Add some initial pokemon
for (let i = 0; i < 3; i++) {
    spawnPokemon();
}
