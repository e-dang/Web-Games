const Node = require('./node');

class SnakeNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }
}

module.exports = SnakeNode;
