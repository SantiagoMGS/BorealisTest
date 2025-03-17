import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
import { User } from '../../entities/user.entity';
import { userInitialData } from 'src/infrastructure/prisma/seed/user.seed';
import { IUserRepository } from '../../repositories/user.repository';
import * as bcrypt from 'bcrypt';

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
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
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

      try {
        await this.applicationRepository.createApplication(applications);
        this.logger.log('Application seed executed successfully');
      } catch (error) {
        this.logger.warn(
          'Applications already exist or failed to create applications',
        );
      }

      // Crear compañías
      for (const newCompany of newCompanies) {
        try {
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
        } catch (error) {
          this.logger.warn(
            `Company ${newCompany.name} already exists or failed to create company`,
          );
        }
      }

      // Crear Recursos
      const newResources: Resource[] = resourceInitialData.map(
        (resource) => new Resource('', resource.name),
      );

      for (const newResource of newResources) {
        try {
          await this.resourseRepository.createResource(newResource);
          this.logger.log(`Resource ${newResource.name} created successfully`);
        } catch (error) {
          this.logger.warn(
            `Resource ${newResource.name} already exists or failed to create resource`,
          );
        }
      }

      // Crear Subrecursos
      const newSubresources: SubResource[] = (
        await Promise.all(
          subresourseInitialData.map(async (subresource) => {
            try {
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
            } catch (error) {
              this.logger.warn(
                `Subresource ${subresource.name} already exists or failed to create subresource`,
              );
              return null; // Return null if creation failed
            }
          }),
        )
      ).filter(
        (subresource): subresource is SubResource => subresource !== null,
      );

      // Crear Acciones
      const actions: Action[] = actionInitialData.map(
        (action) => new Action('', action.name, action.level),
      );

      try {
        await this.actionRepository.createActions(actions);
      } catch (error) {
        this.logger.warn('Actions already exist or failed to create actions');
      }

      // Crear roles
      const newRoles: Role[] = roleInitialData.map(
        (role) => new Role('', role.name),
      );

      for (const newRole of newRoles) {
        try {
          const createdRole = await this.roleRepository.createRole(newRole);
          this.logger.log('Role created successfully');

          const action = await this.actionRepository.findByName('DELETE');

          if (!action) {
            throw new Error('Permission not found');
          } else {
            for (const newSubresource of newSubresources) {
              if (newSubresource) {
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
        } catch (error) {
          this.logger.warn(
            `Role ${newRole.name} already exists or failed to create role`,
          );
        }
      }

      const user = userInitialData;

      const userCompany = await this.companyRepository.findByName(
        user.companyName,
      );

      const userRole = await this.roleRepository.findByName(user.role);

      if (!userCompany) {
        throw new ConflictException('Company not found');
      }

      if (!userRole) {
        throw new ConflictException('Role not found');
      }

      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        this.logger.warn(`El email "${user.email}" ya está en uso.`);
        return 'Seed executed with warnings';
      }

      const newUser = new User('', user.name, user.email, user.password);
      const hashedPassword = await bcrypt.hash(newUser.password, 10);

      const createdUser = await this.userRepository.createUser(
        new User('', newUser.name, newUser.email, hashedPassword),
      );

      await this.userRepository.assignUserToCompanies(createdUser.id, [
        { companyId: userCompany.id, roleId: userRole.id },
      ]);

      this.logger.log('Seed seed executed successfully');
      return 'Seed executed successfully';
    } catch (error) {
      this.logger.error('Failed to execute action seed', error.stack);
      throw error;
    }
  }
}
