'use strict';
var elementos = {};
function inicializarReferenciasJuego() {
    elementos.panelInicio = document.getElementById('panelInicio');
    elementos.panelJuego = document.getElementById('panelJuego');
    elementos.botonComenzar = document.getElementById('botonComenzar');
    elementos.contadorIntentos = document.getElementById('contadorIntentos');
    elementos.contadorTiempo = document.getElementById('contadorTiempo');
    elementos.botonReiniciar = document.getElementById('botonReiniciar');
    elementos.inputBusqueda = document.getElementById('inputBusqueda');
    elementos.botonRandom = document.getElementById('botonRandom');
    elementos.botonEnviarIntento = document.getElementById('botonEnviarIntento');
    elementos.listaAutocompletado = document.getElementById('listaAutocompletado');
    elementos.encabezadoTablero = document.getElementById('encabezadoTablero');
    elementos.tablero = document.getElementById('tablero');
    elementos.zonaPistas = document.getElementById('zonaPistas');
    elementos.listaPistas = document.getElementById('listaPistas');
    elementos.zonaFotoSecreta = document.getElementById('zonaFotoSecreta');
    elementos.imgJugadorSecreto = document.getElementById('imgJugadorSecreto');
    elementos.overlayModal = document.getElementById('overlayModal');
    elementos.cajaModal = document.getElementById('cajaModal');
    elementos.tituloModal = document.getElementById('tituloModal');
    elementos.cuerpoModal = document.getElementById('cuerpoModal');
    elementos.datosModal = document.getElementById('datosModal');
    elementos.botonesModal = document.getElementById('botonesModal');
    elementos.cerrarModal = document.getElementById('cerrarModal');
}
function mostrarModal(tipo, titulo, cuerpo, datosHTML, botones) {
    var i;
    var boton;
    elementos.cajaModal.className = 'cajaModal ' + tipo;
    elementos.tituloModal.className = 'titulo ' + tipo;
    elementos.tituloModal.textContent = titulo;
    elementos.cuerpoModal.textContent = cuerpo;
    if (datosHTML) {
        elementos.datosModal.innerHTML = datosHTML;
        elementos.datosModal.classList.remove('oculto');
    } else {
        elementos.datosModal.classList.add('oculto');
    }
    elementos.botonesModal.innerHTML = '';
    if (botones && botones.length > 0) {
        for (i = 0; i < botones.length; i++) {
            boton = document.createElement('button');
            boton.textContent = botones[i].texto;
            boton.addEventListener('click', botones[i].accion);
            elementos.botonesModal.appendChild(boton);
        }
    }
    elementos.overlayModal.classList.add('activo');
}
function ocultarModal() {
    elementos.overlayModal.classList.remove('activo');
}
function crearEncabezadoTablero() {
    var columnas = ['Foto', 'Nombre', 'Nacionalidad', 'Club', 'Posicion', 'Edad', 'Overall', 'Altura'];
    var i;
    var celda;
    elementos.encabezadoTablero.innerHTML = '';
    for (i = 0; i < columnas.length; i++) {
        celda = document.createElement('div');
        celda.className = i === 0 ? 'celda foto' : 'celda';
        celda.textContent = columnas[i];
        elementos.encabezadoTablero.appendChild(celda);
    }
}
function renderizarFilaIntento(intento, comparacion) {
    var fila = document.createElement('div');
    var celdaFoto = document.createElement('div');
    var imgFoto = document.createElement('img');
    var atributos = [
        { valor: intento.name, estado: comparacion.nombre },
        { valor: intento.nationality, estado: comparacion.nacionalidad },
        { valor: intento.club, estado: comparacion.club },
        { valor: intento.position, estado: comparacion.posicion },
        { valor: intento.age, estado: comparacion.edad },
        { valor: intento.overall, estado: comparacion.overall },
        { valor: intento.heightCm + ' cm', estado: comparacion.altura }
    ];
    var i;
    var celda;
    fila.className = 'filaIntento';
    celdaFoto.className = 'celda foto';
    imgFoto.src = obtenerUrlFotoProxy(intento.photo);
    imgFoto.alt = intento.name;
   // imgFoto.onerror = function() { this.src = 'https://via.placeholder.com/60/cccccc/ffffff?text=?'; };
    celdaFoto.appendChild(imgFoto);
    fila.appendChild(celdaFoto);
    for (i = 0; i < atributos.length; i++) {
        celda = document.createElement('div');
        celda.className = 'celda ' + atributos[i].estado;
        celda.textContent = atributos[i].valor;
        fila.appendChild(celda);
    }
    elementos.tablero.appendChild(fila);
}
function limpiarTablero() {
    elementos.tablero.innerHTML = '';
}
function limpiarAutocompletado() {
    elementos.listaAutocompletado.innerHTML = '';
    elementos.listaAutocompletado.classList.add('oculto');
}
function renderizarAutocompletado(jugadores, callback) {
    var i;
    var item;
    var imgFlag;
    var textoInfo;
    elementos.listaAutocompletado.innerHTML = '';
    if (jugadores.length === 0) {
        elementos.listaAutocompletado.classList.add('oculto');
        return;
    }
    for (i = 0; i < jugadores.length; i++) {
        (function(jugador) {
            item = document.createElement('div');
            imgFlag = document.createElement('img');
            textoInfo = document.createElement('span');
            item.className = 'item';
            imgFlag.src = obtenerUrlFotoProxy(jugador.flag);
            imgFlag.alt = jugador.nationality;
            textoInfo.textContent = jugador.name + ' - ' + jugador.club;
            item.appendChild(imgFlag);
            item.appendChild(textoInfo);
            item.addEventListener('click', function() {
                callback(jugador);
            });
            elementos.listaAutocompletado.appendChild(item);
        })(jugadores[i]);
    }
    elementos.listaAutocompletado.classList.remove('oculto');
}
function actualizarContadorIntentos(intentosRestantes) {
    elementos.contadorIntentos.textContent = intentosRestantes;
}
function actualizarTemporizador(segundos) {
    var minutos = Math.floor(segundos / 60);
    var segRestantes = segundos % 60;
    var textoMin = minutos < 10 ? '0' + minutos : minutos;
    var textoSeg = segRestantes < 10 ? '0' + segRestantes : segRestantes;
    elementos.contadorTiempo.textContent = textoMin + ':' + textoSeg;
}
function inicializarFotoSecreta(urlFoto) {
    elementos.imgJugadorSecreto.src = urlFoto;
    // elementos.imgJugadorSecreto.onerror = function() { this.src = 'https://via.placeholder.com/130/cccccc/ffffff?text=?'; };
    elementos.imgJugadorSecreto.style.filter = 'blur(20px)';
    elementos.zonaFotoSecreta.classList.remove('oculto');
}
function actualizarBlurFoto(intentosFallidos) {
    var blurPx = Math.max(20 - intentosFallidos * 2.5, 0);
    elementos.imgJugadorSecreto.style.filter = 'blur(' + blurPx + 'px)';
}
function revelarFotoCompleta() {
    elementos.imgJugadorSecreto.style.filter = 'blur(0px)';
}
function renderizarPistasReveladas() {
    var i;
    var pistaDiv;
    var mapaPistas;
    elementos.listaPistas.innerHTML = '';
    if (estado.pistasReveladas.length === 0) {
        elementos.zonaPistas.classList.add('oculto');
        return;
    }
    elementos.zonaPistas.classList.remove('oculto');
    mapaPistas = obtenerMapaPistas();
    for (i = 0; i < estado.pistasReveladas.length; i++) {
        pistaDiv = document.createElement('div');
        pistaDiv.className = 'pista';
        pistaDiv.innerHTML = '<strong>' + mapaPistas[estado.pistasReveladas[i]].etiqueta + ':</strong> ' + mapaPistas[estado.pistasReveladas[i]].valor;
        elementos.listaPistas.appendChild(pistaDiv);
    }
}
function obtenerMapaPistas() {
    var secreto = estado.jugadorSecreto;
    return {
        club: { etiqueta: 'Club', valor: secreto.club },
        posicion: { etiqueta: 'Posicion', valor: secreto.position },
        nacionalidad: { etiqueta: 'Nacionalidad', valor: secreto.nationality },
        overall: { etiqueta: 'Overall', valor: secreto.overall }
    };
}
function generarTarjetaJugadorRevelado(jugador) {
    return '<div class="tarjetaJugadorRevelado">' +
        '<img src="' + obtenerUrlFotoProxy(jugador.photo) + '" alt="' + jugador.name + '">' +
        '<div class="info">' +
        '<strong>' + jugador.name + '</strong>' +
        '<span>' + jugador.nationality + ' - ' + jugador.club + '</span>' +
        '<span>Posicion: ' + jugador.position + '</span>' +
        '<span>Edad: ' + jugador.age + ' - Overall: ' + jugador.overall + ' - Altura: ' + jugador.heightCm + ' cm</span>' +
        '</div>' +
        '</div>';
}
