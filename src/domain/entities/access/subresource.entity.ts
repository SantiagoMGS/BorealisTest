/**
 * Representa un subrecurso del sistema relacionado con un controlador específico
 */
export interface ISubresourceEntity {
  id?: string;
  name: string;
  controller: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
