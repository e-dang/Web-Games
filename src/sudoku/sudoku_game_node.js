const Node = require('../core/node');

class SudokuGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }

    setValue(value) {
        this.element.innerText = value;
    }
}

module.exports = SudokuGameNode;
