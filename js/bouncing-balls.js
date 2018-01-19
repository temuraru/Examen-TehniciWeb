"use strict";

const MAX_BALLS = 30, MAX_SPEED = 200;
let Balls = [], ballsNr, mainCanvas, mainContext, canvasWidth, canvasHeight;
let animation, repaintInterval = 20;
let maxAnimationFrames = Number.MAX_SAFE_INTEGER;

/**
 * Simple helper class
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Ball class
 * Handles the display/update of each ball instance on the canvas
 */
class Ball {
    constructor(centerPoint, radius, color, diffPoint) {
        this.center = centerPoint;
        this.radius = radius;
        this.color = color;
        this.diff = diffPoint;
    };
    draw() {
        mainContext.beginPath();
        mainContext.fillStyle = this.color;
        mainContext.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true);
        mainContext.closePath();
        mainContext.fill();
    };
    update() {
        if ((this.center.x + this.radius) >= canvasWidth) {
            this.diff.x = -this.diff.x;
        }
        if ((this.center.x - this.radius) <= 0) {
            this.diff.x = -this.diff.x;
        }

        if ((this.center.y + this.radius) >= canvasHeight) {
            this.diff.y = -this.diff.y;
        }
        if ((this.center.y - this.radius) <= 0) {
            this.diff.y = -this.diff.y;
        }

        this.center.x += this.diff.x;
        this.center.y += this.diff.y;
    };
}

/**
 * Initialize the app:
 * - hook the 'resize' event
 * - handle the input/parametrized fields
 * - start the bouncing application
 */
function init() {
    /**
     * Handle external input to the canvas:
     * - randomize button - set random values for the next 2 slider (range) input fields
     * - speed slider - animation frame display interval
     * - balls slider - number of balls to be animated at once inside the canvas
     */
    function handleInput() {
        let clickEvent = new Event('click');

        let repaintIntervalInput = document.getElementById('repaintInterval');
        let ballsNrInput = document.getElementById('ballsNr');
        let randomize = document.getElementById('randomize');

        randomize.addEventListener('click', function() {
            let randomSpeed = randomInt(1, MAX_SPEED);
            let randomBalls = randomInt(5, MAX_BALLS);

            repaintIntervalInput.value = randomSpeed;
            repaintInterval = randomSpeed;

            ballsNrInput.value = randomBalls;
            ballsNr = randomBalls;

            startApp();
        });

        repaintIntervalInput.addEventListener('change', function() {
            repaintInterval = this.value;
            startApp();
        });

        ballsNrInput.addEventListener('change', function() {
            ballsNr = this.value;
            startApp();
        });

        randomize.dispatchEvent(clickEvent);
    }

    /**
     * Update the footer area with stats
     */
    function updateStats() {
        document.querySelector('.stats .repaintInterval').innerHTML = repaintInterval;
        document.querySelector('.stats .ballsNr').innerHTML = ballsNr;
        document.querySelector('.stats #iterations').innerHTML = '0';
    }

    /**
     * Start the application:
     * - update the stats in the footer area
     * - compute the container/canvas dimensions according to the current (resized) window
     * - create the canvas context onto which the balls are going to be displayed
     * - start the animation
     */
    function startApp() {
        /**
         * Start the animation:
         * - generate a new set of balls
         * - set an automatic interval for repainting the canvas
         */
        function startAnimation() {
            clearInterval(animation);

            /**
             * Generate the Balls array, containing ballsNr instances of the Ball class
             * @param ballsNr integer
             */
            function generateBalls(ballsNr) {
                /**
                 * Generate a random Ball
                 * @returns {Ball}
                 */
                function generateRandomBall() {
                    let radius = randomInt(3, 10);

                    let centerX = randomInt(radius, canvasWidth - radius);
                    let centerY = randomInt(radius, canvasHeight - radius);
                    let centerPoint = new Point(centerX, centerY);

                    let dx = randomInt(-radius, radius);
                    let dy = randomInt(-radius, radius);
                    let diffPoint = new Point(dx, dy);

                    let color = generateRandomColor();

                    return new Ball(centerPoint, radius, color, diffPoint);
                }

                for(let i = 0; i < ballsNr; i++) {
                    Balls[i] = generateRandomBall();
                }
            }
            generateBalls(ballsNr);

            let counter = 0;
            function animate() {
                // clear the context for the new positions
                mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
                mainContext.fillStyle = 'rgba(0, 0, 0, 0.25)'; //generateRandomColor(true, 0.15);
                mainContext.fillRect(0, 0, canvasWidth, canvasHeight);

                for(let i = 0; i < ballsNr; i++) {
                    Balls[i].draw();
                    Balls[i].update();
                }

                counter++;
                document.getElementById('iterations').innerText = counter + '';
                if (counter >= maxAnimationFrames) {
                    clearInterval(animation);
                }
            }

            animation = setInterval(animate, repaintInterval);
        }

        updateStats();

        let containerWidth = getContainerInnerWidth();
        let containerHeight = getContainerInnerHeight();

        let container = document.querySelector('#myCanvas');
        container.style.height = containerHeight + 'px';
        container.style.width = containerWidth + 'px';

        mainCanvas = document.querySelector('#myCanvas');
        mainCanvas.setAttribute('width', containerWidth);
        mainCanvas.setAttribute('height', containerHeight);
        mainContext = mainCanvas.getContext('2d');

        canvasWidth = mainCanvas.width;
        canvasHeight = mainCanvas.height;

        startAnimation();
    }

    window.addEventListener('resize', startApp, true);
    handleInput();
    startApp();
}
document.addEventListener('DOMContentLoaded', init);