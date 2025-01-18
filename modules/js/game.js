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
        // Store lines in 2D arrays for easier coordinate access
        this.horizontalLines = Array(this.size + 1).fill(null)
            .map(() => Array(this.size).fill(false));
        this.verticalLines = Array(this.size).fill(null)
            .map(() => Array(this.size + 1).fill(false));
        this.boxes = Array(this.size).fill(null)
            .map(() => Array(this.size).fill(0));
        this.gameOver = false;
    }

    /**
     * Attempts to make a move in the game
     * @param {string} lineType - Type of line ('horizontal' or 'vertical')
     * @param {number} index - Index of the line in its respective array
     * @returns {boolean} True if the move was valid and made, false otherwise
     */
    makeMove(lineType, x, y) {
        if (this.gameOver) return false;
        
        const lines = lineType === 'horizontal' ? this.horizontalLines : this.verticalLines;
        if (lines[y][x]) return false;

        lines[y][x] = true;
        this.lastMoveX = x;  // Track the last move
        this.lastMoveY = y;
        this.lastMoveType = lineType;
        const boxesCompleted = this.checkBoxes();
        
        // Store current player before potentially changing it
        const moveMadeBy = this.currentPlayer;
        
        // Only switch players if no boxes were completed
        if (!boxesCompleted) {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }

        this.checkGameOver();
        return moveMadeBy; // Return which player made the move
    }

    /**
     * Checks if any boxes were completed in the last move
     * @returns {boolean} True if any boxes were completed, false otherwise
     */
    checkBoxes() {
        let boxesCompleted = false;
        
        // For horizontal lines at y, check boxes at (y-1) and y
        // For vertical lines at x, check boxes at (x-1) and x
        const boxesToCheck = [];
        
        if (this.lastMoveType === 'horizontal') {
            const y = this.lastMoveY;
            const x = this.lastMoveX;
            if (y > 0) boxesToCheck.push({x, y: y-1});
            if (y < this.size) boxesToCheck.push({x, y});
        } else {
            const x = this.lastMoveX;
            const y = this.lastMoveY;
            if (x > 0) boxesToCheck.push({x: x-1, y});
            if (x < this.size) boxesToCheck.push({x, y});
        }
        
        for (const box of boxesToCheck) {
            if (this.boxes[box.y][box.x] === 0 && this.isBoxComplete(box.x, box.y)) {
                this.boxes[box.y][box.x] = this.currentPlayer;
                boxesCompleted = true;
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
    isBoxComplete(x, y) {
        // Check if all four lines around the box are drawn
        const top = this.horizontalLines[y][x];
        const bottom = this.horizontalLines[y + 1][x];
        const left = this.verticalLines[y][x];
        const right = this.verticalLines[y][x + 1];

        const fIsComplete = (top && bottom && left && right);
        if (fIsComplete) {
            console.log(`Box (${x}, ${y}) is now complete.`);
        }

        return fIsComplete;
    }

    /**
     * Checks if the game is over
     */
    checkGameOver() {
        this.gameOver = this.boxes.every(row => row.every(box => box !== 0));
    }

    /**
     * Gets the current scores for both players
     * @returns {{player1: number, player2: number}} Object containing scores for both players
     */
    getScores() {
        let player1 = 0, player2 = 0;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.boxes[y][x] === 1) player1++;
                else if (this.boxes[y][x] === 2) player2++;
            }
        }
        return { player1, player2 };
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
