-- Crear función para validar la combinación de tipo y origen
CREATE OR REPLACE FUNCTION validate_reception_type_origin()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM reception_type_origins
        WHERE reception_type_id = NEW.reception_type_id
        AND reception_origin_id = NEW.reception_origin_id
    ) THEN
        RAISE EXCEPTION 'El origen de recepción seleccionado no es válido para este tipo de recepción';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para validar antes de insertar o actualizar
CREATE TRIGGER validate_reception_type_origin_trigger
BEFORE INSERT OR UPDATE ON receptions
FOR EACH ROW
EXECUTE FUNCTION validate_reception_type_origin(); 