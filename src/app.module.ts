import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './presentation/controller/auth/auth.module';
import { CommonModule } from '@shared/common.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule, CoreModule],
})
export class AppModule {}
