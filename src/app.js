const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/snake', (req, res) => {
    res.render('index', {pageName: 'Snake', seed: ''});
});

app.get('/sudoku/:seed?', (req, res) => {
    res.render('index', {pageName: 'Sudoku', seed: req.params.seed});
});

module.exports = app;
