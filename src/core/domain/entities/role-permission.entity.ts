export class RolePermission {
  constructor(
    public readonly roleId: string,
    public readonly actionId: string,
    public readonly subresourceId: string,
    public readonly createdAt?: Date
  ) {}
}
