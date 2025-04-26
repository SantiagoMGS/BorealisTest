import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ErrorResponseDto } from '@shared/models/error-response.dto';
import { AssignSuppliersUseCase } from '@domain/use-cases/company-supplier/assign-suppliers.use-case';
import { AssignSuppliersDto } from './dtos';

@ApiTags('Proveedores de la Empresa')
@ApiBearerAuth()
@Controller('company-suppliers')
@UseInterceptors(ResponseInterceptor)
//@RequirePermission(CompanySupplierController.name)
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CompanyController {
  constructor(
    private readonly assignSuppliersUseCase: AssignSuppliersUseCase,
  ) {}

  @Post('assign')
  @ApiOperation({ summary: 'Asignar proveedores a la empresa' })
  @ApiBody({
    type: AssignSuppliersDto,
    description: 'Datos para asignar proveedores a la empresa',
  })
  @ApiCreatedResponse({
    description: 'Proveedores asignados exitosamente',
  })
  @ApiBadRequestResponse({
    description: 'Error en los datos enviados',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @CustomResponse({ successMessage: 'Proveedores asignados exitosamente' })
  async assignSuppliers(@Body() data: AssignSuppliersDto): Promise<void> {
    await this.assignSuppliersUseCase.execute(data);
  }
}
