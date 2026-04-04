import { render } from "./render.js";

// Cargar datos desde localStorage
const data = JSON.parse(localStorage.getItem("battle"));

// Estado de la batalla
const state = {
  player: data.player,
  opponent: data.opponent,

  playerHP: Math.floor(data.player.stats[0].base_stat * 2.5),
  opponentHP: Math.floor(data.opponent.stats[0].base_stat * 2.5),

  playerPosition: 2,
  locked: false,
  incomingAttack: null,
  log: [],
  phase: "fighting",
  attackOnCooldown: false,
  definitiveUsed: false
};

// Timer del enemigo
let attackTimeout = null;

// Función de espera
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Colores por tipo (THEMING)
function getTypeColor(type) {
  const colors = {
    fire: "orange",
    water: "blue",
    grass: "green",
    electric: "yellow",
    psychic: "purple",
    dragon: "red",
    ghost: "gray",
    normal: "white"
  };

  return colors[type] || "pink";
}

// Cooldown del jugador
function startCooldown(duration, button) {
  state.attackOnCooldown = true;
  button.disabled = true;

  setTimeout(() => {
    state.attackOnCooldown = false;
    button.disabled = false;
  }, duration);
}

// Detectar fin de batalla
function checkBattleEnd() {
  if (state.playerHP <= 0) {
    state.phase = "ended";
    state.log.push("Perdiste la batalla");
    clearTimeout(attackTimeout);
  }

  if (state.opponentHP <= 0) {
    state.phase = "ended";
    state.log.push("Ganaste la batalla");
    clearTimeout(attackTimeout);
  }
}

// Resolver ataque enemigo
async function resolveEnemyAttack() {
  const target = Math.floor(Math.random() * 3) + 1;

  state.incomingAttack = target;
  state.locked = false;
  render(state);

  await wait(600);

  state.locked = true;
  render(state);

  if (state.playerPosition === target) {
    state.playerHP -= 10;
    state.log.push("¡Te golpearon!");
  } else {
    state.log.push("¡Esquivaste!");
  }

  state.incomingAttack = null;
  state.locked = false;

  checkBattleEnd();

  render(state);
}

// Programar ataques enemigos
function scheduleNextAttack() {
  const delay = (3 + Math.random() * 7) * 1000;

  attackTimeout = setTimeout(async () => {
    await resolveEnemyAttack();

    if (state.phase === "fighting") {
      scheduleNextAttack();
    }
  }, delay);
}

// Movimiento del jugador
function onKeyDown(e) {
  if (state.phase !== "fighting") return;
  if (state.locked) return;

  if (e.key === "ArrowLeft" && state.playerPosition > 1) {
    state.playerPosition--;
  }

  if (e.key === "ArrowRight" && state.playerPosition < 3) {
    state.playerPosition++;
  }

  render(state);
}

// Iniciar todo cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  const attackBtn = document.getElementById("attackBtn");
  const resetBtn = document.getElementById("resetBtn");
  const ultimateBtn = document.getElementById("ultimateBtn");

  // 🎨 Aplicar color según tipo
  const playerType = data.player.types[0].type.name;
  const color = getTypeColor(playerType);
  document.body.style.backgroundColor = color;

  // ATAQUE DEL JUGADOR
  attackBtn.addEventListener("click", () => {
    if (state.phase !== "fighting") return;
    if (state.attackOnCooldown) return;

    const damage = Math.floor(20 + Math.random() * 20);

    state.opponentHP -= damage;
    checkBattleEnd();

    state.log.push(`Atacaste e hiciste ${damage} de daño`);

    startCooldown(3000, attackBtn);

    render(state);
  });

  // DEFINITIVE MOVE
  ultimateBtn.addEventListener("click", () => {
    if (state.definitiveUsed) return;
    if (state.phase !== "fighting") return;

    state.opponentHP = 0;
    state.definitiveUsed = true;

    state.log.push("¡Usaste el movimiento definitivo!");

    checkBattleEnd();
    render(state);
  });

  // BOTÓN REINICIAR
  resetBtn.addEventListener("click", () => {
    state.playerHP = Math.floor(data.player.stats[0].base_stat * 2.5);
    state.opponentHP = Math.floor(data.opponent.stats[0].base_stat * 2.5);
    state.playerPosition = 2;
    state.locked = false;
    state.incomingAttack = null;
    state.log = [];
    state.phase = "fighting";
    state.attackOnCooldown = false;
    state.definitiveUsed = false;

    clearTimeout(attackTimeout);

    render(state);
    scheduleNextAttack();
  });

  render(state);
  document.addEventListener("keydown", onKeyDown);
  scheduleNextAttack();
});