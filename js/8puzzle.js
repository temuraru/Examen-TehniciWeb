"use strict";
const EMPTY_TILE = ' ';
const TILE_WIDTH = 34; // 34px
const TILE_SPACING = 14; // 14px = 10 (5+5-padding) + 4 (2+2-border)
const DEFAULT_SIZE = 3; // 3 x 3 puzzle
const MAX_BOARD_SIZE = 9; // 3 x 3 puzzle

let tilesPerLine = detectPuzzleSize();
let totalTiles = tilesPerLine * tilesPerLine;
let tiles;
let totalMoves = 0;

/**
 * Draw the puzzle board with the current configuration (either from start or from tiles exchange/move):
 * -
 */
function drawPuzzle() {
    /**
     * Create the container structure
     */
    function drawContainer() {
        /**
         * Create the tile i from the current configuration (0-indexed)
         * @param i integer
         * @returns {HTMLSpanElement}
         */
        function getTile(i) {
            /**
             * Get the valid state of a tile:
             * - a tile is valid only if:
             *      - either its value is equal to its index (+1) or
             *      - is the last tile and its value is the empty symbol
             * @param i integer
             * @returns {string}
             */
            function getTileSate(i) {
                let validState = 'invalid';
                if ((i + 1) === tiles[i]) {
                    validState = 'valid';
                }
                if (((i+1) === totalTiles) && (tiles[totalTiles - 1] === EMPTY_TILE)) {
                    validState = 'valid';
                }

                return validState;
            }

            let tile = document.createElement('span');
            tile.id = 'tile_' + i;
            tile.innerHTML = tiles[i];
            tile.className = 'bevel tex-bevel tile ' + getTileSate(i);

            return tile;
        }

        let containerLength = TILE_WIDTH * tilesPerLine + TILE_SPACING;

        let tilesContainer = document.getElementById('tilesContainer');
        tilesContainer.innerHTML = '';
        tilesContainer.style.width = containerLength+'px';
        tilesContainer.style.height = containerLength+'px';
        for (let i = 0; i < totalTiles; i++) {
            let tile = getTile(i);
            tilesContainer.appendChild(tile);
        }
    }
    /**
     * Update the stats:
     * - show/hide the congratulations message in the footer
     * - update the valid/invalid-tiles and total-moves counters
     */
    function updateStats() {
        /**
         * Validate the board configuration:
         * - each tile should have as value its 0-index + 1
         * - the last tile should be the empty tile
         *      (for optimization reasons, can be omitted from validation, since all the others should already be valid)
         * @returns {boolean}
         */
        function isValidStructure() {
            let isValid = true;
            for (let i = 0; i < totalTiles - 2; i++) {
                if (tiles[i] !== i+1) {
                    isValid = false;
                }
            }

            return isValid;
        }

        let resultClassName = 'hidden';
        if (isValidStructure() && totalMoves > 1) {
            resultClassName = '';
        }

        let result = document.getElementById('result');
        result.className = resultClassName;

        document.getElementById('totalMoves').innerText = totalMoves;
        document.getElementById('validTiles').innerText = document.querySelectorAll('.tile.valid').length;
        document.getElementById('invalidTiles').innerText = document.querySelectorAll('.tile.invalid').length;
    }

    /**
     * Handle the key presses:
     * - call a special method for each key (it wil check if it's a directional key, and act accordingly)
     */
    function handleKeyboard() {
        let body = document.querySelector('body');
        body.onkeydown = function (e) {
            handleKeyPress(e.keyCode);
        };
    }

    /**
     * Handle the mouse clicks on the puzzle tiles:
     * - attach a method for the click event on each tile
     * - find the target tile's value and try to move the empty tile in the new place, if possible
     */
    function handleMouseClicks() {
        /**
         * Handle a mouse click on the puzzle board tiles:
         * - first, compute all possible moves/directions from the current (empty) tile
         * - check each possible move:
         *      - if one of them is the same as the target, render the puzzle with the new configuration
         *      - else (target too distant), log an error message to the console for debugging purposes only
         */
        let handleTileClick = function() {
            let targetIndex = parseInt(this.id.replace('tile_', ''), 10);

            let possibleMoves = getPossibleMoves();
            let possibleDirections = Object.keys(possibleMoves);

            for (let key in possibleDirections) {
                if (possibleMoves[possibleDirections[key]] === targetIndex) {
                    renderPuzzle(targetIndex, possibleDirections[key]);

                    return;
                }
            }

            console.log('Move not allowed! Target position: ', targetIndex + 1);
        };

        let spans = document.querySelectorAll('span.tile');
        for (let i = 0; i < spans.length; i++) {
            let tile = spans[i];
            tile.addEventListener("click", handleTileClick);
        }
    }

    drawContainer();

    totalMoves ++;
    updateStats();

    handleKeyboard();
    handleMouseClicks();
}

/**
 * Render the puzzle with a new configuration
 * - add the visual feedback after each user action (mouse click / key press on a directional key)
 *      or randomly-generated move
 * - validate the target position
 * - request the change of tiles and the new board drawing
 * @param targetIndex integer
 * @param direction string
 */
