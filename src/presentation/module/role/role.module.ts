import { PermissionService } from '@app/core/domain/uses-cases/auth/services/permission.service';
import { Module } from '@nestjs/common';
import {
  AssignPermissionsUseCase,
  CheckPermissionUseCase,
  CreateRoleUseCase,
  DeleteRoleUseCase,
  GetAllRolesUseCase,
  GetPermissionsByRoleUseCase,
  GetRoleByIdUseCase,
  RemovePermissionUseCase,
  UpdateRoleUseCase,
} from 'src/core/domain/uses-cases';
import { RolePermissionController } from '../../controllers';
import { RoleController } from '../../controllers/role/role.controller';
import { RepositoryModule } from '../repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [RoleController, RolePermissionController],
  providers: [
    PermissionService,
    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase,
    CheckPermissionUseCase,
    AssignPermissionsUseCase,
  ],
  exports: [
    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase,
    CheckPermissionUseCase,
    AssignPermissionsUseCase,
    PermissionService,
  ],
})
export class RoleModule {} 