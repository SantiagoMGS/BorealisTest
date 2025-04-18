import { AuthModule } from '@presentation/controllers/auth/auth.module';
import { CommonModule } from '@shared/common.module';
import { CoreModule } from '@core/core.module';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@core/prisma/prisma.module';
import { UserModule } from './presentation/controllers/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule, CoreModule, UserModule],
  providers: [JwtStrategy],
})
export class AppModule {}
