const Player = require('./player');

class EasyComputerPlayer extends Player {
    constructor(board, symbol) {
        super(board, symbol);
    }
}

module.exports = EasyComputerPlayer;
