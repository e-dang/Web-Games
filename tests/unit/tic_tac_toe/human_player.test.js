const HumanPlayer = require('../../../src/tic_tac_toe/human_player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test HumanPlayer', () => {
    let player;
    let origSymbol;
    let board;

    beforeEach(() => {
        board = new TicTacToeBoard();
        origSymbol = 'x';
        player = new HumanPlayer(board, origSymbol);
    });

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(HumanPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(HumanPlayer, mock);

        player = new HumanPlayer(board, origSymbol);

        Object.setPrototypeOf(HumanPlayer, orig);
        expect(mock).toHaveBeenCalledWith(board, origSymbol);
    });
});
