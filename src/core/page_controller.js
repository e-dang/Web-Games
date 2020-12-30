const {SnakeGame} = require('../snake/snake_game');
const {SudokuGame} = require('../sudoku/sudoku_game');

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
        this.game.start(() => (event.target.disabled = false));
    }

    _gameFromString(strNodeType) {
        if (strNodeType === 'Snake') {
            return new SnakeGame();
        } else if (strNodeType === 'Sudoku') {
            return new SudokuGame();
        } else {
            return null;
        }
    }
}

module.exports = PageController;
