import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CreateSupplierUseCase } from '@domain/use-cases/supplier';
import {
  CreateSupplierDto,
  SupplierResponseDto,
  UpdateSupplierDto,
} from './dtos';
import { ErrorResponseDto } from '../auth/dtos';
import { SupplierMapper } from './mappers';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { IAuthUser } from '@domain/entities/auth';
import { AllSupplierResponseDto } from './dtos/all-supplier.response.dto';
import { FindAllSupplierUseCase } from '@domain/use-cases/supplier/find-all-supplier.use-case';
import { FindSupplierUseCase } from '@domain/use-cases/supplier/find-supplier.use-case';
import { UpdateSupplierUseCase } from '@domain/use-cases/supplier/update-supplier.use-case';
import { DeleteSupplierUseCase } from '@domain/use-cases/supplier/delete-supplier.use-case';
import { isUUID } from 'class-validator';
import { ISupplierResponse } from '@domain/interfaces/supplier';
@ApiTags('Proveedores')
@Controller('suppliers')
@UseInterceptors(ResponseInterceptor)
export class SupplierController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly findAllSupplierUseCase: FindAllSupplierUseCase,
    private readonly findSupplierUseCase: FindSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
  ) {}

  // Crear un nuevo proveedor
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

  // Obtener todos los proveedores
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Perfil de los proveedores',
    type: AllSupplierResponseDto,
  })
  @CustomResponse({
    successMessage: 'Proveedores obtenidos exitosamente',
  })
  async findAll(): Promise<AllSupplierResponseDto> {
    const suppliers = await this.findAllSupplierUseCase.execute();
    return { suppliers: suppliers.map(SupplierMapper.toResponseDto) };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener un proveedor por ID o número de documento',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID o número de documento del proveedor',
  })
  @ApiResponse({
    status: 200,
    description: 'Proveedor encontrado',
    type: SupplierResponseDto,
  })
  @CustomResponse({
    successMessage: 'Proveedor encontrado exitosamente',
  })
  async findById(@Param('id') id: string): Promise<SupplierResponseDto> {
    const params = isUUID(id) ? { id } : { documentNumber: id };
    const supplier = await this.findSupplierUseCase.execute(params);
    return SupplierMapper.toResponseDto(supplier);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  @ApiParam({ name: 'id', type: String, description: 'ID del proveedor' })
  @ApiBody({
    type: UpdateSupplierDto,
    description: 'Datos del proveedor a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado exitosamente',
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
    successMessage: 'Proveedor actualizado exitosamente',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<SupplierResponseDto> {
    const supplier = await this.updateSupplierUseCase.execute(
      id,
      updateSupplierDto,
      user.id,
    );
    return SupplierMapper.toResponseDto(supplier);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar un proveedor (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'ID del proveedor' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor eliminado exitosamente',
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
    successMessage: 'Proveedor eliminado exitosamente',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IAuthUser,
  ): Promise<SupplierResponseDto> {
    const supplier = await this.deleteSupplierUseCase.execute(id, user.id);
    return SupplierMapper.toResponseDto(supplier);
  }
}
