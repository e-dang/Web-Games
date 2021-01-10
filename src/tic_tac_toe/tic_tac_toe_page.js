const Page = require('../core/page');
const EasyComputerPlayer = require('./easy_comp_player');
const HumanPlayer = require('./human_player');
const {TicTacToeBoard} = require('./tic_tac_toe_board');

class TicTacToePage extends Page {
    constructor() {
        super(new TicTacToeBoard(), {
            easy: (callback) => callback(),
            moderate: (callback) => callback(),
            hard: (callback) => callback(),
        });
        this.humanPlayer = new HumanPlayer('x');
        this.compPlayer = new EasyComputerPlayer('o');

        this.addEventHandlers();
        this.board.draw();
        this._setDefaultDifficulty();
    }

    addEventHandlers() {
        super.addEventHandlers();
        this.addSelectSymbolEventHandler();
    }

    addSelectSymbolEventHandler() {
        document.getElementById('x').addEventListener('click', (event) => this._handleChangeSymbol(event));
        document.getElementById('o').addEventListener('click', (event) => this._handleChangeSymbol(event));
    }

    _handleChangeSymbol(event) {
        if (event.target.id == 'x') {
            this.humanPlayer.useXSymbol();
            this.compPlayer.useOSymbol();
        } else {
            this.humanPlayer.useOSymbol();
            this.compPlayer.useXSymbol();
        }
    }
}

module.exports = TicTacToePage;
