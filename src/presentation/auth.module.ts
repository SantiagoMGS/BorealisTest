import { Module } from '@nestjs/common';

// **Infrastructure Services**
import {
  PrismaActionRepository,
  PrismaApplicationRepository,
  PrismaCompanyRepository,
  PrismaLoginRepository,
  PrismaResourceRepository,
  PrismaRolePermissionRepository,
  PrismaRoleRepository,
  PrismaSubResourceRepository,
  PrismaUserRepository,
} from 'src/infrastructure/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

// **Authentication & Security**
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAzureStrategy } from 'src/core/domain/uses-cases/auth/jwt-azure.strategy';
import { JwtInternalStrategy } from 'src/core/domain/uses-cases/auth/jwt-internal.strategy';

// **Controllers**
import {
  ActionController,
  ApplicationController,
  AuthController,
  CompanyController,
  ResourceController,
  RoleController,
  RolePermissionController,
  SeedController,
  SubResourceController,
  UserController,
  WebhookController
} from './controllers';

// **Use Cases **
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  // **Other Use Cases**
  ActionSeedUseCase,
  ApplicationSeedUseCase,
  AssignApplicationToCompaniesUseCase,
  AssignPermissionsUseCase,
  AuthUseCase,
  CheckPermissionUseCase,
  // **Company Use Cases**
  CreateCompanyUseCase,
  // **Resource Use Cases**
  CreateResourceUseCase,
  // **Role Use Cases**
  CreateRoleUseCase,
  CreateSubResourceUseCase,
  // **User Use Cases**
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
  // **Role Permission Use Cases**
  GetPermissionsByRoleUseCase,
  GetRoleByIdUseCase,
  GetUserPermissionsUseCase,
  ManageSessionUseCase,
  RemovePermissionUseCase,
  SeedUseCase,
  UpdateCompanyUseCase,
  UpdateResourceUseCase,
  UpdateRoleUseCase,
  UpdateUserCompanyRoleUseCase,
  UpdateUserUseCase,
} from 'src/core/domain/uses-cases';
import { RefreshTokenStrategy } from 'src/core/domain/uses-cases/auth/refresh-token.strategy';
import { RefreshTokenUseCase } from 'src/core/domain/uses-cases/auth/refresh-token.use-case';
import { PermissionService } from 'src/core/domain/uses-cases/auth/services/permission.service';
import { PrismaSessionRepository } from 'src/infrastructure/prisma/prisma-session.repository';

@Module({
  controllers: [
    AuthController,
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
    // **Security**

    JwtAzureStrategy,
    JwtInternalStrategy,
    PrismaService,
    PermissionService,
    RefreshTokenUseCase,
    RefreshTokenStrategy,
    ManageSessionUseCase,

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
    {
      provide: 'ISubResourceRepository',
      useClass: PrismaSubResourceRepository,
    },
    {
      provide: 'ILoginRepository',
      useClass: PrismaLoginRepository
    },
    {
      provide: 'ISessionRepository',
      useClass: PrismaSessionRepository
    },

    // **User Use Cases**
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UpdateUserCompanyRoleUseCase,
    GetUserPermissionsUseCase,

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
    // **Subresource Use Cases**
    CreateSubResourceUseCase,
    // **Other Use Cases**
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    AuthUseCase,
    SeedUseCase,

  ],
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'internal', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret', // ✅ Evita que sea undefined
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtAzureStrategy,
    JwtInternalStrategy,
    RefreshTokenStrategy,
    ManageSessionUseCase,

    // **User Use Cases**
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UpdateUserCompanyRoleUseCase,

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
    GetUserPermissionsUseCase,

    // **Company Use Cases**
    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,
    // **Subresource Use Cases**
    CreateSubResourceUseCase,
    // **Other Use Cases**
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    AuthUseCase,
    SeedUseCase,
    RefreshTokenUseCase
  ],
})
export class AuthModule { }
