import TRAINER from "../trainer.config.js";

export function render(state) {
  const trainerDiv = document.getElementById("trainer");
  const playerDiv = document.getElementById("player");
  const opponentDiv = document.getElementById("opponent");
  const battleBtn = document.getElementById("battleBtn");

  // Trainer card
  trainerDiv.innerHTML = `
    <h2>${TRAINER.name}</h2>
    <p>${TRAINER.hometown}</p>
    <p>${TRAINER.catchphrase}</p>
  `;

  // Player
  if (state.loadingPlayer) {
    playerDiv.innerHTML = "Cargando...";
  } else if (state.player) {
    playerDiv.innerHTML = `
      <h3>${state.player.name}</h3>
      <img src="${state.player.sprites.front_default}">
    `;
  }

  // Opponent
  if (state.loadingOpponent) {
    opponentDiv.innerHTML = "Cargando...";
  } else if (state.opponent) {
    opponentDiv.innerHTML = `
      <h3>${state.opponent.name}</h3>
      <img src="${state.opponent.sprites.front_default}">
    `;
  }

  // Enable battle button
  if (state.player && state.opponent) {
    battleBtn.disabled = false;
  }
}