const Board = require('../../../src/core/board');
const SnakeGameNode = require('../../../src/snake/snake_game_node');
const {loadHTML, clearHTML} = require('../utils');

jest.mock('../../../src/snake/snake_game_node');

describe('Board', () => {
    let board;
    let dims;
    let nodeType;

    beforeEach(async (done) => {
        await loadHTML('/snake');
        dims = 10;
        nodeType = SnakeGameNode;
        board = new Board(dims, nodeType);
        done();
    });

    afterEach(() => {
        clearHTML();
        SnakeGameNode.mockReset();
    });

    test('constructor sets dims prop to dims parameter', () => {
        expect(board.dims).toBe(dims);
    });

    test('constructor sets nodeType prop to nodeType param', () => {
        expect(board.nodeType).toBe(nodeType);
    });

    test('draw adds tbody element with id=board to gameBoardWrapper element', () => {
        board.draw();

        const wrapper = document.getElementById('gameBoardWrapper');
        const gameBoard = document.getElementById('gameBoard');
        expect(gameBoard.parentElement).toBe(wrapper);
    });

    test('draw adds dim number of rows to board', () => {
        const rows = document.getElementsByTagName('tr');

        board.draw();

        const gameBoard = document.getElementById('gameBoard');
        expect(rows.length).toBe(board.dims);
        for (let row of rows) {
            expect(row.parentElement).toBe(gameBoard);
        }
    });

    test('draw calls constructs dims * dims number of nodeTypes', () => {
        board.nodeType = jest.fn().mockImplementation(() => new SnakeGameNode());

        board.draw();

        expect(board.nodeType).toHaveBeenCalledTimes(board.dims * board.dims);
    });

    test('draw fills nodes prop with dims * dims elements', () => {
        board.draw();

        expect(board.nodes.length).toBe(board.dims * board.dims);
    });

    test('draw calls _initNode with each node created', () => {
        board._initNode = jest.fn();

        board.draw();

        board.nodes.forEach((node, idx) => expect(board._initNode).toHaveBeenNthCalledWith(idx + 1, node));
    });

    test('getNode returns the node at the correct index', () => {
        let node;
        const row = 3;
        const col = 4;
        for (let i = 0; i < dims; i++) {
            const newNode = new SnakeGameNode();
            board.nodes.push(newNode);
            if (i == row * dims + col) {
                node = newNode;
            }
        }

        const retVal = board.getNode(row, col);

        expect(retVal).toBe(node);
    });

    test('isInvalidSpace returns true when row < 0', () => {
        const row = -1;
        const col = 1;

        const retVal = board.isInvalidSpace(row, col);

        expect(retVal).toBe(true);
    });

    test('isInvalidSpace returns true when row >= dims', () => {
        const row = dims;
        const col = 1;

        const retVal = board.isInvalidSpace(row, col);

        expect(retVal).toBe(true);
    });

    test('isInvalidSpace returns true when col < 0', () => {
        const row = 1;
        const col = -1;

        const retVal = board.isInvalidSpace(row, col);

        expect(retVal).toBe(true);
    });

    test('isInvalidSpace returns true when row >= dims', () => {
        const row = 1;
        const col = dims;

        const retVal = board.isInvalidSpace(row, col);

        expect(retVal).toBe(true);
    });

    test('isInvalidSpace returns false when row and col are both > 0 and < dims', () => {
        const row = 1;
        const col = 1;

        const retVal = board.isInvalidSpace(row, col);

        expect(retVal).toBe(false);
    });

    test('clear calls setAsDefaultNode on all nodes', () => {
        for (let i = 0; i < dims; i++) {
            board.nodes.push(new SnakeGameNode());
        }

        board.clear();

        board.nodes.forEach((node) => {
            expect(node.setAsDefaultNode).toHaveBeenCalledTimes(1);
        });
    });

    test('_initNode calls setAsDefaultNode on node param', () => {
        const node = new SnakeGameNode();

        board._initNode(node);

        expect(node.setAsDefaultNode).toHaveBeenCalledTimes(1);
    });
});
