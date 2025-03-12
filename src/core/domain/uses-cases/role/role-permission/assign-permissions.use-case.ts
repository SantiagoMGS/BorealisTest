import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { AssignPermissionsDto } from 'src/presentation/controllers/role/dtos/assign-permissions.dto';

@Injectable()
export class AssignPermissionsUseCase {
  private readonly logger = new Logger(AssignPermissionsUseCase.name);

  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository
  ) {}

  async execute(assignPermissionsDto: AssignPermissionsDto): Promise<void> {
    const { roleId, permissions } = assignPermissionsDto;

    this.logger.log(`Assigning permissions to role ID: ${roleId}`);

    try {
      const role = await this.roleRepository.findById(roleId);      
      if (!role) throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);

      await this.rolePermissionRepository.assignPermissions(roleId, permissions);
      this.logger.log(`Permissions assigned to role ID: ${roleId}`);
    } catch (error) {
      this.logger.error(`Failed to assign permissions to role ID: ${roleId}`, error.stack);
      throw error;
    }
  }
}
