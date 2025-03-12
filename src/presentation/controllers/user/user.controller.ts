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

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserCompanyRoleUseCase: UpdateUserCompanyRoleUseCase,

  ) { }

  // Solo los usuarios con permiso para CREAR usuarios pueden acceder
  @Post()
  @UseGuards(AuthGuard('internal'), PermissionGuard)
  @Permissions({ resource: 'user', action: 'create' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  // Solo los usuarios con permiso para LEER usuarios pueden acceder
  @Get()
  @UseGuards(AuthGuard('internal'), PermissionGuard)
  @Permissions({ resource: 'user', action: 'read' })
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10
  ) {
    return this.findAllUsersUseCase.execute(page, limit);
  }

  // Solo los usuarios con permiso para LEER un usuario específico pueden acceder
  @Get(':email')
  @UseGuards(AuthGuard('internal'), PermissionGuard)
  @Permissions({ resource: 'user', action: 'read' })
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }

  @Put('update-role')
  @UseGuards(AuthGuard('internal'), PermissionGuard)
  @Permissions({ resource: 'user', action: 'update' })
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Body() updateUserRoleDto: UpdateUserCompanyDto): Promise<void> {
    console.log('llega aca');
    
    const { userId, companyId, roleId } = updateUserRoleDto;
    await this.updateUserCompanyRoleUseCase.execute(userId, companyId, roleId);
  }
  // Solo los usuarios con permiso para ACTUALIZAR usuarios pueden acceder
  @Put(':email')
  @UseGuards(AuthGuard('internal'), PermissionGuard)
  @Permissions({ resource: 'user', action: 'update' })
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(email, updateUserDto);
  }

  // Solo los usuarios con permiso para ELIMINAR usuarios pueden acceder
  @Delete(':email')
  @UseGuards(AuthGuard('internal'), PermissionGuard)
  @Permissions({ resource: 'user', action: 'delete' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('email') email: string) {
    await this.deleteUserUseCase.execute(email);
    return { message: `Usuario con email ${email} eliminado correctamente.` };
  }
  
  
}
