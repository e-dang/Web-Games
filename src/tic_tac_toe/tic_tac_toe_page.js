const Page = require('../core/page');
const TicTacToeGame = require('./tic_tac_toe_game');
const {X, O} = require('./constants');

class TicTacToePage extends Page {
    constructor() {
        super();
        this.difficultyMap = {
            easy: (callback) => this.game.setDifficultyEasy(callback),
            moderate: (callback) => this.game.setDifficultyModerate(callback),
            hard: (callback) => this.game.setDifficultyHard(callback),
        };
        this.game = new TicTacToeGame();

        this.addEventHandlers();
        this._setDefaultDifficulty();
    }

    addSelectSymbolEventHandler() {
        document.getElementById(X).addEventListener('click', (event) => this._handleChangeSymbol(event));
        document.getElementById(O).addEventListener('click', (event) => this._handleChangeSymbol(event));
    }

    addEventHandlers() {
        super.addEventHandlers();
        this.addSelectSymbolEventHandler();
    }

    _handleClickResetButton() {
        this.game.reset();
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
