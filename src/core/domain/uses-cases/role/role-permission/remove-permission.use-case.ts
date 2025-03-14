import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';

@Injectable()
export class RemovePermissionUseCase {
  private readonly logger = new Logger(RemovePermissionUseCase.name);

  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository
  ) {}

  async execute(roleId: string, actionId: string, subresourceId: string): Promise<void> {
    this.logger.log(`Removing permission for role ID: ${roleId}, action ID: ${actionId}, resource ID: ${subresourceId}`);

    try {
      const permissionExists = await this.rolePermissionRepository.findPermission(roleId, actionId, subresourceId);
      if (!permissionExists) throw new NotFoundException(`El permiso no existe para el rol`);

      await this.rolePermissionRepository.removePermission(roleId, actionId, subresourceId);
      this.logger.log(`Permission removed for role ID: ${roleId}`);
    } catch (error) {
      this.logger.error(`Failed to remove permission for role ID: ${roleId}`, error.stack);
      throw error;
    }
  }
}
