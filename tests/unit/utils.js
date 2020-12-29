const fs = require('fs');
const path = require('path');

function cacheHTML(filename) {
    const html = fs.readFileSync(path.resolve(__dirname, '..', '..', 'public', filename), 'utf8');
    function innerFunc() {
        document.documentElement.innerHTML = html;
    }

    return innerFunc;
}

function clearHTML() {
    document.documentElement.innerHTML = '';
}

module.exports = {
    cacheHTML,
    clearHTML,
};
