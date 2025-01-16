// UI handling module

export class UI {
    constructor(container, game) {
        this.container = container;
        this.game = game;
        this.setupGrid();
    }

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

    handleLineClick(element) {
        const type = element.dataset.type;
        const index = parseInt(element.dataset.index);
        
        if (this.game.makeMove(type, index)) {
            element.classList.add('active');
            this.updateBoxes();
            this.updateStatus();
        }
    }

    updateBoxes() {
        const boxes = this.container.querySelectorAll('.box');
        boxes.forEach(box => {
            const index = parseInt(box.dataset.box);
            box.className = 'box';
            if (this.game.boxes[index] === 1) {
                box.classList.add('player1');
            } else if (this.game.boxes[index] === 2) {
                box.classList.add('player2');
            }
        });
    }

    updateStatus() {
        const status = document.getElementById('status');
        const scores = this.game.getScores();
        
        if (this.game.gameOver) {
            const winner = this.game.getWinner();
            if (winner === 0) {
                status.textContent = `Game Over! It's a tie! (${scores.player1} - ${scores.player2})`;
            } else {
                status.textContent = `Game Over! Player ${winner} wins! (${scores.player1} - ${scores.player2})`;
            }
        } else {
            status.textContent = `Player ${this.game.currentPlayer}'s turn (Red: ${scores.player1}, Blue: ${scores.player2})`;
        }
    }
}
