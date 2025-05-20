import { PrismaService } from '@core/prisma/prisma.service';
import {
  IAnalysisEntity,
  ResultValueAA,
  ResultValueDH,
  ResultValueLW,
  ResultValueXRF,
} from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SampleReceptionDataSourceService } from '../reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { AnalysisTypeDatasourceService } from '../analysis-type/analysis-type.datasorce.service';
import { IPaginationOptions } from '@shared/interfaces/pagination.interfaces';
import { ActiveAnalysis } from '@domain/entities/analyses/active-analysis.entity';
import { Prisma } from '@prisma/client';
import { UpdateLWAnalysis } from '@domain/entities/analyses/update-lw-analysis.entity';

@Injectable()
export class AnalysesDatasourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sampleDataSource: SampleReceptionDataSourceService,
    private readonly companyDataSource: CompanyDataSourceService,
    private readonly analysisTypeDatasource: AnalysisTypeDatasourceService,
  ) {}

  async createDHAnalyses(
    analysisData: IAnalysisEntity,
  ): Promise<Prisma.AnalysisGetPayload<{}>> {
    try {
      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          analysisDate: analysisData.analysisDate,
          resultValue: analysisData.resultValue as ResultValueDH,
          analysisType: { connect: { id: analysisData.analysisTypeId! } },
          sample: { connect: { id: analysisData.sampleId } },
        },
      });

      return createdAnalysis;
    } catch (error) {
      throw new BadRequestException(
        'Error al crear el análisis en la base de datos',
      );
    }
  }

  async createXRFAnalyses(
    analysis: IAnalysisEntity,
  ): Promise<Prisma.AnalysisGetPayload<{}>> {
    try {
      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          analysisDate: analysis.analysisDate,
          resultValue: analysis.resultValue as ResultValueXRF[],
          analysisType: { connect: { id: analysis.analysisTypeId! } },
          sample: { connect: { id: analysis.sampleId } },
        },
      });

      return createdAnalysis;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Error al crear el análisis XRF');
    }
  }

  async createLWAnalysis(
    analysis: IAnalysisEntity,
  ): Promise<Prisma.AnalysisGetPayload<{}>> {
    try {
      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          analysisDate: analysis.analysisDate,
          resultValue: analysis.resultValue as ResultValueLW,
          analysisType: { connect: { id: analysis.analysisTypeId! } },
          sample: { connect: { id: analysis.sampleId } },
        },
      });

      return createdAnalysis;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el análisis LW');
    }
  }

  async createAAAnalyses(
    analysis: IAnalysisEntity,
  ): Promise<Prisma.AnalysisGetPayload<{}>> {
    try {
      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          analysisDate: analysis.analysisDate,
          resultValue: analysis.resultValue as ResultValueAA,
          analysisType: { connect: { id: analysis.analysisTypeId! } },
          sample: { connect: { id: analysis.sampleId } },
        },
      });

      return createdAnalysis;
    } catch (error) {
      throw new BadRequestException('Error al crear el análisis AA');
    }
  }

  async getActiveLWAnalyses(
    options: IPaginationOptions,
  ): Promise<ActiveAnalysis<ResultValueLW>[]> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const analysisType =
      await this.analysisTypeDatasource.findByShortName('LW');

    const activeLWanalyses = await this.prisma.analysis.findMany({
      where: {
        isActive: true,
        resultValue: {
          path: ['done'],
          equals: false,
        },
        analysisTypeId: analysisType.id,
      },
      select: {
        id: true,
        analysisDate: true,
        sample: {
          select: {
            id: true,
            code: true,
          },
        },
        resultValue: true,
      },
      skip,
      take: limit,
    });

    return activeLWanalyses.map((analysis) => ({
      analysisId: analysis.id,
      analysisDate: analysis.analysisDate,
      sample: {
        id: analysis.sample.id,
        code: String(analysis.sample.code),
      },
      resultValue: analysis.resultValue as unknown as ResultValueLW,
    }));
  }

  async findExistingAnalysis(
    analysisTypeId: string,
    sampleId: string,
  ): Promise<any> {
    console.log(analysisTypeId, sampleId);
    return this.prisma.analysis.findFirst({
      where: {
        analysisTypeId,
        sampleId,
        isActive: true,
      },
    });
  }

  async updateLWAnalysis(
    analysis: UpdateLWAnalysis,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    await this.companyDataSource.findById(companyId);

    const currentAnalysis = await this.prisma.analysis.findUnique({
      where: { id: analysis.id },
    });

    if (!currentAnalysis) {
      throw new NotFoundException('Análisis no encontrado');
    }

    if (
      analysis.realEndDateTime &&
      new Date(analysis.realEndDateTime) <= currentAnalysis.analysisDate
    ) {
      throw new BadRequestException(
        'La fecha de finalización debe ser posterior a la fecha del análisis',
      );
    }

    const currentResultValue = currentAnalysis.resultValue as ResultValueLW;

    const updatedAnalysis = await this.prisma.analysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        resultValue: {
          ...currentResultValue,
          realEndDateTime: analysis.realEndDateTime,
          done: analysis.done,
        },
      },
    });

    return {
      id: updatedAnalysis.id,
      sampleId: updatedAnalysis.sampleId,
      analysisTypeId: updatedAnalysis.analysisTypeId,
      analysisDate: updatedAnalysis.analysisDate,
      resultValue: updatedAnalysis.resultValue as ResultValueLW,
    };
  }
}
