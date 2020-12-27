const BoardController = require('./board/board_controller');

const nodeType = document.currentScript.getAttribute('node-type');
const controller = new BoardController(20, nodeType);
