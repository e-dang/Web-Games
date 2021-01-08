class Node {
    constructor(row, col, idx, boardRow, shape) {
        this.row = row;
        this.col = col;
        this.idx = idx;
        this.shape = shape;
        this.element = document.createElement('td');
        this.element.id = `n${this.idx}`;
        boardRow.appendChild(this.element);
    }

    setAsEmptyNode() {
        this._setAsNodeType('empty');
    }

    setAsDefaultNode() {
        this.setAsEmptyNode();
    }

    isEmptyNode() {
        return this._isNodeOfType('empty');
    }

    _isNodeOfType(type) {
        return this.element.classList.contains(type);
    }

    _setAsNodeType(type) {
        if (!Array.isArray(type)) {
            type = [type];
        }
        this.element.className = '';
        this.element.classList.add('node', this.shape, ...type);
    }
}

module.exports = Node;
