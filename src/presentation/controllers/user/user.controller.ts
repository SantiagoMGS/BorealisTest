import { ApiStandardResponses } from "@app/presentation/decorator/api-standard-response.decorator";
import {
  Body, Controller, Delete, Get,
  HttpCode, HttpStatus, NotFoundException,
  Param, ParseIntPipe, Patch, Post,
  Query, Request, UseGuards
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam, ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import {
  CreateUserUseCase, DeleteUserUseCase, FindAllUsersUseCase, FindUserUseCase,
  GetUserPermissionsUseCase,
  UpdateUserCompanyRoleUseCase,
  UpdateUserUseCase
} from 'src/core/domain/uses-cases';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { PermissionService } from 'src/core/domain/uses-cases/auth/services/permission.service';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserCompanyDto } from "./dtos/update-user-company.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";


@ApiTags('Users')
@Controller('user')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserCompanyRoleUseCase: UpdateUserCompanyRoleUseCase,
    private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
    private readonly permissionService: PermissionService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiStandardResponses({ created: true, badRequest: true })
  async createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get('permissions-user')
  @ApiOperation({ summary: 'Obtener permisos del usuario autenticado' })
  @ApiStandardResponses({ ok: 'Permisos del usuario autenticado.' })
  async getUserPermissions(@Request() req) {
    return this.getUserPermissionsUseCase.execute(req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los usuarios con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiStandardResponses({ ok: 'Lista de usuarios.' })
  async getAllUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10
  ) {
    const permission = await this.permissionService.getPermissions('user', 'read');
    // Permissions(permission) // No aplicable como función, depende de implementación real
    return this.findAllUsersUseCase.execute(page, limit);
  }

  @Get(':email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un usuario por email' })
  @ApiParam({ name: 'email', description: 'Email del usuario' })
  @ApiStandardResponses({ ok: 'Detalles del usuario.', notFound: 'Usuario no encontrado.' })
  async getUserByEmail(@Param('email') email: string) {
    const permission = await this.permissionService.getPermissions('user', 'read');
    // Permissions(permission)
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }

  @Patch('update-role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario en una compañía' })
  @ApiBody({ type: UpdateUserCompanyDto })
  @ApiStandardResponses({
    ok: 'Rol de usuario actualizado.',
    badRequest: true,
    notFound: 'Usuario o compañía o rol no encontrado.'
  })
  async updateUserRole(@Body() dto: UpdateUserCompanyDto): Promise<void> {
    const permission = await this.permissionService.getPermissions('user', 'update');
    // Permissions(permission)
    const { userId, companyId, roleId } = dto;
    await this.updateUserCompanyRoleUseCase.execute(userId, companyId, roleId);
  }

  @Patch(':email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  @ApiParam({ name: 'email', description: 'Email del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiStandardResponses({
    ok: 'Usuario actualizado exitosamente.',
    badRequest: true,
    notFound: 'Usuario no encontrado.'
  })
  async updateUser(
    @Param('email') email: string,
    @Body() dto: UpdateUserDto
  ) {
    const permission = await this.permissionService.getPermissions('user', 'update');
    // Permissions(permission)
    return this.updateUserUseCase.execute(email, dto);
  }

  @Delete(':email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'email', description: 'Email del usuario' })
  @ApiStandardResponses({
    ok: 'Usuario eliminado exitosamente.',
    notFound: 'Usuario no encontrado.'
  })
  async deleteUser(@Param('email') email: string) {
    const permission = await this.permissionService.getPermissions('user', 'delete');
    // Permissions(permission)
    await this.deleteUserUseCase.execute(email);
    return { message: `Usuario con email ${email} eliminado correctamente.` };
  }
}
