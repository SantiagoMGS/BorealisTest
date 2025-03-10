import { Injectable } from '@nestjs/common';
import { ICompanyRepository } from 'src/core/domain/repositories/company.repository';
import { PrismaService } from '../prisma.service';
import { Company } from 'src/core/domain/entities/company.entity';
@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async findManyByIds(ids: string[]): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: { id: { in: ids } }, // 🔹 Busca solo las compañías con los IDs proporcionados
    });
  }

  async createCompany(company: Company): Promise<Company> {
    return this.prisma.company.create({ data: { name: company.name, logo: company.logo } });
  }

  async deleteCompany(id: string): Promise<void> {
    await this.prisma.company.delete({ where: { id } });
  }
  async findByName(name: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { name } }); // 🔹 Busca por nombre único
  }
}
