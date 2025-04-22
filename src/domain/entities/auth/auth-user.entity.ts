/**
 * Representa la información del usuario autenticado disponible en los controladores
 * a través del decorador @CurrentUser()
 */
export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
