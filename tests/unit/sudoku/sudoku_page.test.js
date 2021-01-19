const Board = require('../../../src/core/board');
const SudokuBoard = require('../../../src/sudoku/sudoku_board');
const SudokuGameNode = require('../../../src/sudoku/sudoku_game_node');
const SudokuPage = require('../../../src/sudoku/sudoku_page');
const {loadHTML, clearHTML} = require('../utils');

jest.mock('../../../src/sudoku/sudoku_board');
jest.mock('../../../src/sudoku/sudoku_game_node');

describe('test SudokuPage', () => {
    let page;

    beforeEach(async (done) => {
        await loadHTML('/sudoku');
        page = new SudokuPage();
        done();
    });

    afterEach(() => {
        clearHTML();
    });

    test('constructor sets board prop to an instance of SudokuBoard', () => {
        expect(page.board).toBeInstanceOf(SudokuBoard);
    });

    test('constructor calls draw method on board property', () => {
        expect(page.board.draw).toHaveBeenCalledTimes(1);
    });

    test('_handleInputChangeEvent calls _handleSudokuComplete when node.userValueIsCorrect and board.isComplete returns true', () => {
        const node = new SudokuGameNode();
        page._removeErrorSignals = jest.fn();
        page._handleUserValueError = jest.fn();
        node.userValueIsCorrect.mockReturnValueOnce(true);
        page.board.isComplete.mockReturnValueOnce(true);
        page._handleSudokuComplete = jest.fn();

        page._handleInputChangeEvent(node);

        expect(page._handleSudokuComplete).toHaveBeenCalledTimes(1);
    });

    test('_handleInputChangeEvent calls _handleUserValueError return value of board.getInvalidNodes', () => {
        const node = new SudokuGameNode();
        const retVal = [node];
        node.userValueIsCorrect.mockReturnValueOnce(false);
        page._handleUserValueError = jest.fn();
        page._removeErrorSignals = jest.fn();
        page.board.getInvalidNodes = jest.fn().mockReturnValueOnce(retVal);
        page.board.isNodeInvalid = jest.fn().mockReturnValueOnce(true);

        page._handleInputChangeEvent(node);

        expect(page._handleUserValueError).toHaveBeenCalledWith(retVal);
    });

    test('_handleInputChangeEvent calls _removeErrorSignals', () => {
        const node = new SudokuGameNode();
        const retVal = [];
        node.userValueIsCorrect.mockReturnValueOnce(false);
        page._handleUserValueError = jest.fn();
        page._removeErrorSignals = jest.fn();
        page.board.getInvalidNodes = jest.fn().mockReturnValueOnce(retVal);

        page._handleInputChangeEvent(node);

        expect(page._removeErrorSignals).toHaveBeenCalledTimes(1);
    });

    test('_handleSudokuComplete displays gameOverModal', async (done) => {
        $('#gameOverModal').on('shown.bs.modal', (event) => {
            expect(event.target).toHaveClass('show');
            done();
        });

        page._handleSudokuComplete();
    });

    test('_handleClickResetButton calls reset on board property', () => {
        page.board = new SudokuBoard();
        page._startTimer = jest.fn();

        page._handleClickResetButton();

        expect(page.board.reset).toHaveBeenCalledTimes(1);
    });

    test('_handleClickHintButton calls getHint on board property', () => {
        const mockRetVal = jest.fn();
        page._handleInputChangeEvent = jest.fn();
        page.board.getHint.mockReturnValueOnce(mockRetVal);

        page._handleClickHintButton();

        expect(page.board.getHint).toHaveBeenCalledTimes(1);
    });

    test('_handleClickHintButton calls _handleInputChangeEvent with return value of getHint', () => {
        const mockRetVal = jest.fn();
        page._handleInputChangeEvent = jest.fn();
        page.board.getHint.mockReturnValueOnce(mockRetVal);

        page._handleClickHintButton();

        expect(page._handleInputChangeEvent).toHaveBeenCalledWith(mockRetVal);
    });

    test('_handleClickHintButton is called when the hint button is clicked', () => {
        page._handleClickHintButton = jest.fn();

        document.getElementById('hintBtn').click();

        expect(page._handleClickHintButton).toHaveBeenCalledTimes(1);
    });

    test.each([
        ['setDifficultyEasy', 'easy'],
        ['setDifficultyModerate', 'moderate'],
        ['setDifficultyHard', 'hard'],
        ['setDifficultyVeryHard', 'veryHard'],
    ])(
        '_handleChangeDifficulty calls %s with callback that calls _updateDifficulty on board property when event.target.id is %s',
        (methodName, id) => {
            page.board[methodName] = jest.fn();
            page.difficultyMap[id] = page.board[methodName];
            page._updateDifficulty = jest.fn();

            page._handleChangeDifficulty({target: {id}});

            expect(page.board[methodName]).toHaveBeenCalledTimes(1);
            page.board[methodName].mock.calls[0][0](); //call callback
            expect(page._updateDifficulty).toHaveBeenCalledTimes(1);
        },
    );

    test('_handleUserValueError calls addErrorBorder on each node in nodes parameter', () => {
        const nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        const errorRowCounts = jest.fn();
        const errorColCounts = jest.fn();
        const errorBoxCounts = jest.fn();
        page._getErrorCounts = jest.fn().mockReturnValue({errorRowCounts, errorColCounts, errorBoxCounts});
        page._addErrorSections = jest.fn();
        page.board.nodes = nodes;

        page._handleUserValueError(nodes);

        nodes.forEach((node) => expect(node.addErrorBorder).toHaveBeenCalledTimes(1));
    });

    test('_handleUserValueError calls _addErrorSections with return values of _getErrorCounts', () => {
        const nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        const errorRowCounts = jest.fn();
        const errorColCounts = jest.fn();
        const errorBoxCounts = jest.fn();
        page._getErrorCounts = jest.fn().mockReturnValue({errorRowCounts, errorColCounts, errorBoxCounts});
        page._addErrorSections = jest.fn();

        page._handleUserValueError(nodes);

        expect(page._addErrorSections).toHaveBeenCalledWith(errorRowCounts, errorColCounts, errorBoxCounts);
    });

    test('_addErrorSections calls addErrorSection on nodes as many times as their are counts for the nodes row, col, and box', () => {
        const dims = 9;
        const errorRowCounts = {0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
        const errorColCounts = {0: 0, 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
        const errorBoxCounts = {0: 0, 1: 0, 2: 1, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
        page.board.calcBoxIdx = jest.fn((row, col) => row % 3);
        page.board.nodes = [];
        for (let i = 0; i < dims; i++) {
            for (let j = 0; j < dims; j++) {
                const node = new SudokuGameNode();
                node.row = i;
                node.col = j;
                node.boxIdx = i % 3;
                page.board.nodes.push(node);
            }
        }

        page._addErrorSections(errorRowCounts, errorColCounts, errorBoxCounts);

        page.board.nodes.forEach((node) => {
            let count = 0;
            if (node.row == 0) {
                count++;
            }
            if (node.col == 1) {
                count++;
            }
            if (node.boxIdx == 2) {
                count++;
            }
            expect(node.addErrorSection).toHaveBeenCalledTimes(count);
        });
    });

    test('_getErrorCounts increments a count for each combo of nodes that share the same row, col, or box', () => {
        const expectedErrorRowCounts = {0: 1, 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
        const expectedErrorColCounts = {0: 1, 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
        const expectedErrorBoxCounts = {0: 1, 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
        page.board.calcBoxIdx = jest.fn((row, col) => row % 3);
        const nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].row = i % 2;
            nodes[i].col = i % 2;
            nodes[i].boxIdx = i % 2;
        }

        const {errorRowCounts, errorColCounts, errorBoxCounts} = page._getErrorCounts(nodes);

        expect(errorRowCounts).toEqual(expectedErrorRowCounts);
        expect(errorColCounts).toEqual(expectedErrorColCounts);
        expect(errorBoxCounts).toEqual(expectedErrorBoxCounts);
    });

    test('_removeErrorSignals calls clearErrors on each node in board', () => {
        page.board.nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];

        page._removeErrorSignals();

        page.board.nodes.forEach((node) => {
            expect(node.clearErrors).toHaveBeenCalledTimes(1);
        });
    });

    test('_handleClickShowTimer is called when showTimerBtn is clicked', () => {
        page._handleClickShowTimer = jest.fn();

        document.getElementById('showTimerBtn').click();

        expect(page._handleClickShowTimer).toHaveBeenCalledTimes(1);
    });

    test.each([
        [false, true],
        [true, false],
    ])('_handleClickShowTimer sets hidden from %s to %s on timer element', (from, to) => {
        const timer = document.getElementById('timer');
        timer.hidden = from;

        page._handleClickShowTimer();

        expect(timer.hidden).toBe(to);
    });
});
