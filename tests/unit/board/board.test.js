const Board = require('../../../src/board/board');
const fs = require('fs');
const path = require('path');
const SnakeGameNode = require('../../../src/board/nodes/snake_game_node');

const html = fs.readFileSync(path.resolve(__dirname, '../../../public/index.html'), 'utf8');

jest.mock('../../../src/board/nodes/snake_game_node');

describe('Board', () => {
    let board;
    let dims;
    let nodeType;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        dims = 10;
        nodeType = SnakeGameNode;
        board = new Board(dims, nodeType);
    });

    afterEach(() => {
        document.documentElement.innerHTML = '';
    });

    test('constructor sets dims prop to dims parameter', () => {
        expect(board.dims).toBe(dims);
    });

    test('constructor sets nodeType prop to nodeType param', () => {
        expect(board.nodeType).toBe(nodeType);
    });

    describe('test draw', () => {
        let wrapper;
        let gameBoard;

        beforeEach(() => {
            wrapper = document.getElementById('gameBoardWrapper');

            board.draw();

            gameBoard = document.getElementById('gameBoard');
        });

        test('draw adds tbody element with id=board to gameBoardWrapper element', () => {
            expect(gameBoard.parentElement).toBe(wrapper);
        });

        test('draw adds dim number of rows to board', () => {
            const rows = document.getElementsByTagName('tr');

            expect(rows.length).toBe(board.dims);
            for (let row of rows) {
                expect(row.parentElement).toBe(gameBoard);
            }
        });

        test('draw calls constructs dims * dims number of nodeTypes', () => {
            board.nodeType = jest.fn();

            board.draw();

            expect(board.nodeType).toHaveBeenCalledTimes(board.dims * board.dims);
        });

        test('draw fills nodes prop with dims * dims elements', () => {
            expect(board.nodes.length).toBe(board.dims * board.dims);
        });
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
});
