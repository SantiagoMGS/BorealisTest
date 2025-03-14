import {
  Body, Controller, Delete, Get, NotFoundException, Param,
  Post, Put, Query, HttpCode, HttpStatus, ParseIntPipe,
  ParseUUIDPipe, UseGuards
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { CreateUserUseCase } from "src/core/domain/uses-cases/user/create-user.use-case";
import { CreateUserDto } from "./dtos/create-user.dto";
import { FindAllUsersUseCase } from "src/core/domain/uses-cases/user/find-all-user.use-case";
import { UpdateUserUseCase } from "src/core/domain/uses-cases/user/update-user.use-case";
import { DeleteUserUseCase } from "src/core/domain/uses-cases/user/delete-user.use-case";
import { FindUserUseCase } from "src/core/domain/uses-cases/user/find-user.use-case";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { PermissionGuard } from "src/core/domain/uses-cases/auth/guards/permission.guard";
import { Permissions } from "src/core/domain/uses-cases/auth/decorators/permissions.decorator";
import { UpdateUserCompanyDto } from "./dtos/update-user-company.dto";
import { UpdateUserCompanyRoleUseCase } from "src/core/domain/uses-cases/user/update-user-company.use-case";
import { PermissionService } from "src/core/domain/uses-cases/auth/services/permission.service";

@Controller('user')
//@UseGuards(AuthGuard('internal'), PermissionGuard) 

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserCompanyRoleUseCase: UpdateUserCompanyRoleUseCase,
    private readonly permissionService: PermissionService,  // 🔹 Inyección del servicio de permisos
  ) { }

  // Solo los usuarios con permiso para CREAR usuarios pueden acceder
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  // Solo los usuarios con permiso para LEER usuarios pueden acceder
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10
  ) {
    const permission = await this.permissionService.getPermissions('user', 'read');
    Permissions(permission);
    return this.findAllUsersUseCase.execute(page, limit);
  }

  // Solo los usuarios con permiso para LEER un usuario específico pueden acceder
  @Get(':email')
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(@Param('email') email: string) {
    const permission = await this.permissionService.getPermissions('user', 'read');
    Permissions(permission);
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }

  @Put('update-role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Body() updateUserRoleDto: UpdateUserCompanyDto): Promise<void> {
    const permission = await this.permissionService.getPermissions('user', 'update');
    Permissions(permission);
    const { userId, companyId, roleId } = updateUserRoleDto;
    await this.updateUserCompanyRoleUseCase.execute(userId, companyId, roleId);
  }

  // Solo los usuarios con permiso para ACTUALIZAR usuarios pueden acceder
  @Put(':email')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    const permission = await this.permissionService.getPermissions('user', 'update');
    Permissions(permission);
    return this.updateUserUseCase.execute(email, updateUserDto);
  }

  // Solo los usuarios con permiso para ELIMINAR usuarios pueden acceder
  @Delete(':email')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('email') email: string) {
    const permission = await this.permissionService.getPermissions('user', 'delete');
    Permissions(permission);
    await this.deleteUserUseCase.execute(email);
    return { message: `Usuario con email ${email} eliminado correctamente.` };
  }
}
