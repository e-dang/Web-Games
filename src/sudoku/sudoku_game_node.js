const Node = require('../core/node');

class SudokuGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
        this.trueValue = null;
    }

    renderTrueValue() {
        this.element.innerText = this.trueValue;
    }

    userValueIsCorrect() {
        return this.trueValue == this.input.value;
    }

    addInputEventListener(type, fn) {
        this.input.addEventListener(type, fn);
    }

    _createElement(boardRow) {
        super._createElement(boardRow);
        this.input = document.createElement('input');
        this.input.id = `i${this.idx}`;
        this.input.maxLength = 1;
        this.input.addEventListener('input', () => this._handleInputEvent());
        this.element.appendChild(this.input);
    }

    _handleInputEvent() {
        const value = parseInt(this.input.value);
        if (isNaN(value) || value === 0) {
            this.input.value = '';
        }
    }
}

module.exports = SudokuGameNode;
