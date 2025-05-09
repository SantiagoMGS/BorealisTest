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
} from '@nestjs/swagger';
import { GetDoreDropdownDataUseCase } from '@domain/use-cases/reception';
import { GetDoreDropdownDataDto } from './dtos/get-dore-dropdown-data.dto';
import { DoreDropdownResponseDto } from './dtos/dore-dropdown-response.dto';

@ApiTags('Gestion Recepciones de Doré')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(DoreManagementController.name)
@Controller('dore-receptions')
export class DoreManagementController {
  constructor(
    private readonly getDoreDropdownDataUseCase: GetDoreDropdownDataUseCase,
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
    type: DoreDropdownResponseDto,
  })
  async getDropdownData(
    @Query() queryParams: GetDoreDropdownDataDto,
  ): Promise<DoreDropdownResponseDto> {
    // Establecer fechas por defecto si no se proporcionan
    const startDate =
      queryParams.startDate || new Date(new Date().getFullYear(), 0, 1);
    const endDate = queryParams.endDate || new Date();

    return await this.getDoreDropdownDataUseCase.execute(startDate, endDate);
  }
}
