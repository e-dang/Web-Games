const ModerateComputerPlayer = require('../../../src/tic_tac_toe/moderate_comp_player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_node');
jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test ModerateComputerPlayer', () => {
    let player;
    let origSymbol;
    let board;

    beforeEach(() => {
        board = new TicTacToeBoard();
        origSymbol = 'x';
        player = new ModerateComputerPlayer(board, origSymbol);
    });

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(ModerateComputerPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(ModerateComputerPlayer, mock);

        player = new ModerateComputerPlayer(board, origSymbol);

        Object.setPrototypeOf(ModerateComputerPlayer, orig);
        expect(mock).toHaveBeenCalledWith(board, origSymbol);
    });

    test('_setAsOpponentNode calls setAsONode on node parameter if isXPlayer is true', () => {
        player.isXPlayer = jest.fn().mockReturnValue(true);
        const node = new TicTacToeNode();

        player._setAsOpponentNode(node);

        expect(node.setAsONode).toHaveBeenCalledTimes(1);
    });

    test('_setAsOpponentNode calls setAsXNode on node parameter if isXPlayer is false', () => {
        player.isXPlayer = jest.fn().mockReturnValue(false);
        const node = new TicTacToeNode();

        player._setAsOpponentNode(node);

        expect(node.setAsXNode).toHaveBeenCalledTimes(1);
    });
});
