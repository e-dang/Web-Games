const SudokuBoard = require('../../../src/sudoku/sudoku_board');
const SudokuPage = require('../../../src/sudoku/sudoku_page');

jest.mock('../../../src/sudoku/sudoku_board');

describe('test SudokuPage', () => {
    let page;

    beforeEach(() => {
        page = new SudokuPage();
    });

    test('constructor sets board prop to an instance of SudokuBoard', () => {
        expect(page.board).toBeInstanceOf(SudokuBoard);
    });

    test('constructor calls draw method on board property', () => {
        expect(page.board.draw).toHaveBeenCalledTimes(1);
    });

    test('constructor calls reset method on board property', () => {
        expect(page.board.reset).toHaveBeenCalledTimes(1);
    });
});
