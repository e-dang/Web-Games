const Page = require('../core/page');
const {TicTacToeBoard} = require('./tic_tac_toe_board');

class TicTacToePage extends Page {
    constructor() {
        super();
        this.board = new TicTacToeBoard();
        this.difficultyMap = {
            easy: (callback) => callback(),
            moderate: (callback) => callback(),
            hard: (callback) => callback(),
        };

        this.addEventHandlers();
        this.board.draw();
        this._setDefaultDifficulty();
    }
}

module.exports = TicTacToePage;
