'use strict';
function guardarSesion(token, usuario) {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}
function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    window.location.href = 'index.html';
}
function obtenerToken() {
    return localStorage.getItem(CLAVE_TOKEN);
}
function obtenerUsuario() {
    var datos = localStorage.getItem(CLAVE_USUARIO);
    if (!datos) {
        return null;
    }
    try {
        return JSON.parse(datos);
    } catch (e) {
        return null;
    }
}
function estaLogueado() {
    return obtenerToken() !== null;
}
