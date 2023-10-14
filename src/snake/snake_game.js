import {Board} from '../core/board';
import {SnakeGameNode} from './snake_game_node';
import {Snake, INITIAL_LENGTH} from './snake';
import utils from '../utils/utils';

export const DIMENSIONS = 17;
export const TIME_STEP = 20;
export const MOVE_TIME_STEP = TIME_STEP * 6;

export const UP_ARROW = 'ArrowUp';
export const DOWN_ARROW = 'ArrowDown';
export const LEFT_ARROW = 'ArrowLeft';
export const RIGHT_ARROW = 'ArrowRight';
export const W = 'w';
export const A = 'a';
export const S = 's';
export const D = 'd';

export class SnakeGame {
  constructor() {
    this.board = new Board(DIMENSIONS, SnakeGameNode);
    this.snake = null;
    this.keys = {};
    this.highScore = 0;

    this.board.draw();
    this.addKeyDownEventListener();
    this.addKeyUpEventListener();
  }

  addKeyDownEventListener() {
    document.addEventListener('keydown', (event) => {
      if (this.snake !== null) {
        this.keys[event.key] = true;
      }
    });
  }

  addKeyUpEventListener() {
    document.addEventListener('keyup', (event) => {
      if (this.snake !== null) {
        this.keys[event.key] = false;
      }
    });
  }

  async start(callback) {
    this.board.clear();
    this.snake = new Snake(this.board);
    document.getElementById('currentScore').innerText = 0;
    this._placeFood(this.snake.getHead().row, this.board.dims - 6);

    await this._gameLoop();
    callback();
  }

  async _gameLoop() {
    let i = 0;
    while (true) {
      this._changeDirections();

      let {row, col} = this.snake.getNextMove();
      if (this._isInvalidSpace(row, col)) {
        this._handleFailure();
        return;
      }

      if (i % (MOVE_TIME_STEP / TIME_STEP) === 0) {
        if (this.board.getNode(row, col).isFoodNode()) {
          document.getElementById('currentScore').innerText = this.snake.getLength() - INITIAL_LENGTH + 1;
          this._placeFood();
        }
        this.snake.move();
      }

      if (this.snake.getLength() === this.board.nodes.length) {
        this._handleSuccess();
        return;
      }

      i++;
      await utils.sleep(TIME_STEP);
    }
  }

  _handleFailure() {
    document.getElementById('gameOverTitle').innerText = 'Game Over!';
    this._handleGameOver();
  }

  _handleSuccess() {
    document.getElementById('gameOverTitle').innerText = 'Congratulations, You Won!';
    this._handleGameOver();
  }

  _handleGameOver() {
    const score = this.snake.getLength() - INITIAL_LENGTH;
    if (score > this.highScore) {
      document.getElementById('highScore').innerText = score;
    }
    document.getElementById('gameOverMessage').innerText = `Your score is ${score}`;
    $('#gameOverModal').modal();
  }

  _isInvalidSpace(row, col) {
    return this.board.isInvalidSpace(row, col) || this.board.getNode(row, col).isSnakeNode();
  }

  _placeFood(row = null, col = null) {
    let node;
    if (row !== null && col !== null) {
      node = this.board.getNode(row, col);
    } else {
      node = this._getRandomEmptyNode();
    }

    node.setAsFoodNode();
  }

  _getRandomEmptyNode() {
    const emptyNodes = this.board.nodes.reduce((accum, node) => {
      if (node.isEmptyNode()) {
        accum.push(node);
      }

      return accum;
    }, []);

    return utils.selectRandom(emptyNodes);
  }

  _changeDirections() {
    if (this.keys[UP_ARROW] || this.keys[W]) {
      this.snake.setDirectionUp();
    } else if (this.keys[DOWN_ARROW] || this.keys[S]) {
      this.snake.setDirectionDown();
    } else if (this.keys[LEFT_ARROW] || this.keys[A]) {
      this.snake.setDirectionLeft();
    } else if (this.keys[RIGHT_ARROW] || this.keys[D]) {
      this.snake.setDirectionRight();
    }
  }
}
