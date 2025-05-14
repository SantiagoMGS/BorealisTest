import { PrismaService } from '@core/prisma/prisma.service';
import {
  IAnalysisEntity,
  ResultValueDH,
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
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('DH');

      await this.companyDataSource.findById(companyId);

      const sample = await this.sampleDataSource.findById(analysis.sampleId);

      const resultValue = analysis.resultValue as ResultValueDH;

      const receivedWeight = Number(sample.receivedWeight);
      const dryWeight = Number(resultValue.dryWeight);

      console.log(receivedWeight, dryWeight);

      const moisture = (1 - dryWeight / receivedWeight) * 100;

      const normalizedResultValue = {
        dryWeight,
        moisture: parseFloat(moisture.toFixed(4)),
      };

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          ...analysis,
          companyId: companyId,
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

      //analysis.resultValue.cosa = 'HOLAAAAAAAAAA';
      console.log(analysis);
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
