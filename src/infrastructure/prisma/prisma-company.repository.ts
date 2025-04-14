import { Injectable } from '@nestjs/common';
import { Company } from 'src/core/domain/entities';
import { CompanyBranding } from 'src/core/domain/entities/company-brand.entity';
import { ICompanyRepository } from 'src/core/domain/repositories/company.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) { }
  async create(company: Company): Promise<Company> {

    const created = await this.prisma.company.create({
      data: {
        name: company.name,
        shortName: company.shortName,
        isActive: company.isActive,
        createdBy: company.createdBy,
        updatedBy: company.updatedBy,
      },
    });

    const full = await this.prisma.company.findUnique({
      where: { id: created.id },
      include: { branding: true },
    });


    return this.mapToCompanyEntity(full);
  }

  async update(id: string, companyData: Partial<Company>): Promise<Company> {
    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        name: companyData.name,
        isActive: companyData.isActive,
        updatedBy: companyData.updatedBy,
      },
      include: { branding: true },
    });
    return this.mapToCompanyEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({ where: { id } });
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        branding: true,
        applications: { include: { application: true } },
      },
    });
    return company ? this.mapToCompanyEntity(company) : null;
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Company[]; total: number }> {
    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { branding: true },
      }),
      this.prisma.company.count(),
    ]);

    return {
      data: companies.map(this.mapToCompanyEntity),
      total,
    };
  }

  async findManyByIds(ids: string[]): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: { id: { in: ids } },
      include: { branding: true },
    });
    return companies.map(this.mapToCompanyEntity);
  }

  async findByName(name: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { name },
      include: { branding: true },
    });
    return company ? this.mapToCompanyEntity(company) : null;
  }
  async isApplicationAssignedToCompany(companyId: string, applicationId: string): Promise<boolean> {
    const result = await this.prisma.companyApplication.findFirst({
      where: {
        companyId,
        applicationId,
      },
    });
    return !!result;
  }
  async createCompanyBranding(
    companyId: string,
    branding: CompanyBranding
  ): Promise<Company> {
    try {
      let temp = await this.prisma.companyBranding.create({
        data: {
          ...branding,
        },
      });

      const full = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: { branding: true },
      });

      return this.mapToCompanyEntity(full);
    } catch (error) {
      console.error("Error creating company branding:", error);
      throw error;
    }
  }
  async updateCompanyBranding(companyId: string, branding: CompanyBranding): Promise<void> {
    await this.prisma.companyBranding.update({
      where: { companyId },
      data: branding,
    });
  }


  async assignApplicationToCompanies(companyIds: string[], applicationIds: string[]): Promise<void> {
    const data = companyIds.flatMap(companyId =>
      applicationIds.map(applicationId => ({ companyId, applicationId }))
    );
    await this.prisma.companyApplication.createMany({ data, skipDuplicates: true });
  }

  private mapToCompanyEntity(company: any): Company {
    return {
      id: company.id,
      name: company.name,
      shortName: company.shortName,
      isActive: company.isActive,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      createdBy: company.createdBy,
      updatedBy: company.updatedBy,
      branding: company.branding
        ? {
          companyId: company.branding.companyId,
          logo: company.branding.logo,
          primaryColor: company.branding.primaryColor,
          secondaryColor: company.branding.secondaryColor,
          tertiaryColor: company.branding.tertiaryColor,
          createdAt: company.branding.createdAt,
          updatedAt: company.branding.updatedAt,
          createdBy: company.branding.createdBy,
          updatedBy: company.branding.updatedBy,
        }
        : null,
    };
  }
}
