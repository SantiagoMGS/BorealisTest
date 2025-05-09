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
  SetCompanyUseCase,
} from '@domain/use-cases/auth';
import { envs } from '@core/config';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { AuthSessionDataSourceService } from '@infrastructure/datasource/auth/session.datasource.service';
import { SessionRepositoryImpl } from '@infrastructure/repositories/auth/session.repository-impl.service';
import { LoginRepositoryImplService } from '@infrastructure/repositories/auth/login.repository-impl.service';
import { TokenService } from '@infrastructure/services/token/token.service';
import { PrismaService } from '@core/prisma/prisma.service';

export const TOKEN_PORT = 'TOKEN_PORT';

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
    // Servicios comunes
    {
      provide: TOKEN_PORT,
      useClass: TokenService,
    },

    // Casos de uso
    {
      provide: SessionManagementUseCase,
      useFactory: (
        sessionRepository: SessionRepository,
        tokenPort: TokenService,
      ) => {
        return new SessionManagementUseCase(sessionRepository, tokenPort);
      },
      inject: [SessionRepository, TOKEN_PORT],
    },
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
    {
      provide: SetCompanyUseCase,
      useFactory: (
        sessionRepository: SessionRepository,
        tokenPort: TokenService,
        prisma: PrismaService,
      ) => {
        return new SetCompanyUseCase(sessionRepository, tokenPort, prisma);
      },
      inject: [SessionRepository, TOKEN_PORT, PrismaService],
    },

    // Servicios de infraestructura
    LoginDataSourceService,
    AuthSessionDataSourceService,

    // Repositorios
    {
      provide: LoginRepository,
      useFactory: (
        loginDataSourceService: LoginDataSourceService,
        tokenPort: TokenService,
      ) => {
        return new LoginRepositoryImplService(
          loginDataSourceService,
          tokenPort,
        );
      },
      inject: [LoginDataSourceService, TOKEN_PORT],
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