function renderPuzzle(targetIndex, direction) {
    /**
     * Exchange the empty tile with another tile (if the move is valid!)
     * @param targetIndex
     */
    function exchangeTiles(targetIndex) {
        if (targetIndex >= totalTiles || targetIndex < 0) {
            return;
        }

        let aux = tiles[targetIndex];
        let currentTileIndex = tiles.indexOf(EMPTY_TILE);

        tiles[targetIndex] = EMPTY_TILE;
        tiles[currentTileIndex] = aux;
    }

    /**
     * Display each move (keyboard or click) in 2 'monitors':
     * - a direction name box
     * - a directional keyboard
     * @param direction string
     * @param targetIndex integer
     */
    function addVisualFeedback(direction, targetIndex) {
        let directionNameBox = document.getElementById('directionNameBox');
        directionNameBox.innerText = direction;
        directionNameBox.className = '';

        let selectedDirectionKey = document.querySelector('#directionalKeyboard .'+direction);
        let selectedDirectionKeyClassName = direction;

        if (targetIndex >= 0) {
            selectedDirectionKeyClassName += ' active';
        } else {
            selectedDirectionKeyClassName += ' error';
            directionNameBox.className += ' error';
        }

        selectedDirectionKey.className = selectedDirectionKeyClassName;
        setTimeout(function() {
            selectedDirectionKey.className = direction;
        }, 1000);
    }

    direction = direction || false;
    if (direction) {
        addVisualFeedback(direction, targetIndex);
    }

    // validate the target position
    if (targetIndex < 0 || targetIndex > totalTiles) {
        return;
    }

    exchangeTiles(targetIndex);
    drawPuzzle();
}

/**
 * Handle a keyboard press:
 * - compute the direction based on the pressed key's code
 * - get the target index of the tile in the requested direction
 * - render the puzzle, if the target tile is valid
 * @param keyCode
 */
let handleKeyPress = function(keyCode) {
    /**
     * Compute the target index of the tile that would be the next move from the current (empty) tile
     * @param direction string
     * @returns {number}
     */
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

        return (targetIndex >= 0 ? targetIndex : -1);
    }

    /**
     * Compute the direction from a keyboard press
     * @param keyCode integer
     * @returns {string}
     */
    function computeKeyboardDirection(keyCode) {
        const keysMap = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        let direction = '';
        for(let key in keysMap) {
            if (keyCode === parseInt(key, 10)) {
                direction = keysMap[keyCode];
            }
        }

        return direction;
    }

    let direction = computeKeyboardDirection(keyCode);
    if ( direction.length === 0 ) {
        return;
    }

    let targetIndex = getKeyboardTargetIndex(direction);
    renderPuzzle(targetIndex, direction);
};

/**
 * Find all possible moves from the current position (the empty tile):
 * - skip UP from the first row
 * - skip DOWN from the last row
 * - skip LEFT from the first column
 * - skip RIGHT from the last column
 *
 * @returns {object}
 */
function getPossibleMoves() {
    let currentTileIndex = tiles.indexOf(EMPTY_TILE);
    let currentTilePosition = currentTileIndex + 1;
    let possibleMoves = {};

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

    return possibleMoves;
}

/**
 * Detect the puzzle board size:
 * - either from an eventual 'size' parameter in URL or
 * - by using the default value
 * @returns {number}
 */
function detectPuzzleSize() {
    let size = DEFAULT_SIZE; // default

    let newSize = parseInt(readUrlParam('size'), 10);
    if (newSize >= DEFAULT_SIZE && newSize <= MAX_BOARD_SIZE) {
        size = newSize;
    }

    return size;
}

/**
 * Initialize the puzzle:
 * - handle the elements outside the puzzle board (sizeSelector, randomize button, directional keys)
 * - create the correct configuration
 * - draw the board
 */
let init = function() {
    /**
     * Handle the elements outside the puzzle board:
     * - create the board size selector
     * - attach the click event to the directional keys
     * - handle the randomize button
     */
    function handleOuterElements() {
        /**
         * Create the board size selector:
         * - available sizes: from 3 x 3 to 9 x 9
         * (for larger boards, it would be much too difficult to solve the puzzle!)
         */
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

            selector.addEventListener('change', function() {
                let value = selector.options[selector.selectedIndex].value;
                window.location.href = window.location.pathname + '?size=' + value;
            });
        }

        /**
         * Manage the Onscreen Keyboard / clicking on the virtual keys
         * - get the keycode corresponding to each directional key
         * - on each 'keyPress' / mouseClick, call the method that handles the key press event
         */
        function handleOnscreenKeyboard() {
            let handleClickOnDirectionalKeyboard = function() {
                let keyCode = parseInt(this.dataset.keycode, 10);
                handleKeyPress(keyCode);
            };

            let keys = document.querySelectorAll('#directionalKeyboard span');
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                key.addEventListener("click", handleClickOnDirectionalKeyboard);
            }
        }

        /**
         * Randomize the puzzle board
         * - set a random number of moves, in accordance to the number of tiles (smaller boards have fewer random moves)
         * - at each iteration:
         *      - find all the possible moves from the empty tile
         *      - shuffle them, in order to choose a random direction
         *      - request a board rendering with the new tiles configuration
         * - after each random move, wait 200 milliseconds, for a better real-time view of the move
         */
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
                    clearInterval(interval);
                }
            };
            interval = setInterval(makeNewRandomMove, 200);
        }

        createSelector();
        handleOnscreenKeyboard();
        document.getElementById('randomize').addEventListener('click', randomizeLayout);
    }

    /**
     * Create the correct/final board configuration
     * - each tile has as value - its 0-index + 1
     * - the last tile has as value the empty-tile symbol ("_" - can be any other non-digit character)
     */
    function createTiles() {
        tiles = [];
        for (let i = 0; i < totalTiles - 1; i++) {
            tiles[i] = i+1;
        }
        tiles[totalTiles - 1] = EMPTY_TILE;
    }

    handleOuterElements();
    createTiles();
    drawPuzzle();
};
document.addEventListener('DOMContentLoaded', init);

