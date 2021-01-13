const Page = require('../core/page');
const SudokuBoard = require('./sudoku_board');

const DIMENSIONS = 9;

class SudokuPage extends Page {
    constructor() {
        super();
        this.board = new SudokuBoard(DIMENSIONS);
        this.difficultyMap = {
            easy: (callback) => this.board.setDifficultyEasy(callback),
            moderate: (callback) => this.board.setDifficultyModerate(callback),
            hard: (callback) => this.board.setDifficultyHard(callback),
            veryHard: (callback) => this.board.setDifficultyVeryHard(callback),
        };
        this.errorMap = {};
        this.interval = null;

        this.addEventHandlers();
        this.board.draw();
        this._setDefaultDifficulty();
    }

    addEventHandlers() {
        super.addEventHandlers();
        this.addClickHintButtonEventHandler().addClickShowTimerEventHandler();
    }

    addClickHintButtonEventHandler() {
        document.getElementById('hintBtn').addEventListener('click', () => this._handleClickHintButton());

        return this;
    }

    addClickShowTimerEventHandler() {
        document.getElementById('showTimerBtn').addEventListener('click', () => this._handleClickShowTimer());

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
        clearInterval(this.interval);
        document.getElementById('gameOverTitle').innerText = 'Congratulations, You Solved It!';
        document.getElementById(
            'gameOverMessage',
        ).innerText = `Time: ${this.board.getElapsedTime()}s\nNumber of Hints Used: ${this.board.numHints}`;
        $('#gameOverModal').modal();
    }

    _handleClickResetButton() {
        this.board.reset();
        this._startTimer();
        this.board.addNodeInputEventListeners('change', (node) => this._handleInputChangeEvent(node));
    }

    _handleClickHintButton() {
        this._handleInputChangeEvent(this.board.getHint());
    }

    _handleUserValueError(userInputNode, borderNodes) {
        let rowError = false;
        let colError = false;
        let boxError = false;
        const boxIdx = this.board.calcBoxIdx(userInputNode.row, userInputNode.col);
        borderNodes.forEach((node) => {
            node.addErrorBorder();
            if (node.idx != userInputNode.idx) {
                if (node.row == userInputNode.row) {
                    rowError = true;
                } else if (node.col == userInputNode.col) {
                    colError = true;
                }

                if (this.board.calcBoxIdx(node.row, node.col) == boxIdx) {
                    boxError = true;
                }
            }
        });

        const errorSectionNodes = [];
        this.board.nodes.forEach((node) => {
            if (rowError && node.row == userInputNode.row) {
                node.addErrorSection();
                errorSectionNodes.push(node);
            }

            if (colError && node.col == userInputNode.col) {
                node.addErrorSection();
                errorSectionNodes.push(node);
            }

            if (boxError && this.board.calcBoxIdx(node.row, node.col) == boxIdx) {
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

    _handleClickShowTimer() {
        const element = document.getElementById('timer');
        element.hidden = !element.hidden;
    }

    _startTimer() {
        this.interval = setInterval(() => {
            const elapsedTime = this.board.getElapsedTime();
            const seconds = Math.floor(elapsedTime);
            const milliseconds = Math.floor((elapsedTime % 1) * 10);
            document.getElementById('elapsedTime').innerText = `${seconds}.${milliseconds}`;
        }, 1);
    }
}

module.exports = SudokuPage;
