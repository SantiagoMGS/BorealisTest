import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { GetPermissionsByCompanyUseCase } from '@domain/use-cases/user/get-permissions-by-company.use-case';
import { PrismaModule } from '@core/prisma/prisma.module';
import { PermissionRepository } from '@domain/repositories/user/permission.repository';
import { PermissionRepositoryImpl } from '@infrastructure/repositories/user/permission.repository-impl.service';
import { PermissionDataSourceService } from '@infrastructure/datasource/user/permission.datasource.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    PermissionDataSourceService,
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryImpl,
    },
    GetPermissionsByCompanyUseCase,
  ],
})
export class UserModule {}
