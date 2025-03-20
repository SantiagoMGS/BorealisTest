import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from '../../entities';

@Injectable()
export class UpdateRoleUseCase {
  private readonly logger = new Logger(UpdateRoleUseCase.name);

  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(id: string, roleData: Partial<Role>): Promise<Role> {
    this.logger.log(`Updating role ID: ${id}`);

    try {
      const existingRole = await this.roleRepository.findById(id);
      if (!existingRole) throw new NotFoundException(`Rol con ID ${id} no encontrado`);

      const updatedRole = await this.roleRepository.updateRole(id, roleData);
      this.logger.log(`Role ID: ${id} updated successfully`);
      return updatedRole;
    } catch (error) {
      this.logger.error(`Failed to update role ID: ${id}`, (error as Error).stack);
      throw error;
    }
  }
}

export default UpdateRoleUseCase;