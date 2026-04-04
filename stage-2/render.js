export function render(state) {
  const arena = document.getElementById("arena");
  const log = document.getElementById("log");

  let cells = ["-", "-", "-"];

  // Mostrar ataque entrante
  if (state.incomingAttack) {
    cells[state.incomingAttack - 1] = "⚠️";
  }

  // Mostrar posición del jugador
  cells[state.playerPosition - 1] = "🟡";

  arena.innerHTML = `
    <p>Opponent HP: ${state.opponentHP}</p>

    <div>
      [ ${cells[0]} | ${cells[1]} | ${cells[2]} ]
    </div>

    <p>Player HP: ${state.playerHP}</p>
  `;

  // Mostrar mensaje cuando termina
  if (state.phase === "ended") {
    arena.innerHTML += `<h2>Batalla terminada</h2>`;
  }

  log.innerHTML = state.log.join("<br>");
}