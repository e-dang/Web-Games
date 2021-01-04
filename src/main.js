const createPage = require('./core/create_page');

const gameType = document.currentScript.getAttribute('game-type');
const page = createPage(gameType);
