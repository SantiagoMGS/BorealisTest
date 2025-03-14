import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
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

@ApiTags('Roles')
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
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The role has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number, default is 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page, default is 10' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of roles.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async getAllRoles(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return this.getAllRolesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Role UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The role details.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    const role = await this.getRoleByIdUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', required: true, description: 'Role UUID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async updateRole(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = this.updateRoleUseCase.execute(id, updateRoleDto);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', required: true, description: 'Role UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    const role = this.deleteRoleUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return { message: `El Rol: ${id} eliminado correctamente.` };
  }
}