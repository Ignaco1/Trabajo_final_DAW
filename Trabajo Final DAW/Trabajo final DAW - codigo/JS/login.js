'use strict';
var elLogin = {};
function inicializarLogin() {
    if (estaLogueado()) {
        window.location.href = 'index.html';
        return;
    }
    elLogin.tabLogin = document.getElementById('tabLogin');
    elLogin.tabRegistro = document.getElementById('tabRegistro');
    elLogin.formularioLogin = document.getElementById('formularioLogin');
    elLogin.formularioRegistro = document.getElementById('formularioRegistro');
    elLogin.inputLoginUsuario = document.getElementById('inputLoginUsuario');
    elLogin.inputLoginContrasena = document.getElementById('inputLoginContrasena');
    elLogin.errorLoginUsuario = document.getElementById('errorLoginUsuario');
    elLogin.errorLoginContrasena = document.getElementById('errorLoginContrasena');
    elLogin.botonLoginEnviar = document.getElementById('botonLoginEnviar');
    elLogin.inputRegistroUsuario = document.getElementById('inputRegistroUsuario');
    elLogin.inputRegistroContrasena = document.getElementById('inputRegistroContrasena');
    elLogin.inputRegistroContrasena2 = document.getElementById('inputRegistroContrasena2');
    elLogin.errorRegistroUsuario = document.getElementById('errorRegistroUsuario');
    elLogin.errorRegistroContrasena = document.getElementById('errorRegistroContrasena');
    elLogin.errorRegistroContrasena2 = document.getElementById('errorRegistroContrasena2');
    elLogin.botonRegistroEnviar = document.getElementById('botonRegistroEnviar');
    elLogin.overlayModal = document.getElementById('overlayModal');
    elLogin.cajaModal = document.getElementById('cajaModal');
    elLogin.tituloModal = document.getElementById('tituloModal');
    elLogin.cuerpoModal = document.getElementById('cuerpoModal');
    elLogin.botonesModal = document.getElementById('botonesModal');
    elLogin.cerrarModal = document.getElementById('cerrarModal');
    mostrarTabLogin();
    elLogin.tabLogin.addEventListener('click', mostrarTabLogin);
    elLogin.tabRegistro.addEventListener('click', mostrarTabRegistro);
    elLogin.botonLoginEnviar.addEventListener('click', alClickLogin);
    elLogin.botonRegistroEnviar.addEventListener('click', alClickRegistro);
    elLogin.cerrarModal.addEventListener('click', ocultarModalLogin);
    elLogin.overlayModal.addEventListener('click', alClickFueraModalLogin);
}
function alClickFueraModalLogin(e) {
    if (e.target === elLogin.overlayModal) {
        ocultarModalLogin();
    }
}
function mostrarTabLogin() {
    elLogin.tabLogin.classList.add('activo');
    elLogin.tabRegistro.classList.remove('activo');
    elLogin.formularioLogin.classList.remove('oculto');
    elLogin.formularioLogin.style.display = 'flex';
    elLogin.formularioRegistro.classList.add('oculto');
    elLogin.formularioRegistro.style.display = 'none';
}
function mostrarTabRegistro() {
    elLogin.tabRegistro.classList.add('activo');
    elLogin.tabLogin.classList.remove('activo');
    elLogin.formularioRegistro.classList.remove('oculto');
    elLogin.formularioRegistro.style.display = 'flex';
    elLogin.formularioLogin.classList.add('oculto');
    elLogin.formularioLogin.style.display = 'none';
}
function alClickLogin() {
    var usuario = elLogin.inputLoginUsuario.value.trim();
    var contrasena = elLogin.inputLoginContrasena.value;
    var hayError = false;
    elLogin.errorLoginUsuario.textContent = '';
    elLogin.errorLoginContrasena.textContent = '';
    if (usuario.length === 0) {
        elLogin.errorLoginUsuario.textContent = 'Ingresa un usuario.';
        hayError = true;
    }
    if (contrasena.length === 0) {
        elLogin.errorLoginContrasena.textContent = 'Ingresa una contrasena.';
        hayError = true;
    }
    if (hayError) {
        return;
    }
    loginUsuario(usuario, contrasena)
        .then(alLoginExitoso)
        .catch(alLoginFallido);
}
function alLoginExitoso(data) {
    guardarSesion(data.token, data.usuario);
    mostrarModalLogin('exito', 'Bienvenido!',
        'Hola ' + data.usuario.nombreUsuario + '. Vas a ser redirigido al juego.',
        [{ texto: 'Ir al juego', accion: redirigirAJuego }]);
}
function redirigirAJuego() {
    window.location.href = 'index.html';
}
function alLoginFallido(error) {
    mostrarModalLogin('error', 'Error al iniciar sesion', error.message,
        [{ texto: 'Aceptar', accion: ocultarModalLogin }]);
}
function alClickRegistro() {
    var usuario = elLogin.inputRegistroUsuario.value.trim();
    var contrasena = elLogin.inputRegistroContrasena.value;
    var contrasena2 = elLogin.inputRegistroContrasena2.value;
    var hayError = false;
    elLogin.errorRegistroUsuario.textContent = '';
    elLogin.errorRegistroContrasena.textContent = '';
    elLogin.errorRegistroContrasena2.textContent = '';
    if (usuario.length < 3) {
        elLogin.errorRegistroUsuario.textContent = 'El usuario debe tener al menos 3 caracteres.';
        hayError = true;
    }
    if (contrasena.length < 4) {
        elLogin.errorRegistroContrasena.textContent = 'La contrasena debe tener al menos 4 caracteres.';
        hayError = true;
    }
    if (contrasena !== contrasena2) {
        elLogin.errorRegistroContrasena2.textContent = 'Las contrasenas no coinciden.';
        hayError = true;
    }
    if (hayError) {
        return;
    }
    registrarUsuario(usuario, contrasena)
        .then(alRegistroExitoso)
        .catch(alRegistroFallido);
}
function alRegistroExitoso() {
    var usuario = elLogin.inputRegistroUsuario.value.trim();
    var contrasena = elLogin.inputRegistroContrasena.value;
    return loginUsuario(usuario, contrasena)
        .then(alLoginExitoso)
        .catch(alLoginFallido);
}
function alRegistroFallido(error) {
    mostrarModalLogin('error', 'Error al registrarse', error.message,
        [{ texto: 'Aceptar', accion: ocultarModalLogin }]);
}
function mostrarModalLogin(tipo, titulo, cuerpo, botones) {
    var i;
    var boton;
    elLogin.cajaModal.className = 'cajaModal ' + tipo;
    elLogin.tituloModal.className = 'titulo ' + tipo;
    elLogin.tituloModal.textContent = titulo;
    elLogin.cuerpoModal.textContent = cuerpo;
    elLogin.botonesModal.innerHTML = '';
    if (botones && botones.length > 0) {
        for (i = 0; i < botones.length; i++) {
            boton = document.createElement('button');
            boton.textContent = botones[i].texto;
            boton.addEventListener('click', botones[i].accion);
            elLogin.botonesModal.appendChild(boton);
        }
    }
    elLogin.overlayModal.classList.add('activo');
}
function ocultarModalLogin() {
    elLogin.overlayModal.classList.remove('activo');
}
window.addEventListener('load', inicializarLogin);
