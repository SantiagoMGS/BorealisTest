import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from '../../entities';

@Injectable()
export class GetAllRolesUseCase {
  private readonly logger = new Logger(GetAllRolesUseCase.name);

  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) { }

  async execute(page: number, limit: number): Promise<{ roles: Role[]; total: number }> {
    this.logger.log(`Getting all roles with page: ${page}, limit: ${limit}`);

    try {
      const result = await this.roleRepository.findAll(page, limit);
      return { roles: result.data, total: result.total };
    } catch (error) {
      this.logger.error('Failed to get all roles', (error as Error).stack);
      throw error;
    }
  }
}
