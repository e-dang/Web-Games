const SudokuBoard = require('./sudoku_board');

DIMENSIONS = 9;

class SudokuPage {
    constructor() {
        this.board = new SudokuBoard(DIMENSIONS);

        this.board.draw();
        this.board.reset();
        this.board.addNodeInputEventListeners('change', (node) => this._handleInputChangeEvent(node));
        this.addEventHandlers();
    }

    addEventHandlers() {
        this.addClickResetButtonEventHandler().addClickHintButtonEventHandler();
    }

    addClickResetButtonEventHandler() {
        document.getElementById('resetBtn').addEventListener('click', () => this._handleClickResetButton());

        return this;
    }

    addClickHintButtonEventHandler() {
        document.getElementById('hintBtn').addEventListener('click', () => this._handleClickHintButton());

        return this;
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
        document.getElementById('gameOverMessage').innerText = `Number of Hints Used: ${this.board.numHints}`;
        $('#gameOverModal').modal();
    }

    _handleClickResetButton() {
        this.board.reset();
    }

    _handleClickHintButton() {
        this._handleInputChangeEvent(this.board.getHint());
    }
}

module.exports = SudokuPage;
