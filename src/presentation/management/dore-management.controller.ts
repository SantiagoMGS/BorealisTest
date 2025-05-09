import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import {
  UseGuards,
  UseInterceptors,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  GetDoreDropdownDataUseCase,
  FindDoreReceptionsByFiltersUseCase,
} from '@domain/use-cases/reception';
import {
  GetDoreDropdownDataDto,
  DoreDropdownResponseDto,
  FindDoreReceptionsByFiltersDto,
  DoreReceptionPaginatedResponseDto,
} from './dtos';
import { Paginated } from '@core/decorators/paginated.decorator';
import {
  ApiResponseDto,
  getResponseSchema,
} from '@shared/dtos/api-response.dto';

@ApiTags('Gestion Recepciones de Doré')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(DoreManagementController.name)
@ApiExtraModels(
  ApiResponseDto,
  DoreDropdownResponseDto,
  DoreReceptionPaginatedResponseDto,
)
@Controller('dore-receptions')
export class DoreManagementController {
  constructor(
    private readonly getDoreDropdownDataUseCase: GetDoreDropdownDataUseCase,
    private readonly findDoreReceptionsByFiltersUseCase: FindDoreReceptionsByFiltersUseCase,
  ) {}

  @Get('dropdown-data')
  @ApiOperation({
    summary: 'Obtener datos para poblar los dropdowns de la UI de doré',
    description:
      'Devuelve listas de proveedores, dorés, números de lote y orígenes de recepción',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos obtenidos correctamente',
    ...getResponseSchema(DoreDropdownResponseDto),
  })
  async getDropdownData(
    @Query() queryParams: GetDoreDropdownDataDto,
  ): Promise<DoreDropdownResponseDto> {
    // Obtener los datos para los dropdowns
    const dropdownData = await this.getDoreDropdownDataUseCase.execute(
      queryParams.startDate,
      queryParams.endDate,
    );

    return {
      data: dropdownData,
    };
  }

  @Get('find-by-filters')
  @Paginated()
  @ApiOperation({
    summary: 'Buscar recepciones de doré aplicando filtros',
    description:
      'Devuelve una lista paginada de recepciones de doré que cumplen con los filtros especificados',
  })
  @ApiResponse({
    status: 200,
    description: 'Recepciones encontradas correctamente',
    ...getResponseSchema(DoreReceptionPaginatedResponseDto),
  })
  async findByFilters(@Query() filterParams: FindDoreReceptionsByFiltersDto) {
    return await this.findDoreReceptionsByFiltersUseCase.execute({
      page: filterParams.page || 1,
      limit: filterParams.limit || 10,
      startDate: filterParams.startDate,
      endDate: filterParams.endDate,
      supplierIds: filterParams.supplierIds,
      receptionOriginIds: filterParams.receptionOriginIds,
      doreIds: filterParams.doreIds,
      batchNumbers: filterParams.batchNumbers,
    });
  }
}
