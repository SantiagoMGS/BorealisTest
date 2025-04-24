import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
@Injectable()
export class CompanySupplierDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<void> {
    await this.prisma.companySupplier.createMany({
      data: supplierIds.map((supplierId) => ({
        companyId,
        supplierId,
      })),
    });
  }

  async getCompanySuppliers(companyId: string) {
    return this.prisma.companySupplier.findMany({
      where: { companyId },
      include: {
        company: true,
        supplier: true,
      },
    });
  }
}
