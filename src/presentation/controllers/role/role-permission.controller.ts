import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  AssignPermissionsUseCase,
  CheckPermissionUseCase,
  GetPermissionsByRoleUseCase,
  RemovePermissionUseCase,
} from 'src/core/domain/uses-cases';

import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { AssignPermissionsDto } from './dtos/assign-permissions.dto';
import { CheckPermissionDto } from './dtos/check-permission.dto';
import { RemovePermissionDto } from './dtos/remove-permission.dto';

@ApiTags('Permisos de Rol')
@Controller('role/role-permission')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class RolePermissionController {
  constructor(
    private readonly assignPermissionsUseCase: AssignPermissionsUseCase,
    private readonly getPermissionsByRoleUseCase: GetPermissionsByRoleUseCase,
    private readonly removePermissionUseCase: RemovePermissionUseCase,
    private readonly checkPermissionUseCase: CheckPermissionUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar permisos a un rol' })
  @ApiBody({ type: AssignPermissionsDto })
  @ApiStandardResponses({ created: true, badRequest: true })
  async assignPermissions(@Body() dto: AssignPermissionsDto) {
    return this.assignPermissionsUseCase.execute(dto);
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener permisos por ID de rol' })
  @ApiParam({ name: 'roleId', description: 'UUID del rol' })
  @ApiStandardResponses({ ok: 'Permisos del rol.', notFound: 'Rol no encontrado.' })
  async getPermissions(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.getPermissionsByRoleUseCase.execute(roleId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un permiso de un rol' })
  @ApiBody({ type: RemovePermissionDto })
  @ApiStandardResponses({ notFound: 'Rol o permiso no encontrado.' })
  async removePermission(@Body() dto: RemovePermissionDto) {
    return this.removePermissionUseCase.execute(
      dto.roleId,
      dto.actionId,
      dto.resourceId,
    );
  }

  @Post('/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar si un rol tiene un permiso específico' })
  @ApiBody({ type: CheckPermissionDto })
  @ApiStandardResponses({ ok: 'Resultado de la verificación del permiso.', badRequest: true })
  async checkPermission(@Body() dto: CheckPermissionDto) {
    return this.checkPermissionUseCase.execute(dto);
  }
}
