import { CoreModule } from '@core/core.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthModule } from '@presentation/controllers/auth/auth.module';
import { CommonModule } from '@shared/common.module';
import { SupplierModule } from './presentation/controllers/supplier/supplier.module';
import { UserModule } from './presentation/controllers/user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CommonModule,
    CoreModule,
    UserModule,
    SupplierModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule { }
