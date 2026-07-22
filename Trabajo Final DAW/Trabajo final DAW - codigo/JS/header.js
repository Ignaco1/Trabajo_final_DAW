'use strict';
function inicializarHeader() {
    aplicarTemaGuardado();
    actualizarUIDeSesion();
    registrarEventosHeader();
    ajustarPanelInicioSegunSesion();
}
function aplicarTemaGuardado() {
    var tema = localStorage.getItem(CLAVE_TEMA);
    var botonTema = document.getElementById('botonTema');
    if (tema === 'oscuro') {
        document.body.classList.add('temaOscuro');
        if (botonTema) {
            botonTema.textContent = 'Modo claro';
        }
    } else if (botonTema) {
        botonTema.textContent = 'Modo oscuro';
    }
}
function alClickBotonTema() {
    var botonTema = document.getElementById('botonTema');
    document.body.classList.toggle('temaOscuro');
    if (document.body.classList.contains('temaOscuro')) {
        localStorage.setItem(CLAVE_TEMA, 'oscuro');
        botonTema.textContent = 'Modo claro';
    } else {
        localStorage.setItem(CLAVE_TEMA, 'claro');
        botonTema.textContent = 'Modo oscuro';
    }
}
function actualizarUIDeSesion() {
    var linkLogin = document.getElementById('linkLogin');
    var usuarioActivo = document.getElementById('usuarioActivo');
    var nombreUsuarioActivo = document.getElementById('nombreUsuarioActivo');
    var linksPrivados = document.getElementsByClassName('linkPrivado');
    var i;
    var usuario;
    if (estaLogueado()) {
        usuario = obtenerUsuario();
        if (linkLogin) {
            linkLogin.classList.add('oculto');
        }
        if (usuarioActivo) {
            usuarioActivo.classList.remove('oculto');
        }
        if (nombreUsuarioActivo && usuario) {
            nombreUsuarioActivo.textContent = usuario.nombreUsuario;
        }
        for (i = 0; i < linksPrivados.length; i++) {
            linksPrivados[i].classList.remove('oculto');
        }
    } else {
        if (linkLogin) {
            linkLogin.classList.remove('oculto');
        }
        if (usuarioActivo) {
            usuarioActivo.classList.add('oculto');
        }
        for (i = 0; i < linksPrivados.length; i++) {
            linksPrivados[i].classList.add('oculto');
        }
    }
}
function ajustarPanelInicioSegunSesion() {
    var avisoLogin = document.getElementById('avisoLogin');
    if (avisoLogin && estaLogueado()) {
        avisoLogin.classList.add('oculto');
    }
}
function registrarEventosHeader() {
    var botonTema = document.getElementById('botonTema');
    var botonLogout = document.getElementById('botonLogout');
    if (botonTema) {
        botonTema.addEventListener('click', alClickBotonTema);
    }
    if (botonLogout) {
        botonLogout.addEventListener('click', cerrarSesion);
    }
}
window.addEventListener('load', inicializarHeader);
