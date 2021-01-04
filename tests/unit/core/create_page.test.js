const createPage = require('../../../src/core/create_page');
const SnakePage = require('../../../src/snake/snake_page');
const {SudokuGame} = require('../../../src/sudoku/sudoku_game');

jest.mock('../../../src/snake/snake_page');
jest.mock('../../../src/sudoku/sudoku_game');

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

    test('createPage returns a new SudokuGame object when parameter is Sudoku', () => {
        const type = 'Sudoku';

        const retVal = createPage(type);

        expect(retVal).toBeInstanceOf(SudokuGame);
    });
});
