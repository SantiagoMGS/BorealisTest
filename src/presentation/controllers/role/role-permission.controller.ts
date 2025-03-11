import { Body, Controller, Post, Get, Delete, Param, HttpCode, HttpStatus, Logger, ParseUUIDPipe } from '@nestjs/common';
import { AssignPermissionsUseCase } from 'src/core/domain/uses-cases/role/role-permission/assign-permissions.use-case';
import { CheckPermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/check-permission.use-case';
import { GetPermissionsByRoleUseCase } from 'src/core/domain/uses-cases/role/role-permission/get-permissions-by-role.use-case';
import { RemovePermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/remove-permission.use-case';
import { AssignPermissionsDto } from './dtos/assign-permissions.dto';
import { CheckPermissionDto } from './dtos/check-permission.dto';

@Controller('role-permission')
export class RolePermissionController {
  constructor(
    private readonly assignPermissionsUseCase: AssignPermissionsUseCase,
    private readonly getPermissionsByRoleUseCase: GetPermissionsByRoleUseCase,
    private readonly removePermissionUseCase: RemovePermissionUseCase,
    private readonly checkPermissionUseCase: CheckPermissionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async assignPermissions(@Body() assignPermissionsDto: AssignPermissionsDto) {
    return this.assignPermissionsUseCase.execute(assignPermissionsDto);
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  async getPermissions(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.getPermissionsByRoleUseCase.execute(roleId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermission(@Body() removePermissionDto: { roleId: string; actionId: string; resourceId: string }) {
    return this.removePermissionUseCase.execute(removePermissionDto.roleId, removePermissionDto.actionId, removePermissionDto.resourceId);
  }

  @Post('/check')
  @HttpCode(HttpStatus.OK)
  async checkPermission(@Body() checkPermissionDto: CheckPermissionDto) {
    return this.checkPermissionUseCase.execute(checkPermissionDto);
  }
}
