import { ICompanyResponse } from '@domain/interfaces/auth';
import { Company, CompanyBranding } from '@prisma/client';

export class CompanyMapper {
  static toResponseDto(
    company: Company & { branding?: CompanyBranding },
  ): ICompanyResponse {
    return {
      id: company.id,
      name: company.name,
      shortName: company.shortName,
      role: '',
      branding: company.branding
        ? {
            logo: company.branding.logo,
            primaryColor: company.branding.primaryColor,
            secondaryColor: company.branding.secondaryColor,
            tertiaryColor: company.branding.tertiaryColor,
          }
        : null,
    };
  }
}
