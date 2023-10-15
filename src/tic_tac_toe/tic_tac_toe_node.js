import {Node} from '../core/node';
import {X, O} from './constants';
export class TicTacToeNode extends Node {
  constructor(row, col, idx, boardRow) {
    super(row, col, idx, boardRow, 'tic-tac-toe-node');
    this.value = 0;
  }

  setAsEmptyNode() {
    super.setAsEmptyNode();
    this.element.innerText = '';
    this.value = 0;
  }

  setAsXNode() {
    this._setAsNodeType(X);
    this.element.innerText = X;
    this.value = 1;
  }

  setAsONode() {
    this._setAsNodeType(O);
    this.element.innerText = O;
    this.value = -1;
  }

  removeTopBorder() {
    this.extraTypes.push('top');
    this.element.classList.add('top');
  }

  removeBottomBorder() {
    this.extraTypes.push('bottom');
    this.element.classList.add('bottom');
  }

  removeRightBorder() {
    this.extraTypes.push('right');
    this.element.classList.add('right');
  }

  removeLeftBorder() {
    this.extraTypes.push('left');
    this.element.classList.add('left');
  }

  addClickEventListener(fn) {
    this.element.addEventListener('click', () => fn(this));
  }
}
