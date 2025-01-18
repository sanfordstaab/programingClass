// Main application module
import { Game } from './game.js';
import { UI } from './ui.js';

let game;
let ui;
const maxWidth = 45;
const maxHeight = 15;

/**
 * Initializes or resets the game with the specified dimensions
 * @param {number} [width=3] - The width of the game grid
 * @param {number} [height=3] - The height of the game grid
 */
function initGame(width, height) {
    let html = '';
    for (let i = 3; i <= maxWidth; i++) {
        if (i == width) {
            html += `<option selected value="${i}">${i}</option>\n`;
        } else {
            html += `<option value="${i}">${i}</option>\n`;
        }
    }
    document.getElementById('gridWidth').innerHTML = html;

    html = '';
    for (let i = 3; i <= maxHeight; i++) {
        if (i == height) {
            html += `<option selected value="${i}">${i}</option>\n`;
        } else {
            html += `<option value="${i}">${i}</option>\n`;
        }
    }    
    document.getElementById('gridHeight').innerHTML = html;

    game = new Game(width, height);
    ui = new UI(document.getElementById('grid'), game);
    ui.updateStatus();
}

// Event listeners
document.getElementById('newGame').addEventListener('click', () => {
    const width = parseInt(document.getElementById('gridWidth').value);
    const height = parseInt(document.getElementById('gridHeight').value);
    initGame(width, height);
    
});

document.getElementById('gridWidth').addEventListener('change', () => {
    const width = parseInt(document.getElementById('gridWidth').value);
    const height = parseInt(document.getElementById('gridHeight').value);
    initGame(width, height);
});

document.getElementById('gridHeight').addEventListener('change', () => {
    const width = parseInt(document.getElementById('gridWidth').value);
    const height = parseInt(document.getElementById('gridHeight').value);
    initGame(width, height);
});

// Initialize game on load
initGame(3, 3);
