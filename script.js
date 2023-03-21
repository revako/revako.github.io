const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleHeight;
let paddleWidth;
let ballRadius;

let topPaddleX;
let bottomPaddleX;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

let hitCounter = 0;
let gameInProgress = true;

let lastFrameTime = performance.now();

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

function move(elapsedTime) {
    ballX += ballSpeedX * elapsedTime;
    ballY += ballSpeedY * elapsedTime;

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
    ballX = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
    ballY = canvas.height / 10;

    ballSpeedX = canvas.width / 300;
    ballSpeedY = canvas.width / 150;
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

function handleTap(event) {
    if (!gameInProgress) {
        resetGame();
    }
}

// Remove the existing event listeners on the canvas
canvas.removeEventListener("mousemove", handlePaddleMovement);
canvas.removeEventListener("touchmove", handlePaddleMovement);
canvas.removeEventListener("click", handleTap);

// Add event listeners to the entire window
window.addEventListener("mousemove", (event) => {
    handlePaddleMovement(event.clientX);
});

window.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handlePaddleMovement(touch.clientX);
});

window.addEventListener("click", handleTap);


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

function gameLoop(currentTime) {
    const elapsedTime = (currentTime - lastFrameTime) / 15;
    lastFrameTime = currentTime;

    draw();
    if (gameInProgress) {
        move(elapsedTime);
    }
    requestAnimationFrame(gameLoop);
}


gameLoop(lastFrameTime);


function updateDimensions() {
    paddleWidth = canvas.width / 4;
    paddleHeight = canvas.width / 40;
    ballRadius = canvas.width / 80;
    ballSpeedX = canvas.width / 300;
    ballSpeedY = canvas.width / 150;
}

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

    canvas.width = size;
    canvas.height = size;

    updateDimensions();

    topPaddleX = (canvas.width - paddleWidth) / 2;
    bottomPaddleX = (canvas.width - paddleWidth) / 2;
    ballX = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
    ballY = canvas.height / 10;


    // Update the canvas style to fit within the phone's display size
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
}


window.addEventListener('resize', resizeCanvas);
resizeCanvas();
