const PageController = require('./core/page_controller');

const gameType = document.currentScript.getAttribute('game-type');
const controller = new PageController(gameType);
