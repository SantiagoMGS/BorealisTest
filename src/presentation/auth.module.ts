import { Module } from '@nestjs/common';

// **Infrastructure Services**
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  PrismaUserRepository,
  PrismaRoleRepository,
  PrismaResourceRepository,
  PrismaCompanyRepository,
  PrismaActionRepository,
  PrismaRolePermissionRepository,
  PrismaApplicationRepository,
  PrismaSubResourceRepository,
  PrismaLoginRepository,
} from 'src/infrastructure/prisma';

// **Authentication & Security**
import { JwtAzureStrategy } from 'src/core/domain/uses-cases/auth/jwt-azure.strategy';
import { JwtInternalStrategy } from 'src/core/domain/uses-cases/auth/jwt-internal.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// **Controllers**
import {
  AuthController,
  CompanyController,
  ResourceController,
  RoleController,
  UserController,
  ActionController,
  RolePermissionController,
  ApplicationController,
  SeedController,
  SubResourceController,
} from './controllers';

// **Use Cases **
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionService } from 'src/core/domain/uses-cases/auth/services/permission.service';
import {
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
  ApplicationSeedUseCase,
  AuthUseCase,
  CreateSubResourceUseCase,
  SeedUseCase,
  GetUserPermissionsUseCase,
} from 'src/core/domain/uses-cases';

@Module({
  controllers: [
    AuthController,
    CompanyController,
    ResourceController,
    RoleController,
    UserController,
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
    // **SubResource Use Cases**
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
    // **SubResource Use Cases**
    CreateSubResourceUseCase,
    // **Other Use Cases**
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    AuthUseCase,
    SeedUseCase,
  ],
})
export class AuthModule {}
