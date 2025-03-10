import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICompanyRepository } from 'src/core/domain/repositories/company.repository';
import { Company } from 'src/core/domain/entities/company.entity';

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) { }


  async createCompany(company: Company): Promise<Company> {
    try {
      const createdCompanye = await this.prisma.company.create({
        data: {
          id: company.id,
          name: company.name,
          logo: company.logo
        },
      });
      return new Company(createdCompanye.id, createdCompanye.name, createdCompanye.logo);
    } catch (error) {
      throw error;
    }
  }

  async findById(companyId: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    return company ? new Company(company.id, company.name, company.logo) : null;
  }


  async deleteCompany(id: string): Promise<void> {
    const company = await this.prisma.company.findUnique({ where: { id: id } });

    if (!company) {
      throw new NotFoundException('Company no encontrado');
    }

    await this.prisma.company.delete({ where: { id: id } });
  }

  async findAll(page: number, limit: number): Promise<{ company: Company[], total: number }> {
    const skip = (page - 1) * limit;

    const [company, total] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: limit,
        select: { id: true, name: true, logo: true } // Include the 'logo' property
      }),
      this.prisma.company.count()
    ]);

    return { company, total };
  }

  async updateCompany(id: string, companyData: Partial<Company>): Promise<Company> {
    const existingCompany = await this.findById(id);
    if (!existingCompany) throw new NotFoundException(`Company con ID ${id} no encontrado`);

    const { ...rest } = companyData;
    companyData = rest;


    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: {
        ...companyData,
        name: companyData.name,
      },
    });

    return new Company(updatedCompany.id, updatedCompany.name, updatedCompany.logo);
  }
}