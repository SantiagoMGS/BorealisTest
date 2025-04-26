import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ErrorResponseDto } from '@shared/models/error-response.dto';
import { AssignSuppliersUseCase } from '@domain/use-cases/company-supplier/assign-suppliers.use-case';
import { AssignSuppliersDto, SuppliersAssignmentResultDto } from './dtos';
import { CurrentUser } from '@core/decorators/current-user.decorator';

@ApiTags('Proveedores de la Empresa')
@ApiBearerAuth()
@Controller('company')
@UseInterceptors(ResponseInterceptor)
@RequirePermission(CompanyController.name)
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CompanyController {
  constructor(
    private readonly assignSuppliersUseCase: AssignSuppliersUseCase,
  ) {}

  @Post('assign-suppliers')
  @ApiOperation({ summary: 'Asignar proveedores a la empresa' })
  @ApiBody({
    type: AssignSuppliersDto,
    description: 'Datos para asignar proveedores a la empresa',
  })
  @ApiOkResponse({
    description: 'Resultado del proceso de asignación de proveedores',
    type: SuppliersAssignmentResultDto,
  })
  @ApiBadRequestResponse({
    description:
      'Error en los datos enviados o ningún proveedor pudo ser asignado',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Proceso de asignación de proveedores completado',
  })
  async assignSuppliers(
    @Body() data: AssignSuppliersDto,
    @CurrentUser('companyId') companyId: string,
  ): Promise<SuppliersAssignmentResultDto> {
    const result = await this.assignSuppliersUseCase.execute(data, companyId);

    if (result.allFailed) {
      throw new BadRequestException(
        'Ningún proveedor pudo ser asignado a la empresa',
      );
    }

    return result;
  }
}
