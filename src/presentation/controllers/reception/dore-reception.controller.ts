import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  CreateDoreReceptionDto,
  DoreReceptionResponseDto,
  BatchNumberResponseDto,
} from './dtos';
import { DoreReceptionMapper } from './mappers';
import { CreateDoreReceptionUseCase } from '@domain/use-cases/reception/create-dore-reception.usecase';
import { GetNextBatchNumberUseCase } from '@domain/use-cases/reception/get-next-batch-number.usecase';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAuthUser } from '@domain/entities/auth';
import {
  ApiResponseDto,
  getResponseSchema,
} from '@shared/dtos/api-response.dto';

@ApiTags('Recepciones de Doré')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
@RequirePermission(DoreReceptionController.name)
@ApiExtraModels(
  ApiResponseDto,
  DoreReceptionResponseDto,
  BatchNumberResponseDto,
)
@Controller('dore-receptions')
export class DoreReceptionController {
  constructor(
    private readonly createDoreReceptionUseCase: CreateDoreReceptionUseCase,
    private readonly getNextBatchNumberUseCase: GetNextBatchNumberUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva recepción de doré' })
  @ApiResponse({
    status: 201,
    description: 'Recepción de doré creada exitosamente',
    ...getResponseSchema(DoreReceptionResponseDto),
  })
  async createDoreReception(
    @Body() createDoreReceptionDto: CreateDoreReceptionDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<DoreReceptionResponseDto> {
    const receptionEntity = DoreReceptionMapper.toEntity(
      createDoreReceptionDto,
      user.companyId!,
    );
    const reception =
      await this.createDoreReceptionUseCase.execute(receptionEntity);
    return DoreReceptionMapper.toResponseDto(reception);
  }

  @Get('supplier/:supplierId/next-batch-number')
  @ApiOperation({
    summary: 'Obtener el siguiente número de lote para un proveedor',
  })
  @ApiResponse({
    status: 200,
    description: 'Número de lote siguiente',
    ...getResponseSchema(BatchNumberResponseDto),
  })
  async getNextBatchNumber(
    @Param('supplierId', ParseUUIDPipe) supplierId: string,
  ): Promise<{ batchNumber: string }> {
    const nextBatchNumber =
      await this.getNextBatchNumberUseCase.execute(supplierId);
    return { batchNumber: nextBatchNumber };
  }
}
