import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserCompanyPermissionsEntity } from '../../entities/user-company-permissions.entity';
import { IUserRepository } from '../../repositories';

@Injectable()
export class GetUserPermissionsByCompanyUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
  ): Promise<UserCompanyPermissionsEntity> {
    try {
      // Llamar directamente al nuevo método que consulta los permisos específicos de la compañía
      return await this.userRepository.getUserCompanyPermissions(
        userId,
        companyId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener permisos por compañía: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }
}
