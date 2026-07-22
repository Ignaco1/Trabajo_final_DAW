'use strict';
function registrarUsuario(nombreUsuario, contrasena) {
    return fetch(URL_BACKEND + '/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: nombreUsuario, contrasena: contrasena })
    }).then(procesarRespuestaBackend);
}
function loginUsuario(nombreUsuario, contrasena) {
    return fetch(URL_BACKEND + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: nombreUsuario, contrasena: contrasena })
    }).then(procesarRespuestaBackend);
}
function guardarPartida(datos) {
    var token = obtenerToken();
    return fetch(URL_BACKEND + '/partidas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(datos)
    }).then(procesarRespuestaBackend);
}
function obtenerHistorial() {
    var token = obtenerToken();
    return fetch(URL_BACKEND + '/historial', {
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(procesarRespuestaBackend);
}
function obtenerRanking() {
    return fetch(URL_BACKEND + '/ranking').then(procesarRespuestaBackend);
}
function obtenerUrlFotoProxy(urlOriginal) {
    if (!urlOriginal) {
        return urlOriginal;
    }
    return URL_BACKEND + '/foto?url=' + encodeURIComponent(urlOriginal);
}
function procesarRespuestaBackend(respuesta) {
    return respuesta.json().then(function(data) {
        if (!respuesta.ok) {
            throw new Error(data.error || 'Error del servidor');
        }
        return data;
    });
}
