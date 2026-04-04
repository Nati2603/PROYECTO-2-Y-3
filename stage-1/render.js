import TRAINER from "../trainer.config.js";

export function render(state) {
  const trainer = document.getElementById("trainer");
  const player = document.getElementById("player");
  const opponent = document.getElementById("opponent");
  const battleBtn = document.getElementById("battleBtn");
  const error = document.getElementById("error");

  // ───────── TRAINER CARD ─────────
  trainer.innerHTML = `
    <h2>${TRAINER.name}</h2>
    <p>${TRAINER.hometown}</p>
    <p>${TRAINER.catchphrase}</p>
  `;

  // ───────── PLAYER ─────────
  if (state.loadingPlayer) {
    player.innerHTML = "<p>Cargando...</p>";
  } else if (state.player) {
    player.innerHTML = `
      <h3>${state.player.name}</h3>
      <img src="${state.player.sprites.front_default}" width="120">

      <p>HP: ${state.player.stats[0].base_stat}</p>
      <p>Attack: ${state.player.stats[1].base_stat}</p>
      <p>Defense: ${state.player.stats[2].base_stat}</p>
      <p>Speed: ${state.player.stats[5].base_stat}</p>
    `;
  }

  // ───────── OPPONENT ─────────
  if (state.loadingOpponent) {
    opponent.innerHTML = "<p>Cargando...</p>";
  } else if (state.opponent) {
    opponent.innerHTML = `
      <h3>${state.opponent.name}</h3>
      <img src="${state.opponent.sprites.front_default}" width="120">

      <p>HP: ${state.opponent.stats[0].base_stat}</p>
      <p>Attack: ${state.opponent.stats[1].base_stat}</p>
      <p>Defense: ${state.opponent.stats[2].base_stat}</p>
      <p>Speed: ${state.opponent.stats[5].base_stat}</p>
    `;
  }

  // ───────── ERROR ─────────
  error.innerText = state.error || "";

  // ───────── ACTIVAR BOTÓN ─────────
  if (state.player && state.opponent) {
    battleBtn.disabled = false;
  } else {
    battleBtn.disabled = true;
  }
}