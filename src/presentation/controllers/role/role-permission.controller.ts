import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { AssignPermissionsUseCase } from 'src/core/domain/uses-cases/role/role-permission/assign-permissions.use-case';
import { CheckPermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/check-permission.use-case';
import { GetPermissionsByRoleUseCase } from 'src/core/domain/uses-cases/role/role-permission/get-permissions-by-role.use-case';
import { RemovePermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/remove-permission.use-case';
import { AssignPermissionsDto } from './dtos/assign-permissions.dto';
import { CheckPermissionDto } from './dtos/check-permission.dto';

@Controller('api/role-permission') // ✅ Asegúrate de que esta ruta es correcta
export class RolePermissionController {
  constructor(
    private readonly assignPermissionsUseCase: AssignPermissionsUseCase,
    private readonly getPermissionsByRoleUseCase: GetPermissionsByRoleUseCase,
    private readonly removePermissionUseCase: RemovePermissionUseCase,
    private readonly checkPermissionUseCase: CheckPermissionUseCase,
  ) {}

  @Post()
  async assignPermissions(@Body() assignPermissionsDto: AssignPermissionsDto) {
    return this.assignPermissionsUseCase.execute(assignPermissionsDto);
  }

  @Get(':roleId')
  async getPermissions(@Param('roleId') roleId: string) {
    return this.getPermissionsByRoleUseCase.execute(roleId);
  }

  @Delete()
  async removePermission(@Body() removePermissionDto: { roleId: string; actionId: string; resourceId: string }) {
    const { roleId, actionId, resourceId } = removePermissionDto;
    return this.removePermissionUseCase.execute(roleId, actionId, resourceId);
  }

  @Post('/check')
  async checkPermission(@Body() checkPermissionDto: CheckPermissionDto) {
    return this.checkPermissionUseCase.execute(checkPermissionDto);
  }
}
