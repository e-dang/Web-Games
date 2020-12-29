const {Dequeue, DequeueNode} = require('../../../src/utils/dequeue');

function extractData(dq) {
    let node = dq.head;
    const data = [];

    while (node != null) {
        data.push(node.data);
        node = node.next;
    }

    return data;
}

describe('Test Dequeue', () => {
    let dq;
    const data = [4, 6, 8];

    beforeEach(() => {
        dq = new Dequeue();
    });

    test.each([['head'], ['tail']])('constructor defines %s', (prop) => {
        expect(dq[prop]).toBeDefined();
    });

    test('constructor sets length prop to 0', () => {
        expect(dq.length).toBe(0);
    });

    test('peekFront returns undefined when dequeue is empty', () => {
        dq.isEmpty = jest.fn().mockReturnValueOnce(true);

        const retVal = dq.peekFront();

        expect(retVal).toBe(undefined);
    });

    test('peekBack returns undefined when dequeue is empty', () => {
        dq.isEmpty = jest.fn().mockReturnValueOnce(true);

        const retVal = dq.peekBack();

        expect(retVal).toBe(undefined);
    });

    test('isEmpty returns true when length is 0', () => {
        dq.length = 0;

        const retVal = dq.isEmpty();

        expect(retVal).toBe(true);
    });

    test('isEmpty returns false when length is not 0', () => {
        dq.length = 1;

        const retVal = dq.isEmpty();

        expect(retVal).toBe(false);
    });

    describe('test push, pop, and peek from front', () => {
        beforeEach(() => {
            data.forEach((val) => dq.pushFront(val));
        });

        test('pushFront increments length', () => {
            expect(dq.length).toBe(data.length);
        });

        test('pushFront adds data to front of dequeue', () => {
            const dqData = extractData(dq);
            dqData.forEach((val, idx) => {
                expect(val).toBe(data[data.length - 1 - idx]);
            });
        });

        test('peekFront returns data at front of dequeue', () => {
            const retVal = dq.peekFront();

            expect(retVal).toBe(8);
        });

        test('popFront pops from front of dequeue', () => {
            expect(dq.popFront()).toBe(8);
            expect(dq.popFront()).toBe(6);
            expect(dq.popFront()).toBe(4);
            expect(dq.popFront()).toBe(undefined);
        });

        test('popFront decrements length', () => {
            while (dq.popFront()) {
                continue;
            }

            expect(dq.length).toBe(0);
        });
    });

    describe('test push, pop, and peek from back', () => {
        beforeEach(() => {
            data.forEach((val) => dq.pushBack(val));
        });

        test('pushBack increments length', () => {
            expect(dq.length).toBe(data.length);
        });

        test('pushBack adds data to back of dequeue', () => {
            const dqData = extractData(dq);
            dqData.forEach((val, idx) => {
                expect(val).toBe(data[idx]);
            });
        });

        test('peekBack returns data at back of dequeue', () => {
            const retVal = dq.peekBack();

            expect(retVal).toBe(8);
        });

        test('popBack pops from back of dequeue', () => {
            expect(dq.popBack()).toBe(8);
            expect(dq.popBack()).toBe(6);
            expect(dq.popBack()).toBe(4);
            expect(dq.popBack()).toBe(undefined);
        });

        test('popBack decrements length', () => {
            while (dq.popBack()) {
                continue;
            }

            expect(dq.length).toBe(0);
        });
    });
});

describe('Test DequeueNode', () => {
    let node;
    const data = 1;
    const next = 2;
    const prev = 3;

    beforeEach(() => {
        node = new DequeueNode(data, next, prev);
    });

    test('constructor sets data prop to data param', () => {
        expect(node.data).toBe(data);
    });

    test('constructor sets next prop to next param', () => {
        expect(node.next).toBe(next);
    });

    test('constructor sets prev prop to prev param', () => {
        expect(node.prev).toBe(prev);
    });
});
