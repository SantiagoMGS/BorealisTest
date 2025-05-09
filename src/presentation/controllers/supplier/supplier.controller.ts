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
  HttpException,
  HttpStatus,
  Query,
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
  ApiNoContentResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CreateSupplierUseCase } from '@domain/use-cases/supplier';
import {
  CreateSupplierDto,
  SupplierResponseDto,
  UpdateSupplierDto,
  MiningTitleResponseDto,
  SupplierPaginatedResponseDto,
} from './dtos';
import { ErrorResponseDto } from '../auth/dtos';
import { SupplierMapper, MiningTitleMapper } from './mappers';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { IAuthUser } from '@domain/entities/auth';
import { AllSupplierResponseDto } from './dtos/all-supplier.response.dto';
import { FindAllSupplierUseCase } from '@domain/use-cases/supplier/find-all-supplier.use-case';
import { FindSupplierUseCase } from '@domain/use-cases/supplier/find-supplier.use-case';
import { UpdateSupplierUseCase } from '@domain/use-cases/supplier/update-supplier.use-case';
import { DeleteSupplierUseCase } from '@domain/use-cases/supplier/delete-supplier.use-case';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { FindMiningTitlesUseCase } from '@domain/use-cases/supplier/find-mining-title.use-case';
import {
  ApiResponseDto,
  getResponseSchema,
  getArrayResponseSchema,
} from '@shared/dtos/api-response.dto';
import { Paginated } from '@core/decorators/paginated.decorator';
import { PaginationDto } from '@shared/dtos/paginator.dto';

@ApiTags('Proveedores')
@ApiBearerAuth()
@Controller('suppliers')
@UseInterceptors(ResponseInterceptor)
@RequirePermission(SupplierController.name)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiExtraModels(
  ApiResponseDto,
  SupplierResponseDto,
  MiningTitleResponseDto,
  SupplierPaginatedResponseDto,
  ErrorResponseDto,
)
export class SupplierController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly findAllSupplierUseCase: FindAllSupplierUseCase,
    private readonly findSupplierUseCase: FindSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
    private readonly findMiningTitlesUseCase: FindMiningTitlesUseCase,
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
    ...getResponseSchema(SupplierResponseDto),
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
  @Paginated()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los proveedores (paginado)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de proveedores',
    ...getResponseSchema(SupplierPaginatedResponseDto),
  })
  @CustomResponse({
    successMessage: 'Proveedores obtenidos exitosamente',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    // Asegurar valores por defecto para page y limit
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
      withDeleted: paginationDto.withDeleted || false,
    };
    return await this.findAllSupplierUseCase.executePaginated(options);
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
    ...getResponseSchema(SupplierResponseDto),
  })
  @CustomResponse({
    successMessage: 'Proveedor encontrado exitosamente',
  })
  async findById(@Param('id') id: string): Promise<SupplierResponseDto> {
    // No es la mejor práctica tener la regex directamente en el controlador
    // TODO: Mover esta validación a un servicio de utilidad o usar una librería como 'uuid'
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const params = uuidRegex.test(id) ? { id } : { documentNumber: id };

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
    ...getResponseSchema(SupplierResponseDto),
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
    ...getResponseSchema(SupplierResponseDto),
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

  @Get('mining-titles/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener los títulos mineros de un proveedor',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del proveedor',
  })
  @ApiResponse({
    status: 200,
    description: 'Títulos mineros encontrados',
    ...getArrayResponseSchema(MiningTitleResponseDto),
  })
  @ApiNoContentResponse({
    description: 'No se encontraron títulos mineros para el proveedor',
  })
  @CustomResponse({
    successMessage: 'Títulos mineros encontrados exitosamente',
  })
  async findMiningTitles(
    @Param('id') id: string,
  ): Promise<MiningTitleResponseDto[]> {
    const miningTitles = await this.findMiningTitlesUseCase.execute(id);

    if (miningTitles.length === 0) {
      return [];
    }

    return MiningTitleMapper.toResponseDtoList(miningTitles);
  }
}
