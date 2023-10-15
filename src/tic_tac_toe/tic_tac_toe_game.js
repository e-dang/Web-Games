import {EasyComputerPlayer} from './easy_comp_player';
import {HumanPlayer} from './human_player';
import {TicTacToeBoard} from './tic_tac_toe_board';
import {X, O} from './constants';
import {ModerateComputerPlayer} from './moderate_comp_player';
import {HardComputerPlayer} from './hard_comp_player';
import {openModal} from '../utils/modal';

export class TicTacToeGame {
  constructor() {
    this.currentLoop = null;
    this.winner = null;
    this.currentTurn = X;
    this.humanWins = 0;
    this.compWins = 0;
    this.board = new TicTacToeBoard();
    this.board.draw(false);

    this.humanPlayer = new HumanPlayer(this.board, () => this.getCurrentTurn(), X);
    this.compPlayer = new EasyComputerPlayer(this.board, this._getComputerSymbol());
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
    if (this._isHumansTurn()) {
      await this.humanPlayer.makeMove();
    } else {
      await this.compPlayer.makeMove();
    }
    this._changeTurns();

    if (this._isGameComplete()) {
      this._handleGameOver();
      return;
    }

    this.currentLoop = setTimeout(this.start.bind(this), 10);
  }

  setDifficultyEasy(callback) {
    this.compPlayer = new EasyComputerPlayer(this.board, this._getComputerSymbol());
    callback();
  }

  setDifficultyModerate(callback) {
    this.compPlayer = new ModerateComputerPlayer(this.board, this._getComputerSymbol());
    callback();
  }

  setDifficultyHard(callback) {
    this.compPlayer = new HardComputerPlayer(this.board, this._getComputerSymbol());
    callback();
  }

  _getComputerSymbol() {
    return this.humanPlayer.isXPlayer() ? O : X;
  }

  _isHumansTurn() {
    return this.humanPlayer.isMyTurn();
  }

  _changeTurns() {
    this.currentTurn = this.currentTurn == X ? O : X;
  }

  _handleGameOver() {
    const message = this._incrementWins();
    document.getElementById('humanWins').innerText = this.humanWins;
    document.getElementById('compWins').innerText = this.compWins;
    document.getElementById('gameOverTitle').innerText = 'Game Over';
    document.getElementById('gameOverMessage').innerText = message;
    openModal('gameOverModal');
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

  _incrementWins() {
    let message;
    if (this.winner == this.humanPlayer) {
      message = 'You Win!';
      this.humanWins++;
    } else if (this.winner == this.compPlayer) {
      message = 'You Lost!';
      this.compWins++;
    } else {
      message = "It's a draw!";
    }

    return message;
  }
}
