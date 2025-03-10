import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from 'src/core/domain/entities/role.entity';

@Injectable()
export class UpdateRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(id: string, roleData: Partial<Role>): Promise<Role> {
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) throw new NotFoundException(`Rol con ID ${id} no encontrado`);

    return this.roleRepository.updateRole(id, roleData);
  }
}

export default UpdateRoleUseCase; 