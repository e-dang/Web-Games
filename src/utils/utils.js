function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    sleep,
    selectRandom,
};
