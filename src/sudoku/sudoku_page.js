const SudokuBoard = require('./sudoku_board');

DIMENSIONS = 9;

class SudokuPage {
    constructor() {
        this.board = new SudokuBoard(DIMENSIONS);

        this.board.draw((node) => this._customizeNode(node));
        this.board.reset();
    }
    _customizeNode(node) {
        node.addInputEventListener('change', () => this._handleInputChangeEvent(node));
    }

    _handleInputChangeEvent(node) {
        if (node.userValueIsCorrect()) {
            if (this.board.isComplete()) {
                this._handleSudokuComplete();
            }
        }
    }

    _handleSudokuComplete() {
        document.getElementById('gameOverTitle').innerText = 'Congratulations, You Won!';
        $('#gameOverModal').modal();
    }
}

module.exports = SudokuPage;
