const Board = require('../../../src/board/board');
const BoardController = require('../../../src/board/board_controller');
const fs = require('fs');
const path = require('path');
const SnakeNode = require('../../../src/board/nodes/snake_node');

const html = fs.readFileSync(path.resolve(__dirname, '../../../public/index.html'), 'utf8');

jest.mock('../../../src/board/board');

describe('Test BoardController', () => {
    let controller;
    let dims;
    let nodeType;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        dims = 10;
        nodeType = 'snake';
        controller = new BoardController(dims, nodeType);

        Board.mockClear();
    });

    afterEach(() => {
        document.documentElement.innerHTML = '';
    });

    test('constructor creates a new Board object with dims param and return val of _nodeTypeFromString', () => {
        const retVal = SnakeNode;
        const orig = BoardController.prototype._nodeTypeFromString;
        const mock = jest.fn((x) => retVal);
        BoardController.prototype._nodeTypeFromString = mock;

        controller = new BoardController(dims, nodeType);

        BoardController.prototype._nodeTypeFromString = orig;
        expect(Board).toHaveBeenCalledWith(dims, retVal);
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

    test('_nodeTypeFromString returns SnakeNode when parameter is snake', () => {
        const type = 'snake';

        const retVal = controller._nodeTypeFromString(type);

        expect(retVal).toBe(SnakeNode);
    });

    test('_nodeTypeFromString returns null when parameter doesnt match a type', () => {
        const type = 'acnawndajnwdfgrfgrg';

        const retVal = controller._nodeTypeFromString(type);

        expect(retVal).toBeNull();
    });
});
