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
});
