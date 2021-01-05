const Board = require('../core/board');
const SudokuGameNode = require('./sudoku_game_node');

class SudokuBoard extends Board {
    constructor(dimensions) {
        super(dimensions, SudokuGameNode);
    }

    reset() {
        this.clear();
        const node = this.getNode(0, 0);
        node.trueValue = 1;
        node.renderTrueValue();
    }

    isComplete() {
        return this.nodes.reduce((accum, node) => accum + node.userValueIsCorrect(), 0) == this.nodes.length;
    }
}

module.exports = SudokuBoard;
