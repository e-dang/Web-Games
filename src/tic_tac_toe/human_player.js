const Player = require('./player');
const {sleep} = require('../utils/utils');

class HumanPlayer extends Player {
    constructor(board, getCurrentTurn, symbol) {
        super(board, symbol);
        this.getCurrentTurn = getCurrentTurn;
        this.isTurnComplete = false;

        this._addNodeClickEventListeners();
    }

    async makeMove() {
        while (!this.isTurnComplete) {
            await sleep(10);
        }

        this.isTurnComplete = false;
    }

    isMyTurn() {
        return this.getCurrentTurn() == this.symbol;
    }

    _addNodeClickEventListeners() {
        this.board.addNodeClickEventListeners((node) => this._handleNodeClickEvent(node));
    }

    _handleNodeClickEvent(node) {
        if (this.isMyTurn() && node.isEmptyNode()) {
            this._setAsMyNode(node);
        }
    }

    _setAsMyNode(node) {
        super._setAsMyNode(node);
        this.isTurnComplete = true;
    }
}

module.exports = HumanPlayer;
