import { Injectable } from '@nestjs/common';
import { ICompanyEntity } from '@domain/entities/company/company.entity';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class CompanyDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.company.findMany();
  }
}
