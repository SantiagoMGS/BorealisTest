import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAuthUser } from '@domain/entities/auth/auth-user.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AnalysesMapper } from './mappers/analyses.mapper';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CreateDHAnalysesUseCase } from '@domain/use-cases/analyses/create-dh-analyses.usecase';
import { CreateDHAnalysesDto } from './dtos/create-dh-analyses.dto';
import { CreateXRFAnalysesUseCase } from '@domain/use-cases/analyses/create-xrf-analyses.usecase';
import { CreateXRFAnalysesDto } from './dtos/create-xrf-analyses.dto';
import { FastifyRequest } from 'fastify';
import * as XLSX from 'xlsx';

@Controller('analyses')
@UseGuards(JwtAuthGuard)
@ApiTags('Analyses')
export class AnalysesController {
  constructor(
    private readonly createDHAnalysisUseCase: CreateDHAnalysesUseCase,
    private readonly createXRFAnalysisUseCase: CreateXRFAnalysesUseCase,
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
    @Body() analysis: CreateDHAnalysesDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<IAnalysisResponse> {
    const analysisEntity = AnalysesMapper.toEntityDH(analysis);
    return this.createDHAnalysisUseCase.execute(
      analysisEntity,
      user.companyId!,
    );
  }

  @Post('xrf-analyses')
  @RequirePermission('XRFAnalyses')
  @ApiOperation({ summary: 'Create a new XRF analysis' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sampleId: { type: 'string', format: 'uuid' },
        analysisDate: { type: 'string', format: 'date' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  async createXRFAnalysis(
    @Req() request: FastifyRequest,
    @CurrentUser() user: IAuthUser,
  ): Promise<IAnalysisResponse> {
    const body = request.body as CreateXRFAnalysesDto;
    return this.createXRFAnalysisUseCase.execute(body, user.companyId!);
  }
}
