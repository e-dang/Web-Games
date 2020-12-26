const Node = require('../../src/node');

describe('Test Node', () => {
    let node;
    const row = 8;
    const col = 6;
    const idx = 68;
    let boardRow;

    beforeEach(() => {
        boardRow = document.createElement('tr');
        boardRow.id = 'boardRow';
        document.body.appendChild(boardRow);
        node = new Node(row, col, idx, boardRow);
    });

    afterEach(() => {
        document.documentElement.innerHTML = '';
    });

    test.each([
        ['row', row],
        ['col', col],
        ['idx', idx],
    ])('constructor sets %s property using the given parameter', (prop, value) => {
        expect(node[prop]).toBe(value);
    });

    test('constructor adds a new cell to the boardRow html element', () => {
        expect(boardRow.children.length).toBe(1);
    });
});
