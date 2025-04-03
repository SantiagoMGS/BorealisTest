import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from "src/core/domain/uses-cases/auth/guards/permission.guard";
import { CreateResourceUseCase } from "src/core/domain/uses-cases/resource/create-resource.use-case";
import { DeleteResourceUseCase } from "src/core/domain/uses-cases/resource/delete-resource.use-case";
import { GetAllResourcesUseCase } from "src/core/domain/uses-cases/resource/get-all-resorce.use-case";
import { GetByIdResourceUseCase } from "src/core/domain/uses-cases/resource/get-resoure.use-case";
import { UpdateResourceUseCase } from "src/core/domain/uses-cases/resource/update-resource.use-case";
import { CreateResourceDto } from "./dtos/create-resource.dto";
import { UpdateResourceDto } from "./dtos/update-resource.dto";

@ApiTags('Resources')
@Controller('resource')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly updateResourceUseCase: UpdateResourceUseCase,
    private readonly deleteResourceUseCase: DeleteResourceUseCase,
    private readonly findByIdResourceUseCase: GetByIdResourceUseCase,
    private readonly findAllResourcesUseCase: GetAllResourcesUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo recurso' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'El recurso ha sido creado exitosamente.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso prohibido al recurso.' })
  async createResource(@Body() createResourceDto: CreateResourceDto) {
    return this.createResourceUseCase.execute(createResourceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los recursos con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página, por defecto es 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página, por defecto es 10' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de recursos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso prohibido al recurso.' })
  async getAllResources(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return this.findAllResourcesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un recurso por ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del recurso' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Detalles del recurso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recurso no encontrado.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso prohibido al recurso.' })
  async getResourceById(@Param('id', ParseUUIDPipe) id: string) {
    const resource = await this.findByIdResourceUseCase.execute(id);
    if (!resource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    return resource;
  }
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un recurso' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del recurso' })
  @ApiBody({ type: UpdateResourceDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'El recurso ha sido actualizado exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recurso no encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso prohibido al recurso.' })
  async updateResource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.updateResourceUseCase.execute(id, updateResourceDto);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un recurso' })
  @ApiParam({ name: 'id', required: true, description: 'UUID del recurso' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'El recurso ha sido eliminado exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recurso no encontrado.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso prohibido al recurso.' })
  async deleteResource(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteResourceUseCase.execute(id);
  }
}