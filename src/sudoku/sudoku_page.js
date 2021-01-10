const SudokuBoard = require('./sudoku_board');

DIMENSIONS = 9;

class SudokuPage {
    constructor() {
        this.board = new SudokuBoard(DIMENSIONS);
        this.errorMap = {};

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
        this._removeErrorSignals(node);

        if (node.userValueIsCorrect()) {
            if (this.board.isComplete()) {
                this._handleSudokuComplete();
            }
        } else if (this.board.isNodeInvalid(node)) {
            this._handleUserValueError(node, this.board.getInvalidNodes());
        }
    }

    _handleSudokuComplete() {
        document.getElementById('gameOverTitle').innerText = 'Congratulations, You Solved It!';
        document.getElementById(
            'gameOverMessage',
        ).innerText = `Time: ${this.board.getElapsedTime()}s\nNumber of Hints Used: ${this.board.numHints}`;
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

    _handleUserValueError(userInputNode, borderNodes) {
        borderNodes.forEach((node) => {
            node.addErrorBorder();
        });

        const errorSectionNodes = [];
        this.board.nodes.forEach((node) => {
            if (node.row == userInputNode.row) {
                node.addErrorSection();
                errorSectionNodes.push(node);
            }

            if (node.col == userInputNode.col) {
                node.addErrorSection();
                errorSectionNodes.push(node);
            }

            if (
                this.board.calcBoxIdx(node.row, node.col) == this.board.calcBoxIdx(userInputNode.row, userInputNode.col)
            ) {
                node.addErrorSection();
                errorSectionNodes.push(node);
            }
        });

        this.errorMap[userInputNode.idx] = {
            borderNodes,
            errorSectionNodes,
        };
    }

    _removeErrorSignals(node) {
        if (node.idx in this.errorMap) {
            const {borderNodes, errorSectionNodes} = this.errorMap[node.idx];
            borderNodes.forEach((node) => node.removeErrorBorder());
            errorSectionNodes.forEach((node) => node.removeErrorSection());
            delete this.errorMap[node.idx];
        }
    }
}

module.exports = SudokuPage;
