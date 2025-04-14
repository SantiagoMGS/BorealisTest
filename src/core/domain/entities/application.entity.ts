export type Application = {
  id: string,
  name: string,
  isActive: boolean,
  path: string,
  logo?: string | null,
  description?: string,
  createdAt?: Date,
  updatedAt?: Date,
  createdBy?: string,
  updatedBy?: string,
}