const {X, O} = require('./constants');

class Player {
    constructor(board, getCurrentTurn, symbol) {
        this.board = board;
        this.getCurrentTurn = getCurrentTurn;
        this._setSymbol(symbol);
    }

    useXSymbol() {
        this._setSymbol(X);
    }

    useOSymbol() {
        this._setSymbol(O);
    }

    isXPlayer() {
        return this.symbol == X;
    }

    isOPlayer() {
        return this.symbol == O;
    }

    isMyTurn() {
        return this.getCurrentTurn() == this.symbol;
    }

    _setAsMyNode(node) {
        if (this.symbol == X) {
            node.setAsXNode();
        } else {
            node.setAsONode();
        }
    }

    _setSymbol(symbol) {
        if (symbol == X || symbol == O) {
            this.symbol = symbol;
        }
    }
}

module.exports = Player;
