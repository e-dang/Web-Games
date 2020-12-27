const Board = require('../../../src/board/board');
const BoardController = require('../../../src/board/board_controller');
const Node = require('../../../src/board/nodes/node');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../../../public/index.html'), 'utf8');

jest.mock('../../../src/board/board');
jest.mock('../../../src/board/nodes/node');

describe('Test BoardController', () => {
    let controller;
    let dims;
    let nodeType;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        dims = 10;
        nodeType = Node;
        controller = new BoardController(dims, nodeType);
    });

    afterEach(() => {
        document.documentElement.innerHTML = '';
    });

    test('constructor creates a new Board object with dims and nodeType parameter', () => {
        expect(Board).toHaveBeenCalledWith(dims, nodeType);
    });

    test('constructor calls draw on board prop', () => {
        expect(controller.board.draw).toHaveBeenCalledTimes(1);
    });

    test('constructor calls addEventListeners', () => {
        const orig = BoardController.prototype.addEventListeners;
        const mock = jest.fn();
        BoardController.prototype.addEventListeners = mock;

        controller = new BoardController(dims, nodeType);

        BoardController.prototype.addEventListeners = orig;
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
});
