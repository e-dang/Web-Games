const Board = require('./board');
const SnakeGameNode = require('./nodes/snake_game_node');
const {Snake} = require('./snake');
const utils = require('../utils/utils');

const DIMENSIONS = 16;
const TIME_STEP = 20;
const MOVE_TIME_STEP = 120;

const UP_ARROW = 'ArrowUp';
const DOWN_ARROW = 'ArrowDown';
const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';
const W = 'w';
const A = 'a';
const S = 's';
const D = 'd';

class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeGameNode);
        this.snake = null;
        this.keys = {};

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

    async start() {
        this.snake = new Snake(this.board);
        this._placeFood(this.snake.getHead().row, this.board.dims - 5);

        this._gameLoop();
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
                    this._placeFood();
                }
                this.snake.move();
            }

            if (this.snake.getLength() === this.board.nodes.length) {
                return;
            }

            i++;
            await utils.sleep(TIME_STEP);
        }
    }

    _handleFailure() {
        document.getElementById('gameOverTitle').innerText = 'Game Over!';
        document.getElementById('gameOverMessage').innerText = `Your score is ${this.snake.getLength()}`;
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

module.exports = {SnakeGame, DIMENSIONS, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, W, A, S, D};
