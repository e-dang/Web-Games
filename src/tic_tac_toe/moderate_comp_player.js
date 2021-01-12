const Player = require('./player');
const {X, O, DRAW} = require('./constants');

class ModerateComputerPlayer extends Player {
    constructor(board, getCurrentTurn, symbol) {
        super(board, getCurrentTurn, symbol);
    }

    async makeMove() {
        let bestMove;
        let bestScore = -Infinity;
        for (let node of this.board.getEmptyNodes()) {
            this._setAsMyNode(node);
            const score = this.miniMax(false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = node;
            }
            node.setAsEmptyNode();
        }

        this._setAsMyNode(bestMove);
    }

    miniMax(isMaximizing) {
        const winner = this.board.getWinner();
        if (winner != null) {
            return this.scores[winner];
        }

        let bestScore;
        if (isMaximizing) {
            bestScore = -Infinity;
            for (let node of this.board.getEmptyNodes()) {
                this._setAsMyNode(node);
                bestScore = Math.max(bestScore, this.miniMax(false));
                node.setAsEmptyNode();
            }
        } else {
            bestScore = Infinity;
            for (let node of this.board.getEmptyNodes()) {
                this._setAsOpponentNode(node);
                bestScore = Math.min(bestScore, this.miniMax(true));
                node.setAsEmptyNode();
            }
        }

        return bestScore;
    }

    _setAsOpponentNode(node) {
        if (this.isXPlayer()) {
            node.setAsONode();
        } else {
            node.setAsXNode();
        }
    }

    _setSymbol(symbol) {
        super._setSymbol(symbol);
        const oppSymbol = this.isXPlayer() ? O : X;
        this.scores = {};
        this.scores[symbol] = 1;
        this.scores[oppSymbol] = -1;
        this.scores[DRAW] = 0;
    }
}

module.exports = ModerateComputerPlayer;
