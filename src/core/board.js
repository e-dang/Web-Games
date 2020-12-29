class Board {
    constructor(dimensions, nodeType) {
        this.dims = dimensions;
        this.nodeType = nodeType;
        this.nodes = [];
    }

    draw() {
        const board = document.createElement('tbody');
        board.id = 'gameBoard';

        for (let i = 0; i < this.dims; i++) {
            const row = document.createElement('tr');
            board.appendChild(row);
            for (let j = 0; j < this.dims; j++) {
                const idx = i * this.dims + j;
                this.nodes.push(new this.nodeType(i, j, idx, row));
            }
        }

        document.getElementById('gameBoardWrapper').appendChild(board);
    }

    getNode(row, col) {
        return this.nodes[row * this.dims + col];
    }

    isInvalidSpace(row, col) {
        if (row < 0 || col < 0 || row >= this.dims || col >= this.dims) {
            return true;
        }

        return false;
    }

    clear() {
        this.nodes.forEach((node) => {
            node.setAsEmptyNode();
        });
    }
}

module.exports = Board;