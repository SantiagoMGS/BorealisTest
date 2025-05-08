import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import {
  CreateDoreReceptionUseCase,
  FindDoreReceptionsByDateRangeUseCase,
} from '@domain/use-cases/reception';
import { GetNextBatchNumberUseCase } from '@domain/use-cases/reception/get-next-batch-number.usecase';
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

@ApiTags('Gestion Recepciones de Doré')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(DoreManagementController.name)
@Controller('dore-receptions')
export class DoreManagementController {
  constructor() {}
  @Get('filter')
  @ApiOperation({ summary: 'Filtrar recepciones de doré por rango de fechas' })
  @ApiResponse({
    status: 200,
    description: 'Recepciones filtradas y proveedores asociados',
  })
  async findByDateRange(): Promise<any> {
    return '';
  }
}
