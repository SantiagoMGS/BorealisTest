import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from "src/core/domain/uses-cases/auth/guards/permission.guard";
import { CreateRoleUseCase } from "src/core/domain/uses-cases/role/create-role.user-case";
import { DeleteRoleUseCase } from "src/core/domain/uses-cases/role/delete-role.use-case";
import { GetAllRolesUseCase } from "src/core/domain/uses-cases/role/get-all-roles.use-case";
import { GetRoleByIdUseCase } from "src/core/domain/uses-cases/role/get-role-by-id.use-case";
import { UpdateRoleUseCase } from "src/core/domain/uses-cases/role/update-role.use-case";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";

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
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'El rol ha sido creado exitosamente.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los roles con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página, el valor predeterminado es 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página, el valor predeterminado es 10' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de roles.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  async getAllRoles(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return this.getAllRolesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del rol' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Detalles del rol.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rol no encontrado.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  async getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    const role = await this.getRoleByIdUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del rol' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'El rol ha sido actualizado exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rol no encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = this.updateRoleUseCase.execute(id, updateRoleDto);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del rol' })
  @ApiResponse({ status: HttpStatus.OK, description: 'El rol ha sido eliminado exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rol no encontrado.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    const role = this.deleteRoleUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return { message: `El Rol: ${id} eliminado correctamente.` };
  }
}