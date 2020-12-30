const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');

describe('Test SudokuGameNode', () => {
    let node;
    let row;
    let col;
    let idx;
    let boardRow;

    beforeEach(() => {
        row = 8;
        col = 6;
        idx = 68;
        boardRow = document.createElement('tr');
        boardRow.id = 'boardRow';
        document.body.appendChild(boardRow);
        node = new SudokuGameNode(row, col, idx, boardRow);
    });

    test('constructor calls Node constructor with parameters', () => {
        const orig = Object.getPrototypeOf(SudokuGameNode);
        const mock = jest.fn();
        Object.setPrototypeOf(SudokuGameNode, mock);

        node = new SudokuGameNode(row, col, idx, boardRow);

        Object.setPrototypeOf(SudokuGameNode, orig);
        expect(mock).toHaveBeenLastCalledWith(row, col, idx, boardRow, 'square');
    });
});
