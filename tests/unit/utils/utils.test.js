const utils = require('../../../src/utils/utils');

describe('Test utils', () => {
    test('selectRandom can return last index of array', () => {
        Math.random = jest.fn().mockReturnValueOnce(0.99);
        const arr = [0, 1, 2, 3];

        const retVal = utils.selectRandom(arr);

        expect(retVal).toBe(arr[arr.length - 1]);
    });

    test('selectRandom can return first index of array', () => {
        Math.random = jest.fn().mockReturnValueOnce(0.01);
        const arr = [0, 1, 2, 3];

        const retVal = utils.selectRandom(arr);

        expect(retVal).toBe(arr[0]);
    });
});
