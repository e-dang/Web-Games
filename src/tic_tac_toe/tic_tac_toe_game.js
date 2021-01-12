const EasyComputerPlayer = require('./easy_comp_player');
const HumanPlayer = require('./human_player');
const {TicTacToeBoard} = require('./tic_tac_toe_board');
const {X, O} = require('./constants');
const ModerateComputerPlayer = require('./moderate_comp_player');

class TicTacToeGame {
    constructor() {
        this.currentLoop = null;
        this.winner = null;
        this.currentTurn = X;
        this.board = new TicTacToeBoard();
        this.board.draw();

        this.humanPlayer = new HumanPlayer(this.board, () => this.getCurrentTurn(), X);
        this.compPlayer = new EasyComputerPlayer(this.board, () => this.getCurrentTurn(), O);
    }

    reset() {
        if (this.currentLoop) {
            clearTimeout(this.currentLoop);
        }
        this.board.clear();
        this.currentTurn = X;
        this.winner = null;
        this.start();
    }

    setHumanPlayerSymbolAsX() {
        this.humanPlayer.useXSymbol();
        this.compPlayer.useOSymbol();
        this.reset();
    }

    setHumanPlayerSymbolAsO() {
        this.humanPlayer.useOSymbol();
        this.compPlayer.useXSymbol();
        this.reset();
    }

    getCurrentTurn() {
        return this.currentTurn;
    }

    async start() {
        if (this._isComputersTurn()) {
            await this.compPlayer.makeMove();
        } else {
            await this.humanPlayer.makeMove();
        }
        this._changeTurns();

        if (this._isGameComplete()) {
            this._handleGameOver();
            return;
        }

        this.currentLoop = setTimeout(this.start.bind(this), 10);
    }

    setDifficultyEasy(callback) {
        this.compPlayer = new EasyComputerPlayer(this.board, () => this.getCurrentTurn(), this._getComputerSymbol());
        callback();
    }

    setDifficultyModerate(callback) {
        this.compPlayer = new ModerateComputerPlayer(
            this.board,
            () => this.getCurrentTurn(),
            this._getComputerSymbol(),
        );
        callback();
    }

    setDifficultyHard(callback) {
        this.compPlayer = new EasyComputerPlayer(this.board, () => this.getCurrentTurn(), this._getComputerSymbol());
        callback();
    }

    _getComputerSymbol() {
        return this.humanPlayer.isXPlayer() ? O : X;
    }

    _isComputersTurn() {
        return this.compPlayer.isMyTurn();
    }

    _changeTurns() {
        this.currentTurn = this.currentTurn == X ? O : X;
    }

    _handleGameOver() {
        console.log('game over');
    }

    _isGameComplete() {
        this._setWinner(this.board.getWinner());
        if (this.winner != null) {
            return true;
        }
        return false;
    }

    _setWinner(symbol) {
        if (symbol == X) {
            this.winner = this._getXPlayer();
        } else if (symbol == O) {
            this.winner = this._getOPlayer();
        } else {
            this.winner = symbol;
        }
    }

    _getXPlayer() {
        return this.humanPlayer.isXPlayer() ? this.humanPlayer : this.compPlayer;
    }

    _getOPlayer() {
        return this.humanPlayer.isOPlayer() ? this.humanPlayer : this.compPlayer;
    }
}

module.exports = TicTacToeGame;
