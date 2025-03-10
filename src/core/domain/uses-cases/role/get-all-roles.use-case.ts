import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from 'src/core/domain/entities/role.entity';

@Injectable()
export class GetAllRolesUseCase {
  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

  async execute(page: number, limit: number): Promise<{ roles: Role[]; total: number }> {
    return this.roleRepository.findAll(page, limit);
  }
}
