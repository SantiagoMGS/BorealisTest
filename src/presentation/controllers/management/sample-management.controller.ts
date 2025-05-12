import { Controller, Get, Query } from '@nestjs/common';
import { DropdownDataDto, SampleDropdownDataDto } from './dtos';
import { GetSampleDropdownDataUseCase } from '@domain/use-cases/manegement/get-sample-dropdown-data.usecase';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-management.interface';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  getResponseSchema,
} from '@shared/dtos/api-response.dto';

@ApiTags('Gestión de muestras')
@Controller('sample-management')
@ApiExtraModels(ApiResponseDto, SampleDropdownDataDto)
export class SampleManagementController {
  constructor(
    private readonly getSampleDropdownDataUseCase: GetSampleDropdownDataUseCase,
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
}
