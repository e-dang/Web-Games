const HardComputerPlayer = require('../../../src/tic_tac_toe/hard_comp_player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test HardComputerPlayer', () => {
    let player;
    let origSymbol = 'x';
    let board = new TicTacToeBoard();

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(HardComputerPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(HardComputerPlayer, mock);

        player = new HardComputerPlayer(board, origSymbol);

        Object.setPrototypeOf(HardComputerPlayer, orig);
        expect(mock).toHaveBeenCalledWith(board, origSymbol);
    });
});
