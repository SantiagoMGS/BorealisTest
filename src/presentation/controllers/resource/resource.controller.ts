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
  CreateResourceUseCase,
  DeleteResourceUseCase,
  GetAllResourcesUseCase,
  GetByIdResourceUseCase,
  UpdateResourceUseCase,
} from 'src/core/domain/uses-cases';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { UpdateResourceDto } from './dtos/update-resource.dto';

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
  @ApiStandardResponses({ created: true, badRequest: true })
  async createResource(@Body() dto: CreateResourceDto) {
    return this.createResourceUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los recursos con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiStandardResponses({ ok: 'Lista de recursos.' })
  async getAllResources(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.findAllResourcesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un recurso por ID' })
  @ApiParam({ name: 'id', description: 'UUID del recurso' })
  @ApiStandardResponses({ ok: 'Detalles del recurso.', notFound: 'Recurso no encontrado.' })
  async getResourceById(@Param('id', ParseUUIDPipe) id: string) {
    const resource = await this.findByIdResourceUseCase.execute(id);
    if (!resource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    return resource;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un recurso' })
  @ApiParam({ name: 'id', description: 'UUID del recurso' })
  @ApiBody({ type: UpdateResourceDto })
  @ApiStandardResponses({ ok: 'Recurso actualizado correctamente.', badRequest: true, notFound: 'Recurso no encontrado.' })
  async updateResource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResourceDto,
  ) {
    return this.updateResourceUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un recurso' })
  @ApiParam({ name: 'id', description: 'UUID del recurso' })
  @ApiStandardResponses({ notFound: 'Recurso no encontrado.' })
  async deleteResource(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteResourceUseCase.execute(id);
  }
}
