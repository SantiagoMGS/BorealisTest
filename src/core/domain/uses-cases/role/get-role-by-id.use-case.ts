import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from '../../entities';

@Injectable()
export class GetRoleByIdUseCase {
  private readonly logger = new Logger(GetRoleByIdUseCase.name);

  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<Role> {
    this.logger.log(`Getting role by ID: ${id}`);

    try {
      const role = await this.roleRepository.findById(id);
      if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      return role;
    } catch (error) {
      this.logger.error(`Failed to get role by ID: ${id}`, error.stack);
      throw error;
    }
  }
}
