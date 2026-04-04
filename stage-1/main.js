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

async function loadPlayer() {
  state.loadingPlayer = true;
  render(state);

  const data = await getPokemon(TRAINER.favoritePokemon);

  state.loadingPlayer = false;
  state.player = data;

  render(state);
}

document.addEventListener("DOMContentLoaded", () => {

  loadPlayer();

  const input = document.getElementById("search");
  const btn = document.getElementById("searchBtn");
  const battleBtn = document.getElementById("battleBtn");

  btn.addEventListener("click", async () => {
    const name = input.value;

    state.loadingOpponent = true;
    render(state);

    const data = await getPokemon(name);

    state.loadingOpponent = false;

    if (data.error) {
      state.opponent = null;
    } else {
      state.opponent = data;
    }

    render(state);
  });

  battleBtn.addEventListener("click", () => {
    localStorage.setItem("battle", JSON.stringify({
      player: state.player,
      opponent: state.opponent
    }));

    window.location.href = "../stage-2/index.html";
  });

});