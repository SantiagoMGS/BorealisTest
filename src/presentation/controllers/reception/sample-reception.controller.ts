import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateReceptionDto,
  ReceptionResponseDto,
  UpdateSampleDto,
} from './dtos';
import { ReceptionMapper } from './mappers';
import { CreateReceptionUseCase } from '@domain/use-cases/reception/create-sample-reception.usecase';
import { GetReceptionUseCase } from '@domain/use-cases/reception/get-sample-reception.usecase';
import { UpdateSampleReceptionUseCase } from '@domain/use-cases/reception/update-sample-reception.usecase';
import { DeleteSampleReceptionUseCase } from '@domain/use-cases/reception/delete-sample-reception.usecase';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAuthUser } from '@domain/entities/auth';
import { UpdateSampleFilter } from '@domain/repositories/reception/sample-reception.repository';

@ApiTags('Recepciones de Muestras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(SampleReceptionController.name)
@Controller('sample-receptions')
export class SampleReceptionController {
  constructor(
    private readonly createReceptionUseCase: CreateReceptionUseCase,
    private readonly getReceptionUseCase: GetReceptionUseCase,
    private readonly updateSampleReceptionUseCase: UpdateSampleReceptionUseCase,
    private readonly deleteSampleReceptionUseCase: DeleteSampleReceptionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva recepción con múltiples unidades' })
  @ApiResponse({
    status: 201,
    description: 'Recepción creada exitosamente',
    type: ReceptionResponseDto,
  })
  async createReception(
    @Body() createReceptionDto: CreateReceptionDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<ReceptionResponseDto> {
    const receptionEntity = ReceptionMapper.toEntity(
      createReceptionDto,
      user.companyId!,
    );
    const reception =
      await this.createReceptionUseCase.execute(receptionEntity);
    return ReceptionMapper.toResponseDto(reception);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recepciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recepciones obtenida exitosamente',
    type: [ReceptionResponseDto],
  })
  async getReceptions(
    @CurrentUser('companyId') companyId: string,
    @Query('supplierId') supplierId?: string,
  ): Promise<ReceptionResponseDto[]> {
    // Obtener todas las recepciones - si se proporciona supplierId, filtra por ese proveedor
    const receptions = await this.getReceptionUseCase.executeGetAll(
      companyId,
      supplierId,
    );
    return receptions.map((reception) =>
      ReceptionMapper.toResponseDto(reception),
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las recepciones sin filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de recepciones obtenida exitosamente',
    type: [ReceptionResponseDto],
  })
  async getAllReceptions(
    @CurrentUser('companyId') companyId: string,
  ): Promise<ReceptionResponseDto[]> {
    // Obtener todas las recepciones sin filtros adicionales
    const receptions = await this.getReceptionUseCase.executeGetAll(companyId);
    return receptions.map((reception) =>
      ReceptionMapper.toResponseDto(reception),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una recepción por ID' })
  @ApiResponse({
    status: 200,
    description: 'Recepción encontrada exitosamente',
    type: ReceptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recepción no encontrada',
  })
  async getReceptionById(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
  ): Promise<ReceptionResponseDto> {
    const reception = await this.getReceptionUseCase.execute(id, companyId);
    return ReceptionMapper.toResponseDto(reception);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una muestra por ID' })
  @ApiResponse({
    status: 200,
    description: 'Muestra actualizada exitosamente',
    type: ReceptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Muestra no encontrada',
  })
  async updateSample(
    @Param('id') id: string,
    @Body() updateSampleDto: UpdateSampleDto,
    @CurrentUser('companyId') companyId: string,
  ): Promise<ReceptionResponseDto> {
    // Preparamos los datos a actualizar (solo los campos que realmente se pueden actualizar)
    const updateData: Partial<any> = {
      companyId,
      supplierId: updateSampleDto.supplierId,
      observation: updateSampleDto.observation,
    };

    // Ejecutamos la actualización
    const updatedReception = await this.updateSampleReceptionUseCase.execute(
      id,
      updateData,
    );

    return ReceptionMapper.toResponseDto(updatedReception);
  }

  @Patch('bulk')
  @ApiOperation({
    summary:
      'Actualizar múltiples muestras por filtros (supplier, tipo análisis, peso)',
  })
  @ApiResponse({
    status: 200,
    description: 'Muestras actualizadas exitosamente',
    type: [ReceptionResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron muestras con los criterios especificados',
  })
  async updateSamplesByFilter(
    @Body() updateSampleDto: UpdateSampleDto,
    @CurrentUser('companyId') companyId: string,
  ): Promise<ReceptionResponseDto[]> {
    // Construimos el filtro
    const filter: UpdateSampleFilter = {
      companyId,
      supplierId: updateSampleDto.supplierId,
      analysisTypeIds: updateSampleDto.analysisTypeIds,
      receivedWeight: updateSampleDto.receivedWeight,
    };

    // Preparamos los datos a actualizar - solo el campo observation
    const updateData: Partial<any> = {
      observation: updateSampleDto.observation,
    };

    // Ejecutamos la actualización por filtros
    const updatedReceptions =
      await this.updateSampleReceptionUseCase.executeByFilter(
        filter,
        updateData,
      );

    return updatedReceptions.map((reception) =>
      ReceptionMapper.toResponseDto(reception),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una recepción por ID (soft delete)' })
  @ApiResponse({
    status: 204,
    description: 'Recepción eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Recepción no encontrada',
  })
  async deleteReception(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
  ): Promise<void> {
    // Primero verificamos que la recepción existe y pertenece a la compañía
    await this.getReceptionUseCase.execute(id, companyId);

    // Luego procedemos con la eliminación
    return this.deleteSampleReceptionUseCase.execute(id);
  }
}
