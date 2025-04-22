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
import { CreateSupplierUseCase } from '@domain/use-cases/supplier';
import { CreateSupplierDto, SupplierResponseDto } from './dtos';
import { ErrorResponseDto } from '@shared/models/error-response.dto';
import { SupplierMapper } from './mappers';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { IAuthUser } from '@domain/entities/auth';

@ApiTags('Proveedores')
@Controller('suppliers')
@UseInterceptors(ResponseInterceptor)
export class SupplierController {
  constructor(private readonly createSupplierUseCase: CreateSupplierUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateSupplierDto,
    description: 'Datos del proveedor a crear',
  })
  @ApiCreatedResponse({
    description: 'Proveedor creado exitosamente',
    type: SupplierResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Proveedor creado exitosamente',
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<SupplierResponseDto> {
    // Convertir DTO a entidad de dominio
    const supplierEntity = SupplierMapper.toEntity(createSupplierDto);

    // Ejecutar caso de uso
    const result = await this.createSupplierUseCase.execute(
      supplierEntity,
      user.id,
    );

    // Convertir resultado a DTO de respuesta
    return SupplierMapper.toResponseDto(result);
  }
}
