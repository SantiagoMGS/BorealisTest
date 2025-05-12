import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';

@Injectable()
export class SampleManagementDataSourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
  ) {}

  async getDropdownData(startDate: Date, endDate: Date): Promise<any> {
    const suppliers = await this.getAvailableSuppliers(startDate, endDate);

    return suppliers;
  }

  async getAvailableSuppliers(startDate: Date, endDate: Date): Promise<any> {
    const sampleReceptionTypeId = (
      await this.receptionTypeDataSource.findByName('Muestra')
    ).id;

    const suppliers = await this.prisma.reception.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        receptionTypeId: sampleReceptionTypeId,
      },
      select: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ['supplierId'],
    });

    // Extraer solo los suppliers de las recepciones encontradas
    return suppliers.map((reception) => reception.supplier);
  }
}
