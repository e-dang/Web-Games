const Board = require('../../../src/core/board');
const SnakeGameNode = require('../../../src/snake/snake_game_node');
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
} = require('../../../src/snake/snake_game');
const {Snake} = require('../../../src/snake/snake');
const utils = require('../../../src/utils/utils');
const {loadHTML, clearHTML} = require('../utils');

jest.mock('../../../src/core/board');
jest.mock('../../../src/snake/snake');
jest.mock('../../../src/snake/snake_game_node');

describe('Test SnakeGame', () => {
    let game;
    let node;

    beforeEach(async (done) => {
        await loadHTML('/');
        node = new SnakeGameNode();
        Board.prototype.getNode = jest.fn((row, col) => node);
        game = new SnakeGame();
        game.board.dims = 10;
        done();
    });

    afterEach(() => {
        Board.mockClear();
        Snake.mockClear();
        SnakeGameNode.mockClear();
        clearHTML();
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
        let callback;

        beforeEach(() => {
            mockNode = new SnakeGameNode();
            mockNode.row = 3;
            Snake.prototype.getHead = jest.fn(() => mockNode);
            Snake.prototype.move = jest.fn(() => false);
            game._gameLoop = jest.fn();
            game._placeFood = jest.fn();
            callback = jest.fn();
        });

        test('start constructs a new snake object with board prop and sets it to snake prop', async (done) => {
            game.start(callback);

            expect(Snake).toHaveBeenCalledWith(game.board);
            expect(game.snake).toBeInstanceOf(Snake);
            done();
        });

        test('start calls _placeFood', async (done) => {
            game.start(callback);

            expect(game._placeFood).toHaveBeenCalled();
            done();
        });

        test('start calls _gameLoop', async (done) => {
            game.start(callback);

            expect(game._gameLoop).toHaveBeenCalledTimes(1);
            done();
        });

        test('start calls callback function', async () => {
            await game.start(callback);

            expect(callback).toHaveBeenCalledTimes(1);
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

    test('keydown event caches the event.key property in this.keys when snake is not null', () => {
        game.snake = new Snake();
        game.keys[UP_ARROW] = false;
        const event = new Event('keydown');
        event.key = UP_ARROW;

        document.dispatchEvent(event);

        expect(game.keys[UP_ARROW]).toBe(true);
    });

    test('keydown event doesnt cache the event.key property in this.keys when snake is null', () => {
        game.snake = null;
        game.keys[UP_ARROW] = false;
        const event = new Event('keydown');
        event.key = UP_ARROW;

        document.dispatchEvent(event);

        expect(game.keys[UP_ARROW]).toBe(false);
    });

    test('keyup event removes the cached event.key property in this.keys when snake is not null', () => {
        game.snake = new Snake();
        game.keys[UP_ARROW] = true;
        const event = new Event('keyup');
        event.key = UP_ARROW;

        document.dispatchEvent(event);

        expect(game.keys[UP_ARROW]).toBe(false);
    });

    test('keyup event doesnt remove the cached event.key property in this.keys when snake is null', () => {
        game.snake = null;
        game.keys[UP_ARROW] = true;
        const event = new Event('keyup');
        event.key = UP_ARROW;

        document.dispatchEvent(event);

        expect(game.keys[UP_ARROW]).toBe(true);
    });

    test('_changeDirections calls setDirectionUp on snake prop when up arrow key is cached', () => {
        game.snake = new Snake();
        game.keys[UP_ARROW] = true;

        game._changeDirections();

        expect(game.snake.setDirectionUp).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionUp on snake prop when "w" key is cached', () => {
        game.snake = new Snake();
        game.keys[W] = true;

        game._changeDirections();

        expect(game.snake.setDirectionUp).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionDown on snake prop when down arrow key is cached', () => {
        game.snake = new Snake();
        game.keys[DOWN_ARROW] = true;

        game._changeDirections();

        expect(game.snake.setDirectionDown).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionDown on snake prop when "s" key is cached', () => {
        game.snake = new Snake();
        game.keys[S] = true;

        game._changeDirections();

        expect(game.snake.setDirectionDown).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionLeft on snake prop when left arrow key is cached', () => {
        game.snake = new Snake();
        game.keys[LEFT_ARROW] = true;

        game._changeDirections();

        expect(game.snake.setDirectionLeft).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionLeft on snake prop when "a" key is cached', () => {
        game.snake = new Snake();
        game.keys[A] = true;

        game._changeDirections();

        expect(game.snake.setDirectionLeft).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionRight on snake prop when right arrow key is cached', () => {
        game.snake = new Snake();
        game.keys[RIGHT_ARROW] = true;

        game._changeDirections();

        expect(game.snake.setDirectionRight).toHaveBeenCalledTimes(1);
    });

    test('_changeDirections calls setDirectionRight on snake prop when "d" key is cached', () => {
        game.snake = new Snake();
        game.keys[D] = true;

        game._changeDirections();

        expect(game.snake.setDirectionRight).toHaveBeenCalledTimes(1);
    });

    test('_handleFailure displays gameOverModal', async (done) => {
        game.snake = new Snake();

        $('#gameOverModal').on('shown.bs.modal', (event) => {
            expect(event.target).toHaveClass('show');
            done();
        });

        game._handleFailure();
    });

    test('_handleSuccess displays gameOverModal', async (done) => {
        game.board.nodes = [];
        $('#gameOverModal').on('shown.bs.modal', (event) => {
            expect(event.target).toHaveClass('show');
            done();
        });

        game._handleSuccess();
    });
});
