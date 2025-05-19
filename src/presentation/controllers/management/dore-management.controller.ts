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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindDoreReceptionsByFiltersUseCase } from '@domain/use-cases/reception';
import {
  DoreDropdownResponseDto,
  FindDoreReceptionsByFiltersDto,
  DoreReceptionItemDto,
} from './dtos';

import { GetDoreDropdownDataUseCase } from '@domain/use-cases/management';
import { IDoreManagementResponse } from '@domain/interfaces/management/dore-management.interface';
import { IPaginatedData } from '@shared/index';
import { DropdownDataDto } from '@shared/dtos/get-dropdown-data.dto';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '@core/decorators/api-responses.decorator';

@ApiTags('Gestion Recepciones de Doré')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(DoreManagementController.name)
@Controller('dore-management')
export class DoreManagementController {
  constructor(
    private readonly getDoreDropdownDataUseCase: GetDoreDropdownDataUseCase,
    private readonly findDoreReceptionsByFiltersUseCase: FindDoreReceptionsByFiltersUseCase,
  ) {}

  @Get('dropdown-data')
  @ApiOperation({
    summary: 'Obtener datos para poblar los dropdowns de la UI de doré',
  })
  @ApiSuccessResponse(
    200,
    'Datos obtenidos correctamente',
    DoreDropdownResponseDto,
  )
  async getDropdownData(
    @Query() queryParams: DropdownDataDto,
  ): Promise<DoreDropdownResponseDto> {
    const dropdownData = await this.getDoreDropdownDataUseCase.execute(
      queryParams.startDate,
      queryParams.endDate,
    );

    return dropdownData;
  }

  @Get('find-by-filters')
  @ApiOperation({
    summary:
      'Buscar recepciones de doré aplicando filtros combinados (logica &)',
  })
  @ApiPaginatedResponse(
    'Recepciones encontradas correctamente',
    DoreReceptionItemDto,
  )
  async findByFilters(
    @Query() filterParams: FindDoreReceptionsByFiltersDto,
  ): Promise<IPaginatedData<IDoreManagementResponse>> {
    return this.findDoreReceptionsByFiltersUseCase.execute(filterParams);
  }
}
