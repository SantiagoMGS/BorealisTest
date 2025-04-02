export class RolePermission {
  constructor(
    public readonly roleId: string,
    public readonly actionId: string,
    public readonly subresourceId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly createdBy?: string,
    public readonly updatedBy?: string,
  ) {}
}