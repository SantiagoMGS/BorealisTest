export interface ISubresourceEntity {
  id?: string;
  name: string;
  controller: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
