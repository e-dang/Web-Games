import {ModerateComputerPlayer} from './moderate_comp_player';

export class HardComputerPlayer extends ModerateComputerPlayer {
  constructor(board, symbol) {
    super(board, symbol);
  }

  async makeMove() {
    let bestMove;
    let bestScore = -Infinity;
    for (let node of this.board.getEmptyNodes()) {
      this._setAsMyNode(node);
      const score = this._miniMaxAlphaBetaPruning(false, bestScore, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = node;
      }
      node.setAsEmptyNode();
    }

    this._setAsMyNode(bestMove);
  }

  _miniMaxAlphaBetaPruning(isMaximizing, alpha, beta) {
    const winner = this.board.getWinner();
    if (winner != null) {
      return this.scores[winner];
    }

    let bestScore;
    if (isMaximizing) {
      bestScore = alpha;
      for (let node of this.board.getEmptyNodes()) {
        this._setAsMyNode(node);
        bestScore = Math.max(bestScore, this._miniMaxAlphaBetaPruning(false, alpha, beta));
        alpha = Math.max(alpha, bestScore);
        node.setAsEmptyNode();
        if (alpha >= beta) {
          break;
        }
      }
    } else {
      bestScore = beta;
      for (let node of this.board.getEmptyNodes()) {
        this._setAsOpponentNode(node);
        bestScore = Math.min(bestScore, this._miniMaxAlphaBetaPruning(true, alpha, beta));
        beta = Math.min(beta, bestScore);
        node.setAsEmptyNode();
        if (beta <= alpha) {
          break;
        }
      }
    }

    return bestScore;
  }
}
