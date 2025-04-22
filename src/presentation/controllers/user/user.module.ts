import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { GetPermissionsByCompanyUseCase } from '@domain/use-cases/user/get-permissions-by-company.use-case';
import { PrismaModule } from '@core/prisma/prisma.module';
import { PermissionRepository } from '@domain/repositories/user/permission.repository';
import { PermissionRepositoryImpl } from '@infrastructure/repositories/user/permission.repository-impl.service';
import { PermissionDataSourceService } from '@infrastructure/datasource/user/permission.datasource.service';
import { CreateUserUseCase } from '@domain/use-cases/user/create-user.use-case';
import { UserRepository } from '@domain/repositories/user/user.repository';
import { UserRepositoryImpl } from '@infrastructure/repositories/user/user.repository-impl.service';
import { UserDataSourceService } from '@infrastructure/datasource/user/user.datasource.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    PermissionDataSourceService,
    UserDataSourceService,
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    GetPermissionsByCompanyUseCase,
    CreateUserUseCase,
  ],
})
export class UserModule {}
