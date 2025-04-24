export interface ICompanyEntity {
  id: string;
  name: string;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
