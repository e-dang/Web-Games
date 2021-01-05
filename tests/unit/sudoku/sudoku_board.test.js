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

    test('isComplete returns true when all nodes have correct user values', () => {
        for (let i = 0; i < dims; i++) {
            const node = new SudokuGameNode();
            node.userValueIsCorrect.mockReturnValueOnce(true);
            board.nodes.push(node);
        }

        const retVal = board.isComplete();

        expect(retVal).toBe(true);
    });

    test('isComplete returns false when at least one node doesnt have correct user value', () => {
        for (let i = 0; i < dims; i++) {
            const node = new SudokuGameNode();
            if (i != 0) {
                node.userValueIsCorrect.mockReturnValueOnce(true);
            } else {
                node.userValueIsCorrect.mockReturnValueOnce(false);
            }
            board.nodes.push(node);
        }

        const retVal = board.isComplete();

        expect(retVal).toBe(false);
    });
});
