const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToePage = require('../../../src/tic_tac_toe/tic_tac_toe_page');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test TicTacToePage', () => {
    let page;

    beforeEach(() => {
        page = new TicTacToePage();
    });

    test('constructor sets board property to a TicTacToeBoard object', () => {
        expect(page.board).toBeInstanceOf(TicTacToeBoard);
    });

    test('constructor calls draw on board', () => {
        expect(page.board.draw).toHaveBeenCalledTimes(1);
    });
});
