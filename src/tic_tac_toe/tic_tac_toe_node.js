const Node = require('../core/node');

class TicTacToeNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }
}

module.exports = TicTacToeNode;
