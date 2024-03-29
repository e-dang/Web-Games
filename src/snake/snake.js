import {Dequeue} from '../utils/dequeue';

export const INITIAL_LENGTH = 3;

export const RIGHT = [0, 1];
export const LEFT = [0, -1];
export const UP = [-1, 0];
export const DOWN = [1, 0];

export class Snake {
  constructor(board) {
    this.body = new Dequeue();
    this.direction = RIGHT;
    this.nextDirection = RIGHT;
    this.board = board;

    this._initSnake();
  }

  move() {
    const {row, col} = this.getNextMove();
    const node = this.board.getNode(row, col);
    if (!node.isFoodNode()) {
      this.body.popBack().setAsEmptyNode();
    }

    this.getHead().setAsSnakeNode();
    node.setAsHeadNode();
    this.body.pushFront(node);

    this.direction = this.nextDirection;
  }

  getNextMove() {
    const [dr, dc] = this.direction;
    const head = this.getHead();
    return {row: head.row + dr, col: head.col + dc};
  }

  getHead() {
    return this.body.peekFront();
  }

  getLength() {
    return this.body.length;
  }

  setDirectionUp() {
    if (this.direction !== DOWN) {
      this.nextDirection = UP;
    }
  }

  setDirectionDown() {
    if (this.direction !== UP) {
      this.nextDirection = DOWN;
    }
  }

  setDirectionLeft() {
    if (this.direction !== RIGHT) {
      this.nextDirection = LEFT;
    }
  }

  setDirectionRight() {
    if (this.direction !== LEFT) {
      this.nextDirection = RIGHT;
    }
  }

  _initSnake() {
    const row = Math.floor(this.board.dims / 2) - 1;
    for (let i = 0; i < INITIAL_LENGTH; i++) {
      const node = this.board.getNode(row, i);
      node.setAsSnakeNode();
      this.body.pushFront(node);
    }

    this.getHead().setAsHeadNode();
  }
}
