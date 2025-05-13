import { PrismaService } from '@core/prisma/prisma.service';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
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
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('DH');

      if (!analysisType) {
        throw new NotFoundException('No existe el tipo de análisis');
      }

      const company = await this.companyDataSource.findById(companyId);
      if (!company) {
        throw new NotFoundException('No existe la empresa');
      }
      const sample = await this.sampleDataSource.findById(analysis.sampleId);

      const receivedWeight = Number(sample.receivedWeight);
      const dryWeight = Number((analysis.resultValue as any).dryWeigth);

      const humidityPercentage = (1 - dryWeight / receivedWeight) * 100;

      const normalizedResultValue = {
        dryWeight,
        humidityPercentage: parseFloat(humidityPercentage.toFixed(4)),
      };

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          ...analysis,
          analysisTypeId: analysisType.id,
          resultValue: JSON.stringify(normalizedResultValue),
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

      throw new BadRequestException('Error al crear el análisis');
    }
  }
  async createXRFAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('XRF');

      if (!analysisType) {
        throw new NotFoundException('No existe el tipo de análisis XRF');
      }
      const company = await this.companyDataSource.findById(companyId);
      if (!company) {
        throw new NotFoundException('No existe la empresa');
      }
      const sampleId = (analysis.sampleId as any)?.value || analysis.sampleId;
      const analysisDate = analysis.analysisDate as Date;

      const sample = await this.sampleDataSource.findById(sampleId);

      if (!sample) {
        throw new NotFoundException('No existe la muestra');
      }

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
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

      if (!analysisType) {
        throw new NotFoundException('No existe el tipo de análisis LW');
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
