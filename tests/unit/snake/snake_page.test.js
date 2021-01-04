const SnakePage = require('../../../src/snake/snake_page');
const {SnakeGame} = require('../../../src/snake/snake_game');
const {loadHTML, clearHTML} = require('../utils');

jest.mock('../../../src/snake/snake_game');

describe('Test SnakePage', () => {
    let page;

    beforeEach(async (done) => {
        await loadHTML('/');
        page = new SnakePage();
        SnakeGame.mockClear();
        done();
    });

    afterEach(() => {
        clearHTML();
    });

    test('constructor sets game prop to instance of SnakeGame', () => {
        expect(page.game).toBeInstanceOf(SnakeGame);
    });

    test('constructor calls addEventListeners', () => {
        const orig = SnakePage.prototype.addEventListeners;
        const mock = jest.fn();
        SnakePage.prototype.addEventListeners = mock;

        page = new SnakePage();

        SnakePage.prototype.addEventListeners = orig;
        expect(mock).toHaveBeenCalledTimes(1);
    });

    test('_handleClickStartBtn is called when startBtn is pressed', () => {
        page._handleClickStartBtn = jest.fn();

        document.getElementById('startBtn').click();

        expect(page._handleClickStartBtn).toHaveBeenCalledTimes(1);
    });

    test('_handleClickStartBtn disables startBtn', () => {
        const element = document.getElementById('startBtn');
        const event = {
            target: element,
        };

        page._handleClickStartBtn(event);

        expect(element).not.toBeEnabled();
    });

    test('_handleClickStartBtn calls start on game prop', () => {
        const element = document.getElementById('startBtn');
        const event = {
            target: element,
        };

        page._handleClickStartBtn(event);

        expect(page.game.start).toHaveBeenCalledTimes(1);
    });
});
