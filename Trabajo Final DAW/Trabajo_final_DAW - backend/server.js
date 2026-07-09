'use strict';

var express = require('express');
var cors = require('cors');
var sql = require('mssql/msnodesqlv8');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var PUERTO = 3001;
var CLAVE_SECRETA = 'futbolle_clave_secreta_2026';

app.use(cors());
app.use(express.json());

// Conexión a la base de datos SQL Server
var configDB = {
    connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-A7735VT\\SQLEXPRESS;Database=FutbolleDB;Trusted_Connection=yes;"
};

// Pool de conexiones
var pool;
async function conectarDB() {
    try {
        pool = await sql.connect(configDB);
        console.log('Conectado a SQL Server correctamente');
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error.message);
    }
}
conectarDB();

// Middleware para verificar token
function verificarToken(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token no provisto' });
    }
    token = token.replace('Bearer ', '');
    jwt.verify(token, CLAVE_SECRETA, function(err, decoded) {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.usuarioId = decoded.id;
        req.nombreUsuario = decoded.nombreUsuario;
        next();
    });
}

// ============================================
// ENDPOINTS
// ============================================

// POST /api/registro
app.post('/api/registro', async function(req, res) {
    var nombreUsuario = req.body.nombreUsuario;
    var contrasena = req.body.contrasena;
    if (!nombreUsuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    if (nombreUsuario.length < 3) {
        return res.status(400).json({ error: 'El usuario debe tener al menos 3 caracteres' });
    }
    if (contrasena.length < 4) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
    }
    try {
        var existe = await pool.request()
            .input('nombreUsuario', sql.NVarChar, nombreUsuario)
            .query('SELECT id FROM Usuarios WHERE nombreUsuario = @nombreUsuario');
        if (existe.recordset.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        var hash = bcrypt.hashSync(contrasena, 10);
        await pool.request()
            .input('nombreUsuario', sql.NVarChar, nombreUsuario)
            .input('contrasenaHash', sql.NVarChar, hash)
            .query('INSERT INTO Usuarios (nombreUsuario, contrasenaHash) VALUES (@nombreUsuario, @contrasenaHash)');
        res.json({ ok: true, mensaje: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('Error en registro:', error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// POST /api/login
app.post('/api/login', async function(req, res) {
    var nombreUsuario = req.body.nombreUsuario;
    var contrasena = req.body.contrasena;
    if (!nombreUsuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    try {
        var resultado = await pool.request()
            .input('nombreUsuario', sql.NVarChar, nombreUsuario)
            .query('SELECT id, nombreUsuario, contrasenaHash FROM Usuarios WHERE nombreUsuario = @nombreUsuario');
        if (resultado.recordset.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        var usuario = resultado.recordset[0];
        var esValida = bcrypt.compareSync(contrasena, usuario.contrasenaHash);
        if (!esValida) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        var token = jwt.sign({
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario
        }, CLAVE_SECRETA, { expiresIn: '7d' });
        res.json({
            ok: true,
            token: token,
            usuario: {
                id: usuario.id,
                nombreUsuario: usuario.nombreUsuario
            }
        });
    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// POST /api/partidas - guardar una partida
app.post('/api/partidas', verificarToken, async function(req, res) {
    var jugadorSecreto = req.body.jugadorSecreto;
    var resultado = req.body.resultado;
    var intentos = req.body.intentos;
    var duracionSegundos = req.body.duracionSegundos;
    var dificultad = req.body.dificultad || 'facil';
    var puntaje = calcularPuntaje(resultado, intentos, duracionSegundos, dificultad);
    try {
        await pool.request()
            .input('usuarioId', sql.Int, req.usuarioId)
            .input('jugadorSecreto', sql.NVarChar, jugadorSecreto)
            .input('resultado', sql.NVarChar, resultado)
            .input('intentos', sql.Int, intentos)
            .input('duracionSegundos', sql.Int, duracionSegundos)
            .input('puntaje', sql.Int, puntaje)
            .query('INSERT INTO Partidas (usuarioId, jugadorSecreto, resultado, intentos, duracionSegundos, puntaje) VALUES (@usuarioId, @jugadorSecreto, @resultado, @intentos, @duracionSegundos, @puntaje)');
        res.json({ ok: true, puntaje: puntaje });
    } catch (error) {
        console.error('Error al guardar partida:', error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

function calcularPuntaje(resultado, intentos, duracionSegundos, dificultad) {
    if (resultado !== 'gano') {
        return 0;
    }
    var puntosBase;
    if (dificultad === 'dificil') {
        puntosBase = 100;
    } else if (dificultad === 'medio') {
        puntosBase = 80;
    } else {
        puntosBase = 60;
    }
    var descuento = (intentos - 1) * 10;
    var bonusTiempo;
    if (duracionSegundos < 60) {
        bonusTiempo = 20;
    } else if (duracionSegundos < 120) {
        bonusTiempo = 10;
    } else {
        bonusTiempo = 0;
    }
    var puntaje = puntosBase - descuento + bonusTiempo;
    if (puntaje < 10) {
        return 10;
    }
    return puntaje;
}

// GET /api/historial - Ultimas 25 
app.get('/api/historial', verificarToken, async function(req, res) {
    try {
        var resultado = await pool.request()
            .input('usuarioId', sql.Int, req.usuarioId)
            .query('SELECT TOP 25 id, jugadorSecreto, resultado, intentos, duracionSegundos, puntaje, fecha FROM Partidas WHERE usuarioId = @usuarioId ORDER BY fecha DESC');
        res.json({ ok: true, partidas: resultado.recordset });
    } catch (error) {
        console.error('Error al obtener historial:', error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// GET /api/ranking - ranking global - no hace falta token
app.get('/api/ranking', async function(req, res) {
    try {
        var resultado = await pool.request().query(
            'SELECT TOP 15 u.nombreUsuario, ' +
            'SUM(p.puntaje) AS puntajeTotal, ' +
            'COUNT(p.id) AS partidasJugadas, ' +
            'SUM(CASE WHEN p.resultado = \'gano\' THEN 1 ELSE 0 END) AS partidasGanadas ' +
            'FROM Usuarios u ' +
            'LEFT JOIN Partidas p ON p.usuarioId = u.id ' +
            'GROUP BY u.nombreUsuario ' +
            'ORDER BY puntajeTotal DESC'
        );
        res.json({ ok: true, ranking: resultado.recordset });
    } catch (error) {
        console.error('Error al obtener ranking:', error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.listen(PUERTO, function() {
    console.log('Backend Futbolle corriendo en http://localhost:' + PUERTO);
});
