import { PrismaService } from '@core/prisma/prisma.service';
import {
  IAnalysisEntity,
  ResultValueDH,
  ResultValueLW,
} from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SampleReceptionDataSourceService } from '../reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { Prisma } from '@prisma/client';
import { AnalysisTypeDatasourceService } from '../analysis-type/analysis-type.datasorce.service';

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
          companyId: companyId,
          analysisTypeId: analysisType.id,
          resultValue: JSON.stringify(analysisData.resultValue),
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
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
          companyId: companyId,
          sampleId: sampleId,
          analysisDate: analysis.analysisDate,
          analysisTypeId: analysisType.id,
          resultValue: JSON.stringify(analysis.resultValue),
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
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
          companyId: companyId,
          sampleId: analysis.sampleId,
          analysisDate: analysis.analysisDate,
          analysisTypeId: analysisType.id,
          resultValue: JSON.stringify(analysis.resultValue),
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
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

      if (!analysisType) {
        throw new NotFoundException('No existe el tipo de análisis AA');
      }
      const company = await this.companyDataSource.findById(companyId);
      if (!company) {
        throw new NotFoundException('No existe la empresa');
      }

      const sample = await this.sampleDataSource.findById(analysis.sampleId);

      if (!sample) {
        throw new NotFoundException('No existe la muestra');
      }
      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          ...analysis,
          companyId: companyId,
          analysisTypeId: analysisType.id,
          resultValue: JSON.stringify(analysis.resultValue),
        },
      });

      return {
        id: createdAnalysis.id,
        sampleId: createdAnalysis.sampleId,
        analysisTypeId: createdAnalysis.analysisTypeId,
        analysisDate: createdAnalysis.analysisDate,
        resultValue:
          typeof createdAnalysis.resultValue === 'string'
            ? JSON.parse(createdAnalysis.resultValue)
            : createdAnalysis.resultValue,
      };
    } catch (error) {
      throw new BadRequestException('Error al crear el análisis AA');
    }
  }
}
