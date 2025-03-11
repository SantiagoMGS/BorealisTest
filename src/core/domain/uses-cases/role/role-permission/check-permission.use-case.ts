import { Inject, Injectable } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';
import { CheckPermissionDto } from 'src/presentation/controllers/role/dtos/check-permission.dto';

@Injectable()
export class CheckPermissionUseCase {
  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository
  ) {}

  async execute(checkPermissionDto: CheckPermissionDto): Promise<{ access: boolean }> {
    const { roleId, actionId, resourceId } = checkPermissionDto;

    const hasPermission = await this.rolePermissionRepository.findPermission(roleId, actionId, resourceId);
    return { access: !!hasPermission };
  }
}
