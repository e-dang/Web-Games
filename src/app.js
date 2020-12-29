const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {pageName: 'Snake'});
});

app.get('/sudoku', (req, res) => {
    res.render('index', {pageName: 'Sudoku'});
});

module.exports = app;
