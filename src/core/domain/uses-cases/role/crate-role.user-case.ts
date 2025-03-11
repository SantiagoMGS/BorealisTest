
import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '../../repositories/role.repository';
import { CreateRoleDto } from 'src/presentation/controllers/dtos/role/create-role.dto';
import { Role } from '../../entities/role.entity';

@Injectable()
export class CreateRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) { }


  async execute(roleDto: CreateRoleDto): Promise<Role> {
    const newRole = new Role(
    '',
      roleDto.name,
    );
    return await this.roleRepository.createRole(newRole);

  }
}