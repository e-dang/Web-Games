const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');
const {X, O} = require('../../../src/tic_tac_toe/constants');

describe('test TicTacToeNode', () => {
    let node;
    let row;
    let col;
    let idx;
    let boardRow;

    beforeEach(() => {
        row = 0;
        col = 1;
        idx = 1;
        boardRow = document.createElement('tr');
        document.body.appendChild(boardRow);
        node = new TicTacToeNode(row, col, idx, boardRow);
    });

    test('constructor calls Node constructor with correct parameters', () => {
        const orig = Object.getPrototypeOf(TicTacToeNode);
        const mock = jest.fn();
        Object.setPrototypeOf(TicTacToeNode, mock);

        node = new TicTacToeNode(row, col, idx, boardRow);

        Object.setPrototypeOf(TicTacToeNode, orig);
        expect(mock).toHaveBeenLastCalledWith(row, col, idx, boardRow, 'tic-tac-toe-node');
    });

    test('constructor sets value property to a number', () => {
        expect(typeof node.value).toBe('number');
    });

    test('addClickEventListener adds the function parameter as a click event listener', () => {
        const func = jest.fn();

        node.addClickEventListener(func);
        node.element.click();

        expect(func).toHaveBeenLastCalledWith(node);
    });

    test('setAsEmptyNode sets value property to 0', () => {
        node.value = 1;

        node.setAsEmptyNode();

        expect(node.value).toBe(0);
    });

    test('setAsXNode calls _setAsNodeType with "x"', () => {
        node._setAsNodeType = jest.fn();

        node.setAsXNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith(X);
    });

    test('setAsXNode sets value property to 1', () => {
        node._setAsNodeType = jest.fn();
        node.value = 0;

        node.setAsXNode();

        expect(node.value).toBe(1);
    });

    test('setAsONode calls _setAsNodeType with "o"', () => {
        node._setAsNodeType = jest.fn();

        node.setAsONode();

        expect(node._setAsNodeType).toHaveBeenCalledWith(O);
    });

    test('setAsONode sets value property to -1', () => {
        node._setAsNodeType = jest.fn();
        node.value = 0;

        node.setAsONode();

        expect(node.value).toBe(-1);
    });
});
