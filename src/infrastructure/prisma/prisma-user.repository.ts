import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/core/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/core/domain/entities';
import { UserPermissionsEntity } from 'src/core/domain/entities/user-permissions.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        hashedPassword: user.hashedPassword,
        isActive: user.isActive,
      },
    });

    return new User(
      created.id,
      created.name,
      created.email,
      created.hashedPassword,
      created.isActive,
      created.createdAt,
      created.updatedAt
    );
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user
      ? new User(
          user.id,
          user.name,
          user.email,
          user.hashedPassword,
          user.isActive,
          user.createdAt,
          user.updatedAt
        )
      : null;
  }

  async findByEmail(email: string): Promise<Omit<User, 'hashedPassword'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
    return user || null;
  }

  async deleteUser(email: string): Promise<void> {
    await this.prisma.user.delete({ where: { email } });
  }

  async findAll(page: number, limit: number): Promise<{ users: Omit<User, 'hashedPassword'>[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          isDeleted: true,
        },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total };
  }

  async update(email: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmailWithPassword(email);
    if (!existingUser)
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);

    if (userData.hashedPassword) {
      userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: userData,
    });

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.hashedPassword,
      updatedUser.isActive,
      updatedUser.createdAt,
      updatedUser.updatedAt
    );
  }

  async assignUserToCompanies(userId: string, permissions: { companyId: string; roleId: string }[]): Promise<void> {
    await this.prisma.userCompany.createMany({
      data: permissions.map((p) => ({ userId, companyId: p.companyId, roleId: p.roleId })),
      skipDuplicates: true,
    });
  }

  async updateUserRole(userId: string, companyId: string, roleId: string): Promise<void> {
    await this.prisma.userCompany.updateMany({
      where: { userId, companyId },
      data: { roleId },
    });
  }

  async getCompanyByUserId(userId: string): Promise<{
    companyId: string;
    companyName: string;
    logo: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    tertiaryColor: string | null;
  }[]> {
    const userCompanies = await this.prisma.userCompany.findMany({
      where: { userId },
      select: {
        company: {
          select: {
            id: true,
            name: true,
            branding: {
              select: {
                logo: true,
                primaryColor: true,
                secondaryColor: true,
                tertiaryColor: true,
              },
            },
          },
        },
      },
    });

    return userCompanies.map(({ company }) => ({
      companyId: company.id,
      companyName: company.name,
      logo: company.branding?.logo ?? null,
      primaryColor: company.branding?.primaryColor ?? null,
      secondaryColor: company.branding?.secondaryColor ?? null,
      tertiaryColor: company.branding?.tertiaryColor ?? null,
    }));
  }

  async getUserPermissions(userId: string): Promise<UserPermissionsEntity[]> {
    try {
      const userPermissions = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          companies: {
            select: {
              company: {
                select: {
                  id: true,
                  name: true,
                  branding: {
                    select: {
                      logo: true,
                      primaryColor: true,
                      secondaryColor: true,
                      tertiaryColor: true,
                    },
                  },
                  applications: {
                    select: {
                      application: {
                        select: {
                          id: true,
                          name: true,
                          isActive: true,
                          logo: true,
                        },
                      },
                    },
                  },
                },
              },
              role: {
                select: {
                  id: true,
                  name: true,
                  permissions: {
                    select: {
                      action: {
                        select: {
                          id: true,
                          name: true,
                          level: true,
                        },
                      },
                      subresource: {
                        select: {
                          id: true,
                          name: true,
                          resource: {
                            select: {
                              id: true,
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return [this.transformUserPermissions(userPermissions)];
    } catch (error) {
      throw new Error('Error fetching user permissions');
    }
  }

  private transformUserPermissions(userPermissions): UserPermissionsEntity {
    if (!userPermissions || !userPermissions.companies) {
      return {
        id: '',
        name: '',
        email: '',
        isActive: false,
        companies: [],
      };
    }

    return {
      id: userPermissions.id,
      name: userPermissions.name,
      email: userPermissions.email,
      isActive: userPermissions.isActive,
      companies: userPermissions.companies.map((companyData: any) => {
        const company = companyData.company;
        const role = companyData.role;
        return {
          companyId: company.id,
          companyName: company.name,
          logo: company.branding?.logo ?? null,
          primaryColor: company.branding?.primaryColor ?? null,
          secondaryColor: company.branding?.secondaryColor ?? null,
          tertiaryColor: company.branding?.tertiaryColor ?? null,
          roleId: role.id,
          roleName: role.name,
          applications: company.applications.map((app: any) => ({
            applicationId: app.application.id,
            applicationName: app.application.name,
            isActive: app.application.isActive,
            logo: app.application.logo,
            resources: this.groupPermissionsByResource(role.permissions),
          })),
        };
      }),
    };
  }

  private groupPermissionsByResource(permissions: any[]): any[] {
    const resourceMap: { [resourceId: string]: any } = {};

    permissions.forEach((permission) => {
      const resourceId = permission.subresource.resource.id;
      const resourceName = permission.subresource.resource.name;
      const subresourceId = permission.subresource.id;
      const subresourceName = permission.subresource.name;

      if (!resourceMap[resourceId]) {
        resourceMap[resourceId] = {
          resourceId,
          resourceName,
          subresources: {},
        };
      }

      if (!resourceMap[resourceId].subresources[subresourceId]) {
        resourceMap[resourceId].subresources[subresourceId] = {
          subresourceId,
          subresourceName,
          action: {
            actionId: permission.action.id,
            actionName: permission.action.name,
            actionLevel: permission.action.level,
          },
        };
      }
    });

    return Object.values(resourceMap).map((resource) => ({
      ...resource,
      subresources: Object.values(resource.subresources),
    }));
  }

  async clearRefreshToken(id: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId: id },
      data: {
        refreshToken: null,
        refreshExpiresAt: null,
      },
    });
  }

  async findUserByRefreshToken(hashedRefreshToken: string): Promise<User | null> {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken: hashedRefreshToken },
      include: { user: true },
    });
    return session?.user || null;
  }

  async updateRefreshToken(userId: string, refreshToken: string, expiry: Date): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId },
      data: {
        refreshToken,
        refreshExpiresAt: expiry,
      },
    });
  }
}