// Main application module
import { Game } from './game.js';
import { UI } from './ui.js';

let game;
let ui;

function initGame(size = 3) {
    game = new Game(size);
    ui = new UI(document.getElementById('grid'), game);
    ui.updateStatus();
}

// Event listeners
document.getElementById('newGame').addEventListener('click', () => {
    const size = parseInt(document.getElementById('gridSize').value);
    initGame(size);
});

document.getElementById('gridSize').addEventListener('change', () => {
    const size = parseInt(document.getElementById('gridSize').value);
    initGame(size);
});

// Initialize game on load
initGame();
