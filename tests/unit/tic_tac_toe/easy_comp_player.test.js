const EasyComputerPlayer = require('../../../src/tic_tac_toe/easy_comp_player');

describe('test EasyComputerPlayer', () => {
    let player;
    let origSymbol;

    beforeEach(() => {
        origSymbol = 'x';
        player = new EasyComputerPlayer(origSymbol);
    });

    test('constructor calls Player constructor', () => {
        const orig = Object.getPrototypeOf(EasyComputerPlayer);
        const mock = jest.fn();
        Object.setPrototypeOf(EasyComputerPlayer, mock);

        player = new EasyComputerPlayer(origSymbol);

        Object.setPrototypeOf(EasyComputerPlayer, orig);
        expect(mock).toHaveBeenCalledWith(origSymbol);
    });
});
