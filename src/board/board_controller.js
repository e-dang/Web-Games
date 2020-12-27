const Board = require('./board');
const SnakeNode = require('./nodes/snake_node');

class BoardController {
    constructor(dims, nodeType) {
        this.board = new Board(dims, this._nodeTypeFromString(nodeType));

        this.board.draw();
        this.addEventListeners();
    }

    addEventListeners() {
        this.addStartBtnEventListener();
    }

    addStartBtnEventListener() {
        document.getElementById('startBtn').addEventListener('click', (event) => this._handleClickStartBtn(event));
    }

    _handleClickStartBtn(event) {
        event.target.disabled = true;
    }

    _nodeTypeFromString(strNodeType) {
        if (strNodeType === 'snake') {
            return SnakeNode;
        } else {
            return null;
        }
    }
}

module.exports = BoardController;
