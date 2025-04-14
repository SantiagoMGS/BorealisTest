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
import { RequireSubresource } from 'src/core/domain/uses-cases/auth/decorators/permissions.decorator';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserCompanyDto } from "./dtos/update-user-company.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@ApiTags('Users')
@Controller('user')
@UseGuards(AuthGuard('internal'))
@RequireSubresource('Gestión de usuarios')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserCompanyRoleUseCase: UpdateUserCompanyRoleUseCase,
    private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiStandardResponses({ created: true, badRequest: true })
  @UseGuards(PermissionGuard)
  async createUser(@Body() dto: CreateUserDto, @Request() req) {
    return this.createUserUseCase.execute(dto, req.user.id);
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
  @UseGuards(PermissionGuard)
  async getAllUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10
  ) {
    return this.findAllUsersUseCase.execute(page, limit);
  }

  @Get(':email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un usuario por email' })
  @ApiParam({ name: 'email', description: 'Email del usuario' })
  @ApiStandardResponses({ ok: 'Detalles del usuario.', notFound: 'Usuario no encontrado.' })
  @UseGuards(PermissionGuard)
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }

  @Patch('company/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario en una compañía' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserCompanyDto })
  @ApiStandardResponses({
    ok: 'Relación usuario-compañía actualizada exitosamente.',
    badRequest: true,
    notFound: 'Usuario o compañía no encontrados.'
  })
  @RequireSubresource('Asignación de roles')
  @UseGuards(PermissionGuard)
  async updateUserCompanyRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserCompanyDto
  ) {
    return this.updateUserCompanyRoleUseCase.execute(id, dto.companyId, dto.roleId);
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
  @UseGuards(PermissionGuard)
  async updateUser(
    @Param('email') email: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.updateUserUseCase.execute(email, dto);
  }

  @Delete(':email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'email', description: 'Email del usuario' })
  @ApiStandardResponses({ notFound: 'Usuario no encontrado.' })
  @UseGuards(PermissionGuard)
  async deleteUser(@Param('email') email: string) {
    await this.deleteUserUseCase.execute(email);
    return { message: `Usuario con email ${email} eliminado correctamente.` };
  }
}
