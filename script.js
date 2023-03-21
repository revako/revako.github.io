const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.fillRect(topPaddleX, 0, paddleWidth, paddleHeight);
    ctx.fillRect(bottomPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Hits: " + hitCounter, canvas.width / 2 - 45, canvas.height / 2 - 10);
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
            ballY = paddleHeight + ballRadius + 1; // Ensure the ball moves out of the paddle
        } else if (ballY < 0) {
            stopGame();
        }
    }

    if (ballY >= canvas.height - paddleHeight - ballRadius) {
        if (ballX >= bottomPaddleX - ballRadius && ballX <= bottomPaddleX + paddleWidth + ballRadius) {
            ballSpeedY = -ballSpeedY;
            increaseBallSpeed();
            hitCounter++;
            ballY = canvas.height - paddleHeight - ballRadius - 1; // Ensure the ball moves out of the paddle
        } else if (ballY > canvas.height) {
            stopGame();
        }
    }
}

function increaseBallSpeed() {
    ballSpeedX *= 1.0125;
    ballSpeedY *= 1.0125;
}

function generateQRCode(url) {
    const qr = qrcode(0, 'L');
    qr.addData(url);
    qr.make();
    return qr.createDataURL(4);
}

function stopGame() {
    gameInProgress = false;

    // Generate the QR code
    const qrCodeUrl = generateQRCode('https://revako.github.io/');
    const qrCodeImage = document.createElement('img');
    qrCodeImage.src = qrCodeUrl;
    qrCodeImage.style.display = 'block';
    qrCodeImage.style.position = 'absolute';
    qrCodeImage.style.left = (canvas.width / 2 - 50) + 'px'; // Adjust horizontal position
    qrCodeImage.style.top = (canvas.height / 2 + 60) + 'px'; // Adjust vertical position
    qrCodeImage.id = 'qrCodeImage'; // Add an ID to the QR code image for easier removal
    document.body.appendChild(qrCodeImage);
}

function resetGame() {
    const qrCodeToRemove = document.getElementById('qrCodeImage');
    if (qrCodeToRemove) {
        qrCodeToRemove.remove();
    }

    // Rest of the resetGame function remains the same
    const startingPoints = [
        { x: canvas.width / 4, y: canvas.height / 4 },
        { x: canvas.width / 2, y: canvas.height / 4 },
        { x: (3 * canvas.width) / 4, y: canvas.height / 4 },
        { x: canvas.width / 4, y: canvas.height / 2 },
        { x: canvas.width / 2, y: canvas.height / 2 },
        { x: (3 * canvas.width) / 4, y: canvas.height / 2 },
        { x: canvas.width / 4, y: (3 * canvas.height) / 4 },
        { x: canvas.width / 2, y: (3 * canvas.height) / 4 },
        { x: (3 * canvas.width) / 4, y: (3 * canvas.height) / 4 },
    ];

    const randomStartingPoint = startingPoints[Math.floor(Math.random() * startingPoints.length)];

    ballX = randomStartingPoint.x;
    ballY = randomStartingPoint.y;
    ballSpeedX = 1;
    ballSpeedY = 2.5;
    hitCounter = 0;
    gameInProgress = true;
    shareButton.style.display = "none";
}

// Add this event listener outside of the stopGame function
canvas.addEventListener('click', () => {
    if (!gameInProgress) {
        resetGame();
    }
});

// Rest of the code
canvas.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const newPaddleX = mouseX - paddleWidth / 2;

    // Make sure the paddle stays within the canvas
    if (newPaddleX >= 0 && newPaddleX <= canvas.width - paddleWidth) {
        topPaddleX = newPaddleX;
        bottomPaddleX = newPaddleX;
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
