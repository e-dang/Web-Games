const EasyComputerPlayer = require('./easy_comp_player');
const HumanPlayer = require('./human_player');
const {TicTacToeBoard} = require('./tic_tac_toe_board');
const {X, O} = require('./constants');

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
        this.compPlayer = new EasyComputerPlayer(this.board, () => this.getCurrentTurn(), this._getComputerSymbol());
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
        for (let i = 0; i < this.board.dims; i++) {
            if (this._decideWinner(this.board.getRow(i)) || this._decideWinner(this.board.getCol(i))) {
                return true;
            }
        }

        if (
            this._decideWinner(this.board.getLeftToRightDiag()) ||
            this._decideWinner(this.board.getRightToLeftDiag())
        ) {
            return true;
        }

        return false;
    }

    _decideWinner(nodes) {
        this._setWinner(this._getSum([...nodes]));
        if (this.winner != null) {
            return true;
        }
        return false;
    }

    _getSum(nodes) {
        return nodes.reduce((accum, node) => (accum += node.value), 0);
    }

    _setWinner(sum) {
        if (sum == 3) {
            this.winner = this._getXPlayer();
        } else if (sum == -3) {
            this.winner = this._getOPlayer();
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
