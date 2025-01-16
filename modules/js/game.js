// Core game logic module

/**
 * Represents the core game logic for Dots and Boxes
 * @class
 */
export class Game {
    /**
     * Creates a new game instance
     * @param {number} [size=3] - The size of the game grid (size x size)
     */
    constructor(size = 3) {
        this.size = size;
        this.reset();
    }

    /**
     * Resets the game state to initial values
     */
    reset() {
        this.currentPlayer = 1;
        this.horizontalLines = Array(this.size * (this.size + 1)).fill(false);
        this.verticalLines = Array((this.size + 1) * this.size).fill(false);
        this.boxes = Array(this.size * this.size).fill(0);
        this.gameOver = false;
    }

    /**
     * Attempts to make a move in the game
     * @param {string} lineType - Type of line ('horizontal' or 'vertical')
     * @param {number} index - Index of the line in its respective array
     * @returns {boolean} True if the move was valid and made, false otherwise
     */
    makeMove(lineType, index) {
        if (this.gameOver) return false;
        
        const lines = lineType === 'horizontal' ? this.horizontalLines : this.verticalLines;
        if (lines[index]) return false;

        lines[index] = true;
        const boxesCompleted = this.checkBoxes();
        
        if (!boxesCompleted) {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }

        this.checkGameOver();
        return true;
    }

    /**
     * Checks if any boxes were completed in the last move
     * @returns {boolean} True if any boxes were completed, false otherwise
     */
    checkBoxes() {
        let boxesCompleted = false;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const boxIndex = row * this.size + col;
                if (this.boxes[boxIndex] === 0 && this.isBoxComplete(row, col)) {
                    this.boxes[boxIndex] = this.currentPlayer;
                    boxesCompleted = true;
                }
            }
        }

        return boxesCompleted;
    }

    /**
     * Checks if a specific box is completed
     * @param {number} row - Row index of the box
     * @param {number} col - Column index of the box
     * @returns {boolean} True if the box is complete, false otherwise
     */
    isBoxComplete(row, col) {
        const top = this.horizontalLines[row * (this.size + 1) + col];
        const bottom = this.horizontalLines[(row + 1) * (this.size + 1) + col];
        const left = this.verticalLines[row * this.size + col];
        const right = this.verticalLines[row * this.size + col + 1];
        return top && bottom && left && right;
    }

    /**
     * Checks if the game is over
     */
    checkGameOver() {
        this.gameOver = this.boxes.every(box => box !== 0);
    }

    /**
     * Gets the current scores for both players
     * @returns {{player1: number, player2: number}} Object containing scores for both players
     */
    getScores() {
        return {
            player1: this.boxes.filter(box => box === 1).length,
            player2: this.boxes.filter(box => box === 2).length
        };
    }

    /**
     * Gets the winner of the game
     * @returns {number|null} 1 for player 1, 2 for player 2, 0 for tie, null if game not over
     */
    getWinner() {
        if (!this.gameOver) return null;
        const scores = this.getScores();
        if (scores.player1 > scores.player2) return 1;
        if (scores.player2 > scores.player1) return 2;
        return 0; // tie
    }
}
