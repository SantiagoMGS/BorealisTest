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
}
