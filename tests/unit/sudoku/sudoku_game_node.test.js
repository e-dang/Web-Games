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

    test('constructor defines trueValue property', () => {
        expect(node.trueValue).toBeDefined();
    });

    test('setAsDefaultNode calls setAsGivenNode', () => {
        node.setAsGivenNode = jest.fn();

        node.setAsDefaultNode();

        expect(node.setAsGivenNode).toHaveBeenCalledTimes(1);
    });

    test('setAsGivenNode calls _setAsNodeType with string "given"', () => {
        node._setAsNodeType = jest.fn();

        node.setAsGivenNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith('given');
    });

    test('isGivenNode calls _isNodeOfType with "given"', () => {
        node._isNodeOfType = jest.fn();

        node.isGivenNode();

        expect(node._isNodeOfType).toHaveBeenCalledWith('given');
    });

    test('isGivenNode returns the return value of _isNodeOfType', () => {
        const val = true;
        node._isNodeOfType = jest.fn().mockReturnValueOnce(val);

        const retVal = node.isGivenNode();

        expect(retVal).toBe(val);
    });

    test("renderTrueValue sets element's innerText property to trueValue property if node is a given node", () => {
        node.isGivenNode = jest.fn(() => true);
        node.trueValue = 10;

        node.renderTrueValue();

        expect(node.element.innerText).toBe(node.trueValue);
    });

    test("renderTrueValue doesnt set element's innerText property to trueValue property if node is not a given node", () => {
        node.isGivenNode = jest.fn(() => false);
        node.trueValue = 10;

        node.renderTrueValue();

        expect(node.element.innerText).toBeUndefined();
    });

    test('setAsInputNode calls _setAsNodeType with string "input"', () => {
        node._setAsNodeType = jest.fn();

        node.setAsInputNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith('input');
    });

    test('setAsInputNode adds a new input element to the cell html element', () => {
        node.setAsInputNode();

        expect(node.element.children.length).toBe(1);
        expect(node.element.children[0].nodeName).toBe('INPUT');
    });

    test('setAsInputNode sets input html element id to `i${this.idx}`', () => {
        node.setAsInputNode();

        expect(node.input.id).toBe(`i${node.idx}`);
    });

    test('isInputNode calls _isNodeOfType with "input"', () => {
        node._isNodeOfType = jest.fn();

        node.isInputNode();

        expect(node._isNodeOfType).toHaveBeenCalledWith('input');
    });

    test('isInputNode returns the return value of _isNodeOfType', () => {
        const val = true;
        node._isNodeOfType = jest.fn().mockReturnValueOnce(val);

        const retVal = node.isInputNode();

        expect(retVal).toBe(val);
    });

    test('addInputEventListener calls addEventListener on input prop with type and fn params if node is an input node', () => {
        node.setAsInputNode();
        const type = 'change';
        const fn = jest.fn();
        node.input.addEventListener = jest.fn();

        node.addInputEventListener(type, fn);

        expect(node.input.addEventListener).toHaveBeenCalledWith(type, fn);
    });

    test('addInputEventListener doesnt call addEventListener on input prop with type and fn params if node is not an input node', () => {
        node.setAsGivenNode();
        const type = 'change';
        const fn = jest.fn();
        node.input = {addEventListener: jest.fn()};

        node.addInputEventListener(type, fn);

        expect(node.input.addEventListener).not.toHaveBeenCalled();
    });

    test('userValueIsCorrect returns true when trueValue property and input.value are equal and node is input node', () => {
        node.setAsInputNode();
        node.trueValue = 1;
        node.input.value = 1;

        const retVal = node.userValueIsCorrect();

        expect(retVal).toBe(true);
    });

    test('userValueIsCorrect returns false when trueValue property and input.value are not equal and node is input node', () => {
        node.setAsInputNode();
        node.trueValue = 1;
        node.input.value = 2;

        const retVal = node.userValueIsCorrect();

        expect(retVal).toBe(false);
    });

    test('userValueIsCorrect returns true when node is a given node', () => {
        node.isGivenNode = jest.fn(() => true);

        const retVal = node.userValueIsCorrect();

        expect(retVal).toBe(true);
    });

    test('_handleInputEvent sets node.input.value to empty string if node.input.value is NaN', () => {
        node.setAsInputNode();
        node.input.value = 'a';

        node._handleInputEvent();

        expect(node.input.value).toBe('');
    });

    test('_handleInputEvent sets node.input.value to empty string if node.input.value is 0', () => {
        node.setAsInputNode();
        node.input.value = 0;

        node._handleInputEvent();

        expect(node.input.value).toBe('');
    });

    test('_handleInputEvent is called when an input event is triggered on an input node', () => {
        node.setAsInputNode();
        node._handleInputEvent = jest.fn();

        node.input.dispatchEvent(new Event('input'));

        expect(node._handleInputEvent).toHaveBeenCalledTimes(1);
    });
});
