import {Page} from '../core/page';
import {openModal} from '../utils/modal';
import {SudokuBoard} from './sudoku_board';

const DIMENSIONS = 9;

export class SudokuPage extends Page {
  constructor() {
    super();
    this.board = new SudokuBoard(DIMENSIONS);
    this.difficultyMap = {
      easy: (callback) => this.board.setDifficultyEasy(callback),
      moderate: (callback) => this.board.setDifficultyModerate(callback),
      hard: (callback) => this.board.setDifficultyHard(callback),
      veryHard: (callback) => this.board.setDifficultyVeryHard(callback),
    };
    this.interval = null;

    this.addEventHandlers();
    this.board.draw();
    this._setDefaultDifficulty();
  }

  addEventHandlers() {
    super.addEventHandlers();
    this.addClickHintButtonEventHandler().addClickShowTimerEventHandler();
  }

  addClickHintButtonEventHandler() {
    document.getElementById('hintBtn').addEventListener('click', () => this._handleClickHintButton());

    return this;
  }

  addClickShowTimerEventHandler() {
    document.getElementById('showTimerBtn').addEventListener('click', () => this._handleClickShowTimer());

    return this;
  }

  cleanUp() {
    clearInterval(this.interval);
  }

  _handleInputChangeEvent(node) {
    this._removeErrorSignals();
    this._handleUserValueError(this.board.getInvalidNodes());

    if (node.userValueIsCorrect() && this.board.isComplete()) {
      this._handleSudokuComplete();
    }
  }

  _handleSudokuComplete() {
    clearInterval(this.interval);
    document.getElementById('gameOverTitle').innerText = 'Congratulations, You Solved It!';
    document.getElementById(
      'gameOverMessage',
    ).innerText = `Time: ${this.board.getElapsedTime()}s\nNumber of Hints Used: ${this.board.numHints}`;
    openModal('gameOverModal');
  }

  _handleClickResetButton() {
    clearInterval(this.interval);
    this.board.reset();
    this._startTimer();
    this.board.addNodeInputEventListeners('change', (node) => this._handleInputChangeEvent(node));
  }

  _handleClickHintButton() {
    this._handleInputChangeEvent(this.board.getHint());
  }

  _handleUserValueError(nodes) {
    nodes.forEach((node) => {
      node.addErrorBorder();
    });

    const {errorRowCounts, errorColCounts, errorBoxCounts} = this._getErrorCounts(nodes);
    this._addErrorSections(errorRowCounts, errorColCounts, errorBoxCounts);
  }

  _getErrorCounts(nodes) {
    const errorRowCounts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
    const errorColCounts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
    const errorBoxCounts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        if (node1.getValue() == node2.getValue()) {
          if (node1.row == node2.row) {
            errorRowCounts[node1.row]++;
          }

          if (node1.col == node2.col) {
            errorColCounts[node1.col]++;
          }

          const boxIdx1 = this.board.calcBoxIdx(node1.row, node1.col);
          const boxIdx2 = this.board.calcBoxIdx(node2.row, node2.col);
          if (boxIdx1 == boxIdx2) {
            errorBoxCounts[boxIdx1]++;
          }
        }
      }
    }

    return {errorRowCounts, errorColCounts, errorBoxCounts};
  }

  _addErrorSections(errorRowCounts, errorColCounts, errorBoxCounts) {
    this.board.nodes.forEach((node) => {
      for (let i = 0; i < errorRowCounts[node.row]; i++) {
        node.addErrorSection();
      }

      for (let i = 0; i < errorColCounts[node.col]; i++) {
        node.addErrorSection();
      }

      for (let i = 0; i < errorBoxCounts[this.board.calcBoxIdx(node.row, node.col)]; i++) {
        node.addErrorSection();
      }
    });
  }

  _removeErrorSignals() {
    this.board.nodes.forEach((node) => node.clearErrors());
  }

  _handleClickShowTimer() {
    const element = document.getElementById('timer');
    element.hidden = !element.hidden;
  }

  _startTimer() {
    this.interval = setInterval(() => {
      const elapsedTime = this.board.getElapsedTime();
      const seconds = Math.floor(elapsedTime);
      const milliseconds = Math.floor((elapsedTime % 1) * 10);
      document.getElementById('elapsedTime').innerText = `${seconds}.${milliseconds}`;
    }, 1);
  }
}
