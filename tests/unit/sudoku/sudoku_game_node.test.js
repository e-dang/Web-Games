const Node = require('../../../src/core/node');
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

    test('constructor adds a new input element to the html element', () => {
        expect(node.element.children.length).toBe(1);
        expect(node.element.children[0].nodeName).toBe('INPUT');
    });

    test('constructor sets input html element id to `i${this.idx}`', () => {
        expect(node.input.id).toBe(`i${node.idx}`);
    });

    test("setValue sets element's innerText property to value parameter", () => {
        const value = 10;

        node.setValue(value);

        expect(node.element.innerText).toBe(value);
    });

    test('addInputEventListener calls addEventListener on input prop with type and fn params', () => {
        const type = 'change';
        const fn = jest.fn();
        node.input.addEventListener = jest.fn();

        node.addInputEventListener(type, fn);

        expect(node.input.addEventListener).toHaveBeenCalledWith(type, fn);
    });
});
