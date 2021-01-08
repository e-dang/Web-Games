const createPage = require('./core/create_page');
const {setSeed} = require('./utils/utils');

setSeed(document.currentScript.getAttribute('seed'));
const gameType = document.currentScript.getAttribute('game-type');
const page = createPage(gameType);
