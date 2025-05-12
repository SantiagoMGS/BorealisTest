import { IDoreReceptionResponse } from '@domain/interfaces';
import {
  IDoreDropdownData,
  IDoreManagementResponse,
} from '@domain/interfaces/management/dore-management.interface';
import { IPaginatedData } from '@shared/index';
import { IManagementFilter } from '@domain/interfaces/management';

/**
 * Interfaz para el repositorio de gestión de doré
 */
export abstract class DoreManagementRepository {
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

  /**
   * Obtiene recepciones de doré con filtros y paginación
   * @param filter Filtros extendidos y opciones de paginación
   * @returns Datos paginados de recepciones
   */
  abstract findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<IDoreManagementResponse>>;
}
