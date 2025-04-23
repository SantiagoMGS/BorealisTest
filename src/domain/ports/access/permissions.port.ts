/**
 * Puerto para el servicio de permisos
 */
export interface IPermissionsPort {
  /**
   * Verifica si un rol tiene permiso para una acción específica en un controlador
   * Considera los permisos escalonados (si tiene permiso para un nivel superior,
   * tiene permisos para todos los niveles inferiores)
   *
   * @param roleId ID del rol
   * @param companyId ID de la compañía
   * @param controller Nombre del controlador
   * @param action Nombre de la acción (método HTTP)
   * @returns Promise<boolean> Si tiene permiso o no
   */
  hasPermission(
    roleId: string,
    companyId: string,
    controller: string,
    action: string,
  ): Promise<boolean>;

  /**
   * Fuerza una recarga del caché de subrecursos
   */
  reloadSubresourcesCache(): Promise<void>;
}
