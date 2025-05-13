export interface ICurrentTenantPort {
  getCompanyId(): string | undefined;

  getUserId(): string | undefined;

  getRoleId(): string | undefined;
}
