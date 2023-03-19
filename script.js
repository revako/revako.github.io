const rockButton = document.getElementById("rock-button");
const paperButton = document.getElementById("paper-button");
const scissorsButton = document.getElementById("scissors-button");
const resultElement = document.querySelector(".result");

const CHOICES = ["&#x1F5FF;", "&#x1F4DC;", "&#x2702;"];
const WINNING_COMBINATIONS = {
  "&#x1F5FF;": "&#x2702;",
  "&#x1F4DC;": "&#x1F5FF;",
  "&#x2702;": "&#x1F4DC;"
};

// function to generate a random computer choice
function getComputerChoice() {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

// function to determine the winner
function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return "tie";
  }
  if (WINNING_COMBINATIONS[userChoice] === computerChoice) {
    return "win";
  }
  return "lose";
}

// function to display the result
function displayResult(userChoice, computerChoice, result) {
  let resultText;
  let emoji;
  if (result === "win") {
    resultText = "You win!";
    emoji = "🎉";
  } else if (result === "lose") {
    resultText = "You lose!";
    emoji = "😢";
  } else {
    resultText = "It's a tie!";
    emoji = "🤝";
  }
  resultElement.innerHTML = `The computer chose ${computerChoice} <br> <br> ${resultText} ${emoji}`;
}

// add event listeners to the buttons
rockButton.addEventListener("click", () => {
  const computerChoice = getComputerChoice();
  const result = determineWinner("&#x1F5FF;", computerChoice);
  displayResult("&#x1F5FF;", computerChoice, result);
});

paperButton.addEventListener("click", () => {
  const computerChoice = getComputerChoice();
  const result = determineWinner("&#x1F4DC;", computerChoice);
  displayResult("&#x1F4DC;", computerChoice, result);
});

scissorsButton.addEventListener("click", () => {
  const computerChoice = getComputerChoice();
  const result = determineWinner("&#x2702;", computerChoice);
  displayResult("&#x2702;", computerChoice, result);
});
