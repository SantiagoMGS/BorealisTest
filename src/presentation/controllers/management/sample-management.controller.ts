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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { FindSampleByFiltersDto, SampleDropdownResponseDto } from './dtos';
import {
  FindSamplesByFiltersUseCase,
  GetSampleDropdownDataUseCase,
} from '@domain/use-cases/management';

import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { IPaginatedData } from '@shared/index';
import { MappedSamples } from '@infrastructure/mappers/sample-management.mapper';
import { DropdownDataDto } from '@shared/dtos/get-dropdown-data.dto';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '@core/decorators/api-responses.decorator';
import { MappedSampleDto } from './dtos/mapped-sample.dto';

@ApiTags('Sample Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(SampleManagementController.name)
@Controller('sample-management')
export class SampleManagementController {
  constructor(
    private readonly getSampleDropdownDataUseCase: GetSampleDropdownDataUseCase,
    private readonly findSamplesByFiltersUseCase: FindSamplesByFiltersUseCase,
  ) {}

  @Get('dropdown-data')
  @ApiOperation({
    summary: 'Obtener datos para poblar los dropdowns de la UI de muestras',
  })
  @ApiSuccessResponse(
    200,
    'Datos obtenidos correctamente',
    SampleDropdownResponseDto,
  )
  @ApiNoContentResponse()
  async getDropdownData(
    @Query() queryParams: DropdownDataDto,
  ): Promise<SampleDropdownResponseDto> {
    const dropdownData = await this.getSampleDropdownDataUseCase.execute(
      queryParams.startDate,
      queryParams.endDate,
    );

    return dropdownData;
  }

  @Get('find-by-filters')
  @ApiOperation({
    summary: 'Buscar muestras aplicando filtros combinados (logica &)',
  })
  @ApiPaginatedResponse('Muestras encontradas correctamente', MappedSampleDto)
  @ApiNoContentResponse()
  async findByFilters(
    @Query() filterParams: FindSampleByFiltersDto,
  ): Promise<IPaginatedData<MappedSamples>> {
    return this.findSamplesByFiltersUseCase.execute(filterParams);
  }
}
