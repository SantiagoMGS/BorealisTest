import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthLoginUseCase } from '@domain/use-cases/auth/login.user-case';
import { AuthLoginRepository } from '@domain/repositories/auth/login.repository';
import { AuthLoginRepositoryImpService } from '@infrastructure/repositories/auth/auth-login.repository-imp.service';
import { AuthLoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { PrismaModule } from '@core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthLoginDataSourceService,
    AuthLoginRepositoryImpService,
    {
      provide: AuthLoginRepository,
      useClass: AuthLoginRepositoryImpService,
    },
    AuthLoginUseCase,
  ],
})
export class AuthModule {}
