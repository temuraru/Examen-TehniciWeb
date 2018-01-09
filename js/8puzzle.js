"use strict";
const EMPTY_TILE = ' ';
const TILE_WIDTH = 34; // 34px
const TILE_SPACING = 14; // 14px = 10 (5+5-padding) + 4 (2+2-border)
const DEFAULT_SIZE = 3; // 3 x 3 puzzle

let tilesPerLine = detectPuzzleSize();
let totalTiles = tilesPerLine * tilesPerLine;
let tiles;
let totalMoves = 0;

function drawPuzzle() {
    let tilesContainer = document.getElementById('tilesContainer');
    let containerLength = TILE_WIDTH * tilesPerLine + TILE_SPACING;
    tilesContainer.innerHTML = '';
    tilesContainer.style.width = containerLength+'px';
    tilesContainer.style.height = containerLength+'px';
    console.log('tiles: ', tiles);
    for (let i = 1; i <= totalTiles; i++) {
        let tile = document.createElement('span');
        tile.id = 'tile_' + (i - 1);
        tile.className = 'bevel tex-bevel tile ';
        let validState = 'invalid';
        if (i === tiles[i - 1]) {
            validState = 'valid';
        }
        if (tiles[totalTiles - 1] === EMPTY_TILE) {
            validState = 'valid';
        }
        tile.className += validState;
        tile.innerHTML = tiles[i-1];
        tilesContainer.appendChild(tile);
    }

    totalMoves ++;

    document.getElementById('totalMoves').innerText = totalMoves;
    document.getElementById('validTiles').innerText = document.querySelectorAll('.tile.valid').length;
    document.getElementById('invalidTiles').innerText = document.querySelectorAll('.tile.invalid').length;

    handleResults();
    handleKeyboard();
    handleMouseClicks();
}

function handleResults() {
    let result = document.getElementById('result');
    if (isValidStructure() && totalMoves > 1) {
        result.className = '';
    } else {
        result.className = 'hidden';
    }
}

function exchangeTiles(targetIndex) {
    let currentTileIndex = tiles.indexOf(EMPTY_TILE);
    let aux = tiles[targetIndex];
    // console.log('exchangeTiles: targetIndex: ', targetIndex);
    // console.log('exchangeTiles: currentTileIndex: ', currentTileIndex);
    // console.log('exchangeTiles: aux: ', aux);
    if (targetIndex >= totalTiles || targetIndex < 0) {
        console.log('Invalid targetIndex: ' + targetIndex + '!');
        return;
    }

    tiles[targetIndex] = EMPTY_TILE;
    tiles[currentTileIndex] = aux;
}


function addVisualFeedback(direction, targetIndex) {
    let moveMonitor = document.getElementById('moveMonitor');
    moveMonitor.innerText = direction;
    moveMonitor.className = '';

    let monitorDirectionKey = document.querySelector('#keyboardKeys .'+direction);
    let monitorDirectionKeyClassName = direction;

    if (targetIndex >= 0) {
        monitorDirectionKeyClassName += ' active';
    } else {
        monitorDirectionKeyClassName += ' error';
        moveMonitor.className += ' error';
    }

    monitorDirectionKey.className = monitorDirectionKeyClassName;
    setTimeout(function() {
        monitorDirectionKey.className = direction;
    }, 1000);
}

let handleKeyPress = function(keyCode) {
    let direction = computeKeyboardDirection(keyCode);
    console.log('keyCode: ', keyCode, '; direction: ', direction);
    if ( !direction ) {
        return;
    }

    let targetIndex = getKeyboardTargetIndex(direction);
    renderPuzzle(targetIndex, direction);
};
function getKeyboardTargetIndex(direction) {
    let currentTileIndex = tiles.indexOf(EMPTY_TILE);
    let targetIndex = -1;
    if (direction === 'up' && currentTileIndex >= tilesPerLine) {
        targetIndex = currentTileIndex - tilesPerLine;
    }
    if (direction === 'down' && (currentTileIndex < totalTiles - tilesPerLine)) {
        targetIndex  = currentTileIndex + tilesPerLine;
    }
    if (direction === 'left' && ((currentTileIndex % tilesPerLine) > 0)) {
        targetIndex = currentTileIndex - 1;
    }
    if (direction === 'right' && ((currentTileIndex % tilesPerLine) < tilesPerLine - 1)) {
        targetIndex = currentTileIndex + 1;
    }

    // console.log('getKeyboardTargetIndex: currentTileIndex: ', currentTileIndex);
    // console.log('getKeyboardTargetIndex: targetIndex: ', targetIndex);
    // console.log('getKeyboardTargetIndex: totalTiles: ', totalTiles);
    // console.log('getKeyboardTargetIndex: tilesPerLine: ', tilesPerLine);
    // console.log('getKeyboardTargetIndex: (currentTileIndex % tilesPerLine): ', (currentTileIndex % tilesPerLine));
    return (targetIndex >= 0 ? targetIndex : -1);
}
function computeKeyboardDirection(keyCode) {
    const keysMap = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    let direction = false;
    for(let key in keysMap) {
        if (keyCode === parseInt(key, 10)) {
            direction = keysMap[keyCode];
        }
    }

    return direction;
}

function handleKeyboard() {
    let body = document.querySelector('body');
    body.onkeydown = function (e) {
        handleKeyPress(e.keyCode);
    };
}

/**
 * Manage the mouse clicks on the puzzle tiles
 *
 */
function handleMouseClicks() {
    let handleMouseClick = function() {
        let targetIndex = parseInt(this.id.replace('tile_', ''), 10);
        moveTile(targetIndex);
    };

    let spans = document.querySelectorAll('span.tile');
    for (let i = 0; i < spans.length; i++) {
        let tile = spans[i];
        tile.addEventListener("click", handleMouseClick);
    }
}

