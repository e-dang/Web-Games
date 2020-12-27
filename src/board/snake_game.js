const Board = require('./board');
const SnakeGameNode = require('./nodes/snake_game_node');

DIMENSIONS = 20;

class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeGameNode);

        this.board.draw();
    }
}

module.exports = {SnakeGame, DIMENSIONS};
