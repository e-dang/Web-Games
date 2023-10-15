import {SnakeGame} from '../snake/snake_game';

export class SnakePage {
  constructor() {
    this.game = new SnakeGame();

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
}
