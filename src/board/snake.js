const Board = require('./board');
const SnakeNode = require('./nodes/snake_node');

DIMENSIONS = 20;

class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeNode);

        this.board.draw();
    }
}

module.exports = {SnakeGame, DIMENSIONS};
