"use strict";
document.addEventListener('DOMContentLoaded', init, false);
let Balls, ballsNr, mainCanvas, mainContext, canvasWidth, canvasHeight;
let animation, repaintInterval = 20;
let ballNrMax = 30, maxAnimationFrames = Number.MAX_SAFE_INTEGER;

function handleInput() {
    window.addEventListener('resize', startApp, true);
    let changeEvent = new Event('change');
    let clickEvent = new Event('click');

    let repaintIntervalInput = document.getElementById('repaintInterval');
    let ballsNrInput = document.getElementById('ballsNr');
    let randomize = document.getElementById('randomize');

    randomize.addEventListener('click', function() {
        repaintIntervalInput.value = randomInt(1, 200);
        ballsNrInput.value = randomInt(5, ballNrMax);
        repaintInterval = repaintIntervalInput.value;
        ballsNr =  ballsNrInput.value;

        startApp();

    }, false);
    randomize.dispatchEvent(clickEvent);

    repaintIntervalInput.addEventListener('change', function() {
        repaintInterval = this.value;
        startApp();
    }, false);

    ballsNrInput.addEventListener('change', function() {
        ballsNr = this.value;
        if (!ballsNr) {
            ballsNr = randomInt(1, ballNrMax);
        }
        startApp();
    }, false);

    // set defaults
    repaintIntervalInput.value = randomInt(1, 30);
    ballsNrInput.value = randomInt(1, ballNrMax);
    ballsNrInput.dispatchEvent(changeEvent);
}

function init() {
    handleInput();
    startApp();
}

function startApp() {
    document.querySelector('.stats .repaintInterval').innerHTML = repaintInterval;
    document.querySelector('.stats .ballsNr').innerHTML = ballsNr;

    console.log('startApp.js', repaintInterval, ballsNr);
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

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ball {
    constructor(centerPoint, radius, color, diffPoint, speed) {
        this.center = centerPoint;
        this.radius = radius;
        this.color = color;
        this.diff = diffPoint;
        this.speed = speed;
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

function generateBalls(ballsNr) {
    Balls = [];

    // generate the new positions
    for(let i = 0; i < ballsNr; i++) {
        let radius = randomInt(3, 10);

        let centerX = randomInt(radius, canvasWidth - radius);
        let centerY = randomInt(radius, canvasHeight - radius);
        let centerPoint = new Point(centerX, centerY);

        let minimumBorder = Math.min(canvasWidth, canvasHeight);
        let speed = randomInt(minimumBorder / 10, minimumBorder / 5);

        let dx = randomInt(-radius, radius);
        let dy = randomInt(-radius, radius);
        let diffPoint = new Point(dx, dy);

        let color = generateRandomColor();

        Balls[i] = new Ball(centerPoint, radius, color, diffPoint, speed);
    }
    console.log(ballsNr, Balls.length, Balls);
}

function startAnimation() {
    clearInterval(animation);

    generateBalls(ballsNr);

    let counter = 0;
    function animate() {
        // console.log('animation started: ', counter);
        // clear the context for the new positions
        mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
        mainContext.fillStyle = 'rgba(0, 0, 0, 0.25)'; //generateRandomColor(true, 0.15);
        mainContext.fillRect(0, 0, canvasWidth, canvasHeight);

        for(let i = 0; i < ballsNr; i++) {
            Balls[i].draw();
            Balls[i].update();
        }

        counter++;
        document.getElementById('iterations').innerText = counter;
        if (counter >= maxAnimationFrames) {
            clearInterval(animation);
        }
    }

    animation = setInterval(animate, repaintInterval);
}

