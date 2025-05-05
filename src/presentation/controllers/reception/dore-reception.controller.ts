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
import { CreateDoreReceptionDto, DoreReceptionResponseDto } from './dtos';
import { DoreReceptionMapper } from './mappers';
import { CreateDoreReceptionUseCase } from '@domain/use-cases/reception/create-dore-reception.usecase';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAuthUser } from '@domain/entities/auth';

@ApiTags('Recepciones de Doré')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ResponseInterceptor)
//@RequirePermission(DoreReceptionController.name)
@Controller('dore-receptions')
export class DoreReceptionController {
  constructor(
    private readonly createDoreReceptionUseCase: CreateDoreReceptionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva recepción de doré' })
  @ApiResponse({
    status: 201,
    description: 'Recepción de doré creada exitosamente',
    type: DoreReceptionResponseDto,
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
}
