const Node = require('../../../../src/board/nodes/node');
const SnakeGameNode = require('../../../../src/board/nodes/snake_game_node');

jest.mock('../../../../src/board/nodes/node');

describe('Test SnakeGameNode', () => {
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
        node = new SnakeGameNode(row, col, idx, boardRow);
    });

    test('constructor calls Node constructor with parameters and shape == square', () => {
        expect(Node).toHaveBeenLastCalledWith(row, col, idx, boardRow, 'square');
    });

    test('setAsSnakeNode calls _setAsNodeType with "snake"', () => {
        node._setAsNodeType = jest.fn();

        node.setAsSnakeNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith('snake');
    });

    test('setAsHeadNode calls _setAsNodeType with ["snake", "head"]', () => {
        node._setAsNodeType = jest.fn();

        node.setAsHeadNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith(['snake', 'head']);
    });

    test('setAsFoodNode calls _setAsNodeType with "food"', () => {
        node._setAsNodeType = jest.fn();

        node.setAsFoodNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith('food');
    });
});
