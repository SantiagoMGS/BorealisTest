import { Inject, Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class SeedUseCase {
  private readonly logger = new Logger(SeedUseCase.name);

  constructor(
    @Inject('ICompanyRepository')
    private readonly actionRepository: IActionRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly applicationRepository: IApplicationRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly rolePermissionRepository: IRolePermissionRepository,
    private readonly resourseRepository: IResourceRepository,
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

      // Crear compañías
      for (const newCompany of newCompanies) {
        // Crear cada compañía del seed
        await this.companyRepository.createCompany(newCompany);

        // Verificar que todas las aplicaciones existan
        const application =
          await this.applicationRepository.findByName('BOREALIS');

        if (!application) {
          throw new Error('Application not found');
        }

        // Asignar aplicaciones a la compañía
        await this.companyRepository.assignApplicationToCompanies(
          [newCompany.id],
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

      // Crear roles
      const newRoles: Role[] = roleInitialData.map(
        (role) => new Role('', role.name),
      );

      // Crear roles
      for (const newRole of newRoles) {
        // Crear cada rol del seed
        const createdRole = await this.roleRepository.createRole(newRole);
        this.logger.log('Role created successfully');

        const action = await this.actionRepository.findByName('delete');

        if (!action) {
          throw new Error('Permission not found');
        } else {
          await this.rolePermissionRepository.assignPermissions(
            createdRole.id,
            [{ actionId: action.id, subresourceId: '' }],
          );
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
