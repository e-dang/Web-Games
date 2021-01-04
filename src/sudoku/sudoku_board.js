const Board = require('../core/board');
const SudokuGameNode = require('./sudoku_game_node');

class SudokuBoard extends Board {
    constructor(dimensions) {
        super(dimensions, SudokuGameNode);
    }

    reset() {
        this.clear();
        this.getNode(0, 0).setValue(1);
    }
}

module.exports = SudokuBoard;
