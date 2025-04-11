import { Module } from '@nestjs/common';

// **Controllers**
import {
  ActionController,
  ApplicationController,
  CompanyController,
  ResourceController,
  RoleController,
  RolePermissionController,
  SeedController,
  SubResourceController,
  UserController,
  WebhookController,
} from './controllers';

// **Use Cases**
import {
  // Seeds
  ActionSeedUseCase,
  ApplicationSeedUseCase,
  AssignApplicationToCompaniesUseCase,
  AssignPermissionsUseCase,
  CheckPermissionUseCase,
  // Companies
  CreateCompanyUseCase,
  // Resources
  CreateResourceUseCase,
  // Roles
  CreateRoleUseCase,
  // Subresources
  CreateSubResourceUseCase,
  // Users
  CreateUserUseCase,
  DeleteCompanyUseCase,
  DeleteResourceUseCase,
  DeleteRoleUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindUserUseCase,
  GetAllCompaniesUseCase,
  GetAllResourcesUseCase,
  GetAllRolesUseCase,
  GetByIdCompanyUseCase,
  GetByIdResourceUseCase,
  GetByNameCompanyUseCase,
  // Permissions
  GetPermissionsByRoleUseCase,
  GetRoleByIdUseCase,
  GetUserPermissionsUseCase,
  RemovePermissionUseCase,
  SeedUseCase,
  UpdateCompanyUseCase,
  UpdateResourceUseCase,
  UpdateRoleUseCase,
  UpdateUserCompanyRoleUseCase,
  UpdateUserUseCase,
} from 'src/core/domain/uses-cases';

// **Repositories**
import { PermissionService } from '@app/core/domain/uses-cases/auth/services/permission.service';
import {
  PrismaActionRepository,
  PrismaApplicationRepository,
  PrismaCompanyRepository,
  PrismaResourceRepository,
  PrismaRolePermissionRepository,
  PrismaRoleRepository,
  PrismaSubResourceRepository,
  PrismaUserRepository,
} from 'src/infrastructure/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [
    CompanyController,
    ResourceController,
    RoleController,
    UserController,
    WebhookController,
    ActionController,
    RolePermissionController,
    ApplicationController,
    SeedController,
    SubResourceController,
  ],
  providers: [
    PrismaService,
    PermissionService,
    // Repositories
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: PrismaRoleRepository,
    },
    {
      provide: 'IResourceRepository',
      useClass: PrismaResourceRepository,
    },
    {
      provide: 'ICompanyRepository',
      useClass: PrismaCompanyRepository,
    },
    {
      provide: 'IActionRepository',
      useClass: PrismaActionRepository,
    },
    {
      provide: 'IRolePermissionRepository',
      useClass: PrismaRolePermissionRepository,
    },
    {
      provide: 'IApplicationRepository',
      useClass: PrismaApplicationRepository,
    },
    {
      provide: 'ISubResourceRepository',
      useClass: PrismaSubResourceRepository,
    },

    // Use Cases
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UpdateUserCompanyRoleUseCase,
    GetUserPermissionsUseCase,

    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase,
    CheckPermissionUseCase,
    AssignPermissionsUseCase,

    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetByIdResourceUseCase,
    GetAllResourcesUseCase,

    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,

    CreateSubResourceUseCase,
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    SeedUseCase,
  ],
  exports: [
    // Repositories
    'IUserRepository', // 👈 IMPORTANTE para AuthModule

    // Use Cases
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UpdateUserCompanyRoleUseCase,
    GetUserPermissionsUseCase,

    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase,
    CheckPermissionUseCase,
    AssignPermissionsUseCase,

    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetByIdResourceUseCase,
    GetAllResourcesUseCase,

    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,

    CreateSubResourceUseCase,
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    SeedUseCase,
  ],
})
export class CoreModule { }
