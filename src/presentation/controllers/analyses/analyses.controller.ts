import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  Req,
  BadRequestException,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAuthUser } from '@domain/entities/auth/auth-user.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { AnalysesMapper } from './mappers/analyses.mapper';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { CreateDHAnalysesUseCase } from '@domain/use-cases/analyses/create-dh-analyses.usecase';
import { CreateDHAnalysesDto } from './dtos/create-dh-analyses.dto';
import { CreateXRFAnalysesUseCase } from '@domain/use-cases/analyses/create-xrf-analyses.usecase';
import { CreateXRFAnalysesDto } from './dtos/create-xrf-analyses.dto';
import { FastifyRequest } from 'fastify';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ErrorResponseDto } from '@shared/models/error-response.dto';
import { CreateLWAnalysesDto } from './dtos/create-lw-analyses.dto';
import { createLWAnalysisUseCase } from '@domain/use-cases/analyses/create-lw-analyses-use-case';
import { LWResponse } from './dtos/response-lw-analyses.dto';
import { DHResponse } from './dtos/response-dh-analyses.dto';
import { XRFResponse } from './dtos/response-xrf-analyses.dto';
import { CreateAAAnalysesDto } from './dtos/create-aa-analyses.dto';
import {
  CreateAAAnalysesUseCase,
  ICreateAAAnalysisData,
} from '@domain/use-cases/analyses/create-aa-analyses.use-case';
import { ResponseAAAnalysesDto } from './dtos/response-aa-analyses.dto';
import { GetActiveLWAnalysesUseCase } from '@domain/use-cases/analyses/get-active-lw-analyses.use-case';
@Controller('analyses')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
@ApiTags('Análisis')
@ApiBearerAuth()
export class AnalysesController {
  constructor(
    private readonly createDHAnalysisUseCase: CreateDHAnalysesUseCase,
    private readonly createXRFAnalysisUseCase: CreateXRFAnalysesUseCase,
    private readonly createLWAnalysisUseCase: createLWAnalysisUseCase,
    private readonly createAAAnalysisUseCase: CreateAAAnalysesUseCase,
    private readonly getActiveLWAnalysesUseCase: GetActiveLWAnalysesUseCase,
  ) {}

  @Get('active-leachwell')
  @RequirePermission('LWAnalyses')
  @ApiOperation({
    summary: 'Obtener análisis LW activos',
    description: 'Obtiene los análisis LW activos en el sistema',
  })
  @CustomResponse({
    successMessage: 'Análisis LW activos obtenidos exitosamente',
  })
  async getActiveLWAnalyses(): Promise<any> {
    return this.getActiveLWAnalysesUseCase.execute();
  }

  @Post('moisture-determination')
  @RequirePermission('DHAnalyses')
  @ApiOperation({
    summary: 'Crear nuevo análisis DH',
    description:
      'Crea un nuevo análisis de tipo Diamond Hole (DH) en el sistema',
  })
  @ApiBody({
    type: CreateDHAnalysesDto,
    description: 'Datos necesarios para obtener la determinación de humedad',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Determinación de Humedad creada exitosamente',
    type: DHResponse,
  })
  @ApiBadRequestResponse({
    description: 'Datos de análisis inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Determinación de Humedad creada exitosamente',
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
  @ApiOperation({
    summary: 'Crear nuevo análisis XRF',
    description:
      'Crea un nuevo análisis de tipo X-Ray Fluorescence (XRF) en el sistema a partir de un archivo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['sampleId', 'analysisDate', 'file'],
      properties: {
        sampleId: {
          type: 'string',
          format: 'uuid',
          description: 'ID de la muestra a analizar',
        },
        analysisDate: {
          type: 'string',
          format: 'date',
          description: 'Fecha en que se realizó el análisis (YYYY-MM-DD)',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo con los datos del análisis XRF',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Análisis XRF creado exitosamente',
    type: XRFResponse,
  })
  @ApiBadRequestResponse({
    description: 'Datos de análisis o archivo inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Análisis XRF creado exitosamente',
  })
  async createXRFAnalysis(
    @Req() request: FastifyRequest,
    @CurrentUser() user: IAuthUser,
  ): Promise<IAnalysisResponse> {
    const body = request.body as CreateXRFAnalysesDto;
    return this.createXRFAnalysisUseCase.execute(body, user.companyId!);
  }

  @Post('leachwell')
  @RequirePermission('LWAnalyses')
  @ApiOperation({
    summary: 'Crear nuevo análisis LW',
    description:
      'Crea un nuevo análisis de tipo Lineal Weight (LW) en el sistema',
  })
  @ApiBody({
    type: CreateLWAnalysesDto,
    description: 'Datos necesarios para crear el análisis LW',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Análisis LW creado correctamente',
    type: LWResponse,
  })
  @ApiBadRequestResponse({
    description: 'Datos de análisis inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Análisis LW creado exitosamente',
  })
  async createLWAnalysis(
    @Body() analysis: CreateLWAnalysesDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<IAnalysisResponse> {
    const analysisEntity = AnalysesMapper.toEntityLW(analysis);
    return this.createLWAnalysisUseCase.execute(
      analysisEntity,
      user.companyId!,
    );
  }

  @Post('aa-analyses')
  // @RequirePermission('AAAnalyses')
  @ApiOperation({
    summary: 'Crear nuevo análisis AA',
    description:
      'Crea un nuevo análisis de Absorción Atómica (AA) en el sistema',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['sampleId', 'analysisDate', 'file'],
      properties: {
        sampleId: {
          type: 'string',
          format: 'uuid',
          description: 'ID de la muestra a analizar',
        },
        analysisDate: {
          type: 'string',
          format: 'date',
          description: 'Fecha en que se realizó el análisis (YYYY-MM-DD)',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo con los datos del análisis AA',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Análisis AA creado correctamente',
    type: ResponseAAAnalysesDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de análisis o archivo inválidos',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Análisis AA creado exitosamente',
  })
  async createAAAnalysis(
    @Req() request: FastifyRequest,
    @CurrentUser() user: IAuthUser,
  ): Promise<IAnalysisResponse[]> {
    return this.createAAAnalysisUseCase.execute(
      request.body as ICreateAAAnalysisData,
      user.companyId!,
    );
  }
}
