import { IDoreReceptionEntity } from '@domain/entities/reception';

/**
 * Repositorio para la gestión de recepciones de doré
 */
export abstract class DoreReceptionRepository {
  /**
   * Crea una nueva recepción de doré con sus ítems
   * @param doreReception Datos de la recepción
   * @returns La recepción creada con sus ítems
   */
  abstract createDoreReception(
    doreReception: IDoreReceptionEntity,
  ): Promise<any>;

  /**
   * Obtiene una recepción de doré por ID
   * @param id ID de la recepción
   * @param companyId ID de la compañía
   * @returns La recepción encontrada o null
   */
  abstract getDoreReceptionById(id: string, companyId: string): Promise<any>;

  /**
   * Obtiene todas las recepciones de doré
   * @param companyId ID de la compañía
   * @param supplierId ID del proveedor (opcional)
   * @returns Lista de recepciones
   */
  abstract getDoreReceptions(
    companyId: string,
    supplierId?: string,
  ): Promise<any[]>;
}
