import { IDoreReceptionEntity } from '@domain/entities/reception';
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
 * Interfaz para la respuesta de datos de dropdown
 */
export interface IDoreDropdownData {
  suppliers: Array<{ id: string; name: string }>;
  dore: Array<{ id: string; code: number }>;
  batchNumbers: string[];
  receptionOrigins: Array<{ id: string; name: string }>;
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

  /**
   * Obtiene datos para llenar los dropdowns del frontend
   * @param startDate Fecha inicial para filtrar
   * @param endDate Fecha final para filtrar
   * @returns Datos para los dropdowns (proveedores, dorés, números de lote, orígenes)
   */
  abstract getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDoreDropdownData>;
}
