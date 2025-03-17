import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AssignPermissionsUseCase } from 'src/core/domain/uses-cases/role/role-permission/assign-permissions.use-case';
import { CheckPermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/check-permission.use-case';
import { GetPermissionsByRoleUseCase } from 'src/core/domain/uses-cases/role/role-permission/get-permissions-by-role.use-case';
import { RemovePermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/remove-permission.use-case';
import { AssignPermissionsDto } from './dtos/assign-permissions.dto';
import { CheckPermissionDto } from './dtos/check-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { RemovePermissionDto } from './dtos/remove-permission.dto';

@ApiTags('Permisos de Rol')
@Controller('role-permission')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class RolePermissionController {
  constructor(
    private readonly assignPermissionsUseCase: AssignPermissionsUseCase,
    private readonly getPermissionsByRoleUseCase: GetPermissionsByRoleUseCase,
    private readonly removePermissionUseCase: RemovePermissionUseCase,
    private readonly checkPermissionUseCase: CheckPermissionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar permisos a un rol' })
  @ApiBody({ type: AssignPermissionsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Los permisos han sido asignados exitosamente al rol.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async assignPermissions(@Body() assignPermissionsDto: AssignPermissionsDto) {
    return this.assignPermissionsUseCase.execute(assignPermissionsDto);
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener permisos por ID de rol' })
  @ApiParam({ name: 'roleId', required: true, description: 'UUID del rol' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de permisos para el rol especificado.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rol no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async getPermissions(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.getPermissionsByRoleUseCase.execute(roleId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un permiso de un rol' })
  @ApiBody({ type: RemovePermissionDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'El permiso ha sido eliminado exitosamente del rol.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rol o permiso no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async removePermission(@Body() removePermissionDto: RemovePermissionDto) {
    return this.removePermissionUseCase.execute(
      removePermissionDto.roleId,
      removePermissionDto.actionId,
      removePermissionDto.resourceId,
    );
  }

  @Post('/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar si un rol tiene un permiso específico' })
  @ApiBody({ type: CheckPermissionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado de la verificación del permiso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async checkPermission(@Body() checkPermissionDto: CheckPermissionDto) {
    return this.checkPermissionUseCase.execute(checkPermissionDto);
  }
}