/**
 * Manage the Onscreen Keyboard / clicking on the virtual keys
 * - get the keycode corresponding to each directional key
 * - on each 'keypress' / mouse click, call the method that handles the key press event
 */
function handleOnscreenKeyboard() {
    let handleMouseClickOnscreenKeyboard = function() {
        let keyCode = parseInt(this.dataset.keycode, 10);
        handleKeyPress(keyCode);
    };

    let keys = document.querySelectorAll('#keyboardKeys span');
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        key.addEventListener("click", handleMouseClickOnscreenKeyboard);
    }
}

function moveTile(targetIndex) {
    let possibleMoves = getPossibleMoves();
    let possibleDirections = Object.keys(possibleMoves);

    let direction = false;
    for (let key in possibleDirections) {
        if (possibleMoves[possibleDirections[key]] === targetIndex) {
            direction = possibleDirections[key];
        }
    }

    // let direction = computeDirectionMouse(targetIndex);
    if (!direction) {
        console.log('Move not allowed! Target position: ', targetIndex + 1);
    } else {
        renderPuzzle(targetIndex, direction);
    }
}

function renderPuzzle(targetIndex, direction) {
    direction = direction || false;
    if (direction) {
        addVisualFeedback(direction, targetIndex);
    }

    if (targetIndex >= 0) {
        exchangeTiles(targetIndex);
        drawPuzzle();
    }
}

function randomizeLayout() {
    let nrOfRandomMoves = tilesPerLine * 10 + Math.floor(Math.random()*10);
    let randomIterations = document.getElementById('randomIterations');
    let interval;
    let makeNewRandomMove = function() {
        if (nrOfRandomMoves > 0) {
            randomIterations.innerText = '#' + nrOfRandomMoves;
            let possibleMoves = getPossibleMoves();
            let possibleDirections = Object.keys(possibleMoves);
            shuffleArrayEs6(possibleDirections);
            let newRandomDirection = possibleDirections.shift();
            let targetIndex = possibleMoves[newRandomDirection];

            renderPuzzle(targetIndex, newRandomDirection);
            nrOfRandomMoves--;
        } else {
            randomIterations.innerText = '';
            document.getElementById('totalMoves').innerText = 0;
            clearInterval(interval);
        }
    };
    interval = setInterval(makeNewRandomMove, 200);
}

function getPossibleMoves() {
    let currentTileIndex = tiles.indexOf(EMPTY_TILE);
    let currentTilePosition = currentTileIndex + 1;
    let possibleMoves = {};
    // console.log('currentTileIndex: ', currentTileIndex, 'currentTilePosition: ', currentTilePosition, '(currentTilePosition % tilesPerLine): ',(currentTilePosition % tilesPerLine), '(tilesPerLine - 1):', (tilesPerLine - 1));

    // the position UP from the currentTile
    if (currentTilePosition > tilesPerLine) {
        possibleMoves['up'] = currentTileIndex - tilesPerLine;
    }
    // the position DOWN from the currentTile
    if (currentTilePosition <= tilesPerLine * (tilesPerLine - 1)) {
        possibleMoves['down'] = currentTileIndex + tilesPerLine;
    }
    if ((currentTilePosition % tilesPerLine) === 0) {
        // the position to the LEFT of the currentTile
        possibleMoves['left'] = currentTileIndex - 1;
    } else {
        if ((currentTilePosition % tilesPerLine) === (tilesPerLine + 1)) {
            // the position to the RIGHT of the currentTile
            possibleMoves['right'] = currentTileIndex + 1;
        } else {
            // the position to the LEFT of the currentTile
            possibleMoves['left'] = currentTileIndex - 1;
            // the position to the RIGHT of the currentTile
            possibleMoves['right'] = currentTileIndex + 1;
        }
    }
    // console.log('possibleMoves: ', possibleMoves);

    return possibleMoves;
}

function createSelector() {
    let selector = document.getElementById('sizeSelector');
    let length = 4;
    while (length < 10) {
        let option = document.createElement('option');
        option.value = length + '';
        option.text = length + ' x ' + length;
        if (length === tilesPerLine) {
            option.selected = true;
        }
        selector.appendChild(option);
        length++;
    }
    selector.value = tilesPerLine;
    selector.options[tilesPerLine - 3].selected = true;

    selector.addEventListener('change', function(event) {
        let value = selector.options[selector.selectedIndex].value;
        window.location.href = window.location.pathname + '?size=' + value;
    })
}

function readUrlParam(paramName) {
    let newValue = 0;
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

function detectPuzzleSize() {
    let size = DEFAULT_SIZE; // default

    let newSize = parseInt(readUrlParam('size'), 10);
    if (newSize >= DEFAULT_SIZE && newSize < 10) {
        size = newSize;
    }

    return size;
}

function isValidStructure() {
    let isValid = true;
    for (let i = 0; i < totalTiles - 2; i++) {
        if (tiles[i] !== i+1) {
            isValid = false;
            console.log('invalid: : ', i, tiles[i], i+1);
            break;
        }
    }
    console.log('isValidStructure: ', isValid);

    return isValid;
}

function createTiles() {
    tiles = [];
    for (let i = 0; i < totalTiles - 1; i++) {
        tiles[i] = i+1;
    }
    tiles[totalTiles - 1] = EMPTY_TILE;
}

let init = function() {
    createSelector();
    createTiles();
    handleOnscreenKeyboard();
    drawPuzzle();
    document.getElementById('randomize').addEventListener('click', randomizeLayout);
};
document.addEventListener('DOMContentLoaded', init);

