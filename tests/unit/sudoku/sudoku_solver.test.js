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

    test('hasMoreThanOneSolution returns false when there is only one solution', () => {
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

        const retVal = solver.hasMoreThanOneSolution(board);

        expect(retVal).toBe(false);
    });

    test('hasMoreThanOneSolution returns true when there is more than one solution', () => {
        const boardArr = [
            [null, null, null, 8, null, null, null, 2, 7],
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

        const retVal = solver.hasMoreThanOneSolution(board);

        expect(retVal).toBe(true);
    });

    test('hasMoreThanOneSolution does not mutate original board', () => {
        const boardArr = [
            [null, null, null, 8, null, null, null, 2, 7],
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

        solver.hasMoreThanOneSolution(board);

        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                expect(board.getNode(i, j).trueValue).toBe(boardArr[i][j]);
            }
        }
    });

    test('hasMoreThanOneSolution returns false when given a pruned node and there is only one solution ', () => {
        const boardArr = [
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
        let prunedNode;
        const board = new SudokuBoard(9);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                if (i == 0 && j == 1) {
                    node.isInputNode.mockReturnValue(true);
                    prunedNode = node;
                }
                node.row = i;
                node.col = j;
                node.trueValue = boardArr[i][j];
                board.nodes.push(node);
            }
        }

        const retVal = solver.hasMoreThanOneSolution(board, prunedNode);

        expect(retVal).toBe(false);
    });

    test('hasMoreThanOneSolution returns true when given a pruned node and there is more than one solution', () => {
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
        let prunedNode;
        const board = new SudokuBoard(9);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                if (i == 0 && j == 0) {
                    node.isInputNode.mockReturnValue(true);
                    prunedNode = node;
                }
                node.row = i;
                node.col = j;
                node.trueValue = boardArr[i][j];
                board.nodes.push(node);
            }
        }

        const retVal = solver.hasMoreThanOneSolution(board, prunedNode);

        expect(retVal).toBe(true);
    });

    test('hasMoreThanOneSolution does not mutate original board when given a pruned node', () => {
        const boardArr = [
            [null, null, null, 8, null, null, null, 2, 7],
            [2, null, null, 4, 6, null, null, null, 3],
            [null, null, null, 5, null, null, 4, 6, null],
            [null, 1, null, null, null, null, null, 9, null],
            [null, null, null, null, null, null, null, null, null],
            [null, 9, null, null, 5, 1, 2, null, null],
            [null, 3, null, null, 7, 2, 6, null, 9],
            [1, 2, null, null, 4, null, null, 3, 8],
            [4, 6, null, null, 3, null, 1, null, null],
        ];
        let prunedNode;
        const board = new SudokuBoard(9);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                if (i == 0 && j == 0) {
                    node.isInputNode.mockReturnValue(true);
                    prunedNode = node;
                }
                node.row = i;
                node.col = j;
                node.trueValue = boardArr[i][j];
                board.nodes.push(node);
            }
        }

        solver.hasMoreThanOneSolution(board, prunedNode);

        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                expect(board.getNode(i, j).trueValue).toBe(boardArr[i][j]);
            }
        }
    });

    test('_getDuplicate returns the duplicate node specified by selector', () => {
        const board = new SudokuBoard(3);
        board.nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        board.nodes.forEach((node, idx) => (node.idx = idx));
        board.nodes[0].trueValue = 1;
        board.nodes[1].trueValue = 0;
        board.nodes[2].trueValue = 1;

        const retVal = solver._getDuplicate(
            (col) => board.getNode(0, col),
            board.nodes[0].trueValue,
            board.dims,
            board.nodes[0],
        );

        expect(retVal.idx).toBe(board.nodes[2].idx);
    });

    test('getInvalidNodes returns invalid nodes', () => {
        const boardArr = [
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
        const invalidNodes = [2, 1, 38, 19, 22];
        let idx = 0;
        const board = new SudokuBoard(9);
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                node.idx = ++idx;
                if ((i == 0 && j == 1) || (i == 2 && j == 0)) {
                    node.isGivenNode.mockReturnValue(false);
                    node.isInputNode.mockReturnValue(true);
                    node.getInputValue.mockReturnValue(5);
                } else {
                    node.isGivenNode.mockReturnValue(true);
                    node.isInputNode.mockReturnValue(false);
                }
                node.row = i;
                node.col = j;
                node.trueValue = boardArr[i][j];
                board.nodes.push(node);
            }
        }

        const retVal = solver.getInvalidNodes(board);

        idxs = retVal.map((node) => node.idx);
        invalidNodes.forEach((idx) => {
            expect(idxs).toContain(idx);
        });
    });
});
