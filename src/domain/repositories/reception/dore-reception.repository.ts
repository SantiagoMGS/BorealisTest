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
  ): Promise<any>;

  /**
   * Filtra recepciones de doré por rango de fechas
   * @param filter Filtros a aplicar (startDate, endDate)
   * @returns Lista de recepciones filtradas y proveedores asociados
   */
  abstract findByDateRange(filter: IDoreReceptionFilter): Promise<any>;

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
