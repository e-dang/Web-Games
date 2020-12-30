const Node = require('../core/node');

class SudokuGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }
}

module.exports = SudokuGameNode;
