import { Injectable } from '@nestjs/common';

/**
 * Servicio para generar el shortName del proveedor según las reglas de negocio
 * - 2 primeras letras del nombre del proveedor
 * - 4 últimos dígitos del número de documento
 */
@Injectable()
export class ShortNameGeneratorService {
  /**
   * Genera un shortName para un proveedor basado en su nombre y número de documento
   * @param name Nombre del proveedor
   * @param documentNumber Número de documento del proveedor
   * @returns ShortName de 6 caracteres
   */
  generate(name: string, documentNumber: string): string {
    // Extraer las 2 primeras letras del nombre (convertidas a mayúsculas)
    // Si el nombre tiene menos de 2 letras, completar con 'X'
    const cleanName = name.replace(/[^a-zA-Z]/g, '');
    const namePrefix = cleanName.substring(0, 2).padEnd(2, 'X').toUpperCase();

    // Extraer los 4 últimos caracteres del documento
    // Si el documento tiene menos de 4 caracteres, completar con '0' al inicio
    const documentSuffix = documentNumber.slice(-4).padStart(4, '0');

    return namePrefix + documentSuffix;
  }
}
