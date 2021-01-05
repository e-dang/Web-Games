const Board = require('../core/board');
const SudokuGameNode = require('./sudoku_game_node');

class SudokuBoard extends Board {
    constructor(dimensions) {
        super(dimensions, SudokuGameNode);
    }

    reset() {
        this.clear();
        this.getNode(0, 0).setValue(1);
    }

    _customizeNode(node) {
        node.addInputEventListener('input', (event) => this._handleInputNodeValue(event));
    }

    _handleInputNodeValue(event) {
        const value = parseInt(event.target.value);
        if (isNaN(value) || value === 0) {
            event.target.value = '';
        }
    }
}

module.exports = SudokuBoard;
