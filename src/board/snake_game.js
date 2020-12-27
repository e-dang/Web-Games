const Board = require('./board');
const SnakeGameNode = require('./nodes/snake_game_node');
const {Snake} = require('./snake');

DIMENSIONS = 20;

class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeGameNode);

        this.board.draw();
    }

    async start() {
        const snake = new Snake(this.board);
    }
}

module.exports = {SnakeGame, DIMENSIONS};
