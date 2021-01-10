const utils = require('../utils/utils');

class SudokuSolver {
    *solve(board) {
        const [rowBitMap, colBitMap, boxBitMap] = this._getBitMaps(board);
        const func = (row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap) =>
            this._isValidGuess(row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap);
        yield* this._solveHelper(0, 0, rowBitMap, colBitMap, boxBitMap, board, func);
    }

    calcNumSolutions(board) {
        return [...this.solve(board)].length;
    }

    hasMoreThanOneSolution(board, prunedNode = null) {
        // store original trueValues because generator is not ran to termination
        const origValues = board.nodes.map((node) => node.trueValue);

        const retVal =
            prunedNode === null
                ? this._hasMoreThanOneSolution(board)
                : this._hasMoreThanOneSolutionPruned(board, prunedNode);

        // restore orig node values
        board.nodes.forEach((node, idx) => (node.trueValue = origValues[idx]));

        return retVal;
    }

    isNodeInvalid(board, node) {
        if (node.isGivenNode()) {
            return false;
        }

        const [rowBitMap, colBitMap, boxBitMap] = this._getBitMaps(board);
        const value = node.getInputValue();
        const boxIdx = board.calcBoxIdx(node.row, node.col);
        return (
            value &&
            (!this._getBit(rowBitMap[node.row], value - 1) ||
                !this._getBit(colBitMap[node.col], value - 1) ||
                !this._getBit(boxBitMap[boxIdx], value - 1))
        );
    }

    getInvalidNodes(board) {
        const [rowBitMap, colBitMap, boxBitMap] = this._getBitMaps(board);
        const invalidNodes = [];

        for (let row = 0; row < board.dims; row++) {
            for (let col = 0; col < board.dims; col++) {
                const node = board.getNode(row, col);
                if (node.isGivenNode()) {
                    continue;
                }

                const boxIdx = board.calcBoxIdx(row, col);
                const value = node.getInputValue();
                const rowTaken = !this._getBit(rowBitMap[row], value - 1);
                const colTaken = !this._getBit(colBitMap[col], value - 1);
                const boxTaken = !this._getBit(boxBitMap[boxIdx], value - 1);
                if (!value && !rowTaken && !colTaken && !boxTaken) {
                    continue;
                }

                invalidNodes.push(node);
                if (rowTaken) {
                    invalidNodes.push(this._getDuplicate((col) => board.getNode(row, col), value, board.dims, node));
                }

                if (colTaken) {
                    invalidNodes.push(this._getDuplicate((row) => board.getNode(row, col), value, board.dims, node));
                }

                if (boxTaken) {
                    invalidNodes.push(
                        this._getDuplicate((i) => board.getNodeInBox(i, boxIdx), value, board.dims, node),
                    );
                }
            }
        }
        return invalidNodes;
    }

    _getDuplicate(selector, value, dims, origNode) {
        for (let i = 0; i < dims; i++) {
            const node = selector(i);
            if (node.trueValue == value && node.idx != origNode.idx) {
                return node;
            }
        }
    }

    _hasMoreThanOneSolution(board) {
        const generator = this.solve(board);
        generator.next();
        return !generator.next().done;
    }

    _hasMoreThanOneSolutionPruned(board, prunedNode) {
        const func = (row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap) =>
            this._isValidGuessPruned(row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap, prunedNode);
        const [rowBitMap, colBitMap, boxBitMap] = this._getBitMaps(board);
        const generator = this._solveHelper(0, 0, rowBitMap, colBitMap, boxBitMap, board, func);
        return !generator.next().done;
    }

    _getBitMaps(board) {
        const rowBitMap = [];
        const colBitMap = [];
        const boxBitMap = [];

        for (let i = 0; i < board.dims; i++) {
            rowBitMap.push(-1);
            colBitMap.push(-1);
            boxBitMap.push(-1);
        }

        for (let row = 0; row < board.dims; row++) {
            for (let col = 0; col < board.dims; col++) {
                const node = board.getNode(row, col);
                if (this._isNullNode(node)) {
                    continue;
                }

                const boxIdx = board.calcBoxIdx(row, col);
                rowBitMap[row] = this._clearBit(rowBitMap[row], node.trueValue - 1);
                colBitMap[col] = this._clearBit(colBitMap[col], node.trueValue - 1);
                boxBitMap[boxIdx] = this._clearBit(boxBitMap[boxIdx], node.trueValue - 1);
            }
        }

        return [rowBitMap, colBitMap, boxBitMap];
    }

    _isValidGuess(row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap) {
        return (
            this._getBit(rowBitMap[row], value) &&
            this._getBit(colBitMap[col], value) &&
            this._getBit(boxBitMap[boxIdx], value)
        );
    }

    _isValidGuessPruned(row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap, node) {
        return (
            this._isValidGuess(row, col, boxIdx, value, rowBitMap, colBitMap, boxBitMap) &&
            !(row == node.row && col == node.col && value + 1 == node.trueValue)
        );
    }

    *_solveHelper(row, col, rowBitMap, colBitMap, boxBitMap, board, isValidGuess) {
        if (board.isInvalidSpace(row, col)) {
            yield;
        } else {
            const [nextRow, nextCol] = this._getNextMove(row, col, board.dims);
            const currNode = board.getNode(row, col);
            if (!this._isNullNode(currNode)) {
                yield* this._solveHelper(nextRow, nextCol, rowBitMap, colBitMap, boxBitMap, board, isValidGuess);
            }

            const boxIdx = board.calcBoxIdx(row, col);
            const prevRowBitMap = rowBitMap[row];
            const prevColBitMap = colBitMap[col];
            const prevBoxBitMap = boxBitMap[boxIdx];
            const prevNodeValue = currNode.trueValue;
            const randValues = this._getRandValues(board.dims);
            for (let i of randValues) {
                if (isValidGuess(row, col, boxIdx, i, rowBitMap, colBitMap, boxBitMap)) {
                    currNode.trueValue = i + 1;
                    rowBitMap[row] = this._clearBit(rowBitMap[row], i);
                    colBitMap[col] = this._clearBit(colBitMap[col], i);
                    boxBitMap[boxIdx] = this._clearBit(boxBitMap[boxIdx], i);

                    yield* this._solveHelper(nextRow, nextCol, rowBitMap, colBitMap, boxBitMap, board, isValidGuess);

                    rowBitMap[row] = prevRowBitMap;
                    colBitMap[col] = prevColBitMap;
                    boxBitMap[boxIdx] = prevBoxBitMap;
                    currNode.trueValue = prevNodeValue;
                }
            }
        }
    }

    _isNullNode(node) {
        return node.trueValue === null || node.isInputNode();
    }

    _getRandValues(dimensions) {
        const arr = [];
        for (let i = 0; i < dimensions; i++) {
            arr.push(i);
        }

        return utils.shuffle(arr);
    }

    _getNextMove(row, col, numCols) {
        const nextCol = (col + 1) % numCols;
        if (nextCol == 0) {
            return [row + 1, nextCol];
        }
        return [row, nextCol];
    }

    _getBit(bitMap, pos) {
        return bitMap & (1 << pos);
    }

    _clearBit(bitMap, pos) {
        return bitMap & ~(1 << pos);
    }
}

module.exports = SudokuSolver;
