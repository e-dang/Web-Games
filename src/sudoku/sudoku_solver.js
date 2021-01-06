const utils = require('../utils/utils');

class SudokuSolver {
    *solve(board) {
        const [rowBitMap, colBitMap, boxBitMap] = this._getBitMaps(board);
        yield* this._solveHelper(0, 0, rowBitMap, colBitMap, boxBitMap, board);
    }

    calcNumSolutions(board) {
        return [...this.solve(board)].length;
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

                const boxIdx = this._calcBoxIdx(row, col);
                rowBitMap[row] = this._clearBit(rowBitMap[row], node.trueValue - 1);
                colBitMap[col] = this._clearBit(colBitMap[col], node.trueValue - 1);
                boxBitMap[boxIdx] = this._clearBit(boxBitMap[boxIdx], node.trueValue - 1);
            }
        }

        return [rowBitMap, colBitMap, boxBitMap];
    }

    *_solveHelper(row, col, rowBitMap, colBitMap, boxBitMap, board) {
        if (board.isInvalidSpace(row, col)) {
            yield;
        } else {
            const [nextRow, nextCol] = this._getNextMove(row, col, board.dims);
            const currNode = board.getNode(row, col);
            if (!this._isNullNode(currNode)) {
                yield* this._solveHelper(nextRow, nextCol, rowBitMap, colBitMap, boxBitMap, board);
            }

            const boxIdx = this._calcBoxIdx(row, col);
            const prevRowBitMap = rowBitMap[row];
            const prevColBitMap = colBitMap[col];
            const prevBoxBitMap = boxBitMap[boxIdx];
            const prevNodeValue = currNode.trueValue;
            const randValues = this._getRandValues(board.dims);
            for (let i of randValues) {
                if (
                    this._getBit(rowBitMap[row], i) &&
                    this._getBit(colBitMap[col], i) &&
                    this._getBit(boxBitMap[boxIdx], i)
                ) {
                    currNode.trueValue = i + 1;
                    rowBitMap[row] = this._clearBit(rowBitMap[row], i);
                    colBitMap[col] = this._clearBit(colBitMap[col], i);
                    boxBitMap[boxIdx] = this._clearBit(boxBitMap[boxIdx], i);

                    yield* this._solveHelper(nextRow, nextCol, rowBitMap, colBitMap, boxBitMap, board);

                    rowBitMap[row] = prevRowBitMap;
                    colBitMap[col] = prevColBitMap;
                    boxBitMap[boxIdx] = prevBoxBitMap;
                }
            }

            currNode.trueValue = prevNodeValue;
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

    _calcBoxIdx(row, col) {
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
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
