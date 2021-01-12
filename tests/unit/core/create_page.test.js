const createPage = require('../../../src/core/create_page');
const SnakePage = require('../../../src/snake/snake_page');
const SudokuPage = require('../../../src/sudoku/sudoku_page');
const TicTacToePage = require('../../../src/tic_tac_toe/tic_tac_toe_page');

jest.mock('../../../src/snake/snake_page');
jest.mock('../../../src/sudoku/sudoku_page');
jest.mock('../../../src/tic_tac_toe/tic_tac_toe_page');

describe('test createPage', () => {
    test('createPage returns a new SnakePage object when parameter is "Snake"', () => {
        const type = 'Snake';

        const retVal = createPage(type);

        expect(retVal).toBeInstanceOf(SnakePage);
    });

    test('createPage returns null when parameter doesnt match a type', () => {
        const type = 'acnawndajnwdfgrfgrg';

        const retVal = createPage(type);

        expect(retVal).toBeNull();
    });

    test('createPage returns a new SudokuPage object when parameter is Sudoku', () => {
        const type = 'Sudoku';

        const retVal = createPage(type);

        expect(retVal).toBeInstanceOf(SudokuPage);
    });

    test('createPage returns a new TicTacToePage object when parameter is "Tic Tac Toe', () => {
        const type = 'Tic Tac Toe';

        const retVal = createPage(type);

        expect(retVal).toBeInstanceOf(TicTacToePage);
    });
});
