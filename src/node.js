class Node {
    constructor(row, col, idx, boardRow) {
        this.row = row;
        this.col = col;
        this.idx = idx;
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
        this.element.classList.add('node', type);
    }
}

module.exports = Node;
