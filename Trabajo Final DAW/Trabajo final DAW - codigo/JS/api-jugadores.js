'use strict';
function obtenerJugadorAleatorio() {
    return fetch(URL_JUGADORES + '/random').then(procesarRespuestaJugadores);
}
function buscarJugadoresPorNombre(consulta, limite) {
    var url = URL_JUGADORES + '/search?q=' + encodeURIComponent(consulta) + '&limit=' + limite;
    return fetch(url).then(procesarRespuestaJugadores);
}
function procesarRespuestaJugadores(respuesta) {
    if (!respuesta.ok) {
        throw new Error('Error al consultar la API de jugadores: ' + respuesta.status);
    }
    return respuesta.json();
}
