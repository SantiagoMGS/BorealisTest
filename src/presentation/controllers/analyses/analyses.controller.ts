import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAuthUser } from '@domain/entities/auth/auth-user.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { AnalysesMapper } from './mappers/analyses.mapper';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CreateAnalysesUseCase } from '@domain/use-cases/analyses/create-analyses.usecase';
import { CreateAnalysesDto } from './dtos/create-analyses.dto';

@Controller('analyses')
@UseGuards(JwtAuthGuard)
@ApiTags('Analyses')
export class AnalysesController {
  constructor(
    private readonly createDHAnalysisUseCase: CreateAnalysesUseCase,
  ) {}

  @Post('dh-analyses')
  @RequirePermission('DHAnalyses')
  @ApiOperation({ summary: 'Create a new DH analysis' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Analysis created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company, Analysis Type or Sample not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid analysis data',
  })
  async createDHAnalysis(
    @Body() analysis: CreateAnalysesDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<IAnalysisResponse> {
    const analysisEntity = AnalysesMapper.toEntity(analysis);
    return this.createDHAnalysisUseCase.execute(
      analysisEntity,
      user.companyId!,
    );
  }
}
