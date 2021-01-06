const SudokuBoard = require('../../../src/sudoku/sudoku_board');
const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');
const SudokuSolver = require('../../../src/sudoku/sudoku_solver');
const utils = require('../../../src/utils/utils');

jest.mock('../../../src/sudoku/sudoku_game_node');

describe('test SudokuSolver', () => {
    let solver;

    beforeEach(() => {
        solver = new SudokuSolver();
    });

    test('_getBit returns the bit at given position when it is 1', () => {
        const bitMap = 2;
        const pos = 1;

        const retVal = solver._getBit(bitMap, pos);

        expect(retVal).toBe(2);
    });

    test('_getBit returns the bit at given position when it is 0', () => {
        const bitMap = 4;
        const pos = 1;

        const retVal = solver._getBit(bitMap, pos);

        expect(retVal).toBe(0);
    });

    test('_clearBit returns the resulting number from changing the bit at the given position from 1 to 0 ', () => {
        const bitMap = 11;
        const pos = 1;

        const retVal = solver._clearBit(bitMap, pos);

        expect(retVal).toBe(9);
    });

    test('_clearBit returns the same bitMap when the it at the given position is already 0', () => {
        const bitMap = 11;
        const pos = 2;

        const retVal = solver._clearBit(bitMap, pos);

        expect(retVal).toBe(bitMap);
    });

    test.each([
        [0, 0, 0],
        [1, 1, 3],
        [2, 2, 6],
        [3, 3, 1],
        [4, 4, 4],
        [5, 5, 7],
        [6, 6, 2],
        [7, 7, 5],
        [8, 8, 8],
    ])('_calcBoxIdx returns %d when row is %d and col is %d', (expected, row, col) => {
        const retVal = solver._calcBoxIdx(row, col);

        expect(retVal).toBe(expected);
    });

    test('_getNextMove returns [row + 1, 0] when col == numCols - 1', () => {
        const row = 1;
        const col = 8;
        const numCols = 9;

        const retVal = solver._getNextMove(row, col, numCols);

        expect(retVal).toEqual([row + 1, 0]);
    });

    test('_getNextMove returns [row, col + 1] when col < numCols - 1', () => {
        const row = 1;
        const col = 6;
        const numCols = 9;

        const retVal = solver._getNextMove(row, col, numCols);

        expect(retVal).toEqual([row, col + 1]);
    });

    test('_getRandValues calls utils.shuffle with arr containing [0, dimensions)', () => {
        const dimensions = 9;
        const arr = [];
        for (let i = 0; i < dimensions; i++) {
            arr.push(i);
        }
        const orig = utils.shuffle;
        const mock = jest.fn();
        utils.shuffle = mock;

        solver._getRandValues(dimensions);

        utils.shuffle = orig;
        expect(mock).toHaveBeenCalledWith(arr);
    });

    test('_getRandValues returns the return value of utils.shuffle', () => {
        const val = [1, 2];
        const orig = utils.shuffle;
        const mock = jest.fn().mockReturnValueOnce(val);
        utils.shuffle = mock;

        const retVal = solver._getRandValues(9);

        utils.shuffle = orig;
        expect(retVal).toEqual(val);
    });

    test('_isNullNode returns true when node.trueValue is null', () => {
        const node = new SudokuGameNode();
        node.trueValue = null;

        const retVal = solver._isNullNode(node);

        expect(retVal).toBe(true);
    });

    test('_isNullNode returns true when node.isInputNode returns true', () => {
        const node = new SudokuGameNode();
        node.isInputNode.mockReturnValueOnce(true);

        const retVal = solver._isNullNode(node);

        expect(retVal).toBe(true);
    });

    test('_isNullNode returns false when node.trueValue is not null and node.isInputNode returns false', () => {
        const node = new SudokuGameNode();
        node.trueValue = 1;
        node.isInputNode.mockReturnValueOnce(false);

        const retVal = solver._isNullNode(node);

        expect(retVal).toBe(false);
    });

    test('solve correctly solves the sudoku board by filling in the answers at node.trueValue property', () => {
        const boardArr = [
            [5, null, null, 8, null, null, null, 2, 7],
            [2, null, null, 4, 6, null, null, null, 3],
            [null, null, null, 5, null, null, 4, 6, null],
            [null, 1, null, null, null, null, null, 9, null],
            [null, null, null, null, null, null, null, null, null],
            [null, 9, null, null, 5, 1, 2, null, null],
            [null, 3, null, null, 7, 2, 6, null, 9],
            [1, 2, null, null, 4, null, null, 3, 8],
            [4, 6, null, null, 3, null, 1, null, null],
        ];
        const board = new SudokuBoard(9);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                node.trueValue = boardArr[i][j];
                board.nodes.push(node);
            }
        }

        solver.solve(board).next();

        const boardSol = [
            [5, 4, 6, 8, 1, 3, 9, 2, 7],
            [2, 7, 1, 4, 6, 9, 5, 8, 3],
            [9, 8, 3, 5, 2, 7, 4, 6, 1],
            [7, 1, 4, 2, 8, 6, 3, 9, 5],
            [3, 5, 2, 7, 9, 4, 8, 1, 6],
            [6, 9, 8, 3, 5, 1, 2, 7, 4],
            [8, 3, 5, 1, 7, 2, 6, 4, 9],
            [1, 2, 9, 6, 4, 5, 7, 3, 8],
            [4, 6, 7, 9, 3, 8, 1, 5, 2],
        ];
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                expect(board.getNode(i, j).trueValue).toBe(boardSol[i][j]);
            }
        }
    });

    test('calcNumSolutions returns the correct number of solutions to the board without changing the values', () => {
        const boardArr = [
            [5, null, null, 8, null, null, null, 2, 7],
            [2, null, null, 4, 6, null, null, null, 3],
            [null, null, null, 5, null, null, 4, 6, null],
            [null, 1, null, null, null, null, null, 9, null],
            [null, null, null, null, null, null, null, null, null],
            [null, 9, null, null, 5, 1, 2, null, null],
            [null, 3, null, null, 7, 2, 6, null, 9],
            [1, 2, null, null, 4, null, null, 3, 8],
            [4, 6, null, null, 3, null, 1, null, null],
        ];
        const board = new SudokuBoard(9);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                node.trueValue = boardArr[i][j];
                board.nodes.push(node);
            }
        }

        const retVal = solver.calcNumSolutions(board);

        expect(retVal).toBe(1);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                expect(board.getNode(i, j).trueValue).toBe(boardArr[i][j]);
            }
        }
    });
});