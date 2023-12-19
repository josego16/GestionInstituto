<!-- Configuracion de la Aplicacion -->

const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

<!-- Carga y configuracion de drivers para mysql -->

<!-- Configuracion de mysql -->
const db = mysql.createConnection({
    host: 'localhost',
    port: 33308,
    user: 'root',
    password: 's83n38DGB8d72',
    database: 'gestion'
});

<!-- Conexion a mysql -->
db.connect(err => {
    if (err) {
        console.error('Error al conectarse a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

<!-- Configuracion de la sesion -->
app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

<!-- Configurando el motor de plantillas -->
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
        extended: true
    })
);