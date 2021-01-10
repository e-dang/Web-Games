class Page {
    constructor(board, difficultyMap) {
        this.board = board;
        this.difficultyMap = difficultyMap;
    }

    addEventHandlers() {
        this.addClickResetButtonEventHandler().addChangeDifficultyEventHandlers();
    }

    addClickResetButtonEventHandler() {
        document.getElementById('resetBtn').addEventListener('click', () => this._handleClickResetButton());

        return this;
    }

    addChangeDifficultyEventHandlers() {
        for (let prop in this.difficultyMap) {
            document.getElementById(prop).addEventListener('click', (event) => this._handleChangeDifficulty(event));
        }

        return this;
    }

    _handleClickResetButton() {
        this.board.clear();
    }

    _handleChangeDifficulty(event) {
        this.difficultyMap[event.target.id](() => this._updateDifficulty(event));
    }

    _updateDifficulty(event) {
        document.getElementById('currentDifficulty').textContent = event.target.textContent;
        this._handleClickResetButton();
    }

    _setDefaultDifficulty() {
        document.getElementById('easy').click();
    }
}

module.exports = Page;
