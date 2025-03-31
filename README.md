# Gestión Instituto

Este proyecto es una aplicación web para la gestión de un instituto. Permite gestionar alumnos, profesores y asignaturas, así como matricular alumnos y profesores en asignaturas.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- Pug (motor de plantillas)
- Body-parser (middleware para analizar el cuerpo de las solicitudes)
- Express-session (middleware para gestionar sesiones)
- Docker (para la base de datos MySQL y Adminer)

## Rutas parametrizadas

La aplicación utiliza rutas parametrizadas para las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de alumnos, profesores y asignaturas. Algunas de las rutas parametrizadas son:

- `GET /alumnos-edit/:id` - Obtener un alumno por su ID para editarlo.
- `POST /alumnos-edit/:id` - Actualizar un alumno por su ID.
- `GET /alumnos-delete/:id` - Obtener un alumno por su ID para eliminarlo.
- `POST /alumnos-delete/:id` - Eliminar un alumno por su ID.
- `GET /profesores-edit/:id` - Obtener un profesor por su ID para editarlo.
- `POST /profesores-edit/:id` - Actualizar un profesor por su ID.
- `GET /profesores-delete/:id` - Obtener un profesor por su ID para eliminarlo.
- `POST /profesores-delete/:id` - Eliminar un profesor por su ID.
- `GET /asignaturas-edit/:id` - Obtener una asignatura por su ID para editarla.
- `POST /asignaturas-edit/:id` - Actualizar una asignatura por su ID.
- `GET /asignaturas-delete/:id` - Obtener una asignatura por su ID para eliminarla.
- `POST /asignaturas-delete/:id` - Eliminar una asignatura por su ID.

## Ejemplo de peticiones HTTP en Postman

A continuación se muestra un ejemplo de cómo realizar una petición HTTP en Postman para agregar un nuevo alumno:

1. Abrir Postman y crear una nueva solicitud.
2. Seleccionar el método `POST`.
3. Ingresar la URL `http://localhost:8000/alumnos-add`.
4. Ir a la pestaña `Body` y seleccionar `x-www-form-urlencoded`.
5. Agregar los siguientes campos y valores:
   - `nombre`: Juan
   - `apellidos`: Pérez
   - `email`: juan.perez@example.com
   - `telefono`: 123456789
6. Hacer clic en el botón `Send` para enviar la solicitud.

Si la solicitud es exitosa, el nuevo alumno será agregado a la base de datos y se redirigirá a la lista de alumnos.

