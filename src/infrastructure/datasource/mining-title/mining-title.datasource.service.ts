import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { SupplierMiningTitleWithRelations } from './mining-title.datasource.types';

@Injectable()
export class MiningTitleDatasource {
  constructor(private readonly prisma: PrismaService) {}

  async findBySupplierId(
    supplierId: string,
  ): Promise<SupplierMiningTitleWithRelations[]> {
    const miningTitles = await this.prisma.supplierMiningTitle.findMany({
      where: { supplierId },
      include: {
        mineType: true,
        city: {
          include: {
            department: true,
          },
        },
      },
    });

    if (miningTitles.length === 0) {
      throw new NotFoundException(
        'No se encontraron títulos mineros para este proveedor',
      );
    }

    return miningTitles;
  }
}
