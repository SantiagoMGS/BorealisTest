import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DropdownDataDto, SampleDropdownDataDto } from './dtos';
import { GetSampleDropdownDataUseCase } from '@domain/use-cases/management/get-sample-dropdown-data.usecase';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-management.interface';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  getResponseSchema,
} from '@shared/dtos/api-response.dto';
import { PaginatedResult } from '@shared/dtos/paginator.dto';
import { FindSampleByFiltersDto } from './dtos/find-samples-by-filters.dto';
import { FindSamplesByFiltersUseCase } from '@domain/use-cases/management/find-samples-by-filters.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { Paginated } from '@core/decorators/paginated.decorator';
import { SamplePaginatedResponseDto } from './dtos/sample-paginated-response.dto';

@ApiTags('Gestión de muestras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(SampleManagementController.name)
@Controller('sample-management')
@ApiExtraModels(
  ApiResponseDto,
  SampleDropdownDataDto,
  SamplePaginatedResponseDto,
)
export class SampleManagementController {
  constructor(
    private readonly getSampleDropdownDataUseCase: GetSampleDropdownDataUseCase,
    private readonly findSamplesByFiltersUseCase: FindSamplesByFiltersUseCase,
  ) {}

  @Get('dropdown-data')
  @ApiOperation({
    summary: 'Obtener datos para los dropdown de gestión de muestras',
    description:
      'Retorna proveedores, muestras y orígenes de recepción en el rango de fechas especificado',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos obtenidos correctamente',
    ...getResponseSchema(SampleDropdownDataDto),
  })
  async getDropdownData(
    @Query() queryParams: DropdownDataDto,
  ): Promise<ISampleDropdownData> {
    const dropdownData = await this.getSampleDropdownDataUseCase.execute(
      queryParams.startDate,
      queryParams.endDate,
    );
    return dropdownData;
  }

  @Get('find-by-filters')
  @Paginated()
  @ApiOperation({
    summary: 'Buscar muestras según filtros',
    description:
      'Retorna muestras paginadas filtradas por los criterios especificados',
  })
  @ApiResponse({
    status: 200,
    description: 'Muestras encontradas correctamente',
    ...getResponseSchema(SamplePaginatedResponseDto),
  })
  async findByFilters(@Query() filterParams: FindSampleByFiltersDto) {
    return await this.findSamplesByFiltersUseCase.execute({
      startDate: filterParams.startDate,
      endDate: filterParams.endDate,
      supplierIds: filterParams.supplierIds,
      receptionOriginIds: filterParams.receptionOriginIds,
      sampleIds: filterParams.sampleIds,
      page: filterParams.page || 1,
      limit: filterParams.limit || 10,
    });
  }
}
