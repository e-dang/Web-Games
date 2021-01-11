const TicTacToeNode = require('../../../src/tic_tac_toe/tic_tac_toe_node');

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
        expect(mock).toHaveBeenLastCalledWith(row, col, idx, boardRow, 'square');
    });

    test('addClickEventListener adds the function parameter as a click event listener', () => {
        const func = jest.fn();

        node.addClickEventListener(func);
        node.element.click();

        expect(func).toHaveBeenLastCalledWith(node);
    });
});
