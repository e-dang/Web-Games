const Board = require('./board');

class BoardController {
    constructor(dims, nodeType) {
        this.board = new Board(dims, nodeType);

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
}

module.exports = BoardController;
