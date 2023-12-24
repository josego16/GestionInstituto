DELIMITER //
CREATE TRIGGER before_insert_profesor_asignatura
    BEFORE INSERT
    ON profesor_asignatura
    FOR EACH ROW
BEGIN
    DECLARE profesor_count INT;
    SET profesor_count = (SELECT COUNT(*) FROM profesor_asignatura WHERE asignatura = NEW.asignatura);

    IF profesor_count > 2 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede asignar mas de 2 profesores a una asignatura';
    END IF;
END;
//

DELIMITER ;