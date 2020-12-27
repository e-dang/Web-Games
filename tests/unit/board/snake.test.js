const Board = require('../../../src/board/board');
const SnakeNode = require('../../../src/board/nodes/snake_node');
const {SnakeGame, DIMENSIONS} = require('../../../src/board/snake');

jest.mock('../../../src/board/board');

describe('Test SnakeGame', () => {
    let game;

    beforeEach(() => {
        game = new SnakeGame();
    });

    afterEach(() => {
        Board.mockClear();
    });

    test('constructor sets board prop to new Board instance with SnakeNode', () => {
        expect(game.board).toBeInstanceOf(Board);
        expect(Board).toHaveBeenCalledWith(DIMENSIONS, SnakeNode);
    });

    test('constructor calls draw on board prop', () => {
        expect(game.board.draw).toHaveBeenCalledTimes(1);
    });
});
