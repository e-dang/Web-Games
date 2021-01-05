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

    test('constructor defines trueValue property', () => {
        expect(node.trueValue).toBeDefined();
    });

    test("renderTrueValue sets element's innerText property to trueValue property", () => {
        node.trueValue = 10;

        node.renderTrueValue();

        expect(node.element.innerText).toBe(node.trueValue);
    });

    test('addInputEventListener calls addEventListener on input prop with type and fn params', () => {
        const type = 'change';
        const fn = jest.fn();
        node.input.addEventListener = jest.fn();

        node.addInputEventListener(type, fn);

        expect(node.input.addEventListener).toHaveBeenCalledWith(type, fn);
    });

    test('userValueIsCorrect returns true when trueValue property and input.value are equal', () => {
        node.trueValue = 1;
        node.input.value = 1;

        const retVal = node.userValueIsCorrect();

        expect(retVal).toBe(true);
    });

    test('userValueIsCorrect returns false when trueValue property and input.value are not equal', () => {
        node.trueValue = 1;
        node.input.value = 2;

        const retVal = node.userValueIsCorrect();

        expect(retVal).toBe(false);
    });

    test('_handleInputEvent sets node.input.value to empty string if node.input.value is NaN', () => {
        node.input.value = 'a';

        node._handleInputEvent();

        expect(node.input.value).toBe('');
    });

    test('_handleInputEvent sets node.input.value to empty string if node.input.value is 0', () => {
        node.input.value = 0;

        node._handleInputEvent();

        expect(node.input.value).toBe('');
    });

    test('_handleInputEvent is called on input event', () => {
        node._handleInputEvent = jest.fn();

        node.input.dispatchEvent(new Event('input'));

        expect(node._handleInputEvent).toHaveBeenCalledTimes(1);
    });
});
