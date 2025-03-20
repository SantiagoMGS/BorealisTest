import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/core/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/core/domain/entities';
import { UserPermissionsEntity } from 'src/core/domain/entities/user-permissions.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(user: User): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
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
  }

  async deleteUser(email: string): Promise<void> {
    await this.prisma.user.delete({ where: { email } });
  }
  async findAll(
    page: number,
    limit: number,
  ): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      await this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total };
  }

  async update(email: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (!existingUser)
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);

    if (userData.password !== undefined && userData.password !== null) {
      userData = {
        ...userData,
        password: await bcrypt.hash(userData.password, 10),
      };
    } else {
      const { password, ...rest } = userData;
      userData = rest;
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: {
        ...userData,
        password: userData.password ?? undefined,
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
    );
  }

  // 🔹 Implementación del nuevo método para asociar usuario con compañías
  async assignUserToCompanies(
    userId: string,
    permissions: { companyId: string; roleId: string }[],
  ): Promise<void> {
    await this.prisma.userCompany.createMany({
      data: permissions.map((permission) => ({
        userId,
        companyId: permission.companyId,
        roleId: permission.roleId,
      })),
      skipDuplicates: true, // Evita errores si ya existe la relación
    });
  }
  async updateUserRole(
    userId: string,
    companyId: string,
    roleId: string,
  ): Promise<void> {
    await this.prisma.userCompany.updateMany({
      where: {
        userId,
        companyId,
      },
      data: {
        roleId,
      },
    });
  }
  async getCompanyByUserId(
    userId: string,
  ): Promise<{ companyId: string; companyName: string; logo: string }[]> {
    const userCompanies = await this.prisma.userCompany.findMany({
      where: { userId },
      select: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            primaryColor: true,
            secondaryColor: true,
            thirdColor: true,
          },
        },
      },
    });

    return userCompanies.map(({ company }) => ({
      companyId: company.id,
      companyName: company.name,
      logo: company.logo,
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
      thirdColor: company.thirdColor,
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
                  logo: true,
                  primaryColor: true,
                  secondaryColor: true,
                  thirdColor: true,
                  applications: {
                    select: {
                      aplication: { // Relación con el modelo Application
                        select: {
                          id: true,
                          name: true,
                          isActive: true,
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
                  permissions: { // Relación con permisos del rol
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
                          resource: { // Relación con el recurso del subrecurso
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
      console.error(error);
      throw new Error('Error fetching user permissions');
    }
  }

  private transformUserPermissions(userPermissions: any): UserPermissionsEntity {
    if (!userPermissions || !userPermissions.companies) {
      return {
        userId: '',
        userName: '',
        userEmail: '',
        isActive: false,
        companies: [],
      };
    }

    return {
      userId: userPermissions.id,
      userName: userPermissions.name,
      userEmail: userPermissions.email,
      isActive: userPermissions.isActive,
      companies: userPermissions.companies.map((companyData: any) => {
        const company = companyData.company;
        const role = companyData.role;

        return {
          companyId: company.id,
          companyName: company.name,
          applications: company.applications.map((app: any) => ({
            applicationId: app.aplication.id,
            applicationName: app.aplication.name,
            isActive: app.aplication.isActive,
            resources: this.groupPermissionsByResource(role.permissions),
          })),
          roleId: role.id,
          roleName: role.name,
        };
      }),
    };
  }

  /**
   * Agrupa las acciones por recursos y subrecursos.
   */
  private groupPermissionsByResource(permissions: any[]): any[] {
    const resourceMap: { [resourceId: string]: any } = {};

    permissions.forEach((permission) => {
      const resourceId = permission.subresource.resource.id;
      const resourceName = permission.subresource.resource.name;
      const subresourceId = permission.subresource.id;
      const subresourceName = permission.subresource.name;

      // Si el recurso no existe en el mapa, inicialízalo
      if (!resourceMap[resourceId]) {
        resourceMap[resourceId] = {
          resourceId,
          resourceName,
          subresources: {},
        };
      }

      // Si el subrecurso no existe en el recurso, inicialízalo
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

    // Convierte el mapa de recursos en un arreglo
    return Object.values(resourceMap).map((resource) => ({
      ...resource,
      subresources: Object.values(resource.subresources),
    }));
  }
}


