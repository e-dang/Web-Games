const Player = require('./player');
const utils = require('../utils/utils');

class EasyComputerPlayer extends Player {
    constructor(board, symbol) {
        super(board, symbol);
    }

    async makeMove() {
        this._setAsMyNode(utils.selectRandom(this.board.getEmptyNodes()));
    }
}

module.exports = EasyComputerPlayer;
