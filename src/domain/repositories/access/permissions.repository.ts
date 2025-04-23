import { ISubresourceEntity } from '@domain/entities/access';

/**
 * Repositorio para la gestión de permisos
 */
export abstract class PermissionsRepository {
  /**
   * Obtiene todos los subrecursos activos
   */
  abstract getAllSubresources(): Promise<ISubresourceEntity[]>;

  /**
   * Verifica si un rol tiene una acción específica para un subrecurso
   * @param roleId ID del rol
   * @param subresourceId ID del subrecurso
   * @param actionLevel Nivel mínimo de acción requerido
   * @returns Promise<boolean> Si tiene la acción o no
   */
  abstract hasRoleActionForSubresource(
    roleId: string,
    subresourceId: string,
    actionLevel: number,
  ): Promise<boolean>;
}
