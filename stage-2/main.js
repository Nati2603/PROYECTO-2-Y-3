import { render } from "./render.js";
import TRAINER from "../trainer.config.js";

const data = JSON.parse(localStorage.getItem("battle"));

const state = {
  player: data.player,
  opponent: data.opponent,

  playerHP: Math.floor(data.player.stats[0].base_stat * 2.5),
  opponentHP: Math.floor(data.opponent.stats[0].base_stat * 2.5),

  playerMaxHP: Math.floor(data.player.stats[0].base_stat * 2.5),
  opponentMaxHP: Math.floor(data.opponent.stats[0].base_stat * 2.5),

  playerPosition: 2,
  locked: false,
  incomingAttack: null,
  log: [],
  phase: "fighting",
  attackOnCooldown: false,
  definitiveUsed: false,

  playerMoves: [
    { name: formatMoveName(data.player.moves[0]?.move?.name || "pound"), power: 60 },
    { name: formatMoveName(data.player.moves[1]?.move?.name || "mega-punch"), power: 60 },
    { name: formatMoveName(data.player.moves[2]?.move?.name || "psychic"), power: 60 }
  ]
};

let attackTimeout = null;
let cooldownTimeout = null;

function formatMoveName(name) {
  return name.replace("-", " ");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTypeColor(type) {
  const colors = {
    fire: "orange",
    water: "blue",
    grass: "green",
    electric: "gold",
    psychic: "purple",
    dragon: "red",
    ghost: "gray",
    normal: "white"
  };

  return colors[type] || "pink";
}

function calcPlayerDamage(movePower) {
  return Math.floor(movePower * 0.3) + Math.floor(Math.random() * movePower * 0.4);
}

function calcEnemyDamage() {
  const opponentAttackStat = state.opponent.stats[1].base_stat;
  return Math.floor(opponentAttackStat * 0.4) + Math.floor(Math.random() * 20);
}

function startCooldown(duration) {
  state.attackOnCooldown = true;
  render(state);
  addButtonEvents();

  cooldownTimeout = setTimeout(() => {
    state.attackOnCooldown = false;
    render(state);
    addButtonEvents();
  }, duration);
}

function checkBattleEnd() {
  if (state.playerHP <= 0) {
    state.playerHP = 0;
    state.phase = "ended";
    state.log.push(TRAINER.loseMessage);
    clearTimeout(attackTimeout);
    clearTimeout(cooldownTimeout);
    return true;
  }

  if (state.opponentHP <= 0) {
    state.opponentHP = 0;
    state.phase = "ended";
    state.log.push(TRAINER.winMessage);
    clearTimeout(attackTimeout);
    clearTimeout(cooldownTimeout);
    return true;
  }

  return false;
}

//Resolución del ataque
async function resolveEnemyAttack() {
  const target = Math.floor(Math.random() * 3) + 1;

  state.incomingAttack = target;
  state.locked = false;
  state.log.push(`El enemigo apunta a la posición ${target}`);
  render(state);
  addButtonEvents();

  await wait(600);

  state.locked = true;
  render(state);
  addButtonEvents();

  if (state.playerPosition === target) {
    const damage = calcEnemyDamage();
    state.playerHP -= damage;
    state.log.push(`¡Te golpearon! Recibiste ${damage} de daño`);
  } else {
    state.log.push("¡Esquivaste!");
  }

  state.incomingAttack = null;
  state.locked = false;

  checkBattleEnd();
  render(state);
  addButtonEvents();
}

//Ataque enemigo automático

function scheduleNextAttack() {
  const delay = (3 + Math.random() * 7) * 1000;

  attackTimeout = setTimeout(async () => {
    await resolveEnemyAttack();

    if (state.phase === "fighting") {
      scheduleNextAttack();
    }
  }, delay);
}

function usePlayerAttack(moveIndex) {
  if (state.phase !== "fighting") return;
  if (state.attackOnCooldown) return;

  const move = state.playerMoves[moveIndex];
  const damage = calcPlayerDamage(move.power);

  state.opponentHP -= damage;
  state.log.push(`${state.player.name} usó ${move.name} e hizo ${damage} de daño`);

  checkBattleEnd();
  render(state);
  addButtonEvents();

  if (state.phase === "fighting") {
    startCooldown(3000);
  }
}

function useUltimateMove() {
  if (state.phase !== "fighting") return;
  if (state.definitiveUsed) return;

  state.opponentHP = 0;
  state.definitiveUsed = true;
  state.log.push(`¡${state.player.name} usó ${TRAINER.definitiveMoveName}!`);
  state.log.push(TRAINER.definitiveMoveFlavor);

  checkBattleEnd();
  render(state);
  addButtonEvents();
}

function resetBattle() {
  state.playerHP = state.playerMaxHP;
  state.opponentHP = state.opponentMaxHP;
  state.playerPosition = 2;
  state.locked = false;
  state.incomingAttack = null;
  state.log = [];
  state.phase = "fighting";
  state.attackOnCooldown = false;
  state.definitiveUsed = false;

  clearTimeout(attackTimeout);
  clearTimeout(cooldownTimeout);

  render(state);
  addButtonEvents();
  scheduleNextAttack();
}

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
  addButtonEvents();
}

function addButtonEvents() {
  const attackBtn1 = document.getElementById("attackBtn1");
  const attackBtn2 = document.getElementById("attackBtn2");
  const attackBtn3 = document.getElementById("attackBtn3");
  const ultimateBtn = document.getElementById("ultimateBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (attackBtn1) {
    attackBtn1.onclick = () => usePlayerAttack(0);
  }

  if (attackBtn2) {
    attackBtn2.onclick = () => usePlayerAttack(1);
  }

  if (attackBtn3) {
    attackBtn3.onclick = () => usePlayerAttack(2);
  }

  if (ultimateBtn) {
    ultimateBtn.onclick = useUltimateMove;
  }

  if (resetBtn) {
    resetBtn.onclick = resetBattle;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const playerType = data.player.types[0].type.name;
  const color = getTypeColor(playerType);
  document.body.style.backgroundColor = color;

  render(state);
  addButtonEvents();
  document.addEventListener("keydown", onKeyDown);
  scheduleNextAttack();
});