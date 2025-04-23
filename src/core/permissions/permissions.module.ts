import { Module } from '@nestjs/common';
import { PermissionsService } from '@infrastructure/services/access';
import { PermissionsRepository } from '@domain/repositories/access';
import { PermissionsRepositoryImpl } from '@infrastructure/repositories/access';
import { PermissionsDataSource } from '@infrastructure/datasource/access/permissions.datasource.service';
import { PrismaModule } from '@core/prisma/prisma.module';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';

@Module({
  imports: [PrismaModule],
  providers: [
    PermissionsDataSource,
    PermissionsService,
    PermissionsGuard,
    {
      provide: PermissionsRepository,
      useClass: PermissionsRepositoryImpl,
    },
  ],
  exports: [PermissionsGuard, PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
