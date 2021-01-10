const HumanPlayer = require('../../../src/tic_tac_toe/human_player');

describe('test HumanPlayer', () => {
    let player;
    let origSymbol;

    beforeEach(() => {
        origSymbol = 'x';
        player = new HumanPlayer(origSymbol);
    });

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(HumanPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(HumanPlayer, mock);

        player = new HumanPlayer(origSymbol);

        Object.setPrototypeOf(HumanPlayer, orig);
        expect(mock).toHaveBeenCalledWith(origSymbol);
    });
});
