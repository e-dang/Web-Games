const Board = require('../../../src/board/board');
const SnakeGameNode = require('../../../src/board/nodes/snake_game_node');
const {SnakeGame, DIMENSIONS} = require('../../../src/board/snake_game');
const {Snake} = require('../../../src/board/snake');

jest.mock('../../../src/board/board');
jest.mock('../../../src/board/snake');

describe('Test SnakeGame', () => {
    let game;

    beforeEach(() => {
        game = new SnakeGame();
    });

    afterEach(() => {
        Board.mockClear();
        Snake.mockClear();
    });

    test('constructor sets board prop to new Board instance with SnakeGameNode', () => {
        expect(game.board).toBeInstanceOf(Board);
        expect(Board).toHaveBeenCalledWith(DIMENSIONS, SnakeGameNode);
    });

    test('constructor calls draw on board prop', () => {
        expect(game.board.draw).toHaveBeenCalledTimes(1);
    });

    test('start constructs a new snake object with board prop', async (done) => {
        game.start();

        expect(Snake).toHaveBeenCalledWith(game.board);
        done();
    });
});
