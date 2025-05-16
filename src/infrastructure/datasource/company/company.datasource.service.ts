import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { Company } from '@prisma/client';

@Injectable()
export class CompanyDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }
}
