// UI handling module

/**
 * Handles all UI interactions and rendering for the game
 * @class
 */
export class UI {
    /**
     * Creates a new UI instance
     * @param {HTMLElement} container - The container element for the game grid
     * @param {Game} game - The game instance to handle UI for
     */
    constructor(container, game) {
        this.container = container;
        this.game = game;
        this.setupGrid();
    }

    /**
     * Sets up the initial game grid with all necessary elements
     */
    setupGrid() {
        const size = this.game.size;
        this.container.style.gridTemplateColumns = `repeat(${2 * size + 1}, auto)`;
        this.container.innerHTML = '';

        // Create grid elements
        for (let row = 0; row <= 2 * size; row++) {
            for (let col = 0; col <= 2 * size; col++) {
                const element = document.createElement('div');

                if (row % 2 === 0 && col % 2 === 0) {
                    // Dots
                    element.className = 'dot';
                } else if (row % 2 === 0 && col % 2 === 1) {
                    // Horizontal lines
                    element.className = 'line horizontal-line';
                    const index = (row / 2) * size + Math.floor(col / 2);
                    element.dataset.type = 'horizontal';
                    element.dataset.index = index;
                    element.addEventListener('click', () => this.handleLineClick(element));
                } else if (row % 2 === 1 && col % 2 === 0) {
                    // Vertical lines
                    element.className = 'line vertical-line';
                    const index = Math.floor(row / 2) * size + (col / 2);
                    element.dataset.type = 'vertical';
                    element.dataset.index = index;
                    element.addEventListener('click', () => this.handleLineClick(element));
                } else {
                    // Box spaces
                    element.className = 'box';
                    const boxRow = Math.floor(row / 2);
                    const boxCol = Math.floor(col / 2);
                    element.dataset.box = boxRow * size + boxCol;
                }

                this.container.appendChild(element);
            }
        }
    }

    /**
     * Handles click events on line elements
     * @param {HTMLElement} element - The clicked line element
     */
    handleLineClick(element) {
        const type = element.dataset.type;
        const index = parseInt(element.dataset.index);
        
        const moveMadeBy = this.game.makeMove(type, index);
        if (moveMadeBy) { // moveMadeBy will be false if move was invalid, or 1 or 2 for the player number
            element.classList.add(`player${moveMadeBy}`);
            this.updateBoxes();
            this.updateStatus();
        }
    }

    /**
     * Updates the visual state of all boxes based on game state
     */
    updateBoxes() {
        const boxes = this.container.querySelectorAll('.box');
        for (let index = 0; index < boxes.length; index++) {
            const box = boxes[index];
            
            // Reset the class
            box.className = 'box';
            
            // Add player class if owned
            if (this.game.boxes[index] === 1) {
                box.classList.add('player1');
                console.log(`box ${index} is owned by player 1`);
            } else if (this.game.boxes[index] === 2) {
                box.classList.add('player2');
                console.log(`box ${index} is owned by player 1`);
            }
        };
    }

    /**
     * Updates the game status display with current scores and turn information
     */
    updateStatus() {
        const status = document.getElementById('status');
        const scores = this.game.getScores();
        
        // Reset classes
        status.classList.remove('player1', 'player2');
        
        if (this.game.gameOver) {
            const winner = this.game.getWinner();
            if (winner === 0) {
                status.textContent = `Game Over! It's a tie! (${scores.player1} - ${scores.player2})`;
            } else {
                status.textContent = `Game Over! Player ${winner} wins! (${scores.player1} - ${scores.player2})`;
                status.classList.add(`player${winner}`);
            }
        } else {
            status.innerHTML = `Player ${
                this.game.currentPlayer
            }'s turn (Red: <span class="player1Color">${
                scores.player1
            }</span>, Blue: <span class="player2Color">${
                scores.player2
            }</span>) Player <span class="player${
                this.game.currentPlayer
            }Color">${
                this.game.currentPlayer
            }</span>'s turn.`;
        }
    }
}
