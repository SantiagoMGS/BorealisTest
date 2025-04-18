import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { envs } from '@core/config';
import { JwtStrategy } from '@infrastructure/strategies/jwt.service';
import { AuthSessionRepository } from '@domain/repositories/auth/auth-session.repository';
import { AuthSessionRepositoryImpl } from '@infrastructure/repositories/auth/auth-session.repository-imp.service';
import { AuthSessionManagementUseCase } from '@domain/use-cases/auth/auth-session-management.use-case';
import { LoginRepositoryImplService } from '@infrastructure/repositories/auth/auth-login.repository-impl.service';
import { AuthSessionDataSourceService } from '@infrastructure/datasource/auth/auth-session.datasource.service';

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
    AuthSessionManagementUseCase,

    // Servicios de infraestructura
    LoginDataSourceService,
    AuthSessionDataSourceService, // Añadir este servicio aquí

    // Repositorios
    {
      provide: LoginRepository,
      useClass: LoginRepositoryImplService,
    },
    {
      provide: AuthSessionRepository,
      useClass: AuthSessionRepositoryImpl,
    },
    LoginUseCase,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule, AuthSessionManagementUseCase], // Exportar si otros módulos lo necesitan
})
export class AuthModule { }