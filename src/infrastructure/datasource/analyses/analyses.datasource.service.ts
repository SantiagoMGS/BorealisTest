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
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('DH');

      await this.companyDataSource.findById(companyId);

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          sampleId: analysisData.sampleId,
          analysisDate: analysisData.analysisDate,
          analysisTypeId: analysisType.id,
          resultValue: analysisData.resultValue as ResultValueDH,
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
        //TODO: Cambiar para que no se devuelva el resultValue como string
        resultValue:
          typeof createdAnalysis.resultValue === 'string'
            ? JSON.parse(createdAnalysis.resultValue)
            : createdAnalysis.resultValue,
      };
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
        //TODO: Cambiar para que no se devuelva el resultValue como string
        resultValue:
          typeof createdAnalysis.resultValue === 'string'
            ? JSON.parse(createdAnalysis.resultValue)
            : createdAnalysis.resultValue,
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
        //TODO: Cambiar para que no se devuelva el resultValue como string
        resultValue:
          typeof createdAnalysis.resultValue === 'string'
            ? JSON.parse(createdAnalysis.resultValue)
            : createdAnalysis.resultValue,
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
        //TODO: Cambiar para que no se devuelva el resultValue como string
        resultValue:
          typeof createdAnalysis.resultValue === 'string'
            ? JSON.parse(createdAnalysis.resultValue)
            : createdAnalysis.resultValue,
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
      analysisDate: analysis.analysisDate,
      sample: {
        id: analysis.sample.id,
        code: String(analysis.sample.code),
      },
      resultValue: analysis.resultValue as unknown as ResultValueLW,
    }));
  }
}
