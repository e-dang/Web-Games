const SudokuBoard = require('../../../src/sudoku/sudoku_board');
const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');
const SudokuSolver = require('../../../src/sudoku/sudoku_solver');
const {millisecondsToSeconds} = require('../../../src/utils/utils');

jest.mock('../../../src/sudoku/sudoku_game_node');
jest.mock('../../../src/sudoku/sudoku_solver');

describe('Test SudokuBoard', () => {
    let board;
    let dims;

    beforeEach(() => {
        dims = 9;
        board = new SudokuBoard(dims);
    });

    afterEach(() => {
        SudokuGameNode.mockClear();
        SudokuSolver.mockClear();
    });

    test('constructor calls Board constructor with dimensions param and SudokuGameNode', () => {
        const orig = Object.getPrototypeOf(SudokuBoard);
        const mock = jest.fn();
        Object.setPrototypeOf(SudokuBoard, mock);

        board = new SudokuBoard(dims);

        Object.setPrototypeOf(SudokuBoard, orig);
        expect(mock).toHaveBeenCalledWith(dims, SudokuGameNode);
    });

    test('constructor creates a new SudokuSolver object and sets it to solver prop', () => {
        expect(board.solver).toBeInstanceOf(SudokuSolver);
    });

    test('constructor sets numHints property to 0', () => {
        expect(board.numHints).toBe(0);
    });

    test('constructor sets startTime to Date.now()', () => {
        expect(millisecondsToSeconds(board.startTime)).toBeCloseTo(millisecondsToSeconds(Date.now()), 1);
    });

    describe('test reset', () => {
        beforeEach(() => {
            board.clear = jest.fn();
            board._selectInputNodes = jest.fn();
            board.solver.solve.mockReturnValueOnce({next: jest.fn()});
        });

        test('reset calls clear method', () => {
            board.reset();

            expect(board.clear).toHaveBeenCalledTimes(1);
        });

        test('reset calls solve on solver prop', () => {
            board.reset();

            expect(board.solver.solve).toHaveBeenCalledWith(board);
        });

        test('reset calls _selectInputNodes', () => {
            board.reset();

            expect(board._selectInputNodes).toHaveBeenCalledTimes(1);
        });

        test('reset calls renderTrueValue on each node', () => {
            board.nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];

            board.reset();

            board.nodes.forEach((node) => {
                expect(node.renderTrueValue).toHaveBeenCalledTimes(1);
            });
        });

        test('reset sets numHints property to 0', () => {
            board.numHints = 10;

            board.reset();

            expect(board.numHints).toBe(0);
        });

        test('reset sets startTime to Date.now()', () => {
            expect(millisecondsToSeconds(board.startTime)).toBeCloseTo(millisecondsToSeconds(Date.now()), 1);
        });
    });

    test('isComplete returns true when all input nodes have correct user values', () => {
        for (let i = 0; i < dims; i++) {
            const node = new SudokuGameNode();
            node.userValueIsCorrect.mockReturnValue(true);
            board.nodes.push(node);
        }

        const retVal = board.isComplete();

        expect(retVal).toBe(true);
    });

    test('isComplete returns false when at least one input node doesnt have correct user value', () => {
        for (let i = 0; i < dims; i++) {
            const node = new SudokuGameNode();
            if (i != 0) {
                node.userValueIsCorrect.mockReturnValue(true);
            } else {
                node.userValueIsCorrect.mockReturnValue(false);
            }
            board.nodes.push(node);
        }

        const retVal = board.isComplete();

        expect(retVal).toBe(false);
    });

    test('_getRandNodeOfType returns the node that causes the parameter function to return true', () => {
        const inputNode = new SudokuGameNode();
        const givenNode = new SudokuGameNode();
        const func = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
        board.getNode = jest.fn().mockReturnValueOnce(inputNode).mockReturnValueOnce(givenNode);

        const retVal = board._getRandNodeOfType(func);

        expect(retVal).toBe(givenNode);
    });

    test('_getRandGivenNode calls _getRandNodeOfType with a function that calls isGivenNode method on its parameter', () => {
        const node = new SudokuGameNode();
        board._getRandNodeOfType = jest.fn();

        board._getRandGivenNode();

        expect(board._getRandNodeOfType).toHaveBeenCalledTimes(1);
        board._getRandNodeOfType.mock.calls[0][0](node);
        expect(node.isGivenNode).toHaveBeenCalledTimes(1);
    });

    test('_getRandInputNode calls _getRandNodeOfType with a function that calls isInputNode method on its parameter', () => {
        const node = new SudokuGameNode();
        board._getRandNodeOfType = jest.fn();

        board._getRandInputNode();

        expect(board._getRandNodeOfType).toHaveBeenCalledTimes(1);
        board._getRandNodeOfType.mock.calls[0][0](node);
        expect(node.isInputNode).toHaveBeenCalledTimes(1);
    });

    test('_selectInputNodes calls setAsInputNode as long as board is too easy', () => {
        const node = new SudokuGameNode();
        board.nodes = [node, node, node];
        board._getRandGivenNode = jest.fn(() => node);
        board._isBoardTooEasy = jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
        board.solver.calcNumSolutions.mockReturnValue(2);

        board._selectInputNodes();

        expect(node.setAsInputNode).toHaveBeenCalledTimes(2);
    });

    test('addNodeInputEventListeners calls addInputEventListener on each node', () => {
        board.nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        const type = 'change';
        const fn = jest.fn();

        board.addNodeInputEventListeners(type, fn);

        board.nodes.forEach((node) => {
            expect(node.addInputEventListener).toHaveBeenCalled();
        });
    });

    test('getHint calls setAsGivenNode on node returned by _getRandInputNode', () => {
        const node = new SudokuGameNode();
        board._getRandInputNode = jest.fn(() => node);

        board.getHint();

        expect(node.setAsGivenNode).toHaveBeenCalledTimes(1);
    });

    test('getHint calls renderTrueValue on node returned by _getRandInputNode', () => {
        const node = new SudokuGameNode();
        board._getRandInputNode = jest.fn(() => node);

        board.getHint();

        expect(node.renderTrueValue).toHaveBeenCalledTimes(1);
    });

    test('getHint increments the numHints property', () => {
        const prev = 0;
        board.numHints = prev;
        board._getRandInputNode = jest.fn(() => new SudokuGameNode());

        board.getHint();

        expect(board.numHints).toBe(prev + 1);
    });

    test('getHint returns the node returned by _getRandInputNode', () => {
        const node = new SudokuGameNode();
        board._getRandInputNode = jest.fn(() => node);

        const retVal = board.getHint();

        expect(retVal).toBe(node);
    });

    test.each([['setDifficultyEasy'], ['setDifficultyModerate'], ['setDifficultyHard'], ['setDifficultyVeryHard']])(
        '%s calls callback function',
        (method) => {
            const callback = jest.fn();

            board[method](callback);

            expect(callback).toHaveBeenCalledTimes(1);
        },
    );

    test('_isBoardTooEasy returns true when there are still attempts remaining and the number of givens are at or above the lower bound', () => {
        board.setDifficultyEasy(() => {});
        const attempts = 1;
        const numGivens = board.givensLowerBound;

        const retVal = board._isBoardTooEasy(attempts, numGivens);

        expect(retVal).toBe(true);
    });

    test('_isBoardTooEasy returns true when numGivens is greater than the givensUpperBound', () => {
        board.setDifficultyEasy(() => {});
        const attempts = -1;
        const numGivens = board.givensUpperBound + 1;

        const retVal = board._isBoardTooEasy(attempts, numGivens);

        expect(retVal).toBe(true);
    });

    test('_isBoardTooEasy returns false when numGivens is less than the givensUpperBound and there are no attempts remaining', () => {
        board.setDifficultyEasy(() => {});
        const attempts = 0;
        const numGivens = board.givensUpperBound;

        const retVal = board._isBoardTooEasy(attempts, numGivens);

        expect(retVal).toBe(false);
    });

    test('_isBoardTooEasy returns false when numGivens is less than the givensLowerBound', () => {
        board.setDifficultyEasy(() => {});
        const attempts = 0;
        const numGivens = board.givensLowerBound - 1;

        const retVal = board._isBoardTooEasy(attempts, numGivens);

        expect(retVal).toBe(false);
    });

    test.each([
        ['addBottomBorder', 'row', 2],
        ['addBottomBorder', 'row', 5],
        ['addRightBorder', 'col', 2],
        ['addRightBorder', 'col', 5],
    ])('_initNode calls %s on node param if %s is %d', (method, prop, value) => {
        const node = new SudokuGameNode();
        node[prop] = value;

        board._initNode(node);

        expect(node[method]).toHaveBeenCalledTimes(1);
    });

    test.each([
        [2, 2],
        [2, 5],
        [5, 2],
        [5, 5],
    ])('_initNode calls both border methods if row and col are %s', (row, col) => {
        const node = new SudokuGameNode();
        node.row = row;
        node.col = col;

        board._initNode(node);

        expect(node.addBottomBorder).toHaveBeenCalledTimes(1);
        expect(node.addRightBorder).toHaveBeenCalledTimes(1);
    });

    test('getElapsedTime returns the current time - startTime proeprty', () => {
        const retVal = board.getElapsedTime();

        expect(millisecondsToSeconds(retVal)).toBeCloseTo(millisecondsToSeconds(Date.now() - board.startTime), 1);
    });

    test('getInvalidNodes returns the return value of solver.getInvalidNodes', () => {
        const mock = jest.fn();
        board.solver.getInvalidNodes.mockReturnValueOnce(mock);

        const retVal = board.getInvalidNodes();

        expect(retVal).toBe(mock);
        expect(board.solver.getInvalidNodes).toHaveBeenCalledWith(board);
    });

    test.each([
        [1, 1, 4, 0],
        [5, 5, 8, 4],
        [7, 8, 5, 8],
    ])('getNodeInBox returns node at row %d, col %d for idx %d and boxIdx %d', (row, col, idx, boxIdx) => {
        for (let i = 0; i < board.dims; i++) {
            for (let j = 0; j < board.dims; j++) {
                const node = new SudokuGameNode();
                node.row = i;
                node.col = j;
                board.nodes.push(node);
            }
        }

        const retVal = board.getNodeInBox(idx, boxIdx, board);

        expect(retVal.row).toBe(row);
        expect(retVal.col).toBe(col);
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
    ])('calcBoxIdx returns %d when row is %d and col is %d', (expected, row, col) => {
        const retVal = board.calcBoxIdx(row, col);

        expect(retVal).toBe(expected);
    });

    test('isNodeInvalid returns the return value of board.isNodeInvalid', () => {
        const mock = jest.fn();
        const node = new SudokuGameNode();
        board.solver.isNodeInvalid.mockReturnValueOnce(mock);

        const retVal = board.isNodeInvalid(node);

        expect(board.solver.isNodeInvalid).toHaveBeenCalledWith(board, node);
        expect(retVal).toBe(mock);
    });
});
