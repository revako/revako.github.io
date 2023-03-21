const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const initialPaddleHeight = 10;
const initialPaddleWidth = 100;
const initialBallRadius = 5;

let paddleHeight = initialPaddleHeight;
let paddleWidth = initialPaddleWidth;
let ballRadius = initialBallRadius;

let topPaddleX;
let bottomPaddleX;
let ballX;
let ballY;
let ballSpeedX = 2;
let ballSpeedY = 5;

let hitCounter = 0;
let gameInProgress = true;

function draw() {
    ctx.fillStyle = "#b5e7a0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillRect(topPaddleX, 0, paddleWidth, paddleHeight);
    ctx.strokeRect(topPaddleX, 0, paddleWidth, paddleHeight);
    ctx.fillRect(bottomPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.strokeRect(bottomPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + hitCounter, canvas.width / 2 - 90, canvas.height / 2 - 10);
}

function move() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width - ballRadius || ballX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY <= paddleHeight + ballRadius) {
        if (ballX >= topPaddleX - ballRadius && ballX <= topPaddleX + paddleWidth + ballRadius) {
            ballSpeedY = -ballSpeedY;
            increaseBallSpeed();
            hitCounter++;
            ballY = paddleHeight + ballRadius + 1;
        } else if (ballY < 0) {
            stopGame();
        }
    }

    if (ballY >= canvas.height - paddleHeight - ballRadius) {
        if (ballX >= bottomPaddleX - ballRadius && ballX <= bottomPaddleX + paddleWidth + ballRadius) {
            ballSpeedY = -ballSpeedY;
            increaseBallSpeed();
            hitCounter++;
            ballY = canvas.height - paddleHeight - ballRadius - 1;
        } else if (ballY > canvas.height) {
            stopGame();
        }
    }
}

function increaseBallSpeed() {
    ballSpeedX *= 1.0125;
    ballSpeedY *= 1.0125;
}

function stopGame() {
    gameInProgress = false;
}

function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 2;
    ballSpeedY = 5;
    hitCounter = 0;
    gameInProgress = true;
}

function handlePaddleMovement(clientX) {
    const mouseX = clientX - canvas.getBoundingClientRect().left;
    const newPaddleX = mouseX - paddleWidth / 2;

    if (newPaddleX >= 0 && newPaddleX <= canvas.width - paddleWidth) {
        bottomPaddleX = newPaddleX;
        topPaddleX = canvas.width - newPaddleX - paddleWidth; // Top paddle moves reversely
    }
}

canvas.addEventListener("mousemove", (event) => {
    handlePaddleMovement(event.clientX);
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handlePaddleMovement(touch.clientX);
});

canvas.addEventListener("click", () => {
    if (!gameInProgress) {
        resetGame();
    }
});

function gameLoop() {
    draw();
    if (gameInProgress) {
        move();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

function resizeCanvas() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let size;

    if (aspectRatio < 0.5) {
        // Portrait orientation, height is more than 2 times the width
        size = window.innerWidth;
    } else {
        // Landscape orientation or height is less than 2 times the width
        size = Math.min(window.innerHeight / 2, window.innerWidth);
    }

    const scaleFactor = size / canvas.width;

    canvas.width = size;
    canvas.height = size;

    paddleHeight = initialPaddleHeight * scaleFactor;
    paddleWidth = initialPaddleWidth * scaleFactor;
    ballRadius = initialBallRadius * scaleFactor;

    topPaddleX = (canvas.width - paddleWidth) / 2;
    bottomPaddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}


window.addEventListener('resize', resizeCanvas);
resizeCanvas();
