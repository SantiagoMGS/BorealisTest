import { Body, Controller, Post, Get, Param, Put, Delete, Query, NotFoundException, HttpCode, HttpStatus, Logger, ParseIntPipe, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { CreateRoleUseCase } from "src/core/domain/uses-cases/role/create-role.user-case";
import { DeleteRoleUseCase } from "src/core/domain/uses-cases/role/delete-role.use-case";
import { GetAllRolesUseCase } from "src/core/domain/uses-cases/role/get-all-roles.use-case";
import { GetRoleByIdUseCase } from "src/core/domain/uses-cases/role/get-role-by-id.use-case";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { UpdateRoleUseCase } from "src/core/domain/uses-cases/role/update-role.use-case";
import { AuthGuard } from "@nestjs/passport";
import { PermissionGuard } from "src/core/domain/uses-cases/auth/guards/permission.guard";

@Controller('role')
@UseGuards(AuthGuard('internal'), PermissionGuard)

export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase
  ) { }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllRoles(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return this.getAllRolesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    const role = await this.getRoleByIdUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateRole(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = this.updateRoleUseCase.execute(id, updateRoleDto);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    const role = this.deleteRoleUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return { message: `El Rol: ${id} eliminado correctamente.` };
  }
}
