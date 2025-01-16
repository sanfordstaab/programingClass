// Core game logic module

export class Game {
    constructor(size = 3) {
        this.size = size;
        this.reset();
    }

    reset() {
        this.currentPlayer = 1;
        this.horizontalLines = Array(this.size * (this.size + 1)).fill(false);
        this.verticalLines = Array((this.size + 1) * this.size).fill(false);
        this.boxes = Array(this.size * this.size).fill(0);
        this.gameOver = false;
    }

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

    isBoxComplete(row, col) {
        const top = this.horizontalLines[row * (this.size + 1) + col];
        const bottom = this.horizontalLines[(row + 1) * (this.size + 1) + col];
        const left = this.verticalLines[row * this.size + col];
        const right = this.verticalLines[row * this.size + col + 1];
        return top && bottom && left && right;
    }

    checkGameOver() {
        this.gameOver = this.boxes.every(box => box !== 0);
    }

    getScores() {
        return {
            player1: this.boxes.filter(box => box === 1).length,
            player2: this.boxes.filter(box => box === 2).length
        };
    }

    getWinner() {
        if (!this.gameOver) return null;
        const scores = this.getScores();
        if (scores.player1 > scores.player2) return 1;
        if (scores.player2 > scores.player1) return 2;
        return 0; // tie
    }
}
