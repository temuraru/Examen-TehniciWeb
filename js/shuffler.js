
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

function shuffleOneLiner(arr1) {
    arr1.reduce((a,v)=>a.splice(Math.floor(Math.random() * a.length), 0, v) && a, []);
}

// // Used like so
// var arr = [2, 11, 37, 42];
// arr = shuffle(arr);
// console.log(arr);
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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


/*jshint -W054 */
(function (exports) {
    'use strict';

    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        var currentIndex = array.length
            , temporaryValue
            , randomIndex
        ;

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

    exports.knuthShuffle = shuffle;
}('undefined' !== typeof exports && exports || 'undefined' !== typeof window && window || global));

// (function () {
//     'use strict';
//
//     var shuffle = require('./').knuthShuffle
//         , a = [2,11,37,42]
//         , b
//     ;
//
//     // The shuffle modifies the original array
//     // calling a.slice(0) creates a copy, which is assigned to b
//     b = shuffle(a.slice(0));
//     console.log(b);
// }());
// https://jsperf.com/fyshuffle
