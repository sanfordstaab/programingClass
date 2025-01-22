class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.resetButton = document.getElementById('resetBtn');

        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell), { once: true });
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    handleCellClick(cell) {
        if (!this.gameActive || cell.classList.contains('x') || cell.classList.contains('o')) {
            return;
        }

        const index = cell.dataset.index;
        this.makeMove(index);

        if (this.gameActive) {
            setTimeout(() => this.computerMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        const cell = this.cells[index];
        cell.classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.endGame(false);
            return;
        }

        if (this.checkDraw()) {
            this.endGame(true);
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    computerMove() {
        // Try to win
        const winningMove = this.findBestMove('O');
        if (winningMove !== -1) {
            this.makeMove(winningMove);
            return;
        }

        // Block player from winning
        const blockingMove = this.findBestMove('X');
        if (blockingMove !== -1) {
            this.makeMove(blockingMove);
            return;
        }

        // Take center if available
        if (this.board[4] === '') {
            this.makeMove(4);
            return;
        }

        // Take a random available corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            this.makeMove(randomCorner);
            return;
        }

        // Take any available space
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : -1).filter(i => i !== -1);
        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            this.makeMove(randomMove);
        }
    }

    findBestMove(player) {
        // Check each winning combination
        for (const combo of this.winningCombos) {
            const line = combo.map(i => this.board[i]);
            const playerCount = line.filter(cell => cell === player).length;
            const emptyCount = line.filter(cell => cell === '').length;

            // If we can win or block a win
            if (playerCount === 2 && emptyCount === 1) {
                const moveIndex = combo[line.findIndex(cell => cell === '')];
                if (this.board[moveIndex] === '') {
                    return moveIndex;
                }
            }
        }
        return -1;
    }

    checkWin() {
        for (const combo of this.winningCombos) {
            if (
                this.board[combo[0]] &&
                this.board[combo[0]] === this.board[combo[1]] &&
                this.board[combo[0]] === this.board[combo[2]]
            ) {
                // Highlight winning cells
                combo.forEach(index => {
                    this.cells[index].classList.add('winning');
                });
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return !this.board.includes('');
    }

    endGame(draw) {
        this.gameActive = false;
        if (draw) {
            this.statusDisplay.textContent = "Game ended in a draw!";
        } else {
            this.statusDisplay.textContent = `${this.currentPlayer === 'X' ? 'You win!' : 'Computer wins!'}`;
        }
    }

    updateStatus() {
        this.statusDisplay.textContent = this.currentPlayer === 'X' ?
            "Your turn!" :
            "Computer's turn...";
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.className = 'cell';
            cell.addEventListener('click', () => this.handleCellClick(cell), { once: true });
        });

        this.updateStatus();
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
