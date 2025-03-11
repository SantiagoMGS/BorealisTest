import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';
import { CheckPermissionDto } from 'src/presentation/controllers/role/dtos/check-permission.dto';

@Injectable()
export class CheckPermissionUseCase {
  private readonly logger = new Logger(CheckPermissionUseCase.name);

  constructor(
    @Inject('IRolePermissionRepository') private readonly rolePermissionRepository: IRolePermissionRepository
  ) {}

  async execute(checkPermissionDto: CheckPermissionDto): Promise<{ access: boolean }> {
    const { roleId, actionId, resourceId } = checkPermissionDto;

    this.logger.log(`Checking permission for role ID: ${roleId}, action ID: ${actionId}, resource ID: ${resourceId}`);

    try {
      const hasPermission = await this.rolePermissionRepository.findPermission(roleId, actionId, resourceId);
      return { access: !!hasPermission };
    } catch (error) {
      this.logger.error(`Failed to check permission for role ID: ${roleId}`, error.stack);
      throw error;
    }
  }
}
