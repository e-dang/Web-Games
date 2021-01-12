const Page = require('../core/page');
const TicTacToeGame = require('./tic_tac_toe_game');

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
        this.game.start();
    }

    addEventHandlers() {
        super.addEventHandlers();
        this.addSelectSymbolEventHandler();
    }

    _handleClickResetButton() {
        this.game.reset();
    }

    addSelectSymbolEventHandler() {
        document.getElementById('x').addEventListener('click', (event) => this._handleChangeSymbol(event));
        document.getElementById('o').addEventListener('click', (event) => this._handleChangeSymbol(event));
    }

    _handleChangeSymbol(event) {
        if (event.target.id == 'x') {
            this.game.setHumanPlayerSymbolAsX();
        } else {
            this.game.setHumanPlayerSymbolAsO();
        }
    }
}

module.exports = TicTacToePage;
