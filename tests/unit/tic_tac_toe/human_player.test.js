const HumanPlayer = require('../../../src/tic_tac_toe/human_player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');
jest.mock('../../../src/tic_tac_toe/tic_tac_toe_node');

describe('test HumanPlayer', () => {
    let player;
    let origSymbol;
    let board;
    let getCurrentTurn;

    beforeEach(() => {
        board = new TicTacToeBoard();
        getCurrentTurn = jest.fn();
        origSymbol = 'x';
        player = new HumanPlayer(board, getCurrentTurn, origSymbol);
    });

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(HumanPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(HumanPlayer, mock);
        const origMethod = HumanPlayer.prototype._addNodeClickEventListeners;
        HumanPlayer.prototype._addNodeClickEventListeners = jest.fn();

        player = new HumanPlayer(board, getCurrentTurn, origSymbol);

        HumanPlayer.prototype._addNodeClickEventListeners = origMethod;
        Object.setPrototypeOf(HumanPlayer, orig);
        expect(mock).toHaveBeenCalledWith(board, getCurrentTurn, origSymbol);
    });

    test('constructor sets isTurnComplete to false', () => {
        expect(player.isTurnComplete).toBe(false);
    });

    test('_addNodeClickEventListeners calls addNodeClickEventListeners on board property', () => {
        player.board.addNodeClickEventListeners = jest.fn();

        player._addNodeClickEventListeners();

        expect(player.board.addNodeClickEventListeners).toHaveBeenCalledTimes(1);
    });

    test('_handleNodeClickEvent calls _setAsMyNode with node param if isMyTurn returns true and node.isEmptyNode returns true', () => {
        const node = new TicTacToeNode();
        node.isEmptyNode.mockReturnValueOnce(true);
        player.isMyTurn = jest.fn().mockReturnValueOnce(true);
        player._setAsMyNode = jest.fn();

        player._handleNodeClickEvent(node);

        expect(player._setAsMyNode).toHaveBeenCalledWith(node);
    });

    test.each([
        [true, false],
        [false, true],
        [false, false],
    ])(
        '_handleNodeClickEvent doesnt call _setAsMyNode with node param if isMyTurn returns %s and node.isEmptyNode returns %s',
        (isEmpty, isMyTurn) => {
            const node = new TicTacToeNode();
            node.isEmptyNode.mockReturnValueOnce(isEmpty);
            player.isMyTurn = jest.fn().mockReturnValueOnce(isMyTurn);
            player._setAsMyNode = jest.fn();

            player._handleNodeClickEvent(node);

            expect(player._setAsMyNode).not.toHaveBeenCalled();
        },
    );

    test('_setAsMyNode sets isTurnComplete to true', () => {
        player.isTurnComplete = false;
        const node = new TicTacToeNode();

        player._setAsMyNode(node);

        expect(player.isTurnComplete).toBe(true);
    });

    test('makeMove sets isTurnComplete to false after is set to true', async (done) => {
        player.isTurnComplete = false;

        const promise = player.makeMove();
        player.isTurnComplete = true;
        await promise;

        expect(player.isTurnComplete).toBe(false);
        done();
    });
});
