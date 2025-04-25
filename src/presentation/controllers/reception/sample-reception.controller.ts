import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReceptionDto, ReceptionResponseDto } from './dtos';
import { ReceptionMapper } from './mappers';
import { CreateReceptionUseCase } from '@domain/use-cases/reception/create-reception.usecase';
import { GetReceptionUseCase } from '@domain/use-cases/reception/get-reception.usecase';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAuthUser } from '@domain/entities/auth';

@ApiTags('Recepciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
//@RequirePermission(SampleReceptionController.name)
@Controller('receptions')
export class SampleReceptionController {
  constructor(
    private readonly createReceptionUseCase: CreateReceptionUseCase,
    private readonly getReceptionUseCase: GetReceptionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva recepción con múltiples unidades' })
  @ApiResponse({
    status: 201,
    description: 'Recepción creada exitosamente',
    type: ReceptionResponseDto,
  })
  async createReception(
    @Body() createReceptionDto: CreateReceptionDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<ReceptionResponseDto> {
    const receptionEntity = ReceptionMapper.toEntity(
      createReceptionDto,
      user.companyId!,
    );
    const reception =
      await this.createReceptionUseCase.execute(receptionEntity);
    return ReceptionMapper.toResponseDto(reception);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recepciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recepciones obtenida exitosamente',
    type: [ReceptionResponseDto],
  })
  async getReceptions(
    @CurrentUser('companyId') companyId: string,
    @Query('supplierId') supplierId?: string,
  ): Promise<ReceptionResponseDto[]> {
    // Obtener todas las recepciones - si se proporciona supplierId, filtra por ese proveedor
    const receptions = await this.getReceptionUseCase.executeGetAll(
      companyId,
      supplierId,
    );
    return receptions.map((reception) =>
      ReceptionMapper.toResponseDto(reception),
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las recepciones sin filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de recepciones obtenida exitosamente',
    type: [ReceptionResponseDto],
  })
  async getAllReceptions(
    @CurrentUser('companyId') companyId: string,
  ): Promise<ReceptionResponseDto[]> {
    // Obtener todas las recepciones sin filtros adicionales
    const receptions = await this.getReceptionUseCase.executeGetAll(companyId);
    return receptions.map((reception) =>
      ReceptionMapper.toResponseDto(reception),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una recepción por ID' })
  @ApiResponse({
    status: 200,
    description: 'Recepción encontrada exitosamente',
    type: ReceptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recepción no encontrada',
  })
  async getReceptionById(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
  ): Promise<ReceptionResponseDto> {
    const reception = await this.getReceptionUseCase.execute(id, companyId);
    return ReceptionMapper.toResponseDto(reception);
  }
}
