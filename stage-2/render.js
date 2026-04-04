export function render(state) {
  const arena = document.getElementById("arena");
  const log = document.getElementById("log");

  let cells = ["-", "-", "-"];

  if (state.incomingAttack) {
    cells[state.incomingAttack - 1] = "⚠️";
  }

  cells[state.playerPosition - 1] = "🟡";

  arena.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h3>${state.opponent.name}</h3>
        <img src="${state.opponent.sprites.front_default}" width="100">
        <p>HP: ${state.opponentHP}</p>
      </div>

      <div>
        [ ${cells[0]} | ${cells[1]} | ${cells[2]} ]
      </div>

      <div>
        <h3>${state.player.name}</h3>
        <img src="${state.player.sprites.front_default}" width="100">
        <p>HP: ${state.playerHP}</p>
      </div>
    </div>
  `;

  if (state.phase === "ended") {
    arena.innerHTML += `<h2>Batalla terminada</h2>`;
  }

  log.innerHTML = state.log.join("<br>");
}