const {TicTacToeBoard, TICTACTOE_DIMENSIONS} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');

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
});
