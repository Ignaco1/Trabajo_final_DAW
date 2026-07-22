'use strict';
var elRanking = {};
function inicializarRanking() {
    elRanking.podio = document.getElementById('podio');
    elRanking.podio1Nombre = document.getElementById('podio1Nombre');
    elRanking.podio1Puntos = document.getElementById('podio1Puntos');
    elRanking.podio2Nombre = document.getElementById('podio2Nombre');
    elRanking.podio2Puntos = document.getElementById('podio2Puntos');
    elRanking.podio3Nombre = document.getElementById('podio3Nombre');
    elRanking.podio3Puntos = document.getElementById('podio3Puntos');
    elRanking.tablaContenedor = document.getElementById('tablaRankingContenedor');
    elRanking.cuerpoTabla = document.getElementById('cuerpoTablaRanking');
    elRanking.mensajeSinRanking = document.getElementById('mensajeSinRanking');
    elRanking.cargando = document.getElementById('cargandoRanking');
    cargarRanking();
}
function cargarRanking() {
    obtenerRanking()
        .then(alRecibirRanking)
        .catch(alFallarRanking);
}
function alRecibirRanking(data) {
    var ranking = data.ranking;
    var conPartidas = ranking.filter(function(u) {
        return u.puntajeTotal !== null && u.puntajeTotal > 0;
    });
    elRanking.cargando.classList.add('oculto');
    if (conPartidas.length === 0) {
        elRanking.mensajeSinRanking.classList.remove('oculto');
        return;
    }
    llenarPodio(conPartidas);
    llenarTablaRanking(conPartidas);
}
function llenarPodio(ranking) {
    elRanking.podio.classList.remove('oculto');
    if (ranking[0]) {
        elRanking.podio1Nombre.textContent = ranking[0].nombreUsuario;
        elRanking.podio1Puntos.textContent = ranking[0].puntajeTotal;
    }
    if (ranking[1]) {
        elRanking.podio2Nombre.textContent = ranking[1].nombreUsuario;
        elRanking.podio2Puntos.textContent = ranking[1].puntajeTotal;
    }
    if (ranking[2]) {
        elRanking.podio3Nombre.textContent = ranking[2].nombreUsuario;
        elRanking.podio3Puntos.textContent = ranking[2].puntajeTotal;
    }
}
function llenarTablaRanking(ranking) {
    var i;
    var fila;
    elRanking.cuerpoTabla.innerHTML = '';
    if (ranking.length <= 3) {
        return;
    }
    elRanking.tablaContenedor.classList.remove('oculto');
    for (i = 3; i < ranking.length; i++) {
        fila = document.createElement('tr');
        fila.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + ranking[i].nombreUsuario + '</td>' +
            '<td>' + ranking[i].partidasJugadas + '</td>' +
            '<td>' + ranking[i].partidasGanadas + '</td>' +
            '<td>' + ranking[i].puntajeTotal + '</td>';
        elRanking.cuerpoTabla.appendChild(fila);
    }
}
function alFallarRanking(error) {
    elRanking.cargando.textContent = 'Error al cargar el ranking: ' + error.message;
}
window.addEventListener('load', inicializarRanking);
