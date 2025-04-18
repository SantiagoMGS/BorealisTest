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
    // Verificar que el usuario pertenece a la compañía
    const userCompany = await this.permissionDataSource.getUserCompany(
      userId,
      companyId,
    );

    if (!userCompany) {
      throw new Error('El usuario no pertenece a esta compañía');
    }

    // Obtener información de la compañía
    const company =
      await this.permissionDataSource.getCompanyWithBranding(companyId);

    if (!company) {
      throw new Error('La compañía no existe');
    }

    // Obtener aplicaciones de la compañía
    const companyApplications =
      await this.permissionDataSource.getCompanyApplications(companyId);

    // Obtener los permisos del rol del usuario
    const rolePermissions = await this.permissionDataSource.getRolePermissions(
      userCompany.roleId,
    );

    // Obtener los recursos de las aplicaciones
    const applicationResources =
      await this.permissionDataSource.getApplicationResources(
        companyApplications.map((ca) => ca.applicationId),
      );

    // Estructurar la respuesta
    const applications = companyApplications
      .map((companyApp) => {
        const app = companyApp.application;
        const appResources = applicationResources.filter(
          (ar) => ar.applicationId === app.id,
        );

        const resources = appResources
          .map((appResource) => {
            const resource = appResource.resource;

            // Obtener subrecursos con permisos para este recurso
            const subresourcesWithPermissions = resource.subresources
              .map((subresource) => {
                const permissions = rolePermissions.filter(
                  (rp) => rp.subresource.id === subresource.id,
                );

                // Si no hay permisos para este subrecurso, retornar null
                if (permissions.length === 0) return null;

                // Tomar solo el primer permiso (acción)
                const firstPermission = permissions[0];

                return {
                  id: subresource.id,
                  name: subresource.name,
                  icon: subresource.icon,
                  path: subresource.path,
                  action: {
                    id: firstPermission.action.id,
                    name: firstPermission.action.name,
                    level: firstPermission.action.level,
                  },
                };
              })
              .filter((subresource) => subresource !== null);

            return {
              id: resource.id,
              name: resource.name,
              icon: resource.icon,
              path: resource.path,
              subresources: subresourcesWithPermissions,
            };
          })
          .filter((resource) => resource.subresources.length > 0);

        return {
          id: app.id,
          name: app.name,
          path: app.path,
          isActive: app.isActive,
          resources,
        };
      })
      .filter((app) => app.resources.length > 0);

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
      applications,
    };
  }
}
