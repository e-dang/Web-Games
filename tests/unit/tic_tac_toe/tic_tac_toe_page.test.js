const {TicTacToeBoard} = require('../../../src/tic_tac_toe/tic_tac_toe_board');
const TicTacToePage = require('../../../src/tic_tac_toe/tic_tac_toe_page');
const {loadHTML, clearHTML} = require('../utils');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_board');

describe('test TicTacToePage', () => {
    let page;

    beforeEach(async (done) => {
        await loadHTML('/tic-tac-toe');
        page = new TicTacToePage();
        done();
    });

    afterEach(() => {
        clearHTML();
    });

    test('constructor sets board property to a TicTacToeBoard object', () => {
        expect(page.board).toBeInstanceOf(TicTacToeBoard);
    });

    test('constructor calls draw on board', () => {
        expect(page.board.draw).toHaveBeenCalledTimes(1);
    });
});
