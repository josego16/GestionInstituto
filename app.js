/**
 * Configuracion de la Aplicacion
 */
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
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
                req.session.user = {
                    username: username,
                    role: results[0].role
                };
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
 * Creacion del CRUD Profesores.
 */

/*
FindAll()
 */
app.get('/profesores', (req, res) => {
    // Obtener todos los profesores de la base de datos
    db.query('SELECT * FROM profesor', (err, result) => {
        if (err) {
            res.render("error", {mensaje: err});
        } else {
            res.render('profesores', {profesores: result}); // Pasar 'result' como valor de 'profesores'
        }
    });
});

/*
Save()
 */
app.get('/profesores-add', (req, res) => {
    res.render('profesores-add');
});

app.post('/profesores-add', (req, res) => {
    //Insertar un nuevo profesor en la base de datos
    const {nombre, apellidos, email} = req.body;
    db.query('INSERT INTO profesor (nombre, apellidos, email) VALUES (?,?,?)',
        [nombre, apellidos, email], (err, result) => {
            if (err)
                res.render('error', {mensaje: err});
            else
                res.redirect('/profesores')
        });
});

/*
Update()
 */
app.get('/profesores-edit/:id', (req, res) => {

    const profesorId = req.params.id;
    //Obtener un profesor por su id
    db.query('SELECT * FROM profesor WHERE id = ?', [profesorId],
        (err, result) => {
            if (err)
                res.render("error", {mensaje: err});
            else
                res.render('profesores-edit', {profesor: result[0]});
        });
});

app.post('/profesores-edit/:id', (req, res) => {

    const profesorId = req.params.id;
    //Actualizar un profesor por su id
    const {nombre, apellidos, email} = req.body;
    db.query('UPDATE profesor SET nombre = ?, apellidos = ?, email = ? WHERE id = ?',
        [nombre, apellidos, email, profesorId],
        (err, result) => {
            if (err)
                res.render("error", {mensaje: err});
            else
                res.redirect('/profesores')
        });
});

/*
Delete()
 */
app.get('/profesores-delete/:id', (req, res) => {

    const profesorId = req.params.id;
    //Obtener y mostrar el alumno a eliminar
    db.query('SELECT * FROM profesor WHERE id = ?',
        [profesorId], (err, result) => {
            if (err)
                res.render('error', {mensaje: err});
            else
                res.render('profesores-delete', {profesor: result[0]});
        });
});

