'use strict';
var elContacto = {};
function inicializarContacto() {
    elContacto.inputNombre = document.getElementById('inputContactoNombre');
    elContacto.inputMail = document.getElementById('inputContactoMail');
    elContacto.inputMensaje = document.getElementById('inputContactoMensaje');
    elContacto.errorNombre = document.getElementById('errorContactoNombre');
    elContacto.errorMail = document.getElementById('errorContactoMail');
    elContacto.errorMensaje = document.getElementById('errorContactoMensaje');
    elContacto.botonEnviar = document.getElementById('botonEnviarContacto');
    elContacto.overlayModal = document.getElementById('overlayModal');
    elContacto.cajaModal = document.getElementById('cajaModal');
    elContacto.tituloModal = document.getElementById('tituloModal');
    elContacto.cuerpoModal = document.getElementById('cuerpoModal');
    elContacto.botonesModal = document.getElementById('botonesModal');
    elContacto.cerrarModal = document.getElementById('cerrarModal');
    elContacto.inputNombre.addEventListener('blur', validarNombreContacto);
    elContacto.inputMail.addEventListener('blur', validarMailContacto);
    elContacto.inputMensaje.addEventListener('blur', validarMensajeContacto);
    elContacto.inputNombre.addEventListener('focus', limpiarErrorNombre);
    elContacto.inputMail.addEventListener('focus', limpiarErrorMail);
    elContacto.inputMensaje.addEventListener('focus', limpiarErrorMensaje);
    elContacto.botonEnviar.addEventListener('click', alClickEnviar);
    elContacto.cerrarModal.addEventListener('click', ocultarModalContacto);
    elContacto.overlayModal.addEventListener('click', alClickFueraModalContacto);
}
function alClickFueraModalContacto(e) {
    if (e.target === elContacto.overlayModal) {
        ocultarModalContacto();
    }
}
function validarNombreContacto() {
    var valor = elContacto.inputNombre.value.trim();
    var regex = /^[a-zA-Z0-9\u00E0-\u00FF ]+$/;
    if (valor.length === 0 || !regex.test(valor)) {
        elContacto.errorNombre.textContent = 'El nombre debe ser alfanumerico y no vacio.';
        elContacto.inputNombre.classList.add('invalido');
        elContacto.inputNombre.classList.remove('valido');
        return false;
    }
    elContacto.errorNombre.textContent = '';
    elContacto.inputNombre.classList.add('valido');
    elContacto.inputNombre.classList.remove('invalido');
    return true;
}
function validarMailContacto() {
    var valor = elContacto.inputMail.value.trim();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(valor)) {
        elContacto.errorMail.textContent = 'Ingresa un mail valido.';
        elContacto.inputMail.classList.add('invalido');
        elContacto.inputMail.classList.remove('valido');
        return false;
    }
    elContacto.errorMail.textContent = '';
    elContacto.inputMail.classList.add('valido');
    elContacto.inputMail.classList.remove('invalido');
    return true;
}
function validarMensajeContacto() {
    var valor = elContacto.inputMensaje.value.trim();
    if (valor.length <= 5) {
        elContacto.errorMensaje.textContent = 'El mensaje debe tener mas de 5 caracteres.';
        elContacto.inputMensaje.classList.add('invalido');
        elContacto.inputMensaje.classList.remove('valido');
        return false;
    }
    elContacto.errorMensaje.textContent = '';
    elContacto.inputMensaje.classList.add('valido');
    elContacto.inputMensaje.classList.remove('invalido');
    return true;
}
function limpiarErrorNombre() {
    elContacto.errorNombre.textContent = '';
    elContacto.inputNombre.classList.remove('invalido');
    elContacto.inputNombre.classList.remove('valido');
}
function limpiarErrorMail() {
    elContacto.errorMail.textContent = '';
    elContacto.inputMail.classList.remove('invalido');
    elContacto.inputMail.classList.remove('valido');
}
function limpiarErrorMensaje() {
    elContacto.errorMensaje.textContent = '';
    elContacto.inputMensaje.classList.remove('invalido');
    elContacto.inputMensaje.classList.remove('valido');
}
function alClickEnviar() {
    var nombreOk = validarNombreContacto();
    var mailOk = validarMailContacto();
    var mensajeOk = validarMensajeContacto();
    if (nombreOk && mailOk && mensajeOk) {
        mostrarModalContacto('exito', 'Formulario valido',
            'Todos los campos estan correctos.',
            [{ texto: 'Aceptar', accion: ocultarModalContacto }]);
    } else {
        mostrarModalContacto('error', 'Error de validacion',
            'Revisa los campos marcados en rojo antes de enviar.',
            [{ texto: 'Aceptar', accion: ocultarModalContacto }]);
    }
}
function mostrarModalContacto(tipo, titulo, cuerpo, botones) {
    var i;
    var boton;
    elContacto.cajaModal.className = 'cajaModal ' + tipo;
    elContacto.tituloModal.className = 'titulo ' + tipo;
    elContacto.tituloModal.textContent = titulo;
    elContacto.cuerpoModal.textContent = cuerpo;
    elContacto.botonesModal.innerHTML = '';
    if (botones && botones.length > 0) {
        for (i = 0; i < botones.length; i++) {
            boton = document.createElement('button');
            boton.textContent = botones[i].texto;
            boton.addEventListener('click', botones[i].accion);
            elContacto.botonesModal.appendChild(boton);
        }
    }
    elContacto.overlayModal.classList.add('activo');
}
function ocultarModalContacto() {
    elContacto.overlayModal.classList.remove('activo');
}
window.addEventListener('load', inicializarContacto);
