const Board = require('../../../src/board/board');
const SnakeGameNode = require('../../../src/board/nodes/snake_game_node');
const {
    SnakeGame,
    DIMENSIONS,
    UP_ARROW,
    DOWN_ARROW,
    LEFT_ARROW,
    RIGHT_ARROW,
    W,
    A,
    S,
    D,
} = require('../../../src/board/snake_game');
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

    test('constructor sets snake property to null', () => {
        expect(game.snake).toBe(null);
    });

    describe('test start', () => {
        let mockNode;

        beforeEach(() => {
            mockNode = new SnakeGameNode();
            mockNode.row = 3;
            Snake.prototype.getHead = jest.fn(() => mockNode);
            Snake.prototype.move = jest.fn(() => false);
            game._gameLoop = jest.fn();
            game._placeFood = jest.fn();
        });

        test('start constructs a new snake object with board prop and sets it to snake prop', async (done) => {
            game.start();

            expect(Snake).toHaveBeenCalledWith(game.board);
            expect(game.snake).toBeInstanceOf(Snake);
            done();
        });

        test('start calls _placeFood', async (done) => {
            game.start();

            expect(game._placeFood).toHaveBeenCalled();
            done();
        });

        test('start calls _gameLoop', async (done) => {
            game.start();

            expect(game._gameLoop).toHaveBeenCalledTimes(1);
            done();
        });
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

    test.each([
        [true, true, true],
        [true, true, false],
        [true, false, true],
        [false, false, false],
    ])(
        '_isInvalidSpace returns %s when board.isInvalidSpace is %s and node.isSnakeNode is %s',
        (expected, isInvalid, isSnake) => {
            game.board.isInvalidSpace = jest.fn().mockReturnValueOnce(isInvalid);
            const mockNode = new SnakeGameNode();
            mockNode.isSnakeNode = jest.fn().mockReturnValueOnce(isSnake);
            game.board.getNode = jest.fn((row, col) => mockNode);

            const retVal = game._isInvalidSpace();

            expect(retVal).toBe(expected);
        },
    );

    test('_handleKeyDown is called when a key is pressed and snake is not null', () => {
        game.snake = new Snake();
        game._handleKeyDown = jest.fn();

        document.dispatchEvent(new Event('keydown'));

        expect(game._handleKeyDown).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown is not called when a key is pressed and snake is null', () => {
        game.snake = null;
        game._handleKeyDown = jest.fn();

        document.dispatchEvent(new Event('keydown'));

        expect(game._handleKeyDown).not.toHaveBeenCalled();
    });

    test('_handleKeyDown calls setDirectionUp on snake prop when up arrow key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: 38,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionUp).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionUp on snake prop when "w" key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: 87,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionUp).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionUp on snake prop when up arrow key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: UP_ARROW,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionUp).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionUp on snake prop when "w" key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: W,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionUp).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionDown on snake prop when down arrow key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: DOWN_ARROW,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionDown).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionDown on snake prop when "s" key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: S,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionDown).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionLeft on snake prop when left arrow key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: LEFT_ARROW,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionLeft).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionLeft on snake prop when "a" key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: A,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionLeft).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionRight on snake prop when right arrow key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: RIGHT_ARROW,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionRight).toHaveBeenCalledTimes(1);
    });

    test('_handleKeyDown calls setDirectionRight on snake prop when "d" key is pressed', async () => {
        game.snake = new Snake();
        const event = {
            keyCode: D,
        };

        await game._handleKeyDown(event);

        expect(game.snake.setDirectionRight).toHaveBeenCalledTimes(1);
    });
});
