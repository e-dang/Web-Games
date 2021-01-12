const Board = require('../core/board');
const TicTacToeNode = require('./tic_tac_toe_node');

TICTACTOE_DIMENSIONS = 3;

class TicTacToeBoard extends Board {
    constructor() {
        super(TICTACTOE_DIMENSIONS, TicTacToeNode);
    }

    getEmptyNodes() {
        return this.nodes.filter((node) => node.isEmptyNode());
    }

    addNodeClickEventListeners(fn) {
        this.nodes.forEach((node) => node.addClickEventListener(fn));
    }

    *getRow(row) {
        for (let i = 0; i < this.dims; i++) {
            yield this.getNode(row, i);
        }
    }

    *getCol(col) {
        for (let i = 0; i < this.dims; i++) {
            yield this.getNode(i, col);
        }
    }

    *getLeftToRightDiag() {
        for (let i = 0; i < this.dims; i++) {
            yield this.getNode(i, i);
        }
    }

    *getRightToLeftDiag() {
        for (let i = 0; i < this.dims; i++) {
            yield this.getNode(i, this.dims - i - 1);
        }
    }
}

module.exports = {TicTacToeBoard, TICTACTOE_DIMENSIONS};
