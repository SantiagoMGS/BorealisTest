import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../repositories/user.repository';
import { ICompanyRepository } from '../../repositories/company.repository';
import { CreateUserDto } from 'src/presentation/controllers/user/dtos/create-user.dto';
import { IRoleRepository } from '../../repositories/role.repository';
import { User } from '../../entities';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(userDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(userDto.email);
      if (existingUser) {
        throw new ForbiddenException(
          `El email "${userDto.email}" ya esta en uso.`,
        );
      }

      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      const newUser = await this.userRepository.createUser(
        new User('', userDto.name, userDto.email, hashedPassword, true, null, null),
      );

      const { permissions } = userDto;
      if (!permissions || permissions.length === 0) {
        throw new NotFoundException(
          `El usuario debe tener al menos un rol y una compañia asignada.`,
        );
      }

      for (const permission of permissions) {
        const role = await this.roleRepository.findById(permission.roleId);
        if (!role) {
          throw new NotFoundException(
            `Rol con ID ${permission.roleId} no encontrado.`,
          );
        }

        const company = await this.companyRepository.findById(
          permission.companyId,
        );
        if (!company) {
          throw new NotFoundException(
            `Compañia con ID ${permission.companyId} no encontrada.`,
          );
        }
      }

      await this.userRepository.assignUserToCompanies(newUser.id, permissions);

      this.logger.log('User created successfully');
      return newUser;
    } catch (error) {
      this.logger.error('Failed to create user', (error as Error).stack);
      throw error;
    }
  }
}
