import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class PermissionDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCompany(userId: string, companyId: string) {
    return this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      include: {
        role: true,
      },
    });
  }

  async getCompanyWithBranding(companyId: string) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        branding: true,
      },
    });
  }

  async getCompanyApplications(companyId: string) {
    return this.prisma.companyApplication.findMany({
      where: {
        companyId,
        isActive: true,
      },
      include: {
        application: true,
      },
    });
  }

  async getRolePermissions(roleId: string) {
    return this.prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        action: true,
        subresource: {
          include: {
            resource: true,
          },
        },
      },
    });
  }

  async getApplicationResources(applicationIds: string[]) {
    return this.prisma.applicationResource.findMany({
      where: {
        applicationId: {
          in: applicationIds,
        },
        isActive: true,
      },
      include: {
        resource: {
          include: {
            subresources: true,
          },
        },
      },
    });
  }
}
