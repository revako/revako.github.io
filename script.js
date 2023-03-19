const generateButton = document.getElementById("generate-button");
const result = document.getElementById("result");
const values = ["Гзеня", "Гзира", "Зедазеня"];

// function to generate a random value from the list
function generateRandomValue() {
  const randomIndex = Math.floor(Math.random() * values.length);
  const randomValue = values[randomIndex];
  return randomValue;
}

// function to handle button click event
function handleButtonClick() {
  const randomValue = generateRandomValue();
  result.innerText = randomValue;
}

// add event listener to button
generateButton.addEventListener("click", handleButtonClick);
