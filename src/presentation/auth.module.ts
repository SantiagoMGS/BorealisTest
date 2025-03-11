import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateUserUseCase } from 'src/core/domain/uses-cases/user/create-user.use-case';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/core/domain/uses-cases/auth/jwtStrategy';
import { CreateRoleUseCase } from 'src/core/domain/uses-cases/role/create-role.user-case';
import { GetAllRolesUseCase } from 'src/core/domain/uses-cases/role/get-all-roles.use-case';
import { GetRoleByIdUseCase } from 'src/core/domain/uses-cases/role/get-role-by-id.use-case';
import { UpdateRoleUseCase } from 'src/core/domain/uses-cases/role/update-role.use-case';
import { DeleteRoleUseCase } from 'src/core/domain/uses-cases/role/delete-role.use-case';
import { CreateResourceUseCase } from 'src/core/domain/uses-cases/resource/create-resource.use-case';
import { CreateCompanyUseCase } from 'src/core/domain/uses-cases/company/create-company.use-case';
import { ActionSeedUseCase } from 'src/core/domain/uses-cases/action/action-seed.use-case';
import { AuthController } from './controllers/auth/auth.controller';
import { CompanyController } from './controllers/company/company.controller';
import { RoleController } from './controllers/role/role.controller';
import { UserController } from './controllers/user/user.controller';
import { ActionController } from './controllers/action/action.controller';
import { PrismaUserRepository, PrismaRoleRepository, PrismaResourceRepository, PrismaCompanyRepository, PrismaActionRepository, PrismaRolePermissionRepository, PrismaApplicationRepository } from 'src/infrastructure/prisma';
import { ResourceController } from './controllers/resource/resource.controller';
import { RolePermissionController } from './controllers/role/role-permission.controller';
import { GetPermissionsByRoleUseCase } from 'src/core/domain/uses-cases/role/role-permission/get-permissions-by-role.use-case';
import { RemovePermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/remove-permission.use-case';
import { CheckPermissionUseCase } from 'src/core/domain/uses-cases/role/role-permission/check-permission.use-case';
import { AssignPermissionsUseCase } from 'src/core/domain/uses-cases/role/role-permission/assign-permissions.use-case';
import { ApplicationSeedUseCase } from 'src/core/domain/uses-cases/application/application-seed.use-case';
import { ApplicationController } from './controllers/applications/applications.controller';

@Module({
  controllers: [AuthController, CompanyController, ResourceController, RoleController, UserController, ActionController, RolePermissionController, ApplicationController],
  providers: [
    JwtStrategy,
    PrismaService,
    PrismaUserRepository,
    {
      provide: 'IUserRepository', useClass: PrismaUserRepository
    },
    {
      provide: 'IRoleRepository', useClass: PrismaRoleRepository
    },
    {
      provide: 'IResourceRepository', useClass: PrismaResourceRepository
    },
    {
      provide: 'ICompanyRepository', useClass: PrismaCompanyRepository
    },
    {
      provide: 'IActionRepository', useClass: PrismaActionRepository
    },
    {
      provide: 'IRolePermissionRepository', useClass: PrismaRolePermissionRepository
    },
    {
      provide: 'IApplicationRepository', useClass: PrismaApplicationRepository
    },

    
    CreateUserUseCase,
    CreateRoleUseCase,
    GetAllRolesUseCase,  // 🔹 Agregado aquí
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    CreateResourceUseCase,
    CreateCompanyUseCase,
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase, 
    CheckPermissionUseCase,
    AssignPermissionsUseCase 
    
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({}),
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy,
    CreateUserUseCase,
    CreateRoleUseCase,
    GetAllRolesUseCase,  // 🔹 Agregado aquí
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    CreateResourceUseCase,
    CreateCompanyUseCase,
    ActionSeedUseCase,
    ApplicationSeedUseCase,
    GetPermissionsByRoleUseCase,
    RemovePermissionUseCase, 
    CheckPermissionUseCase,
    AssignPermissionsUseCase
  ],
})
export class AuthModule { }
