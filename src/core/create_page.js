const SnakePage = require('../snake/snake_page');
const SudokuPage = require('../sudoku/sudoku_page');

function createPage(pageType) {
    if (pageType === 'Snake') {
        return new SnakePage();
    } else if (pageType === 'Sudoku') {
        return new SudokuPage();
    } else {
        return null;
    }
}

module.exports = createPage;
