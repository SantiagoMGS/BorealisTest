import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  actionInitialData,
  applicationInitialData,
  companyInitialData,
  resourceInitialData,
  roleInitialData,
  subresourseInitialData,
  userInitialData,
} from 'src/infrastructure/prisma/seed';
import {
  Action,
  Application,
  Company,
  Resource,
  Role,
  Subresource,
  User,
} from '../../entities';
import {
  IActionRepository,
  IApplicationRepository,
  ICompanyRepository,
  IResourceRepository,
  IRolePermissionRepository,
  IRoleRepository,
  ISubResourceRepository,
  IUserRepository,
} from '../../repositories';

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
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    @Inject('IRolePermissionRepository')
    private readonly rolePermissionRepository: IRolePermissionRepository,
    @Inject('IResourceRepository')
    private readonly resourseRepository: IResourceRepository,
    @Inject('ISubResourceRepository')
    private readonly subresourceRepository: ISubResourceRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<string> {
    this.logger.log('🚀 Ejecutando proceso de seed...');
    try {
      await this.seedApplications();
      await this.seedResources();
      await this.seedCompanies();
      const subresources = await this.seedSubResources();
      await this.seedActions();
      await this.seedRoles(subresources);
      await this.seedUsers();

      this.logger.log('✅ Seed ejecutado exitosamente');
      return 'Seed ejecutado exitosamente';
    } catch (error) {
      this.logger.error(
        '❌ Fallo en el proceso de seed',
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw error;
    }
  }

  private async seedApplications(): Promise<void> {
    this.logger.log('📦 Seeding applications');
    const applications: Application[] = applicationInitialData.map(
      (application) => ({
        id: '',
        name: application.name,
        isActive: true,
        logo: application.logo,
      }),
    );
    try {
      await this.applicationRepository.createApplication(applications);
    } catch {
      this.logger.warn('⚠️ Las aplicaciones ya existen o fallaron al crearse');
    }
  }

  private async seedResources(): Promise<void> {
    this.logger.log('📦 Seeding resources');

    const resources: Resource[] = resourceInitialData.map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
    }));

    for (const resource of resources) {
      try {
        await this.resourseRepository.createResource(resource);
      } catch {
        this.logger.warn(`⚠️ El recurso ${resource.name} ya existe o falló`);
      }
    }
  }

  private async seedCompanies(): Promise<void> {
    this.logger.log('📦 Seeding companies');

    for (const seedCompany of companyInitialData) {
      try {
        const newCompany: Company = {
          id: '',
          name: seedCompany.name,
          shortName: seedCompany.shortName,
          isActive: true,
          createdAt: null,
          updatedAt: null,
          createdBy: null,
          updatedBy: null,
          branding: null,
        };

        let createdCompany: Company;

        try {
          createdCompany =
            await this.companyRepository.createCompany(newCompany);
          this.logger.log(`✅ Compañía ${createdCompany.name} creada`);
        } catch {
          this.logger.warn(`⚠️ Compañía ${seedCompany.name} ya existe`);
          const foundCompany = await this.companyRepository.findByName(
            seedCompany.name,
          );
          if (!foundCompany) continue;
          createdCompany = foundCompany;
        }
        // Crear branding si no existe o está incompleto
        if (
          seedCompany.branding &&
          (!createdCompany.branding || !createdCompany.branding.logo)
        ) {
          await this.companyRepository.createCompanyBranding(
            createdCompany.id!,
            {
              companyId: createdCompany.id!,
              logo: seedCompany.branding.logo,
              primaryColor: seedCompany.branding.primaryColor,
              secondaryColor: seedCompany.branding.secondaryColor,
              tertiaryColor: seedCompany.branding.tertiaryColor,
            },
          );
          this.logger.log(`🎨 Branding creado para ${createdCompany.name}`);
        }

        await this.assignApplicationsToCompany(createdCompany);
      } catch (error) {
        this.logger.warn(
          `⚠️ Compañía ${seedCompany.name} ya existe o falló su creación`,
        );
      }
    }
  }

  private async assignApplicationsToCompany(company: Company): Promise<void> {
    const application =
      await this.applicationRepository.findByName('BOREALIS APP');

    if (!application) throw new Error('❌ Aplicación "BOREALIS" no encontrada');

    const alreadyAssigned =
      await this.companyRepository.isApplicationAssignedToCompany(
        company.id!,
        application.id,
      );

    if (alreadyAssigned) {
      this.logger.log(
        `ℹ️ Aplicación "${application.name}" ya está asignada a la compañía "${company.name}"`,
      );
      return;
    }

    await this.companyRepository.assignApplicationToCompanies(
      [company.id!],
      [application.id],
    );
    this.logger.log(
      `✅ Aplicación "${application.name}" asignada a la compañía "${company.name}"`,
    );
  }

  private async seedSubResources(): Promise<Subresource[]> {
    this.logger.log('📦 Seeding subresources');
    const subresources = await Promise.all(
      subresourseInitialData.map(async (sub) => {
        try {
          const resource = await this.resourseRepository.findByName(
            sub.resourceName,
          );

          if (!resource)
            throw new Error(`Resource ${sub.resourceName} no encontrado`);

          const newSub: Subresource = {
            id: '',
            name: sub.name,
            icon: sub.icon,
            resourceId: resource.id,
          };

          return await this.subresourceRepository.createSubResource(newSub);
        } catch {
          this.logger.warn(`⚠️ Subresource ${sub.name} ya existe o falló`);
          return null;
        }
      }),
    );
    return subresources.filter((s): s is Subresource => s !== null);
  }

  private async seedActions(): Promise<void> {
    this.logger.log('📦 Seeding actions');
    await Promise.all(
      actionInitialData.map(async (a) => {
        try {
          const newAction: Action = { id: '', name: a.name, level: a.level };

          return await this.actionRepository.createActions([newAction]);
        } catch {
          this.logger.warn(`⚠️ Subresource ${a.name} ya existe o falló`);
          return null;
        }
      }),
    );
  }

  private async seedRoles(subresources: Subresource[]): Promise<void> {
    this.logger.log('📦 Seeding roles');
    const roles: Role[] = roleInitialData.map((r) => ({
      id: '',
      name: r.name,
    }));
    for (const role of roles) {
      try {
        const createdRole = await this.roleRepository.createRole(role);
        await this.assignPermissionsToRole(createdRole, subresources);
      } catch {
        this.logger.warn(`⚠️ Rol ${role.name} ya existe o falló`);
      }
    }
  }

  private async assignPermissionsToRole(
    role: Role,
    subresources: Subresource[],
  ): Promise<void> {
    const action = await this.actionRepository.findByName('DELETE');
    if (!action) throw new Error('Acción "DELETE" no encontrada');

    for (const sub of subresources) {
      await this.rolePermissionRepository.assignPermissions(role.id!, [
        { actionId: action.id!, subresourceId: sub.id! },
      ]);
    }
  }

  private async seedUsers(): Promise<void> {
    this.logger.log('📦 Seeding users');
    const user = userInitialData;

    const company = await this.companyRepository.findByName(user.companyName);
    if (!company)
      throw new ConflictException(`Compañía ${user.companyName} no encontrada`);

    const role = await this.roleRepository.findByName(user.role);
    if (!role) throw new ConflictException(`Rol ${user.role} no encontrado`);

    const exists = await this.userRepository.findByEmail(user.email);
    if (exists) {
      this.logger.warn(`⚠️ Usuario con email ${user.email} ya existe`);
      return;
    }

    const hashed = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      id: '',
      name: user.name,
      email: user.email,
      hashedPassword: hashed,
      isActive: true,
    };

    const created = await this.userRepository.createUser(newUser);

    await this.userRepository.assignUserToCompanies(created.id!, [
      { companyId: company.id!, roleId: role.id! },
    ]);
  }
}
