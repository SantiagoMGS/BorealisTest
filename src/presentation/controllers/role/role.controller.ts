import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateRoleUseCase,
  DeleteRoleUseCase,
  GetAllRolesUseCase,
  GetRoleByIdUseCase,
  UpdateRoleUseCase,
} from 'src/core/domain/uses-cases';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@ApiTags('Roles')
@Controller('role')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiBody({ type: CreateRoleDto })
  @ApiStandardResponses({ created: true, badRequest: true })
  async createRole(@Body() dto: CreateRoleDto) {
    return this.createRoleUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los roles con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiStandardResponses({ ok: 'Lista de roles.' })
  async getAllRoles(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.getAllRolesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', description: 'UUID del rol' })
  @ApiStandardResponses({ ok: 'Detalles del rol.', notFound: 'Rol no encontrado.' })
  async getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    const role = await this.getRoleByIdUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiStandardResponses({
    ok: 'Rol actualizado.',
    badRequest: true,
    notFound: 'Rol no encontrado.',
  })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    const updated = await this.updateRoleUseCase.execute(id, dto);
    if (!updated) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol' })
  @ApiStandardResponses({ ok: 'Rol eliminado.', notFound: 'Rol no encontrado.' })
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = this.deleteRoleUseCase.execute(id);
    if (!deleted) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return { message: `El Rol: ${id} eliminado correctamente.` };
  }
}
