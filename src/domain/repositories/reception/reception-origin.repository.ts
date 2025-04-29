import { ReceptionOrigin } from '@prisma/client';

/**
 * Interfaz para operaciones con orígenes de recepción
 */
export abstract class ReceptionOriginRepository {
  /**
   * Busca un origen de recepción por su ID
   * @param id ID del origen de recepción
   * @returns El origen de recepción encontrado
   */
  abstract findById(id: string): Promise<ReceptionOrigin>;

  /**
   * Obtiene los análisis por defecto asociados a un origen de recepción
   * @param originId ID del origen de recepción
   * @returns Lista de análisis por defecto
   */
  abstract getDefaultAnalysisByOriginId(
    originId: string,
  ): Promise<Array<{ id: string; name: string; shortName: string }>>;

  /**
   * Obtiene los proveedores asociados a un origen de recepción
   * @param originId ID del origen de recepción
   * @returns Lista de proveedores con id y nombre
   */
  abstract getSuppliersByOriginId(
    originId: string,
  ): Promise<Array<{ id: string; name: string }>>;
}
