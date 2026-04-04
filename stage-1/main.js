import TRAINER from "../trainer.config.js";
import { getPokemon } from "./api.js";
import { render } from "./render.js";

const state = {
  player: null,
  opponent: null,
  loadingPlayer: false,
  loadingOpponent: false,
  error: null
};

// ─────────────────────────
// Cargar tu Pokémon (Mew)
// ─────────────────────────
async function loadPlayer() {
  state.loadingPlayer = true;
  render(state);

  const data = await getPokemon(TRAINER.favoritePokemon);

  state.player = data;
  state.loadingPlayer = false;

  render(state);
}

loadPlayer();

// ─────────────────────────
// DEBOUNCE + BÚSQUEDA
// ─────────────────────────

const input = document.getElementById("search");
let timeout = null;

input.addEventListener("input", () => {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const name = input.value.toLowerCase().trim();

    if (!name) return;

    state.loadingOpponent = true;
    render(state);

    const data = await getPokemon(name);

    state.loadingOpponent = false;

    if (data.error) {
      state.opponent = null;
      state.error = "Pokémon no encontrado";
    } else {
      state.opponent = data;
      state.error = null;

      // guardar último oponente
      localStorage.setItem("lastOpponent", name);
    }

    render(state);
  }, 300); // ← debounce 300ms
});

// ─────────────────────────
// BOTÓN IR A BATALLA
// ─────────────────────────

const battleBtn = document.getElementById("battleBtn");

battleBtn.addEventListener("click", () => {
  if (!state.player || !state.opponent) return;

  localStorage.setItem(
    "battle",
    JSON.stringify({
      player: state.player,
      opponent: state.opponent
    })
  );

  window.location.href = "../stage-2/index.html";
});