const Node = require('../../../../src/board/nodes/node');

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

    test('constructor sets html element id to `n${idx}`', () => {
        expect(node.element.id).toBe(`n${node.idx}`);
    });

    test('constructor calls setAsEmptyNode', () => {
        const orig = Node.prototype.setAsEmptyNode;
        const mock = jest.fn();
        Node.prototype.setAsEmptyNode = mock;

        node = new Node(row, col, idx, boardRow);

        Node.prototype.setAsEmptyNode = orig;
        expect(mock).toHaveBeenCalledTimes(1);
    });

    test('setAsEmptyNode calls _setAsNodeType with parameter empty', () => {
        node._setAsNodeType = jest.fn();

        node.setAsEmptyNode();

        expect(node._setAsNodeType).toHaveBeenCalledWith('empty');
    });
});
