import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';

@Injectable()
export class GetPermissionsByRoleUseCase {
  private readonly logger = new Logger(GetPermissionsByRoleUseCase.name);

  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository
  ) {}

  async execute(roleId: string) {
    this.logger.log(`Getting permissions for role ID: ${roleId}`);

    try {
      const permissions = await this.rolePermissionRepository.getPermissionsByRole(roleId);
      if (!permissions.length) throw new NotFoundException(`No se encontraron permisos para el rol con ID ${roleId}`);

      return { roleId, permissions };
    } catch (error) {
      this.logger.error(`Failed to get permissions for role ID: ${roleId}`, (error as Error).stack);
      throw error;
    }
  }
}
