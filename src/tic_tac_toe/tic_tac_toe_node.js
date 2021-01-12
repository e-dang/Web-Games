const Node = require('../core/node');

class TicTacToeNode extends Node {
    constructor(row, col, idx, boardRow) {
        super(row, col, idx, boardRow, 'square');
        this.value = 0;
    }

    setAsEmptyNode() {
        super.setAsEmptyNode();
        this.value = 0;
    }

    setAsXNode() {
        this._setAsNodeType('x');
        this.value = 1;
    }

    setAsONode() {
        this._setAsNodeType('o');
        this.value = -1;
    }

    addClickEventListener(fn) {
        this.element.addEventListener('click', () => fn(this));
    }
}

module.exports = TicTacToeNode;
