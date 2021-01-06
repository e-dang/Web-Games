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

    test('constructor calls reset method on board property', () => {
        expect(page.board.reset).toHaveBeenCalledTimes(1);
    });

    test('_handleInputChangeEvent calls _handleSudokuComplete when node.userValueIsCorrect and board.isComplete returns true', () => {
        const node = new SudokuGameNode();
        node.userValueIsCorrect.mockReturnValueOnce(true);
        page.board.isComplete.mockReturnValueOnce(true);
        page._handleSudokuComplete = jest.fn();

        page._handleInputChangeEvent(node);

        expect(page._handleSudokuComplete).toHaveBeenCalledTimes(1);
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
});
