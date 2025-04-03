export type User = {
  id?: string,
  name: string,
  email: string,
  hashedPassword: string,
  isActive: boolean,
  createdAt?: Date,
  updatedAt?: Date,
}