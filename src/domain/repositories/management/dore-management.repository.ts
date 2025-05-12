import { IDoreDropdownData } from '@domain/interfaces/management/dore-management.interface';

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
}