app.post('/profesores-delete/:id', (req, res) => {

    const profesorId = req.params.id;
    //Eliminar un profesor por su id
    db.query('DELETE FROM profesor WHERE id = ?',
        [profesorId], (err, result) => {
            if (err)
                res.render('error', {mensaje: err});
            else
                res.redirect('/profesores')
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

/**
 * Matricular alumnos de asignaturas
 */

//rutas
app.get('/matricular', (req, res) => {
    //Obtener lista de alumnos y asignaturas
    const queryAlumnos = 'SELECT * FROM alumno';
    const queryAsignatura = 'SELECT * FROM asignatura';

    db.query(queryAlumnos, (errAlumnos, resultAlumnos) => {
        if (errAlumnos) throw errAlumnos;

        db.query(queryAsignatura, (errAsignatura, resultAsignaturas) => {
            if (errAsignatura) throw errAsignatura;

            res.render('matriculas', {
                alumnos: resultAlumnos,
                asignaturas: resultAsignaturas,
            });
        });
    });
});
app.post('/matricular', (req, res) => {
    const {alumno, asignatura} = req.body;

    //Verificar si la matricula ya existe
    const queryExiste = 'SELECT * FROM alumno_asignatura WHERE alumno = ? AND asignatura = ?';
    db.query(queryExiste, [alumno, asignatura],
        (errExiste, resultExiste) => {
            if (errExiste) throw errExiste;

            if (resultExiste.length === 0) {
                //Matricular el alumno en la asignatura
                const queryMatricular = 'INSERT INTO alumno_asignatura (alumno, asignatura) VALUES (?,?)';
                db.query(queryMatricular, [alumno, asignatura],
                    (errMatricular) => {
                        if (errMatricular) throw errMatricular;

                        res.redirect('/matricular')
                    });
            } else {
                //La matricula ya existe.
                res.render('error', {mensaje: 'La matricula ya existe'});
            }
        });
});

app.get('/asignaturas/:alumnoId', (req, res) => {
    const alumnoId = req.params.alumnoId;

    //Obtener asignaturas matriculadas para el alumno seleccionado.
    const queryAsignaturasMatriculadas = `SELECT asignatura.nombre as asignatura, alumno.*
                                          FROM asignatura,
                                               alumno,
                                               alumno_asignatura
                                          WHERE alumno_asignatura.alumno = ?
                                            AND asignatura.id = alumno_asignatura.asignatura
                                            AND alumno.id = alumno_asignatura.alumno;`;
    db.query(queryAsignaturasMatriculadas, [alumnoId],
        (err, result) => {
            if (err)
                res.render('error', {mensaje: err});
            else {
                const asignaturas = result;
                db.query('SELECT * FROM alumno WHERE alumno.id = ?', [alumnoId],
                    (err, result,) => {
                        if (err)
                            res.render('error', {mensaje: err});
                        else
                            res.render('asignaturas-alumno', {alumno: result[0], asignaturasMatriculadas: asignaturas});
                    });
            }
        });
});

/**
 * Matricular profesores de asignaturas
 */

//rutas
app.get('/matricularPf', (req, res) => {
    //Obtener lista de alumnos y asignaturas
    const queryAlumnos = 'SELECT * FROM profesor';
    const queryAsignatura = 'SELECT * FROM asignatura';

    db.query(queryAlumnos, (errProfesores, resultProfesores) => {
        if (errProfesores) throw errProfesores;

        db.query(queryAsignatura, (errAsignaturas, resultAsignaturas) => {
            if (errAsignaturas) throw errAsignaturas;

            res.render('matriculasProfesores', {
                profesores: resultProfesores,
                asignaturas: resultAsignaturas,
            });
        });
    });
});

app.post('/matricularPf', (req, res) => {
    const {profesor, asignatura} = req.body;

    //Verificar si la matricula ya existe
    const queryExiste = 'SELECT * FROM profesor_asignatura WHERE profesor = ? AND asignatura = ?';
    db.query(queryExiste, [profesor, asignatura],
        (errExiste, resultExiste) => {
            if (errExiste) throw errExiste;

            if (resultExiste.length === 0) {
                //Matricular el profesor en la asignatura
                const queryMatricular = 'INSERT INTO profesor_asignatura (profesor, asignatura) VALUES (?,?)';
                db.query(queryMatricular, [profesor, asignatura],
                    (errMatricular) => {
                        if (errMatricular) throw errMatricular;

                        res.redirect('/matricularPf')
                    });
            } else {
                //La matricula ya existe
                res.render('error', {mensaje: 'La matricula ya existe'});
            }
        });
});

app.get('/asignaturas/:profesorId', (req, res) => {
    const profesorId = req.params.profesorId;

    //Obtener asignaturas matriculadas para el alumno seleccionado.
    const queryAsignaturasMatriculadasProfesor = `SELECT asignatura.nombre as asignatura, profesor.*
                                          FROM asignatura,
                                               profesor,
                                               profesor_asignatura
                                          WHERE profesor_asignatura.profesor = ?
                                            AND asignatura.id = profesor_asignatura.asignatura
                                            AND profesor.id = ?;`;

    db.query(queryAsignaturasMatriculadasProfesor, [profesorId, profesorId], (err, result) => {
        if (err)
            res.render('error', {mensaje: err});
        else {
            const asignaturasProfe = result;
            db.query('SELECT * FROM profesor WHERE id = ?', [profesorId], (err, result) => {
                if (err)
                    res.render('error', {mensaje: err});
                else
                    res.render('asignaturas-profesor', {profesor: result[0], asignaturasProfesores: asignaturasProfe});
            });
        }
    });
});

/**
 * Iniciamos el servidor
 */
app.listen(port, () => {
    console.log(`Servidor iniciado en http: localhost:${port}`);
});
