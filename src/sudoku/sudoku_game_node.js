const Node = require('../core/node');

class SudokuGameNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
        this.trueValue = null;
    }

    setAsGivenNode() {
        this._setAsNodeType('given');
    }

    setAsInputNode() {
        this._setAsNodeType('input');
        this.input = document.createElement('input');
        this.input.id = `i${this.idx}`;
        this.input.maxLength = 1;
        this.input.addEventListener('input', () => this._handleInputEvent());
        this.element.appendChild(this.input);
    }

    setAsDefaultNode() {
        this.setAsGivenNode();
    }

    isGivenNode() {
        return this._isNodeOfType('given');
    }

    isInputNode() {
        return this._isNodeOfType('input');
    }

    renderTrueValue() {
        if (this.isGivenNode()) {
            this.element.innerText = this.trueValue;
        }
    }

    userValueIsCorrect() {
        if (this.isGivenNode()) {
            return true;
        }

        return this.trueValue == this.input.value;
    }

    addInputEventListener(type, fn) {
        if (this.isInputNode()) {
            this.input.addEventListener(type, fn);
        }
    }

    _handleInputEvent() {
        const value = parseInt(this.input.value);
        if (isNaN(value) || value === 0) {
            this.input.value = '';
        }
    }
}

module.exports = SudokuGameNode;
