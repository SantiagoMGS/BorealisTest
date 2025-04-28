import { AuthModule } from '@presentation/controllers/auth/auth.module';
import { CommonModule as SharedCommonModule } from '@shared/common.module';
import { CommonModule } from '@presentation/controllers/common/common.module';
import { CoreModule } from '@core/core.module';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@core/prisma/prisma.module';
import { UserModule } from './presentation/controllers/user/user.module';
import { SupplierModule } from './presentation/controllers/supplier/supplier.module';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { CompanyModule } from './presentation/controllers/company/company.module';
import { TenantModule } from '@core/config/tenant.module';
import { ReceptionModule } from '@presentation/controllers/reception/reception.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SharedCommonModule,
    CommonModule,
    CoreModule,
    TenantModule,
    UserModule,
    SupplierModule,
    PermissionsModule,
    CompanyModule,
    ReceptionModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
