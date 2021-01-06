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

    test('reset calls clear method', () => {
        board.clear = jest.fn();
        board._selectInputNodes = jest.fn();
        board.solver.solve.mockReturnValueOnce({next: jest.fn()});

        board.reset();

        expect(board.clear).toHaveBeenCalledTimes(1);
    });

    test('reset calls solve on solver prop', () => {
        board.clear = jest.fn();
        board._selectInputNodes = jest.fn();
        board.solver.solve.mockReturnValueOnce({next: jest.fn()});

        board.reset();

        expect(board.solver.solve).toHaveBeenCalledWith(board);
    });

    test('reset calls _selectInputNodes', () => {
        board.clear = jest.fn();
        board._selectInputNodes = jest.fn();
        board.solver.solve.mockReturnValueOnce({next: jest.fn()});

        board.reset();

        expect(board._selectInputNodes).toHaveBeenCalledTimes(1);
    });

    test('reset calls renderTrueValue on each node', () => {
        board.clear = jest.fn();
        board._selectInputNodes = jest.fn();
        board.nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        board.solver.solve.mockReturnValueOnce({next: jest.fn()});

        board.reset();

        board.nodes.forEach((node) => {
            expect(node.renderTrueValue).toHaveBeenCalledTimes(1);
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

    test('_getRandGivenNode returns a given node', () => {
        const inputNode = new SudokuGameNode();
        const givenNode = new SudokuGameNode();
        inputNode.isGivenNode.mockReturnValueOnce(false);
        givenNode.isGivenNode.mockReturnValueOnce(true);
        board.getNode = jest.fn().mockReturnValueOnce(inputNode).mockReturnValueOnce(givenNode);

        const retVal = board._getRandGivenNode();

        expect(retVal).toBe(givenNode);
    });

    test('_selectInputNodes calls setAsInputNode at least attempts number of times', () => {
        const attempts = 2;
        const node = new SudokuGameNode();
        board._getRandGivenNode = jest.fn(() => node);
        board.solver.calcNumSolutions.mockReturnValue(2);

        board._selectInputNodes(attempts);

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
});
