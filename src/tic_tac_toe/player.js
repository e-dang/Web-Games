import {X, O} from './constants';

export class Player {
  constructor(board, symbol) {
    this.board = board;
    this._setSymbol(symbol);
  }

  useXSymbol() {
    this._setSymbol(X);
  }

  useOSymbol() {
    this._setSymbol(O);
  }

  isXPlayer() {
    return this.symbol == X;
  }

  isOPlayer() {
    return this.symbol == O;
  }

  _setAsMyNode(node) {
    if (this.symbol == X) {
      node.setAsXNode();
    } else {
      node.setAsONode();
    }
  }

  _setSymbol(symbol) {
    if (symbol == X || symbol == O) {
      this.symbol = symbol;
    }
  }
}
