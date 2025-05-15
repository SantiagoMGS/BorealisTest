import { Injectable } from '@nestjs/common';
import { IMiningTitleResponse } from '../../../domain/interfaces/supplier/mining-title-response.interface';
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

    return miningTitles;
  }
}
