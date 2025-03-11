import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from 'src/core/domain/entities/role.entity';

@Injectable()
export class GetAllRolesUseCase {
  private readonly logger = new Logger(GetAllRolesUseCase.name);

  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(page: number, limit: number): Promise<{ roles: Role[]; total: number }> {
    this.logger.log(`Getting all roles with page: ${page}, limit: ${limit}`);

    try {
      return this.roleRepository.findAll(page, limit);
    } catch (error) {
      this.logger.error('Failed to get all roles', error.stack);
      throw error;
    }
  }
}
