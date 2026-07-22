'use strict';
var timeoutBusqueda = null;
var jugadorSeleccionado = null;
function inicializarJuego() {
    inicializarReferenciasJuego();
    registrarEventosJuego();
}
function registrarEventosJuego() {
    elementos.botonComenzar.addEventListener('click', alClickComenzar);
    elementos.botonReiniciar.addEventListener('click', alClickReiniciar);
    elementos.inputBusqueda.addEventListener('input', alEscribirBusqueda);
    elementos.botonRandom.addEventListener('click', alClickRandom);
    elementos.botonEnviarIntento.addEventListener('click', alClickEnviarIntento);
    elementos.cerrarModal.addEventListener('click', ocultarModal);
    elementos.overlayModal.addEventListener('click', alClickFueraModal);
}
function alClickFueraModal(evento) {
    if (evento.target === elementos.overlayModal) {
        ocultarModal();
    }
}
function alClickComenzar() {
    iniciarNuevaPartida();
}
function iniciarNuevaPartida() {
    reiniciarEstado();
    limpiarTablero();
    actualizarContadorIntentos(MAX_INTENTOS);
    actualizarTemporizador(0);
    elementos.inputBusqueda.value = '';
    elementos.botonEnviarIntento.disabled = false;
    elementos.zonaPistas.classList.add('oculto');
    elementos.zonaFotoSecreta.classList.add('oculto');
    obtenerJugadorAleatorio()
        .then(alRecibirJugadorSecreto)
        .catch(alFallarObtenerSecreto);
}
function alRecibirJugadorSecreto(jugador) {
    estado.jugadorSecreto = jugador;
    estado.partidaActiva = true;
    elementos.panelInicio.classList.add('oculto');
    elementos.panelJuego.classList.remove('oculto');
    crearEncabezadoTablero();
    inicializarFotoSecreta(obtenerUrlFotoProxy(jugador.photo));
    iniciarTemporizador();
}
function alFallarObtenerSecreto(error) {
    mostrarModal('error', 'Error de conexion',
        'No se pudo obtener el jugador secreto. Revisa tu conexion e intenta de nuevo.',
        'Detalle: ' + error.message,
        [{ texto: 'Reintentar', accion: reintentarInicio }]);
}
function reintentarInicio() {
    ocultarModal();
    iniciarNuevaPartida();
}
function alEscribirBusqueda() {
    var consulta = elementos.inputBusqueda.value.trim();
    jugadorSeleccionado = null;
    if (timeoutBusqueda) {
        clearTimeout(timeoutBusqueda);
    }
    if (consulta.length < 2) {
        limpiarAutocompletado();
        return;
    }
    timeoutBusqueda = setTimeout(function() {
        ejecutarBusqueda(consulta);
    }, 250);
}
function ejecutarBusqueda(consulta) {
    buscarJugadoresPorNombre(consulta, 8)
        .then(alRecibirResultadosBusqueda)
        .catch(alFallarBusqueda);
}
function alRecibirResultadosBusqueda(jugadores) {
    renderizarAutocompletado(jugadores, seleccionarJugadorSugerido);
}
function alFallarBusqueda(error) {
    console.log('Error en busqueda: ' + error.message);
    limpiarAutocompletado();
}
function seleccionarJugadorSugerido(jugador) {
    jugadorSeleccionado = jugador;
    elementos.inputBusqueda.value = jugador.name;
    limpiarAutocompletado();
}
function alClickRandom() {
    if (!estado.partidaActiva) {
        return;
    }
    obtenerJugadorAleatorio()
        .then(alRecibirJugadorRandom)
        .catch(alFallarJugadorRandom);
}
function alRecibirJugadorRandom(jugador) {
    if (yaSeUsoEseNombre(jugador.name)) {
        alClickRandom();
        return;
    }
    jugadorSeleccionado = jugador;
    elementos.inputBusqueda.value = jugador.name;
    limpiarAutocompletado();
}
function alFallarJugadorRandom(error) {
    mostrarModal('error', 'Error', 'No se pudo obtener un jugador random.', 'Detalle: ' + error.message,
        [{ texto: 'Cerrar', accion: ocultarModal }]);
}
function alClickEnviarIntento() {
    if (!estado.partidaActiva) {
        return;
    }
    if (!jugadorSeleccionado) {
        mostrarModal('error', 'Seleccion invalida',
            'Tenes que elegir un jugador de la lista de sugerencias.', null,
            [{ texto: 'Aceptar', accion: ocultarModal }]);
        return;
    }
    var intento = jugadorSeleccionado;
    if (yaSeUsoEseNombre(intento.name)) {
        mostrarModal('error', 'Nombre repetido',
            'Ya usaste a ' + intento.name + ' en esta partida.', null,
            [{ texto: 'Aceptar', accion: ocultarModal }]);
        return;
    }
    procesarIntento(intento);
}
function procesarIntento(intento) {
    var comparacion = compararJugadores(intento, estado.jugadorSecreto);
    var intentosFallidos;
    estado.intentosUsados.push(intento);
    estado.intentosRestantes = MAX_INTENTOS - estado.intentosUsados.length;
    renderizarFilaIntento(intento, comparacion);
    actualizarContadorIntentos(estado.intentosRestantes);
    elementos.inputBusqueda.value = '';
    jugadorSeleccionado = null;
    if (intento.name === estado.jugadorSecreto.name) {
        finalizarPartida(true);
        return;
    }
    intentosFallidos = estado.intentosUsados.length;
    actualizarBlurFoto(intentosFallidos);
    determinarPistasARevelar(intentosFallidos, estado.jugadorSecreto);
    renderizarPistasReveladas();
    if (estado.intentosRestantes === 0) {
        finalizarPartida(false);
    }
}
function finalizarPartida(gano) {
    detenerTemporizador();
    estado.partidaActiva = false;
    elementos.botonEnviarIntento.disabled = true;
    revelarFotoCompleta();
    var intentos = estado.intentosUsados.length;
    var duracion = obtenerDuracionSegundos();
    var puntajeLocal = calcularPuntajeLocal(gano, intentos, duracion);
    if (estaLogueado()) {
        var datos = {
            jugadorSecreto: estado.jugadorSecreto.name,
            resultado: gano ? 'gano' : 'perdio',
            intentos: intentos,
            duracionSegundos: duracion,
            dificultad: 'facil'
        };
        guardarPartida(datos).catch(alFallarGuardarPartida);
    }
    if (gano) {
        mostrarModalVictoria(intentos, duracion, puntajeLocal);
    } else {
        mostrarModalDerrota();
    }
}
function alFallarGuardarPartida(error) {
    console.log('Error al guardar partida: ' + error.message);
}
function mostrarModalVictoria(intentos, duracion, puntaje) {
    var textoTiempo = formatearDuracion(duracion);
    var tarjeta = generarTarjetaJugadorRevelado(estado.jugadorSecreto);
    var cuerpo = 'Adivinaste al jugador en ' + intentos + ' intento(s). Tiempo: ' + textoTiempo + '.';
    if (estaLogueado()) {
        cuerpo = cuerpo + ' Sumaste ' + puntaje + ' puntos al ranking.';
    } else {
        cuerpo = cuerpo + ' Inicia sesion para guardar tus partidas y competir en el ranking.';
    }
    mostrarModal('exito', 'Ganaste!', cuerpo, tarjeta,
        [
            { texto: 'Jugar otra vez', accion: cerrarYReiniciar },
            { texto: 'Cerrar', accion: ocultarModal }
        ]);
}
function mostrarModalDerrota() {
    var tarjeta = generarTarjetaJugadorRevelado(estado.jugadorSecreto);
    mostrarModal('error', 'Perdiste',
        'Agotaste los 8 intentos. El jugador secreto era:', tarjeta,
        [
            { texto: 'Jugar otra vez', accion: cerrarYReiniciar },
            { texto: 'Cerrar', accion: ocultarModal }
        ]);
}
function cerrarYReiniciar() {
    ocultarModal();
    iniciarNuevaPartida();
}
function formatearDuracion(segundos) {
    var min = Math.floor(segundos / 60);
    var seg = segundos % 60;
    if (min === 0) {
        return seg + ' segundos';
    }
    return min + 'm ' + seg + 's';
}
function alClickReiniciar() {
    if (estado.partidaActiva) {
        mostrarModal('error', 'Reiniciar partida?',
            'Vas a perder el progreso actual. Estas seguro?', null,
            [
                { texto: 'Si, reiniciar', accion: confirmarReinicio },
                { texto: 'Cancelar', accion: ocultarModal }
            ]);
    } else {
        confirmarReinicio();
    }
}
function confirmarReinicio() {
    ocultarModal();
    iniciarNuevaPartida();
}
window.addEventListener('load', inicializarJuego);
