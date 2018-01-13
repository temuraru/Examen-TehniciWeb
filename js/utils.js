/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm. (http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm)
 * https://stackoverflow.com/a/12646864
 * The Fisher-Yates algorithm works by picking one random element for each original array element, and then excluding it from the next draw. Just like randomly picking from a deck of cards.
 * This exclusion is done in a clever way (invented by Durstenfeld for use by computers) by swapping the picked element with the current element, and then picking the next random element from the remainder. For optimal efficiency, the loop runs backwards so that the random pick is simplified (it can always start at 0), and it skips the last element because there are no other choices anymore.
 * The running time of this algorithm is O(n). Note that the shuffle is done in-place. So if you do not want to modify the original array, make a copy of it first with .slice(0).
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/** Updating to ES6 / ECMAScript 2015
 * The new ES6 allows us to assign two variables at once. This is especially handy when we want to swap the values of two variables, as we can do it in one line of code.
 */
function shuffleArrayEs6(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Read a parameter value from URL
 * @param paramName string
 * @returns {string}
 */
function readUrlParam(paramName) {
    let newValue;
    let searchPart = window.location.search.replace('?', ''); // or .slice(1);
    let queryString = searchPart.split('#')[0].replace('&amp;', '&');
    let parts = queryString.split('&');
    for (let i=0; i<parts.length; i++) {
        let part = parts[i].split('=');
        if (part[0] === paramName) {
            newValue = part[1];
            break;
        }
    }

    return newValue;
}

/**
 * Sleep (time in milliseconds)
 * @param time integer
 * @returns {Promise}
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Compute container height as difference between:
 * - the visible window height and
 * - the sum of the header and footer heights
 * @returns {int}
 */
function getContainerInnerHeight() {
    let headerHeight = document.querySelector('header').scrollHeight;
    let footerHeight = document.querySelector('footer').scrollHeight;
    let windowHeight = window.innerHeight;

    let outerSpacing = (2 + 2 * 20);

    return windowHeight - (headerHeight + footerHeight + outerSpacing);
}

function getContainerInnerWidth() {
    let windowWidth = window.innerWidth;
    let outerSpacing = 2 * 2 + 2 * 20; // px = margin + border

    return windowWidth - outerSpacing;
}

/**
 * Generate a random integer between two limits
 * @param min integer
 * @param max integer
 * @returns {int}
 */
function randomInt(min, max) {
    return  Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random RGB color
 * @returns {string}
 */
function generateRandomColor(uniform, transparency) {
    let colorParts;

    uniform = uniform || false;
    transparency = transparency || false;

    if (uniform) {
        let color = randomInt(0, 255);
        colorParts = [color, color, color];
    } else {
        colorParts = [
            randomInt(0,255),
            randomInt(0,255),
            randomInt(0,255),
        ];
    }
    if (transparency) {
        colorParts.push(transparency);
    }

    return 'rgb(' + colorParts.join(',') +')';
}