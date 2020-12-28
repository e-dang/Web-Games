const Board = require('./board');
const SnakeGameNode = require('./nodes/snake_game_node');
const {Snake} = require('./snake');
const utils = require('../utils/utils');

DIMENSIONS = 20;
TIME_STEP = 250;
class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeGameNode);
        this.snake = null;

        this.board.draw();
    }

    async start() {
        this.snake = new Snake(this.board);
        this._placeFood(this.snake.getHead().row, this.board.dims - 5);

        this._gameLoop();
    }

    async _gameLoop() {
        while (true) {
            let {row, col} = this.snake.getNextMove();
            if (this._isInvalidSpace(row, col)) {
                break;
            }

            if (this.board.getNode(row, col).isFoodNode()) {
                this._placeFood();
            }

            this.snake.move();

            if (this.snake.length === this.board.nodes.length) {
                break;
            }

            await utils.sleep(TIME_STEP);
        }
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
}

module.exports = {SnakeGame, DIMENSIONS};
