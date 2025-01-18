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
        this.moveHistory = [];
        this.setupGrid();
        this.setupDebugControls();
    }

    /**
     * Sets up the initial game grid with all necessary elements
     */
    setupGrid() {
        const width = this.game.width;
        const height = this.game.height;
        this.container.innerHTML = '';
        
        // Ensure grid layout is properly set
        this.container.style.display = 'grid';
        this.container.style.gap = '2px';
        this.container.style.gridTemplateColumns = `repeat(${2 * width + 1}, auto)`;
        
        // For debugging
        console.log('Setting up grid with dimensions:', width, 'x', height);

        // Create grid elements
        for (let row = 0; row <= 2 * height; row++) {
            for (let col = 0; col <= 2 * width; col++) {
                const element = document.createElement('div');

                if (row % 2 === 0 && col % 2 === 0) {
                    // Dots
                    element.className = 'dot';
                    element.style.width = '10px';
                    element.style.height = '10px';
                } else if (row % 2 === 0 && col % 2 === 1) {
                    // Horizontal lines
                    element.className = 'line horizontal-line';
                    element.dataset.type = 'horizontal';
                    element.dataset.x = Math.floor(col / 2);
                    element.dataset.y = row / 2;
                    element.addEventListener('click', () => this.handleLineClick(element));
                } else if (row % 2 === 1 && col % 2 === 0) {
                    // Vertical lines
                    element.className = 'line vertical-line';
                    element.dataset.type = 'vertical';
                    element.dataset.x = col / 2;
                    element.dataset.y = Math.floor(row / 2);
                    element.addEventListener('click', () => this.handleLineClick(element));
                } else {
                    // Box spaces
                    element.className = 'box';
                    element.dataset.x = Math.floor(col / 2);
                    element.dataset.y = Math.floor(row / 2);
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
        const x = parseInt(element.dataset.x);
        const y = parseInt(element.dataset.y);
        
        const moveMadeBy = this.game.makeMove(type, x, y);
        if (moveMadeBy) { // moveMadeBy will be false if move was invalid, or 1 or 2 for the player number
            element.classList.add(`player${moveMadeBy}`);
            this.moveHistory.push({ type, x, y });
            this.updateBoxes();
            this.updateStatus();
        }
    }

    setupDebugControls() {
        const saveButton = document.getElementById('saveGame');
        const loadButton = document.getElementById('loadGame');
        const loadFile = document.getElementById('loadFile');

        saveButton.addEventListener('click', () => this.saveGame());
        loadButton.addEventListener('click', () => loadFile.click());
        loadFile.addEventListener('change', (e) => this.loadGame(e.target.files[0]));
    }

    saveGame() {
        const data = JSON.stringify(this.moveHistory);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game.dnb';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async loadGame(file) {
        if (!file) return;
        
        const text = await file.text();
        const moves = JSON.parse(text);
        
        // Reset game and UI state
        this.game.reset();
        this.moveHistory = [];
        this.setupGrid();
        this.updateStatus(); // Update the status display to show initial state
        
        // Play moves with delay
        let i = 0;
        const playMove = () => {
            if (i >= moves.length) return;
            
            const move = moves[i];
            const element = this.findLineElement(move.type, move.index);
            if (element) {
                this.handleLineClick(element);
            }
            
            i++;
            setTimeout(playMove, 500); // 500ms = 1/2 second
        };
        
        playMove();
    }

    findLineElement(type, index) {
        return this.container.querySelector(
            `.line[data-type="${type}"][data-index="${index}"]`
        );
    }

    /**
     * Updates the visual state of all boxes based on game state
     */
    updateBoxes() {
        const boxes = this.container.querySelectorAll('.box');
        boxes.forEach(box => {
            const x = parseInt(box.dataset.x);
            const y = parseInt(box.dataset.y);
            const owner = this.game.boxes[y][x];
            if (owner === 1) {
                box.className = 'box player1';
            } else if (owner === 2) {
                box.className = 'box player2';
            } else {
                box.className = 'box';
            }
        });
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
                status.innerHTML = `Game Over! It's a tie! (Red: <span class="player1Color">${scores.player1}</span>, Blue: <span class="player2Color">${scores.player2}</span>)`;
            } else {
                const winnerName = winner === 1 ? '<span class="player1Color">Red</span>' : '<span class="player2Color">Blue</span>';
                status.innerHTML = `Game Over! ${winnerName} wins! (Red: <span class="player1Color">${scores.player1}</span>, Blue: <span class="player2Color">${scores.player2}</span>)`;
                status.classList.add(`player${winner}`);
            }
        } else {
            const currentPlayerName = this.game.currentPlayer === 1 ? '<span class="player1Color">Red</span>' : '<span class="player2Color">Blue</span>';
            status.innerHTML = `${currentPlayerName}'s turn (Red: <span class="player1Color">${
                scores.player1
            }</span>, Blue: <span class="player2Color">${
                scores.player2
            }</span>)`;
        }
    }
}
