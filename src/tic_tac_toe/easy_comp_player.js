import {Player} from './player';
import utils from '../utils/utils';

export class EasyComputerPlayer extends Player {
  constructor(board, symbol) {
    super(board, symbol);
  }

  async makeMove() {
    this._setAsMyNode(utils.selectRandom(this.board.getEmptyNodes()));
  }
}
