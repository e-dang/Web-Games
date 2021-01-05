const SudokuBoard = require('../../../src/sudoku/sudoku_board');
const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');

jest.mock('../../../src/sudoku/sudoku_game_node');

describe('Test SudokuBoard', () => {
    let board;
    let dims;

    beforeEach(() => {
        dims = 9;
        board = new SudokuBoard(dims);
    });

    afterEach(() => {
        SudokuGameNode.mockClear();
    });

    test('constructor calls Board constructor with dimensions param and SudokuGameNode', () => {
        const orig = Object.getPrototypeOf(SudokuBoard);
        const mock = jest.fn();
        Object.setPrototypeOf(SudokuBoard, mock);

        board = new SudokuBoard(dims);

        Object.setPrototypeOf(SudokuBoard, orig);
        expect(mock).toHaveBeenCalledWith(dims, SudokuGameNode);
    });

    test('reset calls clear method', () => {
        board.getNode = jest.fn().mockReturnValueOnce(new SudokuGameNode());
        board.clear = jest.fn();

        board.reset();

        expect(board.clear).toHaveBeenCalledTimes(1);
    });
});
