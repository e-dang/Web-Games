const SudokuBoard = require('./sudoku_board');

DIMENSIONS = 9;

class SudokuPage {
    constructor() {
        this.board = new SudokuBoard(DIMENSIONS);

        this.addEventHandlers();
        this.board.draw();
        this._setDefaultDifficulty();
    }

    addEventHandlers() {
        this.addClickResetButtonEventHandler().addClickHintButtonEventHandler().addChangeDifficultyEventHandlers();
    }

    addClickResetButtonEventHandler() {
        document.getElementById('resetBtn').addEventListener('click', () => this._handleClickResetButton());

        return this;
    }

    addClickHintButtonEventHandler() {
        document.getElementById('hintBtn').addEventListener('click', () => this._handleClickHintButton());

        return this;
    }

    addChangeDifficultyEventHandlers() {
        document.getElementById('easy').addEventListener('click', (event) => this._handleChangeDifficulty(event));
        document.getElementById('moderate').addEventListener('click', (event) => this._handleChangeDifficulty(event));
        document.getElementById('hard').addEventListener('click', (event) => this._handleChangeDifficulty(event));
        document.getElementById('veryHard').addEventListener('click', (event) => this._handleChangeDifficulty(event));

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
        this.board.addNodeInputEventListeners('change', (node) => this._handleInputChangeEvent(node));
    }

    _handleClickHintButton() {
        this._handleInputChangeEvent(this.board.getHint());
    }

    _setDefaultDifficulty() {
        document.getElementById('easy').click();
    }

    _handleChangeDifficulty(event) {
        if (event.target.id == 'easy') {
            this.board.setDifficultyEasy(() => this._updateDifficulty(event));
        } else if (event.target.id == 'moderate') {
            this.board.setDifficultyModerate(() => this._updateDifficulty(event));
        } else if (event.target.id == 'hard') {
            this.board.setDifficultyHard(() => this._updateDifficulty(event));
        } else if (event.target.id == 'veryHard') {
            this.board.setDifficultyVeryHard(() => this._updateDifficulty(event));
        }
    }

    _updateDifficulty(event) {
        document.getElementById('currentDifficulty').textContent = event.target.textContent;
        this._handleClickResetButton();
    }
}

module.exports = SudokuPage;
