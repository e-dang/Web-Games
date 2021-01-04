const SudokuBoard = require('./sudoku_board');

DIMENSIONS = 9;

class SudokuPage {
    constructor() {
        this.board = new SudokuBoard(DIMENSIONS);

        this.board.draw();
        this.board.reset();
    }
}

module.exports = SudokuPage;
