CREATE DATABASE IF NOT EXISTS `gestion`;

USE `gestion`;

DROP TABLE IF EXISTS alumno_asignatura;
DROP TABLE IF EXISTS profesor_asignatura;
DROP TABLE IF EXISTS alumno;
DROP TABLE IF EXISTS profesor;
DROP TABLE IF EXISTS asignatura;

CREATE TABLE IF NOT EXISTS users
(
    `ÌD`       INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `USERNAME` VARCHAR(50)  NOT NULL,
    `PASSWORD` VARCHAR(255) NOT NULL
);

INSERT INTO users (`USERNAME`, `PASSWORD`)
VALUES ('ADMIN', 'ADMIN');

CREATE TABLE profesor
(
    `ID`        INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `NOMBRE`    VARCHAR(50) NOT NULL,
    `APELLIDOS` VARCHAR(50) NOT NULL,
    `EMAIL`     VARCHAR(50) NOT NULL
);

CREATE TABLE alumno
(
    `ID`        INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `NOMBRE`    VARCHAR(50) NOT NULL,
    `APELLIDOS` VARCHAR(50) NOT NULL,
    `EMAIL`     VARCHAR(50) NOT NULL,
    `TELEFONO`  VARCHAR(50) NOT NULL
);

CREATE TABLE asignatura
(
    `ID`     INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `NOMBRE` VARCHAR(50) NOT NULL,
    `CURSO`  SMALLINT    NOT NULL,
    `CICLO`  VARCHAR(50) NOT NULL
);

CREATE TABLE alumno_asignatura
(
    `ALUMNO`     INT NOT NULL,
    `ASIGNATURA` INT NOT NULL,
    PRIMARY KEY (`ALUMNO`, `ASIGNATURA`),
    FOREIGN KEY (`ALUMNO`) REFERENCES alumno (`ID`),
    FOREIGN KEY (`ASIGNATURA`) REFERENCES asignatura (`ID`)
);

CREATE TABLE profesor_asignatura
(
    `PROFESOR`   INT NOT NULL,
    `ASIGNATURA` INT NOT NULL,
    PRIMARY KEY (`PROFESOR`, `ASIGNATURA`),
    FOREIGN KEY (`PROFESOR`) REFERENCES profesor (`ID`),
    FOREIGN KEY (`ASIGNATURA`) REFERENCES asignatura (`ID`)
);