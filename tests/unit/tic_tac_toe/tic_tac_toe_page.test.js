const TicTacToeGame = require('../../../src/tic_tac_toe/tic_tac_toe_game');
const TicTacToePage = require('../../../src/tic_tac_toe/tic_tac_toe_page');
const {loadHTML, clearHTML} = require('../utils');

jest.mock('../../../src/tic_tac_toe/tic_tac_toe_game');

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

    test('constructor sets game prop to TicTacToeGame object', () => {
        expect(page.game).toBeInstanceOf(TicTacToeGame);
    });

    test('_handleClickResetButton calls reset on game property', () => {
        expect(page.game.reset).toHaveBeenCalledTimes(1);
    });

    test.each(['x', 'o'])('_handleChangeSymbol is called when %s button is clicked', (symbol) => {
        page._handleChangeSymbol = jest.fn();

        document.getElementById(symbol).click();

        expect(page._handleChangeSymbol).toHaveBeenCalledTimes(1);
    });

    test('_handleChangeSymbol calls setHumanPlayerSymbolAsX on game when event.target.id is x', () => {
        page._handleChangeSymbol({target: {id: 'x'}});

        expect(page.game.setHumanPlayerSymbolAsX).toHaveBeenCalledTimes(1);
    });

    test('_handleChangeSymbol calls setHumanPlayerSymbolAsO on game when event.target.id is o', () => {
        page._handleChangeSymbol({target: {id: 'o'}});

        expect(page.game.setHumanPlayerSymbolAsO).toHaveBeenCalledTimes(1);
    });
});
