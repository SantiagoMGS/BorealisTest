import { ConflictException, Inject, Injectable, Logger, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IActionRepository, IApplicationRepository, ICompanyRepository, IResourceRepository, IRolePermissionRepository, IRoleRepository, ISubResourceRepository, IUserRepository } from '../../repositories';
import { Action, Application, Company, Resource, Role, SubResource, User } from '../../entities';
import { actionInitialData, applicationInitialData, companyInitialData, resourceInitialData, roleInitialData, subresourseInitialData, userInitialData } from 'src/infrastructure/prisma/seed';

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
  ) { }

  async execute(): Promise<String> {
    this.logger.log('Executing seed process');

    try {
      await this.seedApplications();
      await this.seedCompanies();
      await this.seedResources();
      const subresources = await this.seedSubResources();
      await this.seedActions();
      await this.seedRoles(subresources);
      await this.seedUsers();

      this.logger.log('Seed process executed successfully');
      return 'Seed executed successfully';
    } catch (error) {
      this.logger.error('Failed to execute seed process', error instanceof Error ? error.stack : 'Unknown error');
      throw error;
    }
  }

  private async seedApplications(): Promise<void> {
    this.logger.log('Seeding applications');

    const applications: Application[] = applicationInitialData.map(
      (application) => new Application('', application.name, true, application.logo),
    );

    try {
      await this.applicationRepository.createApplication(applications);
      this.logger.log('Applications seeded successfully');
    } catch (error) {
      this.logger.warn('Applications already exist or failed to create applications');
    }
  }

  private async seedCompanies(): Promise<void> {
    this.logger.log('Seeding companies');

    const companies: Company[] = companyInitialData.map(
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

    for (const company of companies) {
      try {
        const createdCompany = await this.companyRepository.createCompany(company);
        await this.assignApplicationsToCompany(createdCompany);
        this.logger.log(`Company ${company.name} created successfully`);
      } catch (error) {
        this.logger.warn(`Company ${company.name} already exists or failed to create company`);
      }
    }
  }

  private async assignApplicationsToCompany(company: Company): Promise<void> {
    const application = await this.applicationRepository.findByName('BOREALIS');

    if (!application) {
      throw new Error('Application not found');
    }

    await this.companyRepository.assignApplicationToCompanies(
      [company.id],
      [application.id],
    );
  }

  private async seedResources(): Promise<void> {
    this.logger.log('Seeding resources');

    const resources: Resource[] = resourceInitialData.map(
      (resource) => new Resource('', resource.name),
    );

    for (const resource of resources) {
      try {
        await this.resourseRepository.createResource(resource);
        this.logger.log(`Resource ${resource.name} created successfully`);
      } catch (error) {
        this.logger.warn(`Resource ${resource.name} already exists or failed to create resource`);
      }
    }
  }

  private async seedSubResources(): Promise<SubResource[]> {
    this.logger.log('Seeding subresources');

    const subresources = await Promise.all(
      subresourseInitialData.map(async (subresource) => {
        try {
          const resource = await this.resourseRepository.findByName(subresource.resourceName);

          if (!resource) {
            throw new Error(`Resource ${subresource.resourceName} not found`);
          }

          const newSubResource = new SubResource('', subresource.name, resource.id);
          const createdSubresource = await this.subresourceRepository.createSubResource(newSubResource);
          this.logger.log(`Subresource ${newSubResource.name} created successfully`);
          return createdSubresource;
        } catch (error) {
          this.logger.warn(`Subresource ${subresource.name} already exists or failed to create subresource`);
          return null;
        }
      }),
    );

    return subresources.filter((subresource): subresource is SubResource => subresource !== null);
  }

  private async seedActions(): Promise<void> {
    this.logger.log('Seeding actions');

    const actions: Action[] = actionInitialData.map(
      (action) => new Action('', action.name, action.level),
    );

    try {
      await this.actionRepository.createActions(actions);
      this.logger.log('Actions seeded successfully');
    } catch (error) {
      this.logger.warn('Actions already exist or failed to create actions');
    }
  }

  private async seedRoles(subresources: SubResource[]): Promise<void> {
    this.logger.log('Seeding roles');

    const roles: Role[] = roleInitialData.map(
      (role) => new Role('', role.name),
    );

    for (const role of roles) {
      try {
        const createdRole = await this.roleRepository.createRole(role);
        this.logger.log(`Role ${role.name} created successfully`);
        await this.assignPermissionsToRole(createdRole, subresources);
      } catch (error) {
        this.logger.warn(`Role ${role.name} already exists or failed to create role`);
      }
    }
  }

  private async assignPermissionsToRole(role: Role, subresources: SubResource[]): Promise<void> {
    const action = await this.actionRepository.findByName('DELETE');

    if (!action) {
      throw new Error('Action not found');
    }

    for (const subresource of subresources) {
      await this.rolePermissionRepository.assignPermissions(
        role.id,
        [
          {
            actionId: action.id,
            subresourceId: subresource.id,
          },
        ],
      );
    }
    this.logger.log(`Permissions assigned to role ${role.name}`);
  }

  private async seedUsers(): Promise<void> {
    this.logger.log('Seeding users');

    const user = userInitialData;

    const userCompany = await this.companyRepository.findByName(user.companyName);
    if (!userCompany) {
      throw new ConflictException(`Company ${user.companyName} not found`);
    }

    const userRole = await this.roleRepository.findByName(user.role);
    if (!userRole) {
      throw new ConflictException(`Role ${user.role} not found`);
    }

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      this.logger.warn(`User with email "${user.email}" already exists`);
      return;
    }

    const newUser = new User('', user.name, user.email, user.password, true, '', null);
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = await this.userRepository.createUser(
      new User('', newUser.name, newUser.email, hashedPassword, true, null, null),
    );

    await this.assignUserToCompany(createdUser, userCompany, userRole);
    this.logger.log(`User ${user.name} created successfully`);
  }

  private async assignUserToCompany(user: User, company: Company, role: Role): Promise<void> {
    await this.userRepository.assignUserToCompanies(user.id, [
      { companyId: company.id, roleId: role.id },
    ]);
    this.logger.log(`User ${user.name} assigned to company ${company.name} with role ${role.name}`);
  }
}