import { Inject, Injectable, Logger, ConflictException } from '@nestjs/common';
import { IRoleRepository } from '../../repositories/role.repository';
import { CreateRoleDto } from 'src/presentation/controllers/role/dtos/create-role.dto';
import { Role } from '../../entities/role.entity';



@Injectable()
export class CreateRoleUseCase {
  private readonly logger = new Logger(CreateRoleUseCase.name);

  constructor(@Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) { }

  async execute(roleDto: CreateRoleDto): Promise<Role> {
    this.logger.log('Creating new role');

    try {
      const existingRole = await this.roleRepository.findById(roleDto.name);
      if (existingRole) {
        throw new ConflictException(`El rol "${roleDto.name}" ya existe.`);
      }

      const newRole = new Role('', roleDto.name);
      const createdRole = await this.roleRepository.createRole(newRole);
      this.logger.log('Role created successfully');
      return createdRole;
    } catch (error) {
      this.logger.error('Failed to create role', error.stack);
      throw error;
    }
  }
}