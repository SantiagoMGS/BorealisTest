/**
 * Interfaz para operaciones con orígenes de recepción
 */
export abstract class ReceptionOriginRepository {
  /**
   * Obtiene un origen de recepción por su ID
   */
  abstract getReceptionOriginById(id: string): Promise<any>;

  /**
   * Obtiene los análisis por defecto para un origen de recepción
   */
  abstract getDefaultAnalysisByOriginId(
    originId: string,
  ): Promise<{ id: string; name: string }[]>;
}
