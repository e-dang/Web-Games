const {SnakeGame} = require('./snake');

class PageController {
    constructor(gameType) {
        this.game = this._gameFromString(gameType);

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
        this.game.start();
    }

    _gameFromString(strNodeType) {
        if (strNodeType === 'snake') {
            return new SnakeGame();
        } else {
            return null;
        }
    }
}

module.exports = PageController;
