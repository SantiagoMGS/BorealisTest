export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public hashedPassword: string, 
    public isActive: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
    public isDeleted: boolean = false,
  ) {}
}