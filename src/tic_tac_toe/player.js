class Player {
    constructor(board, getCurrentTurn, symbol) {
        this.board = board;
        this.getCurrentTurn = getCurrentTurn;
        this._setSymbol(symbol);
    }

    useXSymbol() {
        this._setSymbol('x');
    }

    useOSymbol() {
        this._setSymbol('o');
    }

    isXPlayer() {
        return this.symbol == 'x';
    }

    isOPlayer() {
        return this.symbol == 'o';
    }

    isMyTurn() {
        return this.getCurrentTurn() == this.symbol;
    }

    _setAsMyNode(node) {
        if (this.symbol == 'x') {
            node.setAsXNode();
        } else {
            node.setAsONode();
        }
    }

    _setSymbol(symbol) {
        if (symbol == 'x' || symbol == 'o') {
            this.symbol = symbol;
        }
    }
}

module.exports = Player;
