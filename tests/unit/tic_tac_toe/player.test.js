const Player = require('../../../src/tic_tac_toe/player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');
const {X, O} = require('../../../src/tic_tac_toe/constants');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');
jest.mock('../../../src/tic_tac_toe/tic_tac_toe_node');

describe('test Player', () => {
    let player;
    let origSymbol;
    let board;

    beforeEach(() => {
        board = new TicTacToeBoard();
        origSymbol = X;
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

        player._setSymbol(X);

        expect(player.symbol).toBe(X);
    });

    test('_setSymbol sets symbol prop to "o" when "o" is passed in', () => {
        player.symbol = null;

        player._setSymbol(O);

        expect(player.symbol).toBe(O);
    });

    test('_setSymbol doesnt set symbol prop when param is not x or o', () => {
        player.symbol = O;

        player._setSymbol('oadawfafdw');

        expect(player.symbol).toBe(O);
    });

    test('useXSymbol calls _setSymbol with "x"', () => {
        player._setSymbol = jest.fn();

        player.useXSymbol();

        expect(player._setSymbol).toHaveBeenCalledWith(X);
    });

    test('useOSymbol calls _setSymbol with "o"', () => {
        player._setSymbol = jest.fn();

        player.useOSymbol();

        expect(player._setSymbol).toHaveBeenCalledWith(O);
    });

    test('_setAsMyNode calls setAsXNode on node param if symbol property is x', () => {
        player.symbol = X;
        const node = new TicTacToeNode();

        player._setAsMyNode(node);

        expect(node.setAsXNode).toHaveBeenCalledTimes(1);
    });

    test('_setAsMyNode calls setAsONode on node param if symbol property is o', () => {
        player.symbol = O;
        const node = new TicTacToeNode();

        player._setAsMyNode(node);

        expect(node.setAsONode).toHaveBeenCalledTimes(1);
    });

    test.each([
        ['isXPlayer', true, X],
        ['isXPlayer', false, O],
        ['isOPlayer', true, O],
        ['isOPlayer', false, X],
    ])('%s returns %s when symbol is %s', (method, expected, symbol) => {
        player.symbol = symbol;

        const retVal = player[method]();

        expect(retVal).toBe(expected);
    });
});
