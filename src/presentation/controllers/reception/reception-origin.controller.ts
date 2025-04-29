import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { DefaultAnalysisResponseDto } from './dtos';
import { GetDefaultAnalysisUseCase } from '@domain/use-cases/reception/get-default-analysis.usecase';

@ApiTags('Orígenes de Recepción')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(ReceptionOriginController.name)
@Controller('reception-origins')
export class ReceptionOriginController {
  constructor(
    private readonly getDefaultAnalysisUseCase: GetDefaultAnalysisUseCase,
  ) {}

  @Get('default-analysis/:originId')
  @ApiOperation({
    summary: 'Obtener análisis por defecto para un origen de recepción',
    description:
      'Devuelve la lista de análisis por defecto que se deben realizar para un origen de recepción específico. Estos análisis vienen preseleccionados para facilitar el proceso de registro.',
  })
  @ApiParam({
    name: 'originId',
    type: 'string',
    description: 'ID único del origen de recepción (UUID)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({
    description: 'Lista de análisis por defecto obtenida correctamente',
    type: [DefaultAnalysisResponseDto],
  })
  async getDefaultAnalysisByOrigin(
    @Param('originId') originId: string,
  ): Promise<DefaultAnalysisResponseDto[]> {
    return this.getDefaultAnalysisUseCase.execute(originId);
  }
}
import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import {
  DefaultAnalysisResponseDto,
  SupplierByOriginResponseDto,
} from './dtos';
import { GetDefaultAnalysisUseCase } from '@domain/use-cases/reception/get-default-analysis.usecase';
import { GetSuppliersByOriginUseCase } from '@domain/use-cases/reception/get-suppliers-by-origin.usecase';

@ApiTags('Orígenes de Recepción')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
//@RequirePermission(ReceptionOriginController.name)
@Controller('reception-origins')
export class ReceptionOriginController {
  constructor(
    private readonly getDefaultAnalysisUseCase: GetDefaultAnalysisUseCase,
    private readonly getSuppliersByOriginUseCase: GetSuppliersByOriginUseCase,
  ) {}

  @Get('default-analysis/:originId')
  @ApiOperation({
    summary: 'Obtener análisis por defecto para un origen de recepción',
    description:
      'Devuelve la lista de análisis por defecto que se deben realizar para un origen de recepción específico',
  })
  @ApiParam({
    name: 'originId',
    type: 'string',
    description: 'ID del origen de recepción',
  })
  @ApiOkResponse({
    description: 'Lista de análisis por defecto obtenida correctamente',
    type: [DefaultAnalysisResponseDto],
  })
  async getDefaultAnalysisByOrigin(
    @Param('originId') originId: string,
  ): Promise<DefaultAnalysisResponseDto[]> {
    return this.getDefaultAnalysisUseCase.execute(originId);
  }

  @Get('suppliers-by-reception-origin/:originId')
  @ApiOperation({
    summary: 'Obtener proveedores por origen de recepción',
    description:
      'Devuelve la lista de proveedores asociados a un origen de recepción específico',
  })
  @ApiParam({
    name: 'originId',
    type: 'string',
    description: 'ID del origen de recepción',
  })
  @ApiOkResponse({
    description: 'Lista de proveedores obtenida correctamente',
    type: [SupplierByOriginResponseDto],
  })
  async getSuppliersByOrigin(
    @Param('originId') originId: string,
  ): Promise<SupplierByOriginResponseDto[]> {
    return this.getSuppliersByOriginUseCase.execute(originId);
  }
}
