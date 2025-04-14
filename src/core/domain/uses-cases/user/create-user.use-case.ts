import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/presentation/controllers/user/dtos/create-user.dto';
import { User } from '../../entities/user.entity';
import { ICompanyRepository } from '../../repositories/company.repository';
import { IRoleRepository } from '../../repositories/role.repository';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(userDto: CreateUserDto, currentUserId?: string): Promise<Omit<User, 'hashedPassword'>> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(userDto.email);
      if (existingUser) {
        throw new ForbiddenException(
          `El email "${userDto.email}" ya esta en uso.`,
        );
      }

      const { permissions } = userDto;
      if (!permissions || permissions.length === 0) {
        throw new NotFoundException(
          `El usuario debe tener al menos un rol y una compañía asignada.`,
        );
      }

      // Si hay un usuario autenticado, verificar que tenga permisos en las compañías donde quiere crear el usuario
      if (currentUserId) {
        // Obtener las compañías del usuario actual
        const userPermissions = await this.userRepository.getUserPermissions(currentUserId);
        if (!userPermissions || userPermissions.length === 0) {
          throw new UnauthorizedException('No tienes permisos para crear usuarios');
        }
        
        // Obtener los IDs de las compañías donde el usuario tiene acceso
        const allowedCompanyIds = userPermissions[0].companies.map(company => company.companyId);
        
        // Verificar que todas las compañías en el DTO estén permitidas para el usuario actual
        for (const permission of permissions) {
          if (!allowedCompanyIds.includes(permission.companyId)) {
            throw new ForbiddenException(
              `No tienes permiso para crear usuarios en la compañía con ID ${permission.companyId}`
            );
          }
        }
      }

      // Validar los roles y compañías antes de crear el usuario
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
            `Compañía con ID ${permission.companyId} no encontrada.`,
          );
        }
      }

      // Crear el nuevo usuario
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const newUser: User = {
        name: userDto.name,
        email: userDto.email,
        hashedPassword,
        isActive: false,
      };

      // Primero, crear el usuario para obtener el ID
      const createdUser = await this.userRepository.create(newUser);
      
      // Luego, asignar los permisos utilizando el ID del usuario recién creado
      if (createdUser.id) {
        await this.userRepository.assignUserToCompanies(createdUser.id, permissions);
      } else {
        throw new Error('No se pudo obtener el ID del usuario creado');
      }

      this.logger.log('Usuario creado exitosamente');
      
      // Devolver el usuario sin el hashedPassword
      const { hashedPassword: _, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error('Error al crear usuario', (error as Error).stack);
      throw error;
    }
  }
}
