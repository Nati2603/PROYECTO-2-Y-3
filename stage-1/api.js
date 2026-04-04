export async function getPokemon(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!res.ok) throw new Error("No encontrado");
    return await res.json();
  } catch (error) {
    return { error: true };
  }
}