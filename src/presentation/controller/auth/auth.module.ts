import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LoginDataSourceService } from '@infrastructure/datasource/auth/login.datasource.service';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { LoginRepository, SessionRepository } from '@domain/repositories/auth';
import {
  LoginUseCase,
  LogoutUseCase,
  SessionManagementUseCase,
} from '@domain/use-cases/auth';
import { envs } from '@core/config';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { AuthSessionDataSourceService } from '@infrastructure/datasource/auth/session.datasource.service';
import { SessionRepositoryImpl } from '@infrastructure/repositories/auth/session.repository-impl.service';
import { LoginRepositoryImplService } from '@infrastructure/repositories/auth/login.repository-impl.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: {
        expiresIn: envs.jwtExpiration,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Casos de uso
    SessionManagementUseCase,
    {
      provide: LoginUseCase,
      useFactory: (
        loginRepository: LoginRepository,
        sessionRepository: SessionRepository,
      ) => {
        return new LoginUseCase(loginRepository, sessionRepository);
      },
      inject: [LoginRepository, SessionRepository],
    },
    LogoutUseCase,

    // Servicios de infraestructura
    LoginDataSourceService,
    AuthSessionDataSourceService,

    // Repositorios
    {
      provide: LoginRepository,
      useClass: LoginRepositoryImplService,
    },
    {
      provide: SessionRepository,
      useClass: SessionRepositoryImpl,
    },

    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule, SessionManagementUseCase],
})
export class AuthModule {}
