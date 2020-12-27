class Node {
    constructor(row, col, idx, boardRow, shape) {
        this.row = row;
        this.col = col;
        this.idx = idx;
        this.shape = shape;
        this.element = document.createElement('td');
        this.element.id = `n${idx}`;
        this.setAsEmptyNode();
        boardRow.appendChild(this.element);
    }

    setAsEmptyNode() {
        this._setAsNodeType('empty');
    }

    _setAsNodeType(type) {
        this.element.className = '';
        this.element.classList.add('node', this.shape, type);
    }
}

module.exports = Node;
