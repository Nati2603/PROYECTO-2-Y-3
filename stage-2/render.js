export function render(state) {
  const arena = document.getElementById("arena");
  const log = document.getElementById("log");
  const controls = document.getElementById("controls");

  const playerHpPercent = (state.playerHP / state.playerMaxHP) * 100;
  const opponentHpPercent = (state.opponentHP / state.opponentMaxHP) * 100;

  let opponentCells = ["", "", ""];
  let playerCells = ["", "", ""];

  opponentCells[1] = `
    <img src="${state.opponent.sprites.front_default}" alt="${state.opponent.name}" class="pokemon-sprite">
  `;

  playerCells[state.playerPosition - 1] = `
    <img src="${state.player.sprites.front_default}" alt="${state.player.name}" class="pokemon-sprite">
  `;

  arena.innerHTML = `
    <div class="battle-layout">
      <div class="pokemon-card">
        <h3>${state.opponent.name}</h3>
        <p>HP: ${state.opponentHP}</p>
        <div class="hp-bar">
          <div class="hp-fill" style="width: ${opponentHpPercent}%;"></div> 
        </div>
      </div>

      <div class="arena-board">
        <div class="arena-row">
          ${opponentCells
            .map(
              (cell) => `
                <div class="arena-cell">
                  ${cell}
                </div>
              `
            )
            .join("")}
        </div>

        <p class="arena-text">↓ ATAQUES ↓</p>

        <div class="arena-row">
          ${playerCells
            .map((cell, index) => {
              const cellNumber = index + 1;
              const warning = state.incomingAttack === cellNumber ? "warning" : "";

              return `
                <div class="arena-cell ${warning}">
                  ${state.incomingAttack === cellNumber ? '<span class="warning-icon">⚠</span>' : ""}
                  ${cell}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>

      <div class="pokemon-card">
        <h3>${state.player.name}</h3>
        <p>HP: ${state.playerHP}</p>
        <div class="hp-bar">
          <div class="hp-fill" style="width: ${playerHpPercent}%;"></div>
        </div>
      </div>
    </div>
  `;

  controls.innerHTML = `
    <button id="attackBtn1" ${state.phase !== "fighting" || state.attackOnCooldown ? "disabled" : ""}>
      ${state.playerMoves[0] ? state.playerMoves[0].name : "Ataque 1"}
    </button>

    <button id="attackBtn2" ${state.phase !== "fighting" || state.attackOnCooldown ? "disabled" : ""}>
      ${state.playerMoves[1] ? state.playerMoves[1].name : "Ataque 2"}
    </button>

    <button id="attackBtn3" ${state.phase !== "fighting" || state.attackOnCooldown ? "disabled" : ""}>
      ${state.playerMoves[2] ? state.playerMoves[2].name : "Ataque 3"}
    </button>

    <button id="ultimateBtn" ${state.definitiveUsed || state.phase !== "fighting" ? "disabled" : ""}>
      Definitive Move
    </button>

    <button id="resetBtn">Battle Again</button>
  `;

  if (state.phase === "ended") {
    arena.innerHTML += `<h2 class="end-message">Batalla terminada</h2>`;
  }

  log.innerHTML = state.log.map((item) => `<p>${item}</p>`).join("");
}