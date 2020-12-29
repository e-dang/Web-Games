const request = require('supertest');
const app = require('../../src/app');
const path = require('path');
const ejs = require('ejs');

describe('test the path "/"', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with index.html on GET', async () => {
        const html = await ejs.renderFile(path.resolve(global.PROJECT_DIR, 'views', 'index.ejs'), {
            pageName: 'Snake',
        });

        const response = await request(app).get('/');

        expect(response.text).toBe(html);
    });
});
