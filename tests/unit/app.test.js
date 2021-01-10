const request = require('supertest');
const app = require('../../src/app');
const path = require('path');
const ejs = require('ejs');

describe('test the path "/snake"', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/snake');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with index.html on GET', async () => {
        const html = await ejs.renderFile(path.resolve(global.PROJECT_DIR, 'views', 'index.ejs'), {
            pageName: 'Snake',
            seed: '',
        });

        const response = await request(app).get('/snake');

        expect(response.text).toBe(html);
    });
});

describe('test the path "/sudoku"', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/sudoku');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with index.html on GET', async () => {
        const html = await ejs.renderFile(path.resolve(global.PROJECT_DIR, 'views', 'index.ejs'), {
            pageName: 'Sudoku',
            seed: '',
        });

        const response = await request(app).get('/sudoku');

        expect(response.text).toBe(html);
    });
});

describe('test the path "/tic-tac-toe"', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/tic-tac-toe');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with index.html on GET', async () => {
        const html = await ejs.renderFile(path.resolve(global.PROJECT_DIR, 'views', 'index.ejs'), {
            pageName: 'Tic Tac Toe',
            seed: '',
        });

        const response = await request(app).get('/tic-tac-toe');

        expect(response.text).toBe(html);
    });
});
