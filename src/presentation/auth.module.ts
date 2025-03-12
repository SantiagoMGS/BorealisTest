import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// **Infrastructure Services**
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PrismaUserRepository, PrismaRoleRepository, PrismaResourceRepository, PrismaCompanyRepository, PrismaActionRepository, PrismaRolePermissionRepository, PrismaApplicationRepository, } from 'src/infrastructure/prisma';

// **Authentication & Security**
import { JwtStrategy } from 'src/core/domain/uses-cases/auth/jwtStrategy';

// **Controllers**
import { AuthController } from './controllers/auth/auth.controller';
import { CompanyController } from './controllers/company/company.controller';
import { ResourceController } from './controllers/resource/resource.controller';
import { RoleController } from './controllers/role/role.controller';
import { UserController } from './controllers/user/user.controller';
import { ActionController } from './controllers/action/action.controller';
import { RolePermissionController } from './controllers/role/role-permission.controller';
import { ApplicationController } from './controllers/applications/applications.controller';

// **Use Cases - User**
import { CreateUserUseCase } from 'src/core/domain/uses-cases/user/create-user.use-case';
import { FindAllUsersUseCase } from 'src/core/domain/uses-cases/user/find-all-user.use-case';
import { UpdateUserUseCase } from 'src/core/domain/uses-cases/user/update-user.use-case';
import { DeleteUserUseCase } from 'src/core/domain/uses-cases/user/delete-user.use-case';
import { FindUserUseCase } from 'src/core/domain/uses-cases/user/find-user.use-case';

// **Use Cases - Role**
import { CreateRoleUseCase } from 'src/core/domain/uses-cases/role/create-role.user-case';
import { GetAllRolesUseCase } from 'src/core/domain/uses-cases/role/get-all-roles.use-case';
import { GetRoleByIdUseCase } from 'src/core/domain/uses-cases/role/get-role-by-id.use-case';
import { UpdateRoleUseCase } from 'src/core/domain/uses-cases/role/update-role.use-case';
import { DeleteRoleUseCase } from 'src/core/domain/uses-cases/role/delete-role.use-case';

// **Use Cases - Role Permission**
import { GetPermissionsByRoleUseCase } from 'src/core/domain/uses-cases/role/role-permission/get-permissions-by-role.use-case';
import { RemovePermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/remove-permission.use-case';
import { CheckPermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/check-permission.use-case';
import { AssignPermissionsUseCase } from 'src/core/domain/uses-cases/role/role-permission/assign-permissions.use-case';

// **Use Cases - Resource**
import { CreateResourceUseCase } from 'src/core/domain/uses-cases/resource/create-resource.use-case';
import { UpdateResourceUseCase } from 'src/core/domain/uses-cases/resource/update-resource.use-case';
import { DeleteResourceUseCase } from 'src/core/domain/uses-cases/resource/delete-resource.use-case';
import { GetByIdResourceUseCase } from 'src/core/domain/uses-cases/resource/get-resoure.use-case';
import { GetAllResourcesUseCase } from 'src/core/domain/uses-cases/resource/get-all-resorce.use-case';

// **Use Cases - Company**
import { CreateCompanyUseCase } from 'src/core/domain/uses-cases/company/create-company.use-case';
import { GetByIdCompanyUseCase } from 'src/core/domain/uses-cases/company/get-by-id-company.use-case';
import { GetByNameCompanyUseCase } from 'src/core/domain/uses-cases/company/get-by-name-company.use-case';
import { GetAllCompaniesUseCase } from 'src/core/domain/uses-cases/company/get-all-company.use-case';
import { AssignApplicationToCompaniesUseCase } from 'src/core/domain/uses-cases/company/assign-application-to-companies.use-case';
import { DeleteCompanyUseCase } from 'src/core/domain/uses-cases/company/delete-company.use-case';

// **Use Cases - Other**
import { ActionSeedUseCase } from 'src/core/domain/uses-cases/action/action-seed.use-case';
import { ApplicationSeedUseCase } from 'src/core/domain/uses-cases/application/application-seed.use-case';
import { UpdateCompanyUseCase } from 'src/core/domain/uses-cases/company/update-company.use-case';

@Module({
  controllers: [
    AuthController, 
    CompanyController, 
    ResourceController, 
    RoleController, 
    UserController, 
    ActionController, 
    RolePermissionController, 
    ApplicationController
  ],
  providers: [
    // **Security**
    JwtStrategy,
    PrismaService,

    // **Repositories**
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
    

    // **User Use Cases**
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,

    // **Role Use Cases**
    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    // **Role Permission Use Cases**
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase, 
    CheckPermissionUseCase,
    AssignPermissionsUseCase,

    // **Resource Use Cases**
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetByIdResourceUseCase,
    GetAllResourcesUseCase,

    // **Company Use Cases**
    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,

    // **Other Use Cases**
    ActionSeedUseCase,
    ApplicationSeedUseCase
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({}),
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy,

    // **User Use Cases**
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,

    // **Role Use Cases**
    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    // **Role Permission Use Cases**
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase, 
    CheckPermissionUseCase,
    AssignPermissionsUseCase,

    // **Resource Use Cases**
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetByIdResourceUseCase,
    GetAllResourcesUseCase,

    // **Company Use Cases**
    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,

    // **Other Use Cases**
    ActionSeedUseCase,
    ApplicationSeedUseCase
  ],
})
export class AuthModule {}
