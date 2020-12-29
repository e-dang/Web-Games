const PageController = require('../../../src/core/page_controller');
const {SnakeGame} = require('../../../src/board/snake_game');
const {cacheHTML, clearHTML} = require('../utils');

const loadHTML = cacheHTML('index.html');

jest.mock('../../../src/board/snake_game');

describe('Test PageController', () => {
    let controller;
    let gameType;

    beforeEach(() => {
        loadHTML();
        gameType = 'snake';
        controller = new PageController(gameType);

        SnakeGame.mockClear();
    });

    afterEach(() => {
        clearHTML();
    });

    test('constructor sets game prop to the return value of _gameFromString', () => {
        const retVal = new SnakeGame();
        const orig = PageController.prototype._gameFromString;
        const mock = jest.fn((x) => retVal);
        PageController.prototype._gameFromString = mock;

        controller = new PageController(gameType);

        PageController.prototype._gameFromString = orig;
        expect(controller.game).toBe(retVal);
    });

    test('constructor calls addEventListeners', () => {
        const orig = PageController.prototype.addEventListeners;
        const mock = jest.fn();
        PageController.prototype.addEventListeners = mock;

        controller = new PageController(gameType);

        PageController.prototype.addEventListeners = orig;
        expect(mock).toHaveBeenCalledTimes(1);
    });

    test('_handleClickStartBtn is called when startBtn is pressed', () => {
        controller._handleClickStartBtn = jest.fn();

        document.getElementById('startBtn').click();

        expect(controller._handleClickStartBtn).toHaveBeenCalledTimes(1);
    });

    test('_handleClickStartBtn disables startBtn', () => {
        const element = document.getElementById('startBtn');
        const event = {
            target: element,
        };

        controller._handleClickStartBtn(event);

        expect(element).not.toBeEnabled();
    });

    test('_handleClickStartBtn calls start on game prop', () => {
        const element = document.getElementById('startBtn');
        const event = {
            target: element,
        };

        controller._handleClickStartBtn(event);

        expect(controller.game.start).toHaveBeenCalledTimes(1);
    });

    test('_gameFromString returns a new SnakeGame object when parameter is snake', () => {
        const type = 'snake';

        const retVal = controller._gameFromString(type);

        expect(retVal).toBeInstanceOf(SnakeGame);
    });

    test('_gameFromString returns null when parameter doesnt match a type', () => {
        const type = 'acnawndajnwdfgrfgrg';

        const retVal = controller._gameFromString(type);

        expect(retVal).toBeNull();
    });
});
