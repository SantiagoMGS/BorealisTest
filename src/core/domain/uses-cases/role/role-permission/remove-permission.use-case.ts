import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';

@Injectable()
export class RemovePermissionUseCase {
  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository
  ) {}

  async execute(roleId: string, actionId: string, resourceId: string): Promise<void> {
    const permissionExists = await this.rolePermissionRepository.findPermission(roleId, actionId, resourceId);
    if (!permissionExists) throw new NotFoundException(`El permiso no existe para el rol`);

    await this.rolePermissionRepository.removePermission(roleId, actionId, resourceId);
  }
}
