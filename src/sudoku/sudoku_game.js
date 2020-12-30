const Board = require('../core/board');
const SudokuGameNode = require('./sudoku_game_node');

DIMENSIONS = 9;

class SudokuGame {
    constructor() {
        this.board = new Board(DIMENSIONS, SudokuGameNode);

        this.board.draw();
    }
}

module.exports = {SudokuGame, DIMENSIONS};
