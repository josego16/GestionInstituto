/**
 * Configuracion de la Aplicacion
 * @type {e | (() => Express)}
 */
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const {response} = require("express");
const e = require("express");

//Creamos el objeto para la aplicacion.
const app = express();
const port = 8000;

/**
 * Carga y configuracion de drivers para mysql
 */

//Configuracion conexion mysql
const db = mysql.createConnection({
    host: 'localhost',
    port: 33308,
    user: 'root',
    password: 's83n38DGB8d72',
    database: 'gestion'
});

//Conexion mysql
db.connect(err => {
    if (err) {
        console.error('Error al conectarse a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

/**
 * Configuracion de la sesion
 */
app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

/**
 * Configuracion del motor de la plantilla
 */

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Configuramos el middleware para analizar el cuerpo de las solicitudes.
app.use(bodyParser.urlencoded({extended: true}));

//ruta por defecto.
app.get('/', (req, res) => {
    res.render('index', {user: req.session.user});
});

/**
 * Configuracion Middleware
 */

// Middleware para gestionar la sesión de usuario
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    if (!req.session.user && !req.path.match("/login")) {
        res.redirect("/login")
    } else
        next()
});

//ruta por defecto
app.get('/', (req, res) => {
    res.render('index');
});

// ruta para el login
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    // Verificación de credenciales en MySQL
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error al verificar las credenciales:', err);
            res.render("error", {mensaje: "Credenciales no válidas."});
        } else {
            if (results.length > 0) {
                req.session.user = username;
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        }
    });
});

// ruta para el logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.render("error", {mensaje: err});
        else res.redirect('/login');
    });
});

// ruta para el error
app.get('/error', (req, res) => {
    res.render('error');
});

/**
 * Creacion del CRUD alumnos.
 */

/*
FindAll()
 */
app.get('/alumnos', (req, res) => {
    //Obtener todos los alumnos de la base de datos
    db.query('SELECT * FROM alumno', (err, result) => {
        if (err) res.render('error', {mensaje: err});
        else
            res.render('alumnos', {alumnos: result});
    });
});

/*
Save()
 */
app.get('/alumnos-add', (req, res) => {
    res.render('alumnos-add');
});

app.post('/alumnos-add', (req, res) => {
    //Insertar un nuevo alumno en la base de datos.
    const {nombre, apellidos, email, telefono} = req.body;
    db.query('INSERT INTO alumno (nombre, apellidos, email, telefono) VALUES (?,?,?,?)',
        [nombre, apellidos, email, telefono], (err, result) => {
            if (err) res.render("error", {mensaje: err});
            else
                res.redirect('/alumnos');
        });
});

/*
Update()
 */
app.get('/alumnos-edit/:id', (req, res) => {
    const alumnoId = req.params.id;
    //Obtener un alumno por su ID;
    db.query('SELECT * FROM alumno WHERE id = ?', [alumnoId], (err, result) => {
        if (err) res.render('error', {mensaje: err});
        else
            res.render('alumnos-edit', {alumno: result[0]});
    });
});

app.post('/alumnos-edit/:id', (req, res) => {
    const alumnoId = req.params.id;
    //Actualizar un alumno por su ID
    const {nombre, apellidos, email, telefono} = req.body;
    db.query('UPDATE alumno SET nombre = ?, apellidos = ?, email = ?, telefono = ? WHERE id = ?',
        [nombre, apellidos, email, telefono, alumnoId], (err, result) => {
            if (err)
                res.render('error', {mensaje: err});
            else
                res.redirect('/alumnos');
        });
});

/*
Delete()
 */
app.get('/alumnos-delete/:id', (req, res) => {
    const alumnoId = req.params.id;
    // Obtener y mostrar el alumno a eliminar
    db.query('SELECT * FROM alumno WHERE id = ?', [alumnoId], (err, result) => {
        if (err)
            res.render("error", {mensaje: err});
        else
            res.render('alumnos-delete', {alumno: result[0]});
    });
});

app.post('/alumnos-delete/:id', (req, res) => {
    const alumnoId = req.params.id;
    // Eliminar un alumno por su ID
    db.query('DELETE FROM alumno WHERE id = ?', [alumnoId], (err, result) => {
        if (err)
            res.render("error", {mensaje: err});
        else
            res.redirect('/alumnos');
    });
});

/**
 * Creacion del CRUD Asignaturas.
 */

/*
FindAll()
 */
app.get('/asignaturas', (req, res) => {
    db.query('SELECT * FROM asignatura', (err, result) => {
        if (err)
            res.render('error', {mensaje: err});
        else
            res.render('asignaturas', {asignaturas: result});
    });
});

/*
Save()
 */
app.get('/asignaturas-add', (req, res) => {
    res.render('asignaturas-add');
});

app.post('/asignaturas-add', (req, res) => {
    // Insertar un nuevo alumno en la base de datos
    const {nombre, ciclo, curso} = req.body
    db.query('INSERT INTO asignatura (nombre,ciclo,curso) VALUES (?,?,?)', [nombre, ciclo, curso], (err, result) => {
        if (err)
            res.render('error', {mensaje: err});
        else
            res.redirect('/asignaturas');
    });
});

/*
Update()
 */
app.get('/asignaturas-edit/:id', (req, res) => {
    const asignaturaId = req.params.id;
    //Obtener una asignatura por su ID;
    db.query('SELECT * FROM asignatura WHERE id = ?', [asignaturaId], (err, result) => {
        if (err)
            res.render('error', {mensaje: err});
        else
            res.render('asignaturas-edit', {asignatura: result[0]});
    });
});

app.post('/asignaturas-edit/:id', (req, res) => {
    const asignaturaId = req.params.id;
    //Actualizar una asignatura por su ID
    const {nombre, curso, ciclo} = req.body;
    db.query('UPDATE asignatura SET nombre = ?, curso = ?, ciclo = ? WHERE id = ?',
        [nombre, curso, ciclo, asignaturaId], (err, result) => {
            if (err)
                res.render('error', {mensaje: err});
            else
                res.redirect('/asignaturas');
        });
})

/*
Delete()
 */
app.get('/asignaturas-delete/:id', (req, res) => {
    const asignaturaId = req.params.id;
    //Obtener y mostrar la asignatura a eliminar
    db.query('SELECT * FROM asignatura WHERE id = ?', [asignaturaId], (err, result) => {
        if (err)
            res.render("error", {mensaje: err});
        else
            res.render('asignaturas-delete', {asignatura: result[0]});
    });
});

app.post('/asignaturas-delete/:id', (req, res) => {
    const asignaturaId = req.params.id;
    //Eliminar una asignatura por su ID
    db.query('DELETE FROM asignatura WHERE id = ?', [asignaturaId], (err, result) => {
        if (err)
            res.render("error", {mensaje: err});
        else
            res.redirect('/asignaturas');
    });
})
app.listen(port, () => {
    console.log(`Servidor iniciado en http: localhost:${port}`);
});
