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
        this.lastMoveIndex = index;  // Track the last move
        this.lastMoveType = lineType;  // Track the type of move
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
        
        // Calculate which boxes to check based on the last move
        const row = Math.floor(this.lastMoveIndex / this.size);
        const col = this.lastMoveIndex % this.size;
        
        // For horizontal lines at row R, check boxes at (R-1,col) and (R,col)
        // For vertical lines at col C, check boxes at (row,C-1) and (row,C)
        const boxesToCheck = [];
        // For horizontal lines
        if (this.lastMoveType === 'horizontal') {
            // Check box above the line (if not top row)
            if (row > 0) boxesToCheck.push({row: row-1, col});
            // Check box below the line (if not bottom row)
            if (row < this.size) boxesToCheck.push({row, col});
        } else {
            // For vertical lines
            // Check box to the left of the line (if not leftmost)
            if (col > 0) boxesToCheck.push({row, col: col-1});
            // Check box to the right of the line (if not rightmost)
            if (col < this.size) boxesToCheck.push({row, col});
        }
        
        for (const box of boxesToCheck) {
            const boxIndex = box.row * this.size + box.col;
            if (this.boxes[boxIndex] === 0 && this.isBoxComplete(box.row, box.col)) {
                this.boxes[boxIndex] = this.currentPlayer;
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
    isBoxComplete(row, col) {
        const topIndex = row * (this.size) + col;
        const bottomIndex = (row + 1) * (this.size) + col;
        const leftIndex = row * (this.size + 1) + col;
        const rightIndex = row * (this.size + 1) + (col + 1);

        // Check if all four lines around the box are drawn
        const top = this.horizontalLines[topIndex];
        const bottom = this.horizontalLines[bottomIndex];
        const left = this.verticalLines[leftIndex];
        const right = this.verticalLines[rightIndex];

        const fIsComplete = (top && bottom && left && right);
        if (fIsComplete) {
            console.log(`Box (${row}, ${col}) is now complete.`);
        }

        return fIsComplete;
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
