const Page = require('../../../src/core/page');

function createBtn(btn) {
    const element = document.createElement('button');
    element.id = btn;
    document.body.appendChild(element);
}

describe('test Page', () => {
    let page;
    let difficultyMap;

    beforeEach(() => {
        difficultyMap = {
            easy: jest.fn(),
            moderate: jest.fn(),
            hard: jest.fn(),
        };
        createBtn('resetBtn');
        createBtn('easy');
        createBtn('moderate');
        createBtn('hard');
        createBtn('currentDifficulty');
        page = new Page(difficultyMap);
    });

    test('constructor sets difficultyMap to difficultyMap param', () => {
        expect(page.difficultyMap).toEqual(difficultyMap);
    });

    test('_handleClickResetButton is called when the reset button is clicked', () => {
        page.addClickResetButtonEventHandler();
        page._handleClickResetButton = jest.fn();

        document.getElementById('resetBtn').click();

        expect(page._handleClickResetButton).toHaveBeenCalledTimes(1);
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
        page.addChangeDifficultyEventHandlers();
        page._handleChangeDifficulty = jest.fn();

        page._setDefaultDifficulty();

        expect(page._handleChangeDifficulty).toHaveBeenCalledTimes(1);
    });

    test('_setDefaultDifficulty calls the function mapped to easy in difficulty map', () => {
        page.addChangeDifficultyEventHandlers();
        page._setDefaultDifficulty();

        expect(page.difficultyMap.easy).toHaveBeenCalledTimes(1);
    });

    test.each([['easy'], ['moderate'], ['hard']])(
        '_handleChangeDifficulty is called when %s button is clicked',
        (btnId) => {
            page.addChangeDifficultyEventHandlers();
            page._handleChangeDifficulty = jest.fn();

            document.getElementById(btnId).click();

            expect(page._handleChangeDifficulty).toHaveBeenCalledTimes(1);
        },
    );
});
