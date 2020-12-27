const Node = require('./node');

class SnakeGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }

    setAsSnakeNode() {
        this._setAsNodeType('snake');
    }

    setAsHeadNode() {
        this._setAsNodeType(['snake', 'head']);
    }
}

module.exports = SnakeGameNode;
