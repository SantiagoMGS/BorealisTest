import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/core/domain/entities';
import { UserCompanyPermissionsEntity } from 'src/core/domain/entities/user-company-permissions.entity';
import { UserPermissionsEntity } from 'src/core/domain/entities/user-permissions.entity';
import { IUserRepository } from 'src/core/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: User): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      // Si el usuario ya existe, devolver el usuario existente
      return this.mapToUserEntity(existingUser);
    }
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

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take: limit }),
      this.prisma.user.count(),
    ]);
    return { data: users, total };
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

    return this.mapToUserEntity(updatedUser);
  }

  async delete(email: string): Promise<void> {
    await this.prisma.user.delete({ where: { email } });
  }
  async findByEmail(
    email: string,
  ): Promise<Omit<User, 'hashedPassword'> | null> {
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
  async assignUserToCompanies(
    userId: string,
    permissions: { companyId: string; roleId: string }[],
  ): Promise<void> {
    await this.prisma.userCompany.createMany({
      data: permissions.map((p) => ({
        userId,
        companyId: p.companyId,
        roleId: p.roleId,
      })),
      skipDuplicates: true,
    });
  }

  async updateUserRole(
    userId: string,
    companyId: string,
    roleId: string,
  ): Promise<void> {
    await this.prisma.userCompany.updateMany({
      where: { userId, companyId },
      data: { roleId },
    });
  }

  async getUserPermissions(userId: string): Promise<UserPermissionsEntity[]> {
    try {
      console.log('Fetching user permissions for userId:', userId);

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

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    expiry: Date,
  ): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId },
      data: {
        refreshToken,
        refreshExpiresAt: expiry,
      },
    });
  }

  async findUserByRefreshToken(
    hashedRefreshToken: string,
  ): Promise<User | null> {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken: hashedRefreshToken },
      include: { user: true },
    });
    return session?.user || null;
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
  private transformUserPermissions(
    userPermissions: any,
  ): UserPermissionsEntity {
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
      throw new NotFoundException(
        'Error al transformar los permisos del usuario',
      );
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

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.mapToUserEntity(user) : null;
  }

  async getCompanyByUserId(userId: string): Promise<
    {
      id: string;
      name: string;
      logo: string | null;
      primaryColor: string | null;
      secondaryColor: string | null;
      tertiaryColor: string | null;
    }[]
  > {
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

  async getUserCompanyPermissions(
    userId: string,
    companyId: string,
  ): Promise<UserCompanyPermissionsEntity> {
    try {
      // 1. Obtener el rol del usuario en la compañía específica
      const userCompany = await this.prisma.userCompany.findFirst({
        where: {
          userId: userId,
          companyId: companyId,
        },
        select: {
          roleId: true,
        },
      });

      if (!userCompany) {
        throw new NotFoundException(
          `El usuario con ID ${userId} no tiene un rol asignado en la compañía con ID ${companyId}`,
        );
      }

      // 2. Obtener las aplicaciones asociadas a la compañía
      const companyApplications = await this.prisma.companyApplication.findMany(
        {
          where: {
            companyId: companyId,
            isActive: true,
          },
          select: {
            application: {
              select: {
                id: true,
                name: true,
                path: true,
                isActive: true,
                resources: {
                  select: {
                    resource: {
                      select: {
                        id: true,
                        name: true,
                        icon: true,
                        path: true,
                        subresources: {
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
      );

      // 3. Obtener los permisos del rol del usuario
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: {
          roleId: userCompany.roleId,
        },
        select: {
          subresourceId: true,
          action: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
        },
      });

      // Crear un mapa para acceder fácilmente a los permisos por subrecurso
      const permissionsBySubresource = new Map();
      rolePermissions.forEach((permission) => {
        const { subresourceId, action } = permission;
        if (!permissionsBySubresource.has(subresourceId)) {
          permissionsBySubresource.set(subresourceId, []);
        }
        permissionsBySubresource.get(subresourceId).push(action);
      });

      // 4. Estructurar los datos como se requiere
      const applications = companyApplications
        .map((companyApp) => {
          const app = companyApp.application;

          return {
            id: app.id,
            name: app.name,
            path: app.path,
            isActive: app.isActive,
            resources: app.resources
              .map((appResource) => {
                const resource = appResource.resource;

                return {
                  id: resource.id,
                  name: resource.name,
                  icon: resource.icon,
                  path: resource.path,
                  subresources: resource.subresources
                    .map((subresource) => {
                      // Obtener las acciones para este subrecurso específico
                      const actions =
                        permissionsBySubresource.get(subresource.id) || [];

                      return {
                        id: subresource.id,
                        name: subresource.name,
                        icon: subresource.icon,
                        path: subresource.path,
                        actions: actions,
                      };
                    })
                    .filter((subresource) => subresource.actions.length > 0), // Solo incluir subrecursos con acciones permitidas
                };
              })
              .filter((resource) => resource.subresources.length > 0), // Solo incluir recursos con subrecursos permitidos
          };
        })
        .filter((app) => app.resources.length > 0); // Solo incluir aplicaciones con recursos permitidos

      return { applications };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener permisos del usuario por compañía: ${error?.message || 'Error desconocido'}`,
      );
    }
  }
}
