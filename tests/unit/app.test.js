const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');

describe('test the path "/"', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with index.html on GET', async () => {
        const html = fs.readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8');

        const response = await request(app).get('/');

        expect(response.text).toBe(html);
    });
});
