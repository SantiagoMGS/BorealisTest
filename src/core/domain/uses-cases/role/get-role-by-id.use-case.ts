import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from 'src/core/domain/entities/role.entity';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }
}
