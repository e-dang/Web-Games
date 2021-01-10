const app = require('../../src/app');
const request = require('supertest');

async function loadHTML(path) {
    document.documentElement.innerHTML = (await request(app).get(path)).text;
}

function clearHTML() {
    document.documentElement.innerHTML = '';
}

module.exports = {
    loadHTML,
    clearHTML,
};
