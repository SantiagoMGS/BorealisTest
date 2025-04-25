/**
 * Puerto para acceder a la información del tenant (compañía) actual
 */
export interface ICurrentTenantPort {
  /**
   * Obtiene el ID de la compañía del contexto actual
   */
  getCompanyId(): string | undefined;

  /**
   * Obtiene el ID del usuario del contexto actual
   */
  getUserId(): string | undefined;

  /**
   * Obtiene el ID del rol del contexto actual
   */
  getRoleId(): string | undefined;
}
