import { Module } from '@nestjs/common';
import { PrismaRolePermissionRepository } from 'src/infrastructure/prisma/prisma-role-permission.repository';
import { RolePermissionController } from 'src/presentation/controllers/role/role-permission.controller';
import { AssignPermissionsUseCase } from './assign-permissions.use-case';
import { GetPermissionsByRoleUseCase } from './get-permissions-by-role.use-case';
import { RemovePermissionUseCase } from './remove-permission.use-case';
import { CheckPermissionUseCase } from './check-permission.use-case';

@Module({
  controllers: [RolePermissionController],
  providers: [
    {
      provide: 'IRolePermissionRepository',
      useClass: PrismaRolePermissionRepository,
    },
    AssignPermissionsUseCase,
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase,
    CheckPermissionUseCase,
  ],
  exports: [
    AssignPermissionsUseCase,
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase,
    CheckPermissionUseCase,
  ],
})
export class RolePermissionModule {}
