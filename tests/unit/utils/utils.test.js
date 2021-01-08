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

    describe('test shuffle', () => {
        let arr;

        beforeEach(() => {
            arr = [1, 2, 3, 4];
            Math.random = jest
                .fn()
                .mockReturnValueOnce(0.1)
                .mockReturnValueOnce(0.2)
                .mockReturnValueOnce(0.45)
                .mockReturnValueOnce(0.9);
        });

        test('shuffle calls Math.random', () => {
            utils.shuffle(arr);

            expect(Math.random).toHaveBeenCalledTimes(arr.length);
        });

        test('shuffle returns an array containing the same elements of original array but in different order', () => {
            const retVal = utils.shuffle([...arr]);

            expect(retVal.length).toBe(arr.length);
            expect(retVal).not.toStrictEqual(arr);
            arr.forEach((val) => {
                expect(retVal).toContain(val);
            });
        });
    });

    test('millisecondsToSeconds converts millisconds to seconds', () => {
        const time = Date.now();

        const retVal = utils.millisecondsToSeconds(time);

        expect(retVal).toBe(time / 1000);
    });
});
