import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/core/domain/entities';
import { UserPermissionsEntity } from 'src/core/domain/entities/user-permissions.entity';
import { IUserRepository } from 'src/core/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  // Función para mapear un usuario de la base de datos a la entidad User

  private mapToUserEntity(user: any): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Función para mapear permisos de usuario
  private transformUserPermissions(userPermissions: any): UserPermissionsEntity {
    try {
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
            id: company.id,
            name: company.name,
            shortName: company.shortName,
            logo: company.branding?.logo ?? null,
            primaryColor: company.branding?.primaryColor ?? null,
            secondaryColor: company.branding?.secondaryColor ?? null,
            tertiaryColor: company.branding?.tertiaryColor ?? null,
            roleId: role.id,
            roleName: role.name,
            applications: company.applications.map((app: any) => ({
              id: app.application.id,
              name: app.application.name,
              isActive: app.application.isActive,
              logo: app.application.logo,
              path: app.application.path,
              resources: this.groupPermissionsByResource(role.permissions),
            })),
          };
        }),
      };
    } catch (error) {
      throw new NotFoundException('Error al transformar los permisos del usuario');
    }

  }

  // Función para agrupar permisos por recurso
  private groupPermissionsByResource(permissions: any[]): any[] {
    try {
      const resourceMap: { [id: string]: any } = {};

      permissions.forEach((permission) => {
        const id = permission.subresource.resource.id;
        const name = permission.subresource.resource.name;
        const icon = permission.subresource.resource.icon;
        const path = permission.subresource.resource.path;
        const subRId = permission.subresource.id;
        const subRName = permission.subresource.name;
        const subRIcon = permission.subresource.icon;
        const subRPath = permission.subresource.path;

        if (!resourceMap[id]) {
          resourceMap[id] = {
            id,
            name,
            icon,
            path,
            subresources: {},
          };
        }

        if (!resourceMap[id].subresources[subRId]) {
          resourceMap[id].subresources[subRId] = {
            id: subRId,
            name: subRName,
            icon: subRIcon,
            path: subRPath,
            actions: [],
          };
        }

        resourceMap[id].subresources[subRId].actions.push({
          id: permission.action.id,
          name: permission.action.name,
          level: permission.action.level,
        });
      });

      return Object.values(resourceMap).map((resource) => ({
        ...resource,
        subresources: Object.values(resource.subresources),
      }));
    } catch (error) {
      throw new NotFoundException('Error al agrupar permisos por recurso');

    }
  }

  async createUser(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        hashedPassword: user.hashedPassword,
        isActive: user.isActive,
      },
    });

    return this.mapToUserEntity(created);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.mapToUserEntity(user) : null;
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
        },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total };
  }

  async update(email: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmailWithPassword(email);
    if (!existingUser) throw new NotFoundException(`Usuario con email ${email} no encontrado`);

    if (userData.hashedPassword) {
      userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: userData,
    });

    return this.mapToUserEntity(updatedUser);
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
    id: string;
    name: string;
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
            shortName: true,
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
      id: company.id,
      name: company.name,
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
                  shortName: true,
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
                          path: true,
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
                          icon: true,
                          path: true,
                          resource: {
                            select: {
                              id: true,
                              name: true,
                              icon: true,
                              path: true,
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