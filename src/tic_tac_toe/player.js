class Player {
    constructor(symbol) {
        this._setSymbol(symbol);
    }

    useXSymbol() {
        this._setSymbol('x');
    }

    useOSymbol() {
        this._setSymbol('o');
    }

    _setSymbol(symbol) {
        if (symbol == 'x' || symbol == 'o') {
            this.symbol = symbol;
        }
    }
}

module.exports = Player;