const Node = require('./node');

class SnakeGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }

    setAsSnakeNode() {
        this._setAsNodeType('snake');
    }

    setAsHeadNode() {
        this._setAsNodeType(['snake', 'snake-head']);
    }

    setAsFoodNode() {
        this._setAsNodeType('food');
    }

    isSnakeNode() {
        return this._isNodeOfType('snake');
    }

    isFoodNode() {
        return this._isNodeOfType('food');
    }
}

module.exports = SnakeGameNode;
