const SnakePage = require('../snake/snake_page');
const {SudokuGame} = require('../sudoku/sudoku_game');

function createPage(pageType) {
    if (pageType === 'Snake') {
        return new SnakePage();
    } else if (pageType === 'Sudoku') {
        return new SudokuGame();
    } else {
        return null;
    }
}

module.exports = createPage;
