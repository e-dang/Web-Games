const SnakePage = require('../snake/snake_page');
const SudokuPage = require('../sudoku/sudoku_page');
const TicTacToePage = require('../tic_tac_toe/tic_tac_toe_page');

function createPage(pageType) {
    if (pageType === 'Snake') {
        return new SnakePage();
    } else if (pageType === 'Sudoku') {
        return new SudokuPage();
    } else if (pageType === 'Tic Tac Toe') {
        return new TicTacToePage();
    } else {
        return null;
    }
}

module.exports = createPage;
