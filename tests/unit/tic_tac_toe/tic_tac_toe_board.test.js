const {TicTacToeBoard, TICTACTOE_DIMENSIONS} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');
const {X, O, DRAW} = require('../../../src/tic_tac_toe/constants');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_node');

describe('test TicTacToeBoard', () => {
    let board;

    beforeEach(() => {
        board = new TicTacToeBoard();
    });

    test('constructor sets dims to TICTACTOE_DIMENSIONS', () => {
        expect(board.dims).toBe(TICTACTOE_DIMENSIONS);
    });

    test('constructor sets nodeType to TicTacToeNode', () => {
        expect(board.nodeType).toBe(TicTacToeNode);
    });

    test('addNodeClickEventListeners calls addClickEventListener on each node with the function parameter', () => {
        const func = jest.fn();

        board.addNodeClickEventListeners(func);

        board.nodes.forEach((node) => {
            expect(node.addClickEventListener).toHaveBeenCalledTimes(1);
            expect(node.addClickEventListener).toHaveBeenCalledWith(func);
        });
    });

    describe('test generators', () => {
        beforeEach(() => {
            for (let i = 0; i < board.dims; i++) {
                for (let j = 0; j < board.dims; j++) {
                    const node = new TicTacToeNode();
                    node.row = i;
                    node.col = j;
                    board.nodes.push(node);
                }
            }
        });

        test.each([0, 1, 2])('getRow returns the nodes in correct row', (row) => {
            let col = 0;
            for (let node of board.getRow(row)) {
                expect(node.row).toBe(row);
                expect(node.col).toBe(col);
                col++;
            }
        });

        test.each([0, 1, 2])('getCol returns the nodes in correct col', (col) => {
            let row = 0;
            for (let node of board.getCol(col)) {
                expect(node.row).toBe(row);
                expect(node.col).toBe(col);
                row++;
            }
        });

        test('getLeftToRightDiag returns nodes in the correct diagonal', () => {
            let idx = 0;
            for (let node of board.getLeftToRightDiag()) {
                expect(node.row).toBe(idx);
                expect(node.col).toBe(idx);
                idx++;
            }
        });

        test('getRightToLeftDiag returns nodes in the correct diagonal', () => {
            let idx = 0;
            for (let node of board.getRightToLeftDiag()) {
                expect(node.row).toBe(idx);
                expect(node.col).toBe(board.dims - idx - 1);
                idx++;
            }
        });
    });

    test('getEmptyNodes returns all nodes that are empty', () => {
        const emptyNode = new TicTacToeNode();
        const nonEmptyNode = new TicTacToeNode();
        emptyNode.isEmptyNode.mockReturnValueOnce(true);
        nonEmptyNode.isEmptyNode.mockReturnValueOnce(false);
        board.nodes.push(emptyNode);
        board.nodes.push(nonEmptyNode);

        const retVal = board.getEmptyNodes();

        expect(retVal).toEqual([emptyNode]);
    });

    test.each([1, 2, 3, 4, 5, 6, 7, 8])(
        'getWinner returns the return value of _decideWinner %d call if the return value is not null',
        (numCalls) => {
            const mockRetVal = jest.fn();
            let count = 1;
            board._decideWinner = jest.fn(() => {
                if (count == numCalls) {
                    return mockRetVal;
                }
                count++;
            });

            const retVal = board.getWinner();

            expect(retVal).toBe(mockRetVal);
        },
    );

    test('getWinner returns DRAW if _decideWinner always returns null and getEmptyNodes returns array of length == 0', () => {
        board._decideWinner = jest.fn(() => null);
        board.getEmptyNodes = jest.fn().mockReturnValue([]);

        const retVal = board.getWinner();

        expect(retVal).toBe(DRAW);
    });

    test('getWinner returns null if _decideWinner always returns null and getEmptyNodes returns array of length > 0', () => {
        board._decideWinner = jest.fn(() => null);
        board.getEmptyNodes = jest.fn().mockReturnValue([1]);

        const retVal = board.getWinner();

        expect(retVal).toBe(null);
    });

    test.each([
        [X, 3],
        [O, -3],
        [null, 0],
    ])('_decideWinner returns %s if _getSum returns %d', (expected, sum) => {
        board._getSum = jest.fn().mockReturnValue(sum);

        const retVal = board._decideWinner([]);

        expect(retVal).toBe(expected);
    });

    test('_getSum returns the sum of the nodes values', () => {
        const nodes = [new TicTacToeNode(), new TicTacToeNode(), new TicTacToeNode()];
        nodes.forEach((node) => (node.value = 1));

        const retVal = board._getSum(nodes);

        expect(retVal).toBe(3);
    });

    test.each([
        ['removeTopBorder', 'row', 0],
        ['removeBottomBorder', 'row', TICTACTOE_DIMENSIONS - 1],
        ['removeLeftBorder', 'col', 0],
        ['removeRightBorder', 'col', TICTACTOE_DIMENSIONS - 1],
    ])('_initNode calls %s on node parameter if node %s is %d', (method, prop, value) => {
        const node = new TicTacToeNode();
        node[prop] = value;

        board._initNode(node, false);

        expect(node[method]).toHaveBeenCalledTimes(1);
    });
});
