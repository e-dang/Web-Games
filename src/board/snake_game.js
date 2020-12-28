const Board = require('./board');
const SnakeGameNode = require('./nodes/snake_game_node');
const {Snake} = require('./snake');
const utils = require('../utils/utils');

const DIMENSIONS = 20;
const TIME_STEP = 250;

const UP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const W = 87;
const A = 65;
const S = 83;
const D = 68;

class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeGameNode);
        this.snake = null;

        this.board.draw();
        this.addKeyDownEventListener();
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

    addKeyDownEventListener() {
        document.addEventListener('keydown', (event) => {
            if (this.snake !== null) {
                this._handleKeyDown(event);
            }
        });
    }

    async _handleKeyDown(event) {
        if (event.keyCode === UP_ARROW || event.keyCode === W) {
            this.snake.setDirectionUp();
        } else if (event.keyCode === DOWN_ARROW || event.keyCode === S) {
            this.snake.setDirectionDown();
        } else if (event.keyCode === LEFT_ARROW || event.keyCode === A) {
            this.snake.setDirectionLeft();
        } else if (event.keyCode === RIGHT_ARROW || event.keyCode === D) {
            this.snake.setDirectionRight();
        }
    }
}

module.exports = {SnakeGame, DIMENSIONS, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, W, A, S, D};
