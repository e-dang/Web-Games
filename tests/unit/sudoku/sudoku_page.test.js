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
        node.userValueIsCorrect.mockReturnValueOnce(true);
        page.board.isComplete.mockReturnValueOnce(true);
        page._handleSudokuComplete = jest.fn();

        page._handleInputChangeEvent(node);

        expect(page._handleSudokuComplete).toHaveBeenCalledTimes(1);
    });

    test('_handleInputChangeEvent calls _handleUserValueError with event node and return value of board.getInvalidNodes when user value is not correct', () => {
        const node = new SudokuGameNode();
        const retVal = [node];
        node.userValueIsCorrect.mockReturnValueOnce(false);
        page._handleUserValueError = jest.fn();
        page.board.getInvalidNodes = jest.fn().mockReturnValueOnce(retVal);

        page._handleInputChangeEvent(node);

        expect(page._handleUserValueError).toHaveBeenCalledWith(node, retVal);
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

        page._handleClickResetButton();

        expect(page.board.reset).toHaveBeenCalledTimes(1);
    });

    test('_handleClickResetButton is called when the reset button is clicked', () => {
        page._handleClickResetButton = jest.fn();

        document.getElementById('resetBtn').click();

        expect(page._handleClickResetButton).toHaveBeenCalledTimes(1);
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

    test('_updateDifficulty sets textContent of currentDifficulty HTML element to textContent of events target', () => {
        const textContent = 'some text';
        const currDiff = document.getElementById('currentDifficulty');

        page._updateDifficulty({target: {textContent}});

        expect(currDiff.textContent).toBe(textContent);
    });

    test('_updateDifficulty calls _handleClickResetButton', () => {
        const textContent = 'some text';
        page._handleClickResetButton = jest.fn();

        page._updateDifficulty({target: {textContent}});

        expect(page._handleClickResetButton).toHaveBeenCalledTimes(1);
    });

    test('_setDefaultDifficulty calls _handleChangeDifficulty', () => {
        page._handleChangeDifficulty = jest.fn();

        page._setDefaultDifficulty();

        expect(page._handleChangeDifficulty).toHaveBeenCalledTimes(1);
    });

    test('_setDefaultDifficulty calls setDifficultyEasy on board prop', () => {
        page.board.setDifficultyEasy = jest.fn();

        page._setDefaultDifficulty();

        expect(page.board.setDifficultyEasy).toHaveBeenCalledTimes(1);
    });

    test.each([['easy'], ['moderate'], ['hard'], ['veryHard']])(
        '_handleChangeDifficulty is called when %s button is clicked',
        (btnId) => {
            page._handleChangeDifficulty = jest.fn();

            document.getElementById(btnId).click();

            expect(page._handleChangeDifficulty).toHaveBeenCalledTimes(1);
        },
    );

    test.each([
        ['setDifficultyEasy', 'easy'],
        ['setDifficultyModerate', 'moderate'],
        ['setDifficultyHard', 'hard'],
        ['setDifficultyVeryHard', 'veryHard'],
    ])(
        '_handleChangeDifficulty calls %s with callback that calls _updateDifficulty on board property when event.target.id is %s',
        (methodName, id) => {
            page.board[methodName] = jest.fn();
            page._updateDifficulty = jest.fn();

            page._handleChangeDifficulty({target: {id}});

            expect(page.board[methodName]).toHaveBeenCalledTimes(1);
            page.board[methodName].mock.calls[0][0](); //call callback
            expect(page._updateDifficulty).toHaveBeenCalledTimes(1);
        },
    );

    test('_handleUserValueError calls addErrorBorder on each node in nodes parameter', () => {
        const nodes = [new SudokuGameNode(), new SudokuGameNode(), new SudokuGameNode()];
        page.board.nodes = nodes;

        page._handleUserValueError(nodes[0], nodes);

        nodes.forEach((node) => expect(node.addErrorBorder).toHaveBeenCalledTimes(1));
    });

    test('_handleUserValueError calls addErrorSection on each node in nodes parameter that shares a row, col, or box with userInputNode', () => {
        const dims = 9;
        page.board.calcBoxIdx.mockReturnValue((node) => node.boxIdx);
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
        const userInputNode = page.board.nodes[0];

        page._handleUserValueError(userInputNode, page.board.nodes);

        page.board.nodes.forEach((node) => {
            if (node.col == userInputNode.col || node.row == userInputNode.row || node.boxIdx == userInputNode.boxIdx) {
                expect(node.addErrorSection).toHaveBeenCalled();
            }
        });
    });
});
