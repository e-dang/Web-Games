const {TicTacToeBoard} = require('./tic_tac_toe_board');

class TicTacToePage {
    constructor() {
        this.board = new TicTacToeBoard();

        this.board.draw();
    }
}

module.exports = TicTacToePage;
