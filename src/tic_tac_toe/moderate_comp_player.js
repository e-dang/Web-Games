const Player = require('./player');
const {X, O, DRAW} = require('./constants');

class ModerateComputerPlayer extends Player {
    constructor(board, symbol) {
        super(board, symbol);
        this.depthLimit = 3;
    }

    async makeMove() {
        let bestMove;
        let bestScore = -Infinity;
        const emptyNodes = this.board.getEmptyNodes();
        for (let i = 0; i < emptyNodes.length; i++) {
            const node = emptyNodes.shift();
            this._setAsMyNode(node);
            const score = this._miniMax(1, emptyNodes, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = node;
            }
            node.setAsEmptyNode();
            emptyNodes.push(node);
        }

        this._setAsMyNode(bestMove);
    }

    _miniMax(depth, emptyNodes, isMaximizing) {
        const winner = this.board.getWinner();
        if (winner != null) {
            return this.scores[winner];
        } else if (depth == this.depthLimit) {
            return 0;
        }

        let bestScore;
        if (isMaximizing) {
            bestScore = -Infinity;
            for (let i = 0; i < emptyNodes.length; i++) {
                const node = emptyNodes.shift();
                this._setAsMyNode(node);
                bestScore = Math.max(bestScore, this._miniMax(depth + 1, emptyNodes, false));
                node.setAsEmptyNode();
                emptyNodes.push(node);
            }
        } else {
            bestScore = Infinity;
            for (let i = 0; i < emptyNodes.length; i++) {
                const node = emptyNodes.shift();
                this._setAsOpponentNode(node);
                bestScore = Math.min(bestScore, this._miniMax(depth + 1, emptyNodes, true));
                node.setAsEmptyNode();
                emptyNodes.push(node);
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
