const Player = require('./player');

class HumanPlayer extends Player {
    constructor(board, symbol) {
        super(board, symbol);
    }
}

module.exports = HumanPlayer;
