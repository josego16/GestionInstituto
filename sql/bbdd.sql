CREATE DATABASE IF NOT EXISTS `gestion`;

USE `gestion`;

DROP TABLE IF EXISTS alumno_asignatura;
DROP TABLE IF EXISTS profesor_asignatura;
DROP TABLE IF EXISTS alumno;
DROP TABLE IF EXISTS profesor;
DROP TABLE IF EXISTS asignatura;

CREATE TABLE IF NOT EXISTS users
(
    `id`          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username`    VARCHAR(50)  NOT NULL,
    `password`    VARCHAR(255) NOT NULL

);

INSERT INTO users (`username`, `password`)
VALUES ('admin', 'admin');

CREATE TABLE profesor
(
    `id`        INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre`    VARCHAR(50) NOT NULL,
    `apellidos` VARCHAR(50) NOT NULL,
    `email`     VARCHAR(50) NOT NULL
);

CREATE TABLE alumno
(
    `id`        INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre`    VARCHAR(50) NOT NULL,
    `apellidos` VARCHAR(50) NOT NULL,
    `email`     VARCHAR(50) NOT NULL,
    `telefono`  VARCHAR(50) NOT NULL
);

CREATE TABLE asignatura
(
    `id`     INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL,
    `curso`  SMALLINT    NOT NULL,
    `ciclo`  VARCHAR(50) NOT NULL
);

CREATE TABLE alumno_asignatura
(
    `alumno`     INT NOT NULL,
    `asignatura` INT NOT NULL,
    PRIMARY KEY (`alumno`, `asignatura`),
    FOREIGN KEY (`alumno`) REFERENCES alumno (`id`),
    FOREIGN KEY (`asignatura`) REFERENCES asignatura (`id`)
);

CREATE TABLE profesor_asignatura
(
    `profesor`   INT NOT NULL,
    `asignatura` INT NOT NULL,
    PRIMARY KEY (`profesor`, `asignatura`),
    FOREIGN KEY (`profesor`) REFERENCES profesor (`id`),
    FOREIGN KEY (`asignatura`) REFERENCES asignatura (`id`)
);