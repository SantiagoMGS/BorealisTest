import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '@domain/repositories/user/permission.repository';
import { PermissionDataSourceService } from '@infrastructure/datasource/user/permission.datasource.service';
import { IPermissionsByCompanyResponse } from '@domain/interfaces/user/permission-response.interface';

@Injectable()
export class PermissionRepositoryImpl implements PermissionRepository {
  constructor(
    private readonly permissionDataSource: PermissionDataSourceService,
  ) {}

  async getPermissionsByCompany(
    userId: string,
    companyId: string,
  ): Promise<IPermissionsByCompanyResponse> {
    try {
      // Obtener información de la compañía
      const company =
        await this.permissionDataSource.getCompanyWithBranding(companyId);

      // Verificar que el usuario pertenece a la compañía para obtener información del rol
      const userCompany = await this.permissionDataSource.getUserCompany(
        userId,
        companyId,
      );

      // Obtener permisos utilizando la función almacenada en PostgreSQL
      const permissionsData =
        await this.permissionDataSource.getUserPermissionsByCompany(
          userId,
          companyId,
        );

      // Si no hay datos de permisos o el array está vacío, retornar estructura básica
      if (!permissionsData || (permissionsData as any[]).length === 0) {
        return {
          company: {
            id: company.id,
            name: company.name,
            shortName: company.shortName,
            branding: company.branding
              ? {
                  logo: company.branding.logo,
                  primaryColor: company.branding.primaryColor,
                  secondaryColor: company.branding.secondaryColor,
                  tertiaryColor: company.branding.tertiaryColor,
                }
              : null,
          },
          role: {
            id: userCompany.roleId,
            name: userCompany.role.name,
          },
          applications: [],
        };
      }

      // Procesar los datos para formar la estructura deseada
      const applicationsMap = new Map();
      const resourcesMap = new Map();

      // Organizar los datos en una estructura jerárquica
      for (const row of permissionsData as any[]) {
        // Procesar aplicación
        if (!applicationsMap.has(row.applicationId)) {
          applicationsMap.set(row.applicationId, {
            id: row.applicationId,
            name: row.applicationName,
            path: row.applicationPath,
            isActive: row.applicationIsActive,
            resources: [],
          });
        }
        const application = applicationsMap.get(row.applicationId);

        // Procesar recurso
        const resourceKey = `${row.applicationId}-${row.resourceId}`;
        if (!resourcesMap.has(resourceKey)) {
          const resource = {
            id: row.resourceId,
            name: row.resourceName,
            icon: row.resourceIcon,
            path: row.resourcePath,
            subresources: [],
          };
          resourcesMap.set(resourceKey, resource);
          application.resources.push(resource);
        }
        const resource = resourcesMap.get(resourceKey);

        // Procesar subrecurso con acción
        const existingSubresource = resource.subresources.find(
          (sr: any) => sr.id === row.subresourceId,
        );

        if (!existingSubresource) {
          resource.subresources.push({
            id: row.subresourceId,
            name: row.subresourceName,
            icon: row.subresourceIcon,
            path: row.subresourcePath,
            action: {
              id: row.actionId,
              name: row.actionName,
              level: row.actionLevel,
            },
          });
        }
      }

      // Convertir los Maps a arrays para la respuesta final
      const applications = Array.from(applicationsMap.values());

      return {
        company: {
          id: company.id,
          name: company.name,
          shortName: company.shortName,
          branding: company.branding
            ? {
                logo: company.branding.logo,
                primaryColor: company.branding.primaryColor,
                secondaryColor: company.branding.secondaryColor,
                tertiaryColor: company.branding.tertiaryColor,
              }
            : null,
        },
        role: {
          id: userCompany.roleId,
          name: userCompany.role.name,
        },
        applications,
      };
    } catch (error) {
      throw error;
    }
  }
}
