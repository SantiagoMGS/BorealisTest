import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';

@Injectable()
export class DeleteRoleUseCase {
  private readonly logger = new Logger(DeleteRoleUseCase.name);

  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  /**
   * Deletes a role by its ID.
   * @param id - The ID of the role to delete.
   * @throws NotFoundException if the role with the given ID is not found.
   */
  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting role ID: ${id}`);

    try {
      const existingRole = await this.roleRepository.findById(id);
      if (!existingRole) throw new NotFoundException(`Rol con ID ${id} no encontrado`);

      await this.roleRepository.deleteRole(id);
      this.logger.log(`Role ID: ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete role ID: ${id}`, error.stack);
      throw error;
    }
  }
}
