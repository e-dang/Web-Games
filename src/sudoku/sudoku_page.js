const Page = require('../core/page');
const SudokuBoard = require('./sudoku_board');

const DIMENSIONS = 9;

class SudokuPage extends Page {
    constructor() {
        super(new SudokuBoard(DIMENSIONS));
        this.difficultyMap = {
            easy: (callback) => this.board.setDifficultyEasy(callback),
            moderate: (callback) => this.board.setDifficultyModerate(callback),
            hard: (callback) => this.board.setDifficultyHard(callback),
            veryHard: (callback) => this.board.setDifficultyVeryHard(callback),
        };
        this.errorMap = {};

        this.addEventHandlers();
        this.board.draw();
        this._setDefaultDifficulty();
    }

    addEventHandlers() {
        super.addEventHandlers();
        this.addClickHintButtonEventHandler();
    }

    addClickHintButtonEventHandler() {
        document.getElementById('hintBtn').addEventListener('click', () => this._handleClickHintButton());

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
