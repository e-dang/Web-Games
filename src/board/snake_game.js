const Board = require('./board');
const SnakeGameNode = require('./nodes/snake_game_node');
const {Snake} = require('./snake');
const utils = require('../utils/utils');

DIMENSIONS = 20;

class SnakeGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SnakeGameNode);

        this.board.draw();
    }

    async start() {
        const snake = new Snake(this.board);
        this._placeFood(snake.getHead().row, this.board.dims - 5);
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
