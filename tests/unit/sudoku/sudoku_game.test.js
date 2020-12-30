const {SudokuGame, DIMENSIONS} = require('../../../src/sudoku/sudoku_game');
const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');
const Board = require('../../../src/core/board');

jest.mock('../../../src/core/board');
jest.mock('../../../src/sudoku/sudoku_game_node');

describe('Test SudokuGame', () => {
    let game;

    beforeEach(() => {
        game = new SudokuGame();
    });

    afterEach(() => {
        Board.mockClear();
        SudokuGameNode.mockClear();
    });

    test('constructor creates a new board obj with dims and SudokuGameNode', () => {
        expect(Board).toHaveBeenCalledWith(DIMENSIONS, SudokuGameNode);
    });

    test('constructor calls draw on board property', () => {
        expect(game.board.draw).toHaveBeenCalledTimes(1);
    });
});
