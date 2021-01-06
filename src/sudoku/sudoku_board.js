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
        this._selectInputNodes(5);
        this.nodes.forEach((node) => node.renderTrueValue());
        this.numHints = 0;
    }

    getHint() {
        const node = this._getRandInputNode();
        node.setAsGivenNode();
        node.renderTrueValue();
        this.numHints++;
    }

    isComplete() {
        return this.nodes.reduce((accum, node) => accum + node.userValueIsCorrect(), 0) == this.nodes.length;
    }

    addNodeInputEventListeners(type, fn) {
        this.nodes.forEach((node) => node.addInputEventListener(type, () => fn(node)));
    }

    _selectInputNodes(attempts) {
        while (attempts > 0) {
            const node = this._getRandGivenNode();

            node.setAsInputNode();
            if (this.solver.calcNumSolutions(this) > 1) {
                attempts--;
                node.setAsGivenNode();
            }
        }
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
