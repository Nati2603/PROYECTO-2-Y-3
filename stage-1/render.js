import TRAINER from "../trainer.config.js";

export function render(state) {
  const trainer = document.getElementById("trainer");
  const player = document.getElementById("player");
  const opponent = document.getElementById("opponent");
  const battleBtn = document.getElementById("battleBtn");
  const error = document.getElementById("error");

  trainer.innerHTML = `
    <h2>${TRAINER.name}</h2>
    <p><strong>Hometown:</strong> ${TRAINER.hometown}</p>
    <p><strong>Catchphrase:</strong> ${TRAINER.catchphrase}</p>
    <p><strong>Favorite Pokémon:</strong> ${TRAINER.favoritePokemon}</p>
    <p><strong>Nickname:</strong> ${TRAINER.nickname}</p>
    <p><strong>Battle Cry:</strong> ${TRAINER.battleCry}</p>
    <p><strong>Definitive Move:</strong> ${TRAINER.definitiveMoveName}</p>
  `;

  if (state.loadingPlayer) {
    player.innerHTML = `<p>Cargando tu Pokémon...</p>`;
  } else if (state.player) {
    const playerTypes = state.player.types
      .map((item) => item.type.name)
      .join(", ");

    const playerMoves = state.player.moves
      .slice(0, 4)
      .map((move) => `<li>${move.move.name}</li>`)
      .join("");

    player.innerHTML = `
      <h3>${state.player.name}</h3>
      <img src="${state.player.sprites.front_default}" alt="${state.player.name}">

      <p><strong>Type:</strong> ${playerTypes}</p>
      <p><strong>HP:</strong> ${state.player.stats[0].base_stat}</p>
      <p><strong>Attack:</strong> ${state.player.stats[1].base_stat}</p>
      <p><strong>Defense:</strong> ${state.player.stats[2].base_stat}</p>
      <p><strong>Speed:</strong> ${state.player.stats[5].base_stat}</p>

      <p><strong>Moves:</strong></p>
      <ul>
        ${playerMoves}
      </ul>
    `;
  } else {
    player.innerHTML = `<p>No se encontró tu Pokémon.</p>`;
  }

  if (state.loadingOpponent) {
    opponent.innerHTML = `<p>Cargando oponente...</p>`;
  } else if (state.opponent) {
    const opponentTypes = state.opponent.types
      .map((item) => item.type.name)
      .join(", ");

    const opponentMoves = state.opponent.moves
      .slice(0, 4)
      .map((move) => `<li>${move.move.name}</li>`)
      .join("");

    opponent.innerHTML = `
      <h3>${state.opponent.name}</h3>
      <img src="${state.opponent.sprites.front_default}" alt="${state.opponent.name}">

      <p><strong>Type:</strong> ${opponentTypes}</p>
      <p><strong>HP:</strong> ${state.opponent.stats[0].base_stat}</p>
      <p><strong>Attack:</strong> ${state.opponent.stats[1].base_stat}</p>
      <p><strong>Defense:</strong> ${state.opponent.stats[2].base_stat}</p>
      <p><strong>Speed:</strong> ${state.opponent.stats[5].base_stat}</p>

      <p><strong>Moves:</strong></p>
      <ul>
        ${opponentMoves}
      </ul>
    `;
  } else {
    opponent.innerHTML = `<p>Aquí aparecerá el oponente.</p>`;
  }

  error.innerText = state.error || "";

  battleBtn.disabled = !(state.player && state.opponent);
}