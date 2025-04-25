-- Crear función para validar la combinación de tipo de recepción y tipo de submuestra
CREATE OR REPLACE FUNCTION validate_reception_type_sub_sample_type()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM reception_type_sub_sample_types rtsst
        JOIN reception_units ru ON ru.reception_id = NEW.reception_unit_id
        JOIN receptions r ON r.id = ru.reception_id
        WHERE rtsst.reception_type_id = r.reception_type_id
        AND rtsst.sub_sample_type_id = NEW.sub_sample_type_id
    ) THEN
        RAISE EXCEPTION 'El tipo de submuestra seleccionado no es válido para este tipo de recepción';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para validar antes de insertar o actualizar
CREATE TRIGGER validate_reception_type_sub_sample_type_trigger
BEFORE INSERT OR UPDATE ON sub_samples
FOR EACH ROW
EXECUTE FUNCTION validate_reception_type_sub_sample_type(); 