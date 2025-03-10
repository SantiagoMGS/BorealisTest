export class RolePermission {
  constructor(
    public readonly roleId: string,
    public readonly actionId: string,
    public readonly resourceId: string,
    public readonly createdAt?: Date
  ) {}
}
