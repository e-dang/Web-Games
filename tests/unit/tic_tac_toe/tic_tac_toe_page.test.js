const TicTacToeGame = require('../../../src/tic_tac_toe/tic_tac_toe_game');
const TicTacToePage = require('../../../src/tic_tac_toe/tic_tac_toe_page');
const {X, O} = require('../../../src/tic_tac_toe/constants');
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
        page._handleClickResetButton();

        expect(page.game.reset).toHaveBeenCalledTimes(1);
    });

    test.each([X, O])('_handleChangeSymbol is called when %s button is clicked', (symbol) => {
        page._handleChangeSymbol = jest.fn();

        document.getElementById(symbol).click();

        expect(page._handleChangeSymbol).toHaveBeenCalledTimes(1);
    });

    test('_handleChangeSymbol calls setHumanPlayerSymbolAsX on game when event.target.id is x', () => {
        page._handleChangeSymbol({target: {id: X}});

        expect(page.game.setHumanPlayerSymbolAsX).toHaveBeenCalledTimes(1);
    });

    test('_handleChangeSymbol calls setHumanPlayerSymbolAsO on game when event.target.id is o', () => {
        page._handleChangeSymbol({target: {id: O}});

        expect(page.game.setHumanPlayerSymbolAsO).toHaveBeenCalledTimes(1);
    });
});
