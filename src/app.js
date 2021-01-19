const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {seed: ''});
});

app.get('/snake', (req, res) => {
    res.render('index', {pageName: 'Snake'});
});

app.get('/sudoku/:seed?', (req, res) => {
    res.render('index', {pageName: 'Sudoku', seed: req.params.seed});
});

app.get('/tic-tac-toe', (req, res) => {
    res.render('index', {pageName: 'Tic Tac Toe'});
});

module.exports = app;
