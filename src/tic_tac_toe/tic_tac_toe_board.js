const Board = require('../core/board');
const TicTacToeNode = require('./tic_tac_toe_node');

TICTACTOE_DIMENSIONS = 3;

class TicTacToeBoard extends Board {
    constructor() {
        super(TICTACTOE_DIMENSIONS, TicTacToeNode);
    }

    addNodeClickEventListeners(fn) {
        this.nodes.forEach((node) => node.addClickEventListener(fn));
    }
}

module.exports = {TicTacToeBoard, TICTACTOE_DIMENSIONS};
