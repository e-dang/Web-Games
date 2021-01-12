const EasyComputerPlayer = require('../../../src/tic_tac_toe/easy_comp_player');
const HumanPlayer = require('../../../src/tic_tac_toe/human_player');
const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToeGame = require('../../../src/tic_tac_toe/tic_tac_toe_game');
const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');
const {X, O} = require('../../../src/tic_tac_toe/constants');

jest.mock('../../../src/tic_tac_toe/easy_comp_player');
jest.mock('../../../src/tic_tac_toe/human_player');
jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');
jest.mock('../../../src/tic_tac_toe/tic_tac_toe_node');

describe('test TicTacToeGame', () => {
    let game;

    beforeEach(() => {
        game = new TicTacToeGame();
    });

    test('constructor sets board prop to instance of TicTacToeBoard', () => {
        expect(game.board).toBeInstanceOf(TicTacToeBoard);
    });

    test('constructor sets humanPlayer to instance of HumanPlayer', () => {
        expect(game.humanPlayer).toBeInstanceOf(HumanPlayer);
    });

    test('constructor sets compPlayer to instance of EasyComputerPlayer', () => {
        expect(game.compPlayer).toBeInstanceOf(EasyComputerPlayer);
    });

    test('constructor calls draw on board', () => {
        expect(game.board.draw).toHaveBeenCalledTimes(1);
    });

    test('reset calls clear on board property', () => {
        game.start = jest.fn();

        game.reset();

        expect(game.board.clear).toHaveBeenCalledTimes(1);
    });

    test('reset sets currentTurn to X', () => {
        game.currentTurn = O;
        game.start = jest.fn();

        game.reset();

        expect(game.currentTurn).toBe(X);
    });

    test('reset sets winner to null', () => {
        game.winner = 1;
        game.start = jest.fn();

        game.reset();

        expect(game.winner).toBeNull();
    });

    test('reset calls start', () => {
        game.start = jest.fn();

        game.reset();

        expect(game.start).toHaveBeenCalled();
    });

    test('setHumanPlayerSymbolAsX calls useXSymbol on humanPlayer', () => {
        game.reset = jest.fn();

        game.setHumanPlayerSymbolAsX();

        expect(game.humanPlayer.useXSymbol).toHaveBeenCalledTimes(1);
    });

    test('setHumanPlayerSymbolAsX calls useOSymbol on compPlayer', () => {
        game.reset = jest.fn();

        game.setHumanPlayerSymbolAsX();

        expect(game.compPlayer.useOSymbol).toHaveBeenCalledTimes(1);
    });

    test('setHumanPlayerSymbolAsO calls useXSymbol on compPlayer', () => {
        game.reset = jest.fn();

        game.setHumanPlayerSymbolAsO();

        expect(game.compPlayer.useXSymbol).toHaveBeenCalledTimes(1);
    });

    test('setHumanPlayerSymbolAsO calls useOSymbol on humanPlayer', () => {
        game.reset = jest.fn();

        game.setHumanPlayerSymbolAsO();

        expect(game.humanPlayer.useOSymbol).toHaveBeenCalledTimes(1);
    });

    test('getCurrentTurn returns the value of currentTurn', () => {
        game.currentTurn = X;

        const retVal = game.getCurrentTurn();

        expect(retVal).toBe(game.currentTurn);
    });

    test('_isComputersTurn returns the return value of compPlayer.isMyTurn', () => {
        const mockRetVal = 1;
        game.compPlayer.isMyTurn.mockReturnValue(mockRetVal);

        const retVal = game._isComputersTurn();

        expect(retVal).toBe(mockRetVal);
    });

    test('_changeTurns sets currentTurn to "x" if currentTurn is "o"', () => {
        game.currentTurn = O;

        game._changeTurns();

        expect(game.currentTurn).toBe(X);
    });

    test('_changeTurns sets currentTurn to "o" if currentTurn is "x"', () => {
        game.currentTurn = X;

        game._changeTurns();

        expect(game.currentTurn).toBe(O);
    });

    test.each([
        ['compPlayer', false],
        ['humanPlayer', true],
    ])('_getXPlayer returns %s if humanPlayer.isXPlayer returns %s', (player, returnValue) => {
        game.humanPlayer.isXPlayer.mockReturnValue(returnValue);

        const retVal = game._getXPlayer();

        expect(retVal).toBe(game[player]);
    });

    test.each([
        ['compPlayer', false],
        ['humanPlayer', true],
    ])('_getOPlayer returns %s if humanPlayer.isOPlayer returns %s', (player, returnValue) => {
        game.humanPlayer.isOPlayer.mockReturnValue(returnValue);

        const retVal = game._getOPlayer();

        expect(retVal).toBe(game[player]);
    });

    test.each([
        ['_getXPlayer', 3],
        ['_getOPlayer', -3],
    ])('_setWinner sets winner property to the return value of %s if sum parameter is %d', (method, sum) => {
        game.winner = null;
        const retVal = jest.mock();
        game[method] = jest.fn().mockReturnValueOnce(retVal);

        game._setWinner(sum);

        expect(game.winner).toBe(retVal);
    });

    test('_getSum returns the sum of the nodes values', () => {
        const nodes = [new TicTacToeNode(), new TicTacToeNode(), new TicTacToeNode()];
        nodes.forEach((node) => (node.value = 1));

        const retVal = game._getSum(nodes);

        expect(retVal).toBe(3);
    });

    test('decide winner returns true if winner is not null', () => {
        game._setWinner = jest.fn();
        game._getSum = jest.fn();
        game.winner = game.compPlayer;

        const retVal = game._decideWinner([]);

        expect(retVal).toBe(true);
    });

    test('decide winner returns false if winner is null', () => {
        game._setWinner = jest.fn();
        game._getSum = jest.fn();
        game.winner = null;

        const retVal = game._decideWinner([]);

        expect(retVal).toBe(false);
    });

    test.each([1, 2, 3, 4, 5, 6, 7, 8])(
        '_isGameComplete returns true if _decideWinner returns true on the %d call',
        (numCalls) => {
            let count = 1;
            game.board.dims = 3;
            game._decideWinner = jest.fn(() => {
                if (count == numCalls) {
                    return true;
                }
                count++;
            });

            const retVal = game._isGameComplete();

            expect(retVal).toBe(true);
        },
    );

    test('_isGameComplete returns true if _decideWinner always returns false and board.getEmptyNodes returns array of length == 0', () => {
        game.board.dims = 3;
        game._decideWinner = jest.fn(() => false);
        game.board.getEmptyNodes.mockReturnValue([]);

        const retVal = game._isGameComplete();

        expect(retVal).toBe(true);
    });

    test('_isGameComplete returns false if _decideWinner always returns false and board.getEmptyNodes returns array of length > 0', () => {
        game.board.dims = 3;
        game._decideWinner = jest.fn(() => false);
        game.board.getEmptyNodes.mockReturnValue([1]);

        const retVal = game._isGameComplete();

        expect(retVal).toBe(false);
    });

    test.each([
        ['setDifficultyEasy', EasyComputerPlayer],
        ['setDifficultyModerate', EasyComputerPlayer],
        ['setDifficultyHard', EasyComputerPlayer],
    ])('%s calls callback function and sets compPlayer to instance of %s', (method, klass) => {
        const fn = jest.fn();

        game[method](fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(game.compPlayer).toBeInstanceOf(klass);
    });

    test.each([
        [true, O],
        [false, X],
    ])('_getComputerSymbol returns the opposite symbol of humanPlayer', (mockRetVal, expected) => {
        game.humanPlayer.isXPlayer.mockReturnValueOnce(mockRetVal);

        const retVal = game._getComputerSymbol();

        expect(retVal).toBe(expected);
    });
});
