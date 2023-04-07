const colors = [
  "pink",
  "orange",
  "yellow",
  "lime",
  "aqua",
  "SkyBlue",
  "MediumPurple",
];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let sortedScores = [];
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
let ballColor = getRandomColor();
let paddleColor = getRandomColor(ballColor);

function getRandomColor(excludeColor) {
  let newColor;
  do {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  } while (newColor === excludeColor);
  return newColor;
}

function draw() {
  ctx.fillStyle = "#b5e7a0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = paddleColor;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.fillRect(topPaddleX, 0, paddleWidth, paddleHeight);
  ctx.strokeRect(topPaddleX, 0, paddleWidth, paddleHeight);
  ctx.fillRect(bottomPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.strokeRect(bottomPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
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

function move(elapsedTime) {
    ballX += ballSpeedX * elapsedTime;
    ballY += ballSpeedY * elapsedTime;

    if (ballX > canvas.width - ballRadius || ballX < ballRadius) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX += (Math.random() - 0.5) * 0.1 * ballSpeedX;

        const minBallSpeedX = canvas.width / 400;
        if (Math.abs(ballSpeedX) < minBallSpeedX) {
            ballSpeedX = ballSpeedX >= 0 ? minBallSpeedX : -minBallSpeedX;
        }
    }

    if (ballY <= paddleHeight + ballRadius) {
        if (ballX >= topPaddleX - ballRadius && ballX <= topPaddleX + paddleWidth + ballRadius) {
            ballSpeedY = -ballSpeedY;
            increaseBallSpeed();
            hitCounter++;
            ballY = paddleHeight + ballRadius + 1;
        } else if (ballY < 0) {
            if (hitCounter === 0) {
                stopGameWithZeroPoints();
            } else {
                stopGame();
            }
        }
    }

    if (ballY >= canvas.height - paddleHeight - ballRadius) {
        if (ballX >= bottomPaddleX - ballRadius && ballX <= bottomPaddleX + paddleWidth + ballRadius) {
            ballSpeedY = -ballSpeedY;
            increaseBallSpeed();
            hitCounter++;
            ballY = canvas.height - paddleHeight - ballRadius - 1;
        } else if (ballY > canvas.height) {
            if (hitCounter === 0) {
                stopGameWithZeroPoints();
            } else {
                stopGame();
            }
        }
    }
}

function increaseBallSpeed() {
  ballSpeedX *= 1.0125;
  ballSpeedY *= 1.0125;
  ballColor = getRandomColor(ballColor);
  paddleColor = getRandomColor(ballColor);
}

function stopGame() {
    gameInProgress = false;
    if (hitCounter === 0) {
        showPopup2();
    } else {
        showPopup1();
    }
}

function stopGameWithZeroPoints() {
    gameInProgress = false;
    showPopup2();
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
        topPaddleX = canvas.width - newPaddleX - paddleWidth;
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
    const allScores = [];
    snapshot.forEach((childSnapshot) => {
      allScores.push(childSnapshot.val());
    });

    // Group scores by name and find the highest score for each player
    const groupedScores = allScores.reduce((acc, score) => {
      if (!acc[score.name]) {
        acc[score.name] = score;
      } else if (score.score > acc[score.name].score) {
        acc[score.name] = score;
      }
      return acc;
    }, {});

    // Convert the groupedScores object to an array and sort it
    highScores = Object.values(groupedScores).sort((a, b) => b.score - a.score).slice(0, 20);

    updateHighScoresList();
    const bestPlayerElement = document.getElementById('bestPlayer');
    bestPlayerElement.innerHTML = `Best player - ${highScores[0].name}`;
  });
}

function updateHighScoresList(currentPlayerScore) {
  highScoresList.innerHTML = '';
  highScores.forEach((score, index) => {
    const listItem = document.createElement('li');
    const isCurrentPlayer = currentPlayerScore && score.score === currentPlayerScore.score && score.name === currentPlayerScore.name;

    if (score.name === "Anonymous") {
      listItem.classList.add("grey-font");
    }

    if (isCurrentPlayer) {
      listItem.style.color = 'red';
    }

    listItem.textContent = `${index + 1}. ${score.name} - ${score.score}`;
    highScoresList.appendChild(listItem);
  });

  if (currentPlayerScore && !highScores.some(score => score.name === currentPlayerScore.name && score.score === currentPlayerScore.score)) {
    const separator = document.createElement('li');
    separator.innerHTML = '----------------';
    highScoresList.appendChild(separator);

    const currentPlayerListItem = document.createElement('li');
    currentPlayerListItem.style.color = 'red';
    const pointWord = currentPlayerScore.score === 1 ? 'point' : 'points';
    currentPlayerListItem.textContent = `Is that all you got, ${currentPlayerScore.name}? ${currentPlayerScore.score} ${pointWord}? Cmon, you can do better!`;
    highScoresList.appendChild(currentPlayerListItem);
  }
}

function updateHighScores(snapshot) {
  const scores = [];
  snapshot.forEach(childSnapshot => {
    scores.push(childSnapshot.val());
  });

  // Store the sorted scores list in a variable
  sortedScores = scores.sort((a, b) => b.score - a.score);

  highScores = sortedScores.slice(0, 20);
  updateHighScoresList();
}

submitName.addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const enteredName = nameInput.value.trim() === "" ? "Anonymous" : nameInput.value;

    const newScore = {
      name: enteredName,
      score: hitCounter,
    };

    firebase
      .database()
      .ref("highScores")
      .push(newScore);
    hidePopup1();
    showPopup2();

    // Pass the current player's score to updateHighScoresList()
    updateHighScoresList(newScore);
  } else {
    console.error("User not authenticated");
  }
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
