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
}

module.exports = Board;
