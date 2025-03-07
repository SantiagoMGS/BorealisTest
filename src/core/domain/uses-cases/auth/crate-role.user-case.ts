
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '../../repositories/role.repository';
import { CreateRoleDto } from 'src/presentation/controllers/auth/dtos/create-role.dto';
import { Role } from '../../entities/role.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject('IRoleRepository') private readonly userRepository: IRoleRepository) { }


  async execute(roleDto: CreateRoleDto): Promise<Role> {
    const newUser = new Role(
      crypto.randomUUID(),
      roleDto.name,
    );
    return this.userRepository.createRole(newUser);
  }
}