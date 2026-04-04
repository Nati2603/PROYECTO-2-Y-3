# PROYECTO-2-Y-3
Proyecto 2 y 3 de Programación web 1
El pokemón escogido es "Mew", es de tipo Psíquico. Puede aprender prácticamente cualquier movimiento. Tiene una alta capacidad de adaptarse a cualquier situación de batalla.
# Pequeño resumen

En este proyecto desarrollé una aplicación web de batalla Pokémon utilizando JavaScript puro (Vanilla JS) y la PokeAPI.

En la primera parte (Stage 1), implementé una pantalla donde se carga automáticamente mi Pokémon favorito (Mew) desde la API. También agregué un buscador para seleccionar un oponente, mostrando su información básica. Una vez seleccionados ambos Pokémon, se almacenan los datos en localStorage para ser utilizados en la siguiente etapa.

En la segunda parte (Stage 2), construí una batalla en tiempo real. El jugador puede moverse entre tres posiciones usando las teclas del teclado para esquivar ataques enemigos que ocurren de forma automática. También puede atacar al oponente mediante un botón con tiempo de recarga (cooldown).

Se implementó un sistema de vida (HP) para ambos Pokémon, donde el jugador puede ganar o perder dependiendo de los ataques recibidos o realizados. Además, se muestra un registro (log) de eventos durante la batalla.

Finalmente, agregué la funcionalidad de reiniciar la batalla sin recargar la página, permitiendo jugar nuevamente de forma dinámica.