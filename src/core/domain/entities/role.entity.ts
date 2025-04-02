export class Role {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly isSystem: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly createdBy?: string,
    public readonly updatedBy?: string,
    public readonly isDeleted: boolean = false,
  ) {}
}