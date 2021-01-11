const Player = require('../../../src/tic_tac_toe/player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test Player', () => {
    let player;
    let origSymbol;
    let board;

    beforeEach(() => {
        board = new TicTacToeBoard();
        origSymbol = 'x';
        player = new Player(board, origSymbol);
    });

    test('constructor calls _setSymbol with symbol param', () => {
        const orig = Player.prototype._setSymbol;
        const mock = jest.fn();
        Player.prototype._setSymbol = mock;

        player = new Player(board, origSymbol);

        Player.prototype._setSymbol = orig;
        expect(mock).toHaveBeenCalledWith(origSymbol);
    });

    test('constructor sets board prop to board parameter', () => {
        expect(player.board).toBe(board);
    });

    test('_setSymbol sets symbol prop to "x" when "x" is passed in', () => {
        player.symbol = null;

        player._setSymbol('x');

        expect(player.symbol).toBe('x');
    });

    test('_setSymbol sets symbol prop to "o" when "o" is passed in', () => {
        player.symbol = null;

        player._setSymbol('o');

        expect(player.symbol).toBe('o');
    });

    test('_setSymbol doesnt set symbol prop when param is not x or o', () => {
        player.symbol = 'o';

        player._setSymbol('oadawfafdw');

        expect(player.symbol).toBe('o');
    });

    test('useXSymbol calls _setSymbol with "x"', () => {
        player._setSymbol = jest.fn();

        player.useXSymbol();

        expect(player._setSymbol).toHaveBeenCalledWith('x');
    });

    test('useOSymbol calls _setSymbol with "o"', () => {
        player._setSymbol = jest.fn();

        player.useOSymbol();

        expect(player._setSymbol).toHaveBeenCalledWith('o');
    });
});
