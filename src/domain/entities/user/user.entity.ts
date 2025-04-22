/**
 * Representa la entidad de usuario para el dominio
 */
export interface IUserEntity {
  id?: string;
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
