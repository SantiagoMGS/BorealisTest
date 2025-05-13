import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import {
  FindSampleByFiltersDto,
  DropdownDataDto,
  SampleDropdownDataDto,
  SamplePaginatedResponseDto,
} from './dtos';
import { Paginated } from '@core/decorators/paginated.decorator';
import {
  FindSamplesByFiltersUseCase,
  GetSampleDropdownDataUseCase,
} from '@domain/use-cases/management';
import {
  ApiResponseDto,
  getResponseSchema,
} from '@shared/dtos/api-response.dto';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { IPaginatedData } from '@shared/index';
import { ISampleManagementResponse } from '@domain/interfaces/management/sample-management.interface';

@ApiTags('Sample Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(SampleManagementController.name)
@ApiExtraModels(
  ApiResponseDto,
  SampleDropdownDataDto,
  SamplePaginatedResponseDto,
)
@Controller('sample-management')
export class SampleManagementController {
  constructor(
    private readonly getSampleDropdownDataUseCase: GetSampleDropdownDataUseCase,
    private readonly findSamplesByFiltersUseCase: FindSamplesByFiltersUseCase,
  ) {}

  @Get('dropdown-data')
  @ApiOperation({
    summary: 'Obtener datos para poblar los dropdowns de la UI',
    description: 'Devuelve listas de proveedores, muestras y orígenes',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos obtenidos correctamente',
    ...getResponseSchema(SampleDropdownDataDto),
  })
  async getDropdownData(
    @Query() queryParams: DropdownDataDto,
  ): Promise<SampleDropdownDataDto> {
    const dropdownData = await this.getSampleDropdownDataUseCase.execute(
      queryParams.startDate,
      queryParams.endDate,
    );

    return dropdownData;
  }

  @Get('find-by-filters')
  @Paginated()
  @ApiOperation({
    summary: 'Buscar muestras aplicando filtros',
    description:
      'Devuelve una lista paginada de muestras que cumplen con los filtros especificados',
  })
  @ApiResponse({
    status: 200,
    description: 'Muestras encontradas correctamente',
    ...getResponseSchema(SamplePaginatedResponseDto),
  })
  async findByFilters(
    @Query() filterParams: FindSampleByFiltersDto,
  ): Promise<IPaginatedData<ISampleManagementResponse>> {
    return await this.findSamplesByFiltersUseCase.execute({
      page: filterParams.page || 1,
      limit: filterParams.limit || 10,
      startDate: filterParams.startDate,
      endDate: filterParams.endDate,
      supplierIds: filterParams.supplierIds,
      receptionOriginIds: filterParams.receptionOriginIds,
      sampleIds: filterParams.sampleIds,
    });
  }
}
