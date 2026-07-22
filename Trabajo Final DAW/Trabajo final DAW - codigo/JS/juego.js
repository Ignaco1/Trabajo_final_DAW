'use strict';
var estado = {
    jugadorSecreto: null,
    intentosUsados: [],
    intentosRestantes: MAX_INTENTOS,
    tiempoInicio: null,
    intervaloTemporizador: null,
    partidaActiva: false,
    pistasReveladas: []
};
function reiniciarEstado() {
    estado.jugadorSecreto = null;
    estado.intentosUsados = [];
    estado.intentosRestantes = MAX_INTENTOS;
    estado.tiempoInicio = null;
    estado.partidaActiva = false;
    estado.pistasReveladas = [];
    if (estado.intervaloTemporizador) {
        clearInterval(estado.intervaloTemporizador);
        estado.intervaloTemporizador = null;
    }
}
function iniciarTemporizador() {
    estado.tiempoInicio = Date.now();
    actualizarTemporizador(0);
    estado.intervaloTemporizador = setInterval(tickTemporizador, 1000);
}
function tickTemporizador() {
    var segundos = Math.floor((Date.now() - estado.tiempoInicio) / 1000);
    actualizarTemporizador(segundos);
}
function detenerTemporizador() {
    if (estado.intervaloTemporizador) {
        clearInterval(estado.intervaloTemporizador);
        estado.intervaloTemporizador = null;
    }
}
function obtenerDuracionSegundos() {
    if (!estado.tiempoInicio) {
        return 0;
    }
    return Math.floor((Date.now() - estado.tiempoInicio) / 1000);
}
function compararJugadores(intento, secreto) {
    return {
        nombre: intento.name === secreto.name ? 'acierto' : 'fallo',
        nacionalidad: intento.nationality === secreto.nationality ? 'acierto' : 'fallo',
        club: intento.club === secreto.club ? 'acierto' : 'fallo',
        posicion: intento.position === secreto.position ? 'acierto' : 'fallo',
        edad: compararNumeros(intento.age, secreto.age),
        overall: compararNumeros(intento.overall, secreto.overall),
        altura: compararNumeros(intento.heightCm, secreto.heightCm)
    };
}
function compararNumeros(valorIntento, valorSecreto) {
    if (valorIntento === valorSecreto) {
        return 'acierto';
    }
    if (valorSecreto > valorIntento) {
        return 'mayor';
    }
    return 'menor';
}
function yaSeUsoEseNombre(nombre) {
    var i;
    for (i = 0; i < estado.intentosUsados.length; i++) {
        if (estado.intentosUsados[i].name === nombre) {
            return true;
        }
    }
    return false;
}
function calcularPuntajeLocal(gano, intentos, duracion) {
    if (!gano) {
        return 0;
    }
    var puntosBase = 60;
    var descuento = (intentos - 1) * 10;
    var bonus = 0;
    if (duracion < 60) {
        bonus = 20;
    } else if (duracion < 120) {
        bonus = 10;
    }
    var puntaje = puntosBase - descuento + bonus;
    if (puntaje < 10) {
        return 10;
    }
    return puntaje;
}
function determinarPistasARevelar(intentosFallidos, secreto) {
    var pistas = [];
    if (intentosFallidos >= 3 && !estado.pistasReveladas.includes('club')) {
        pistas.push({ tipo: 'club', etiqueta: 'Club', valor: secreto.club });
        estado.pistasReveladas.push('club');
    }
    if (intentosFallidos >= 6 && !estado.pistasReveladas.includes('posicion')) {
        pistas.push({ tipo: 'posicion', etiqueta: 'Posicion', valor: secreto.position });
        estado.pistasReveladas.push('posicion');
    }
    if (intentosFallidos === MAX_INTENTOS - 1) {
        if (!estado.pistasReveladas.includes('nacionalidad')) {
            pistas.push({ tipo: 'nacionalidad', etiqueta: 'Nacionalidad', valor: secreto.nationality });
            estado.pistasReveladas.push('nacionalidad');
        } else if (!estado.pistasReveladas.includes('overall')) {
            pistas.push({ tipo: 'overall', etiqueta: 'Overall', valor: secreto.overall });
            estado.pistasReveladas.push('overall');
        }
    }
    return pistas;
}
