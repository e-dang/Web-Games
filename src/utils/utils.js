function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
    // Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function millisecondsToSeconds(time) {
    return time / 1000;
}

function setSeed(seed) {
    if (seed) {
        Math.seedrandom(seed);
    }
}

module.exports = {
    sleep,
    selectRandom,
    shuffle,
    millisecondsToSeconds,
    setSeed,
};
