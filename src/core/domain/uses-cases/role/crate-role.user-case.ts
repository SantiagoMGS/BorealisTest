
import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '../../repositories/role.repository';
import { CreateRoleDto } from 'src/presentation/controllers/dtos/create-role.dto';
import { Role } from '../../entities/role.entity';

@Injectable()
export class CreateRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) { }


  async execute(roleDto: CreateRoleDto): Promise<Role> {
    const newUser = new Role(
      crypto.randomUUID(),
      roleDto.name,
    );
    return this.roleRepository.createRole(newUser);
  }
}