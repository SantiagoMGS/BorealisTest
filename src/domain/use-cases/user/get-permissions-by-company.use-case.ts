import { Injectable } from '@nestjs/common';
import { IPermissionsByCompanyResponse } from '@domain/interfaces/user/permission-response.interface';
import { PermissionRepository } from '@domain/repositories/user/permission.repository';

@Injectable()
export class GetPermissionsByCompanyUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(
    userId: string,
    companyId: string,
  ): Promise<IPermissionsByCompanyResponse> {
    return this.permissionRepository.getPermissionsByCompany(userId, companyId);
  }
}
