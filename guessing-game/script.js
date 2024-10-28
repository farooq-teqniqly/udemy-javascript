document.addEventListener("DOMContentLoaded", () => {
  const gameConfig = {
    minNumber: 1,
    maxNumber: 20,
    startScore: 10,
  };

  initializeGame(gameConfig);
});

const initializeGame = (gameConfig) => {
  const labelCaption = `Guess a number between ${gameConfig.minNumber} and ${gameConfig.maxNumber}`;
  const label = document.getElementById("label-guess-number");

  if (!label) {
    throw new Error("Label not found");
  }

  label.innerText = labelCaption;

  const input = document.getElementById("input-guess-number");

  if (!input) {
    throw new Error("Input not found");
  }

  input.setAttribute("min", gameConfig.minNumber.toString());
  input.setAttribute("max", gameConfig.maxNumber.toString());

  const startScore = gameConfig.startScore;
  const scoreSpan = document.getElementById("score");

  if (!scoreSpan) {
    throw new Error("Score span not found");
  }

  scoreSpan.innerText = startScore.toString();
};
