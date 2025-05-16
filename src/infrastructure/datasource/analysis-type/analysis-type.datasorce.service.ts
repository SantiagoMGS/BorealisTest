import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalysisTypeSelect } from './types/analysis-type-select.type';

@Injectable()
export class AnalysisTypeDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByShortName(shortName: string): Promise<AnalysisTypeSelect> {
    const analysisType = await this.prisma.analysisType.findUnique({
      where: {
        shortName,
        isActive: true,
      },
    });
    if (!analysisType) {
      throw new NotFoundException('No existe el tipo de análisis');
    }
    return analysisType;
  }
  async findById(id: string) {
    return this.prisma.analysisType.findUnique({
      where: {
        id,
      },
    });
  }
}
