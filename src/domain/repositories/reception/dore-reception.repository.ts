import { IDoreReceptionEntity } from '@domain/entities/reception';

/**
 * Interfaz para los filtros de búsqueda de recepciones de doré
 */
export interface IDoreReceptionFilter {
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
  code?: string;
}

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
   * Filtra recepciones de doré por rango de fechas
   * @param filter Filtros a aplicar (startDate, endDate)
   * @returns Lista de recepciones filtradas y proveedores asociados
   */
  abstract findByDateRange(filter: IDoreReceptionFilter): Promise<any>;
}
