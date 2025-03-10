import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';

@Injectable()
export class DeleteRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<void> {
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) throw new NotFoundException(`Rol con ID ${id} no encontrado`);

    await this.roleRepository.deleteRole(id);
  }
}
