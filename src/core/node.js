class Node {
    constructor(row, col, idx, boardRow, nodeType) {
        this.row = row;
        this.col = col;
        this.idx = idx;
        this.extraTypes = [nodeType];
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

    addCheckerOn() {
        this._addExtraType('checker-on');
    }

    addCheckerOff() {
        this._addExtraType('checker-off');
    }

    _isNodeOfType(type) {
        return this.element.classList.contains(type);
    }

    _setAsNodeType(type) {
        if (!Array.isArray(type)) {
            type = [type];
        }
        this.element.className = '';
        this.element.classList.add('node', ...this.extraTypes, ...type);
    }

    _addExtraType(type) {
        this.extraTypes.push(type);
        this.element.classList.add(type);
    }
}

module.exports = Node;
