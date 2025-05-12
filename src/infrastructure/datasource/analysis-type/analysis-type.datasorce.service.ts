import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AnalysisTypeDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByShortName(shortName: string) {
    const analysisType = await this.prisma.analysisType.findUnique({
      where: {
        shortName,
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
