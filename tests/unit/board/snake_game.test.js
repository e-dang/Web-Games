const Board = require('../../../src/board/board');
const SnakeGameNode = require('../../../src/board/nodes/snake_game_node');
const {SnakeGame, DIMENSIONS} = require('../../../src/board/snake_game');
const {Snake} = require('../../../src/board/snake');
const utils = require('../../../src/utils/utils');

jest.mock('../../../src/board/board');
jest.mock('../../../src/board/snake');
jest.mock('../../../src/board/nodes/snake_game_node');

describe('Test SnakeGame', () => {
    let game;
    let node;

    beforeEach(() => {
        node = new SnakeGameNode();
        Board.prototype.getNode = jest.fn((row, col) => node);
        game = new SnakeGame();
        game.board.dims = 10;
    });

    afterEach(() => {
        Board.mockClear();
        Snake.mockClear();
        SnakeGameNode.mockClear();
    });

    test('constructor sets board prop to new Board instance with SnakeGameNode', () => {
        expect(game.board).toBeInstanceOf(Board);
        expect(Board).toHaveBeenCalledWith(DIMENSIONS, SnakeGameNode);
    });

    test('constructor calls draw on board prop', () => {
        expect(game.board.draw).toHaveBeenCalledTimes(1);
    });

    test('start constructs a new snake object with board prop', async (done) => {
        const mockNode = new SnakeGameNode();
        mockNode.row = 3;
        Snake.prototype.getHead = jest.fn().mockReturnValueOnce(mockNode);

        game.start();

        expect(Snake).toHaveBeenCalledWith(game.board);
        done();
    });

    test('start calls _placeFood', async (done) => {
        const mockNode = new SnakeGameNode();
        mockNode.row = 3;
        Snake.prototype.getHead = jest.fn().mockReturnValueOnce(mockNode);
        game._placeFood = jest.fn();

        game.start();

        expect(game._placeFood).toHaveBeenCalled();
        done();
    });

    test('_placeFood sets node at given row, col as a food node', () => {
        const row = 1;
        const col = 2;

        game._placeFood(row, col);

        expect(node.setAsFoodNode).toHaveBeenCalledTimes(1);
    });

    test('_placeFood sets a random empty node as food node if no row or col are specified', () => {
        const mockNode = new SnakeGameNode();
        game._getRandomEmptyNode = jest.fn().mockReturnValueOnce(mockNode);

        game._placeFood();

        expect(game._getRandomEmptyNode).toHaveBeenCalledTimes(1);
        expect(mockNode.setAsFoodNode).toHaveBeenCalledTimes(1);
    });

    test('_getRandomEmptyNode only selects from empty nodes on the board', () => {
        const emptyNode = new SnakeGameNode();
        const nonEmptyNode = new SnakeGameNode();
        emptyNode.isEmptyNode.mockReturnValueOnce(true);
        nonEmptyNode.isEmptyNode.mockReturnValueOnce(false);
        game.board.nodes = [emptyNode, nonEmptyNode];
        utils.selectRandom = jest.fn();

        game._getRandomEmptyNode();

        expect(utils.selectRandom).toHaveBeenCalledWith([emptyNode]);
    });

    test('_getRandomEmptyNode returns the return value of utils.selectRandom', () => {
        const mockRetVal = new SnakeGameNode();
        game.board.nodes = {reduce: jest.fn()};
        game.board.nodes.reduce.mockReturnValueOnce([]);
        utils.selectRandom = jest.fn().mockReturnValueOnce(mockRetVal);

        const retVal = game._getRandomEmptyNode();

        expect(retVal).toBe(mockRetVal);
    });
});
