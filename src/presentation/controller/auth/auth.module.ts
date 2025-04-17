import { Module } from '@nestjs/common';

import { LoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { LoginRepositoryImplService } from '@infrastructure/repositories/auth/auth-login.repository-impl.service';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    LoginDataSourceService,
    LoginRepositoryImplService,
    {
      provide: LoginRepository,
      useClass: LoginRepositoryImplService,
    },
    LoginUseCase,
  ],
})
export class AuthModule {}
