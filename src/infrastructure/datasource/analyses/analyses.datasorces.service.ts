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

@Injectable()
export class AnalysesDatasourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sampleDataSource: SampleReceptionDataSourceService,
    private readonly companyDataSource: CompanyDataSourceService,
  ) {}

  async createDHAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      // Verificamos que existan todas las entidades relacionadas
      const analysisType = await this.prisma.analysisType.findUnique({
        where: {
          id: analysis.analysisTypeId,
        },
      });

      if (!analysisType) {
        throw new NotFoundException('No existe el tipo de análisis');
      }

      const company = await this.companyDataSource.findById(companyId);
      if (!company) {
        throw new NotFoundException('No existe la empresa');
      }

      const createdAnalysis = await this.prisma.analysis.create({
        data: {
          ...analysis,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced entity not found');
        }
      }
      console.error('Error al crear el análisis:', error);
      throw new BadRequestException('Error al crear el análisis');
    }
  }
}
