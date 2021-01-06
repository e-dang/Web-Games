const SudokuBoard = require('./sudoku_board');

DIMENSIONS = 9;

class SudokuPage {
    constructor() {
        this.board = new SudokuBoard(DIMENSIONS);

        this.board.draw();
        this.board.reset();
        this.board.addNodeInputEventListeners('change', (node) => this._handleInputChangeEvent(node));
    }

    _handleInputChangeEvent(node) {
        if (node.userValueIsCorrect()) {
            if (this.board.isComplete()) {
                this._handleSudokuComplete();
            }
        }
    }

    _handleSudokuComplete() {
        document.getElementById('gameOverTitle').innerText = 'Congratulations, You Solved It!';
        document.getElementById('gameOverMessage').innerText = 'Time: 0s';
        $('#gameOverModal').modal();
    }
}

module.exports = SudokuPage;
