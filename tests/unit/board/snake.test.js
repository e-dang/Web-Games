const Board = require('../../../src/board/board');
const SnakeGameNode = require('../../../src/board/nodes/snake_game_node');
const {Snake, INITIAL_LENGTH} = require('../../../src/board/snake');

jest.mock('../../../src/board/board');
jest.mock('../../../src/board/nodes/snake_game_node');

describe('Test Snake', () => {
    let snake;
    let board;
    let node;

    beforeEach(() => {
        Board.mockReset();
        SnakeGameNode.mockReset();
        board = new Board();
        node = new SnakeGameNode();
        board.getNode = jest.fn((row, col) => node);
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

    test('getHead returns the return value of body.peekFront', () => {
        const mockNode = new SnakeGameNode();
        snake.body.peekFront = jest.fn().mockReturnValueOnce(mockNode);

        const retVal = snake.getHead();

        expect(retVal).toBe(mockNode);
    });

    test('getNextMove returns obj with row and col equal to head position + direction', () => {
        const row = 4;
        const col = 3;
        const dr = 0;
        const dc = 1;
        snake.getHead = jest.fn().mockReturnValueOnce({
            row,
            col,
        });
        snake.direction = [dr, dc];

        const retVal = snake.getNextMove();

        expect(retVal.row).toBe(row + dr);
        expect(retVal.col).toBe(col + dc);
    });

    test('move calls pops node off back of body and sets it to an empty node when next node is not a food node', () => {
        node.isFoodNode.mockReturnValueOnce(false);
        const backNode = new SnakeGameNode();
        snake.body.popBack = jest.fn().mockReturnValueOnce(backNode);

        snake.move();

        expect(snake.body.popBack).toHaveBeenCalledTimes(1);
        expect(backNode.setAsEmptyNode).toHaveBeenCalledTimes(1);
    });

    test('move doesnt pop node off back of body or set it to an empty node when next node is a food node', () => {
        node.isFoodNode.mockReturnValueOnce(true);
        const backNode = new SnakeGameNode();
        snake.body.popBack = jest.fn().mockReturnValueOnce(backNode);

        snake.move();

        expect(snake.body.popBack).not.toHaveBeenCalled();
        expect(backNode.setAsEmptyNode).not.toHaveBeenCalled();
    });

    test('move sets next node to head node', () => {
        const mockNode = new SnakeGameNode();
        snake.board.getNode = jest.fn().mockReturnValueOnce(mockNode);

        snake.move();

        expect(mockNode.setAsHeadNode).toHaveBeenCalledTimes(1);
    });
});
