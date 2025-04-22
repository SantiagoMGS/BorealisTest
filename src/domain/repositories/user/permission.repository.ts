import { IPermissionsByCompanyResponse } from '@domain/interfaces/user/permission-response.interface';

export abstract class PermissionRepository {
  abstract getPermissionsByCompany(
    userId: string,
    companyId: string,
  ): Promise<IPermissionsByCompanyResponse>;
}
