const Board = require('../core/board');
const TicTacToeNode = require('./tic_tac_toe_node');
const {X, O, DRAW} = require('./constants');

TICTACTOE_DIMENSIONS = 3;

class TicTacToeBoard extends Board {
    constructor() {
        super(TICTACTOE_DIMENSIONS, TicTacToeNode);
    }

    draw() {
        super.draw();
        this.nodes.forEach((node) => {
            if (node.row == 0) {
                node.removeTopBorder();
            }

            if (node.row == TICTACTOE_DIMENSIONS - 1) {
                node.removeBottomBorder();
            }

            if (node.col == 0) {
                node.removeLeftBorder();
            }

            if (node.col == TICTACTOE_DIMENSIONS - 1) {
                node.removeRightBorder();
            }
        });
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

    getWinner() {
        let winner;
        for (let i = 0; i < this.dims; i++) {
            winner = this._decideWinner(this.getRow(i));
            if (winner) {
                return winner;
            }

            winner = this._decideWinner(this.getCol(i));
            if (winner) {
                return winner;
            }
        }

        winner = this._decideWinner(this.getLeftToRightDiag());
        if (winner) {
            return winner;
        }

        winner = this._decideWinner(this.getRightToLeftDiag());
        if (winner) {
            return winner;
        }

        if (this.getEmptyNodes().length == 0) {
            return DRAW;
        }

        return null;
    }

    _decideWinner(nodes) {
        const sum = this._getSum([...nodes]);
        if (sum == 3) {
            return X;
        } else if (sum == -3) {
            return O;
        }
        return null;
    }

    _getSum(nodes) {
        return nodes.reduce((accum, node) => (accum += node.value), 0);
    }
}

module.exports = {TicTacToeBoard, TICTACTOE_DIMENSIONS};
