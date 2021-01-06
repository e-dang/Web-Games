const Board = require('../core/board');
const SudokuGameNode = require('./sudoku_game_node');
const SudokuSolver = require('./sudoku_solver');

class SudokuBoard extends Board {
    constructor(dimensions) {
        super(dimensions, SudokuGameNode);
        this.solver = new SudokuSolver();
        this.numHints = 0;
    }

    reset() {
        this.clear();
        this.solver.solve(this).next();
        this._selectInputNodes();
        this.nodes.forEach((node) => node.renderTrueValue());
        this.numHints = 0;
    }

    getHint() {
        const node = this._getRandInputNode();
        node.setAsGivenNode();
        node.renderTrueValue();
        this.numHints++;
        return node;
    }

    isComplete() {
        return this.nodes.reduce((accum, node) => accum + node.userValueIsCorrect(), 0) == this.nodes.length;
    }

    setDifficultyEasy(callback) {
        // difficulty bounds according to http://zhangroup.aporc.org/images/files/Paper_3485.pdf
        this.givensLowerBound = 36;
        this.givensUpperBound = 40;
        this.attempts = 2;
        callback();
    }

    setDifficultyModerate(callback) {
        // difficulty bounds according to http://zhangroup.aporc.org/images/files/Paper_3485.pdf
        this.givensLowerBound = 32;
        this.givensUpperBound = 35;
        this.attempts = 4;
        callback();
    }

    setDifficultyHard(callback) {
        // difficulty bounds according to http://zhangroup.aporc.org/images/files/Paper_3485.pdf
        this.givensLowerBound = 28;
        this.givensUpperBound = 31;
        this.attempts = 6;
        callback();
    }

    setDifficultyVeryHard(callback) {
        // difficulty bounds according to http://zhangroup.aporc.org/images/files/Paper_3485.pdf
        this.givensLowerBound = 22;
        this.givensUpperBound = 27;
        this.attempts = 8;
        callback();
    }

    addNodeInputEventListeners(type, fn) {
        this.nodes.forEach((node) => node.addInputEventListener(type, () => fn(node)));
    }

    _selectInputNodes() {
        let attempts = this.attempts;
        let numGivens = this.nodes.length;
        while (this._isBoardTooEasy(attempts, numGivens)) {
            const node = this._getRandGivenNode();

            node.setAsInputNode();
            if (this.solver.calcNumSolutions(this) > 1) {
                attempts--;
                node.setAsGivenNode();
            } else {
                numGivens--;
            }
        }
    }

    _isBoardTooEasy(attempts, numGivens) {
        return (attempts > 0 && numGivens >= this.givensLowerBound) || numGivens > this.givensUpperBound;
    }

    _getRandGivenNode() {
        return this._getRandNodeOfType((node) => node.isGivenNode());
    }

    _getRandInputNode() {
        return this._getRandNodeOfType((node) => node.isInputNode());
    }

    _getRandNodeOfType(fn) {
        while (true) {
            const row = Math.floor(Math.random() * this.dims);
            const col = Math.floor(Math.random() * this.dims);
            const node = this.getNode(row, col);
            if (fn(node)) {
                return node;
            }
        }
    }
}

module.exports = SudokuBoard;
