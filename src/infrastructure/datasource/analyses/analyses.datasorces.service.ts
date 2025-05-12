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
      // Verificamos que existan todas las entidades relacionadas
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

      // Convertimos los valores a números para asegurar el cálculo correcto
      const receivedWeight = Number(sample.receivedWeight);
      const dryWeight = Number((analysis.resultValue as any).dryWeigth);

      const humidityPercentage = (1 - dryWeight / receivedWeight) * 100;

      // Normalizamos el objeto resultValue
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('No existe la muestra relacionada');
        }
      }
      console.error('Error al crear el análisis:', error);
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

      // Extraer el sampleId del objeto o string
      const sampleId = (analysis.sampleId as any)?.value || analysis.sampleId;
      const analysisDate = analysis.analysisDate as Date;
      console.log('analysisDate procesado:', analysisDate);

      // Verificar la muestra y su relación con la empresa
      const sample = await this.sampleDataSource.findById(sampleId);

      if (!sample) {
        throw new NotFoundException('No existe la muestra');
      }

      // Crear el análisis usando el sampleId procesado
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
      console.error('Error al crear el análisis XRF:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Error al crear el análisis XRF');
    }
  }
}
