import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';

@Injectable()
export class GetPermissionsByRoleUseCase {
  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository
  ) {}

  async execute(roleId: string) {
    const permissions = await this.rolePermissionRepository.getPermissionsByRole(roleId);
    if (!permissions.length) throw new NotFoundException(`No se encontraron permisos para el rol con ID ${roleId}`);

    return { roleId, permissions };
  }
}
