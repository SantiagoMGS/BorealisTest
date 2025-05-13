import { PrismaService } from '@core/prisma/prisma.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReceptionOrigin } from '@prisma/client';

@Injectable()
export class ReceptionOriginDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ReceptionOrigin> {
    const origin = await this.prisma.receptionOrigin.findUnique({
      where: { id },
    });

    if (!origin) {
      throw new NotFoundException(
        `No se encontró el origen de recepción con ID ${id}`,
      );
    }

    return origin;
  }

  async getDefaultAnalysisByOriginId(originId: string) {
    const origin = await this.findById(originId);

    const defaultAnalysis =
      await this.prisma.defaultAnalysisTypeOrigin.findMany({
        where: {
          receptionOriginId: originId,
        },
        include: {
          analysisType: {
            select: {
              id: true,
              name: true,
              shortName: true,
            },
          },
        },
      });

    if (defaultAnalysis.length === 0) {
      return [];
    }

    return defaultAnalysis.map(
      (item: {
        analysisType: { id: string; name: string; shortName: string };
      }) => ({
        id: item.analysisType.id,
        name: item.analysisType.name,
        shortName: item.analysisType.shortName,
        selected: true,
      }),
    );
  }

  async getSuppliersByOriginId(
    originId: string,
  ): Promise<Array<{ id: string; name: string }>> {
    await this.findById(originId);

    const supplierOrigins = await this.prisma.supplierReceptionOrigin.findMany({
      where: {
        originId,
      },
      select: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (supplierOrigins.length === 0)
      throw new HttpException(
        'No se encontraron proveedores asociados a este origen de recepción',
        HttpStatus.NO_CONTENT,
      );

    return supplierOrigins.map((so) => ({
      id: so.supplier.id,
      name: so.supplier.name,
    }));
  }
}
