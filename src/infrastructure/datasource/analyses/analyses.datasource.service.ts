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
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('XRF');

      await this.companyDataSource.findById(companyId);

      const sampleId = (analysis.sampleId as any)?.value || analysis.sampleId;

      await this.sampleDataSource.findById(sampleId);

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          sampleId: sampleId,
          analysisDate: analysis.analysisDate,
          analysisTypeId: analysisType.id,
          resultValue: analysis.resultValue as ResultValueXRF[],
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
        resultValue: createdAnalysis.resultValue as ResultValueXRF[],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Error al crear el análisis XRF');
    }
  }

  async createLWAnalysis(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('LW');

      await this.companyDataSource.findById(companyId);

      await this.sampleDataSource.findById(analysis.sampleId);

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          sampleId: analysis.sampleId,
          analysisDate: analysis.analysisDate,
          analysisTypeId: analysisType.id,
          resultValue: analysis.resultValue as ResultValueLW,
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
        resultValue: createdAnalysis.resultValue as ResultValueLW,
      };
    } catch (error) {
      throw new BadRequestException('Error al crear el análisis LW');
    }
  }

  async createAAAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('AA');

      await this.companyDataSource.findById(companyId);

      const sample = await this.sampleDataSource.findById(analysis.sampleId);

      if (!sample) {
        throw new NotFoundException('No existe la muestra');
      }
      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          ...analysis,
          analysisTypeId: analysisType.id,
          resultValue: analysis.resultValue as ResultValueAA,
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
        resultValue: createdAnalysis.resultValue as ResultValueAA,
      };
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
