const Player = require('./player');

class HumanPlayer extends Player {
    constructor(symbol) {
        super(symbol);
    }
}

module.exports = HumanPlayer;
