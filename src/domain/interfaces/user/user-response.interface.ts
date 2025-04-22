/**
 * Interfaz para la respuesta de operaciones con usuarios
 */
export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
