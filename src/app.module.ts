import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './presentation/controller/auth/auth.module';
import { CommonModule } from '@shared/common.module';
import { CoreModule } from './core/core.module';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule, CoreModule],
  providers: [JwtStrategy],
})
export class AppModule {}
