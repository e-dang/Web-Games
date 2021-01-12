const EasyComputerPlayer = require('../../../src/tic_tac_toe/easy_comp_player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const utils = require('../../../src/utils/utils');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test EasyComputerPlayer', () => {
    let player;
    let origSymbol;
    let board;

    beforeEach(() => {
        board = new TicTacToeBoard();
        origSymbol = 'x';
        player = new EasyComputerPlayer(board, origSymbol);
    });

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(EasyComputerPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(EasyComputerPlayer, mock);

        player = new EasyComputerPlayer(board, origSymbol);

        Object.setPrototypeOf(EasyComputerPlayer, orig);
        expect(mock).toHaveBeenCalledWith(board, origSymbol);
    });

    test('makeMove calls _setAsMyNode with return value of selectRandom', async () => {
        const retVal = jest.fn();
        utils.selectRandom = jest.fn().mockReturnValue(retVal);
        player._setAsMyNode = jest.fn();

        await player.makeMove();

        expect(player._setAsMyNode).toHaveBeenCalledWith(retVal);
    });
});
