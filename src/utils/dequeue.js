class DequeueNode {
    constructor(data, next = null, prev = null) {
        this.data = data;
        this.next = next;
        this.prev = prev;
    }
}

class Dequeue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    pushFront(data) {
        const node = new DequeueNode(data);
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }

        this.length++;
    }

    pushBack(data) {
        const node = new DequeueNode(data);
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }

        this.length++;
    }

    popFront() {
        if (this.isEmpty()) {
            return undefined;
        }

        const node = this.head;
        this.head = node.next;
        node.next = null;
        this.length--;
        if (!this.isEmpty()) {
            this.head.prev = null;
        }

        return node.data;
    }

    popBack() {
        if (this.isEmpty()) {
            return undefined;
        }

        const node = this.tail;
        this.tail = node.prev;
        node.prev = null;
        this.length--;
        if (!this.isEmpty()) {
            this.tail.next = null;
        }

        return node.data;
    }

    peekFront() {
        if (this.isEmpty()) {
            return undefined;
        }

        return this.head.data;
    }

    peekBack() {
        if (this.isEmpty()) {
            return undefined;
        }

        return this.tail.data;
    }

    isEmpty() {
        return this.length === 0;
    }
}

module.exports = {Dequeue, DequeueNode};
