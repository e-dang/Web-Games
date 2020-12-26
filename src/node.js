class Node {
    constructor(row, col, idx, boardRow) {
        this.row = row;
        this.col = col;
        this.idx = idx;
        this.element = document.createElement('td');
        boardRow.appendChild(this.element);
    }
}

module.exports = Node;
