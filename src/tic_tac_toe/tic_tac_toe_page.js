const Page = require('../core/page');
const TicTacToeGame = require('./tic_tac_toe_game');
const {X, O} = require('./constants');

class TicTacToePage extends Page {
    constructor() {
        super({
            easy: (callback) => callback(),
            moderate: (callback) => callback(),
            hard: (callback) => callback(),
        });
        this.game = new TicTacToeGame();

        this.addEventHandlers();
        this._setDefaultDifficulty();
    }

    addEventHandlers() {
        super.addEventHandlers();
        this.addSelectSymbolEventHandler();
    }

    _handleClickResetButton() {
        this.game.reset();
    }

    addSelectSymbolEventHandler() {
        document.getElementById(X).addEventListener('click', (event) => this._handleChangeSymbol(event));
        document.getElementById(O).addEventListener('click', (event) => this._handleChangeSymbol(event));
    }

    _handleChangeSymbol(event) {
        if (event.target.id == X) {
            this.game.setHumanPlayerSymbolAsX();
        } else {
            this.game.setHumanPlayerSymbolAsO();
        }
    }
}

module.exports = TicTacToePage;
