const {Dequeue} = require('../utils/dequeue');

INITIAL_LENGTH = 3;

RIGHT = [0, 1];
LEFT = [0, -1];
UP = [-1, 0];
DOWN = [1, 0];

class Snake {
    constructor(board) {
        this.body = new Dequeue();
        this.direction = RIGHT;
        this.board = board;

        this._initSnake();
    }

    getNextMove() {
        const [dr, dc] = this.direction;
        const head = this.getHead();
        return {row: head.row + dr, col: head.col + dc};
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
    }

    getHead() {
        return this.body.peekFront();
    }

    _initSnake() {
        const row = this.board.dims / 2 - 1;
        for (let i = 0; i < INITIAL_LENGTH; i++) {
            const node = this.board.getNode(row, i);
            node.setAsSnakeNode();
            this.body.pushFront(node);
        }

        this.getHead().setAsHeadNode();
    }
}

module.exports = {
    INITIAL_LENGTH,
    Snake,
};
