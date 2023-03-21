const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions based on the device screen size
const minSide = Math.min(window.innerWidth, window.innerHeight);
canvas.width = minSide;
canvas.height = minSide;

const paddleHeight = 10;
const paddleWidth = 100;
const ballRadius = 5;

let topPaddleX = (canvas.width - paddleWidth) / 2;
let bottomPaddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 1;
let ballSpeedY = 2.5;

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
    ballSpeedX = 1;
    ballSpeedY = 2.5;
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
    const side = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = side;
    canvas.height = side;
    topPaddleX = (canvas.width - paddleWidth) / 2;
    bottomPaddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedY = canvas.height / 2;
    canvas.style.marginTop = "10px"; // Add a margin to the top of the canvas
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
