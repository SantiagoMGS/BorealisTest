import { Module, Res } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PrismaUserRepository } from 'src/infrastructure/prisma/auth/prisma-user.repository';
import { CreateUserUseCase } from 'src/core/domain/uses-cases/user/create-user.use-case';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/core/domain/uses-cases/auth/jwtStrategy';
import { CreateRoleUseCase } from 'src/core/domain/uses-cases/role/crate-role.user-case';
import { PrismaRoleRepository } from 'src/infrastructure/prisma/auth/prisma-role.repository';
import { PrismaResourceRepository } from 'src/infrastructure/prisma/prisma-resource.repository';
import { CreateResourceUseCase } from 'src/core/domain/uses-cases/resource/create-resource.use-case';
import { PrismaCompanyRepository } from 'src/infrastructure/prisma/auth/prisma-company.repository';
import { CreateCompanyUseCase } from 'src/core/domain/uses-cases/company/create-company.use-case';
import { AuthController } from './controllers/auth/auth.controller';
import { CompanyController } from './controllers/company/company.controller';
import { ResourceController } from './controllers/resource/resource.controlle';
import { RoleController } from './controllers/role/role.controller';
import { UserController } from './controllers/user/user.controller';

@Module({
  controllers: [AuthController, CompanyController, ResourceController, RoleController, UserController],
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
    CreateUserUseCase,
    CreateRoleUseCase,
    CreateResourceUseCase,
    CreateCompanyUseCase

  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // 👈 IMPORTANTE
    JwtModule.register({}),
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy,
    CreateUserUseCase,
    CreateRoleUseCase,
    CreateResourceUseCase,
    CreateCompanyUseCase
  ], // 👈 EXPORTARLO PARA QUE OTROS MÓDULOS LO VEAN
})
export class AuthModule { }
