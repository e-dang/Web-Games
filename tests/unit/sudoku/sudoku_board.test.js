const SudokuBoard = require('../../../src/sudoku/sudoku_board');
const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');
const SudokuSolver = require('../../../src/sudoku/sudoku_solver');

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
});
