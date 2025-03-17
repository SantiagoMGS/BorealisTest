import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '../../entities/company.entity';
import { companyInitialData } from 'src/infrastructure/prisma/seed/company.seed';
import { IApplicationRepository } from '../../repositories/application.repository';
import { Role } from '../../entities/role.entity';
import { roleInitialData } from 'src/infrastructure/prisma/seed/role.seed';
import { IRoleRepository } from '../../repositories/role.repository';
import { IRolePermissionRepository } from '../../repositories/role-permission.repository';
import { IActionRepository } from '../../repositories/action.repository';
import { resourceInitialData } from 'src/infrastructure/prisma/seed/resource.seed';
import { Resource } from '../../entities/resource.entity';
import { IResourceRepository } from '../../repositories/resource.repository';
import { subresourseInitialData } from 'src/infrastructure/prisma/seed/subresource.seed';
import { SubResource } from '../../entities/subresource.entity';
import { ISubResourceRepository } from '../../repositories/subresource.reposiroty';
import { actionInitialData } from 'src/infrastructure/prisma/seed/action.seed';
import { Application } from '../../entities/application.entity';
import { applicationInitialData } from 'src/infrastructure/prisma/seed/application.seed';
import { Action } from '../../entities/action.entity';

@Injectable()
export class SeedUseCase {
  private readonly logger = new Logger(SeedUseCase.name);

  constructor(
    @Inject('IActionRepository')
    private readonly actionRepository: IActionRepository,
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
    @Inject('IApplicationRepository')
    private readonly applicationRepository: IApplicationRepository,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('IRolePermissionRepository')
    private readonly rolePermissionRepository: IRolePermissionRepository,
    @Inject('IResourceRepository')
    private readonly resourseRepository: IResourceRepository,
    @Inject('ISubResourceRepository')
    private readonly subresourceRepository: ISubResourceRepository,
  ) {}

  async execute(): Promise<String> {
    this.logger.log('Executing action seed');

    try {
      const newCompanies: Company[] = companyInitialData.map(
        (company) =>
          new Company(
            '',
            company.name,
            company.logo,
            company.primaryColor,
            company.secondaryColor,
            company.thirdColor,
          ),
      );

      const applications: Application[] = applicationInitialData.map(
        (application) => new Application('', application.name, true),
      );

      await this.applicationRepository.createApplication(applications);
      this.logger.log('Application seed executed successfully');

      // Crear compañías
      for (const newCompany of newCompanies) {
        // Crear cada compañía del seed

        const createdCompany =
          await this.companyRepository.createCompany(newCompany);
        // Verificar que todas las aplicaciones existan
        const application =
          await this.applicationRepository.findByName('BOREALIS');

        if (!application) {
          throw new Error('Application not found');
        }
        // Asignar aplicaciones a la compañía
        await this.companyRepository.assignApplicationToCompanies(
          [createdCompany.id],
          [application.id],
        );
        this.logger.log('Company created successfully');
      }

      // Crear Recursos
      const newResources: Resource[] = resourceInitialData.map(
        (resource) => new Resource('', resource.name),
      );

      for (const newResource of newResources) {
        // Crear cada recurso del seed
        await this.resourseRepository.createResource(newResource);
        this.logger.log(`Resource ${newResource.name} created successfully`);
      }

      // Crear Subrecursos
      const newSubresources: SubResource[] = await Promise.all(
        subresourseInitialData.map(async (subresource) => {
          const resource = await this.resourseRepository.findByName(
            subresource.resourceName,
          );

          if (resource) {
            const newSubResource = new SubResource(
              '',
              subresource.name,
              resource.id,
            );
            const createdSubresource =
              await this.subresourceRepository.createSubResource(
                newSubResource,
              );
            this.logger.log(
              `Subresource ${newSubResource.name} created successfully`,
            );
            return createdSubresource; // Return the created subresource
          } else {
            throw new Error('Resource not found');
          }
        }),
      );

      // Crear Acciones
      const actions: Action[] = actionInitialData.map(
        (action) => new Action('', action.name, action.level),
      );

      await this.actionRepository.createActions(actions);
      this.logger.log('Action seed executed successfully');

      // Crear roles
      const newRoles: Role[] = roleInitialData.map(
        (role) => new Role('', role.name),
      );

      for (const newRole of newRoles) {
        // Crear cada rol del seed
        const createdRole = await this.roleRepository.createRole(newRole);
        this.logger.log('Role created successfully');

        const action = await this.actionRepository.findByName('DELETE');
        console.log(createdRole.id);
        console.log(action!.id);
        console.log(newSubresources);

        if (!action) {
          throw new Error('Permission not found');
        } else {
          for (const newSubresource of newSubresources) {
            await this.rolePermissionRepository.assignPermissions(
              createdRole.id,
              [
                {
                  actionId: action.id,
                  subresourceId: newSubresource.id,
                },
              ],
            );
          }
        }
      }

      this.logger.log('Seed seed executed successfully');
      return 'Seed executed successfully';
    } catch (error) {
      this.logger.error('Failed to execute action seed', error.stack);
      throw error;
    }
  }
}
