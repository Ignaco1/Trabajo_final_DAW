'use strict';
var elHistorial = {};
var partidasCache = [];
function inicializarHistorial() {
    elHistorial.controles = document.getElementById('controlesHistorial');
    elHistorial.selectOrden = document.getElementById('selectOrden');
    elHistorial.tablaContenedor = document.getElementById('tablaHistorialContenedor');
    elHistorial.cuerpoTabla = document.getElementById('cuerpoTablaHistorial');
    elHistorial.mensajeSinHistorial = document.getElementById('mensajeSinHistorial');
    elHistorial.mensajeNoLogueado = document.getElementById('mensajeNoLogueado');
    elHistorial.cargando = document.getElementById('cargandoHistorial');
    elHistorial.subtitulo = document.getElementById('subtituloHistorial');
    if (!estaLogueado()) {
        elHistorial.mensajeNoLogueado.classList.remove('oculto');
        elHistorial.subtitulo.classList.add('oculto');
        elHistorial.mensajeSinHistorial.classList.add('oculto');
        return;
    }
    elHistorial.mensajeNoLogueado.classList.add('oculto');
    elHistorial.mensajeSinHistorial.classList.add('oculto');
    elHistorial.cargando.classList.remove('oculto');
    elHistorial.selectOrden.addEventListener('change', alCambiarOrden);
    cargarHistorial();
}
function cargarHistorial() {
    obtenerHistorial()
        .then(alRecibirHistorial)
        .catch(alFallarHistorial);
}
function alRecibirHistorial(data) {
    elHistorial.cargando.classList.add('oculto');
    partidasCache = data.partidas;
    if (partidasCache.length === 0) {
        elHistorial.mensajeSinHistorial.classList.remove('oculto');
        elHistorial.controles.classList.add('oculto');
        elHistorial.tablaContenedor.classList.add('oculto');
        return;
    }
    elHistorial.mensajeSinHistorial.classList.add('oculto');
    elHistorial.mensajeNoLogueado.classList.add('oculto');
    elHistorial.controles.classList.remove('oculto');
    elHistorial.tablaContenedor.classList.remove('oculto');
    renderizarTablaHistorial(partidasCache);
}
function renderizarTablaHistorial(partidas) {
    var i;
    var fila;
    var claseEstado;
    var textoEstado;
    var fechaFormateada;
    elHistorial.cuerpoTabla.innerHTML = '';
    for (i = 0; i < partidas.length; i++) {
        claseEstado = partidas[i].resultado === 'gano' ? 'estadoGano' : 'estadoPerdio';
        textoEstado = partidas[i].resultado === 'gano' ? 'Gano' : 'Perdio';
        fechaFormateada = new Date(partidas[i].fecha).toLocaleString('es-AR');
        fila = document.createElement('tr');
        fila.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + partidas[i].jugadorSecreto + '</td>' +
            '<td><span class="' + claseEstado + '">' + textoEstado + '</span></td>' +
            '<td>' + partidas[i].intentos + '</td>' +
            '<td>' + formatearDuracionHistorial(partidas[i].duracionSegundos) + '</td>' +
            '<td>' + partidas[i].puntaje + '</td>' +
            '<td>' + fechaFormateada + '</td>';
        elHistorial.cuerpoTabla.appendChild(fila);
    }
}
function formatearDuracionHistorial(segundos) {
    var min = Math.floor(segundos / 60);
    var seg = segundos % 60;
    if (min === 0) {
        return seg + 's';
    }
    return min + 'm ' + seg + 's';
}
function alCambiarOrden() {
    var criterio = elHistorial.selectOrden.value;
    var ordenado = partidasCache.slice();
    if (criterio === 'fecha') {
        ordenado.sort(comparadorFecha);
    } else if (criterio === 'intentos') {
        ordenado.sort(comparadorIntentos);
    } else if (criterio === 'puntaje') {
        ordenado.sort(comparadorPuntaje);
    }
    renderizarTablaHistorial(ordenado);
}
function comparadorFecha(a, b) {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
}
function comparadorIntentos(a, b) {
    return a.intentos - b.intentos;
}
function comparadorPuntaje(a, b) {
    return b.puntaje - a.puntaje;
}
function alFallarHistorial(error) {
    elHistorial.cargando.textContent = 'Error al cargar el historial: ' + error.message;
}
window.addEventListener('load', inicializarHistorial);
