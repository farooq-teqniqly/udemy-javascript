"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const gameConfig = {
    minNumber: 1,
    maxNumber: 20,
    startScore: 10,
  };

  const newGameButton = document.getElementById("new-game-button");

  newGameButton.addEventListener("click", () => {
    initializeGame(gameConfig);
  });

  initializeGame(gameConfig);

  const answer = generateAnswer(gameConfig.minNumber, gameConfig.maxNumber);
  playGame(answer, gameConfig);
});

const initializeGame = (gameConfig) => {
  const labelCaption = `Guess a number between ${gameConfig.minNumber} and ${gameConfig.maxNumber}`;
  const label = document.getElementById("label-guess-number");
  label.textContent = labelCaption;

  const input = document.getElementById("input-guess-number");
  input.setAttribute("min", gameConfig.minNumber.toString());
  input.setAttribute("max", gameConfig.maxNumber.toString());

  const scoreSpan = document.getElementById("score");
  scoreSpan.textContent = gameConfig.startScore.toString();
};

const playGame = (answer, gameConfig) => {
  const guessButton = document.getElementById("guess-button");

  guessButton.addEventListener("click", () => {
    const guessInput = document.getElementById("input-guess-number");
    const guessResult = document.getElementById("guess-result");

    if (guessInput.value === "") {
      guessResult.textContent = "Please enter a guess!";
      return;
    }

    const guess = parseInt(guessInput.value);

    if (
      isNaN(guess) ||
      guess < gameConfig.minNumber ||
      guess > gameConfig.maxNumber
    ) {
      guessResult.textContent = "Please enter a valid number!";
      return;
    }

    let guessResultText = "";

    if (guess === answer) {
      guessResultText = "You guessed correctly!";
    } else if (guess < answer) {
      guessResultText = "Your guess is too low!";
      gameConfig.startScore--;
    } else {
      guessResultText = "Your guess is too high!";
      gameConfig.startScore--;
    }

    if (gameConfig.startScore === 0) {
      guessResultText = "You lost the game! Refresh the page to play again.";
    }

    guessResult.textContent = guessResultText;

    const scoreSpan = document.getElementById("score");
    scoreSpan.textContent = gameConfig.startScore.toString();
  });
};

const generateAnswer = (minNumber, maxNumber) => {
  return Math.floor(Math.random() * (maxNumber - minNumber + 1));
};
