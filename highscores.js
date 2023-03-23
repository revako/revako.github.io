document.getElementById("newGameButton").addEventListener("click", () => {
    window.location.href = "index.html";
});

const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
    .map(score => {
        return `<li>${score.name} - ${score.score}</li>`;
    })
    .join("");
