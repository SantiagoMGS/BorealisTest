import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { AssignPermissionsDto } from 'src/presentation/controllers/dtos/role/assign-permissions.dto';


@Injectable()
export class AssignPermissionsUseCase {
  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository
  ) {}

  async execute(assignPermissionsDto: AssignPermissionsDto): Promise<void> {
    const { roleId, permissions } = assignPermissionsDto;

    // Verificar si el rol existe
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);

    // Asignar permisos al rol
    await this.rolePermissionRepository.assignPermissions(roleId, permissions);
  }
}
