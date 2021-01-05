const Node = require('../core/node');

class SudokuGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
    }

    setValue(value) {
        this.element.innerText = value;
    }

    addInputEventListener(type, fn) {
        this.input.addEventListener(type, fn);
    }

    _createElement(boardRow) {
        super._createElement(boardRow);
        this.input = document.createElement('input');
        this.input.id = `i${this.idx}`;
        this.input.maxLength = 1;
        this.element.appendChild(this.input);
    }
}

module.exports = SudokuGameNode;
