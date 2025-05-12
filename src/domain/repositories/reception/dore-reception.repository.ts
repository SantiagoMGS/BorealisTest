import { IDoreReceptionEntity } from '@domain/entities/reception';
import { IDoreDropdownData } from '@domain/interfaces/management/dore-management.interface';
import { IDoreReceptionResponse } from '@domain/interfaces/reception';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

/**
 * Interfaz para los filtros de búsqueda de recepciones de doré
 */
export interface IDoreReceptionFilter extends IPaginationOptions {
  startDate: Date;
  endDate: Date;
  supplierIds?: string[];
  receptionOriginIds?: string[];
  doreIds?: string[];
  batchNumbers?: string[];
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
  ): Promise<IDoreReceptionResponse>;

  /**
   * Obtiene recepciones de doré con filtros y paginación
   * @param filter Filtros extendidos y opciones de paginación
   * @returns Datos paginados de recepciones
   */
  abstract findByFilters(
    filter: IDoreReceptionFilter,
  ): Promise<IPaginatedData<IDoreReceptionResponse>>;

  /**
   * Obtiene el último número de lote para un proveedor específico en el año actual
   * @param supplierId ID del proveedor
   * @param prefix Prefijo del lote (formato: [shortName]-D-[año])
   * @returns Último número de lote encontrado o null si no existe
   */
  abstract findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null>;
}
