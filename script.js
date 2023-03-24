const firebaseConfig = {
  apiKey: "AIzaSyCsuukzzMzwUN27majJIa_6cZ4uNoBWwcM",
  authDomain: "paddle-pong-frenzy.firebaseapp.com",
  databaseURL: "https://paddle-pong-frenzy-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "paddle-pong-frenzy",
  storageBucket: "paddle-pong-frenzy.appspot.com",
  messagingSenderId: "711791029629",
  appId: "1:711791029629:web:f1aa0a643aee8a279fb014",
  measurementId: "G-491YGM3LLY"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously().catch((error) => {
  console.error("Error signing in anonymously:", error);
});

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
    const scoreText = "Score: " + hitCounter;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, (canvas.width - scoreTextWidth) / 2, canvas.height / 2 - 10);

    if (!gameInProgress) {
        const titleText = "Paddle Pong Frenzy";
        const titleTextWidth = ctx.measureText(titleText).width;
        ctx.fillText(titleText, (canvas.width - titleTextWidth) / 2, canvas.height / 2 - 70);
    }
}

function saveHighScoreToDatabase(name, score) {
  const scoreRef = firebase.database().ref('highScores').push();
  scoreRef.set({ name, score });
}

function move(elapsedTime) {
    ballX += ballSpeedX * elapsedTime;
    ballY += ballSpeedY * elapsedTime;

    if (ballX > canvas.width - ballRadius || ballX < ballRadius) {
        ballSpeedX = -ballSpeedX;
        // Add a small random horizontal speed to prevent the ball from getting stuck
        ballSpeedX += (Math.random() - 0.5) * 0.1 * ballSpeedX;
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

window.addEventListener("mousemove", (event) => {
    handlePaddleMovement(event.clientX);
});

window.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handlePaddleMovement(touch.clientX);
});

canvas.addEventListener("mousemove", (event) => {
    handlePaddleMovement(event.clientX);
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handlePaddleMovement(touch.clientX);
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
    paddleHeight = canvas.width / 70;
    ballRadius = canvas.width / 50;
    ballSpeedX = canvas.width / 300;
    ballSpeedY = canvas.width / 150;
}

function resizeCanvas() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let size;

    if (aspectRatio < 0.5) {
        size = window.innerWidth*0.92;
    } else {
        size = Math.min(window.innerHeight*0.46, window.innerWidth);
    }
  
    canvas.width = size;
    canvas.height = size;

    updateDimensions();

    topPaddleX = (canvas.width - paddleWidth) / 2;
    bottomPaddleX = (canvas.width - paddleWidth) / 2;
    ballX = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
    ballY = canvas.height / 10;

    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const popup1 = document.getElementById('popup1');
const popup2 = document.getElementById('popup2');
const submitName = document.getElementById('submitName');
const nameInput = document.getElementById('nameInput');
const highScoresList = document.getElementById('highScoresList');
const newGame = document.getElementById('newGame');

let highScores = [];

function showPopup1() {
    popup1.style.display = 'block';
}

function hidePopup1() {
    popup1.style.display = 'none';
}

function showPopup2() {
    popup2.style.display = 'block';
}

function hidePopup2() {
    popup2.style.display = 'none';
}

function createHighScoreList() {
  const highScoresRef = firebase.database().ref('highScores');

highScoresRef.on('value', (snapshot) => {
  const highScoresData = snapshot.val();
  highScores = Object.values(highScoresData || {});
  highScores.sort((a, b) => b.score - a.score);
  updateHighScoresList();
});
}

function updateHighScoresList() {
  highScoresList.innerHTML = '';
  highScores.forEach((score, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${score.name} - ${score.score}`;
    highScoresList.appendChild(listItem);
  });
}

submitName.addEventListener('click', () => {
  const name = nameInput.value;

  // Save the high score to the Firebase Realtime Database
  saveHighScoreToDatabase(name, hitCounter);

  highScores.push({ name, score: hitCounter });
  highScores.sort((a, b) => b.score - a.score);
  updateHighScoresList();
  hidePopup1();
  showPopup2();
});

newGame.addEventListener('click', () => {
    hidePopup2();
    resetGame();
});

function stopGame() {
    gameInProgress = false;
    showPopup1();
}

createHighScoreList();
