const Board = require('../../../src/board/board');
const SnakeGameNode = require('../../../src/board/nodes/snake_game_node');
const {Snake, INITIAL_LENGTH} = require('../../../src/board/snake');

jest.mock('../../../src/board/board');
jest.mock('../../../src/board/nodes/snake_game_node');

describe('Test Snake', () => {
    let snake;
    let board;

    beforeEach(() => {
        Board.mockClear();
        SnakeGameNode.mockClear();
        board = new Board();
        board.getNode = jest.fn((row, col) => new SnakeGameNode());
        snake = new Snake(board);
    });

    test('constructor sets board prop to board param', () => {
        expect(snake.board).toBe(board);
    });

    test('constructor defines body', () => {
        expect(snake.body).toBeDefined();
    });

    test('constructor defines direction', () => {
        expect(snake.direction).toBeDefined();
    });

    test('constructor calls _initSnake', () => {
        const orig = Snake.prototype._initSnake;
        const mock = jest.fn();
        Snake.prototype._initSnake = mock;

        snake = new Snake(board);

        Snake.prototype._initSnake = orig;
        expect(mock).toHaveBeenCalledTimes(1);
    });

    test('_initSnake pushes INITIAL_LENGTH nodes onto body', () => {
        expect(snake.body.length).toBe(INITIAL_LENGTH);
    });

    test('_initSnake sets front of body to be head node', () => {
        expect(snake.body.peekFront().setAsHeadNode).toHaveBeenCalledTimes(1);
    });
});
