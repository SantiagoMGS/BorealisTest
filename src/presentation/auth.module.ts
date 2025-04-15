import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// **Auth Controllers**
import { AuthController } from './controllers';

// **Auth Strategies y Servicios**
import { JwtAzureStrategy } from 'src/core/domain/uses-cases/auth/jwt-azure.strategy';
import { JwtInternalStrategy } from 'src/core/domain/uses-cases/auth/jwt-internal.strategy';
import { RefreshTokenStrategy } from 'src/core/domain/uses-cases/auth/refresh-token.strategy';
import { PermissionService } from 'src/core/domain/uses-cases/auth/services/permission.service';

// **Auth Use Cases**
import { AuthUseCase, ManageSessionUseCase } from 'src/core/domain/uses-cases';
import { RefreshTokenUseCase } from 'src/core/domain/uses-cases/auth/refresh-token.use-case';

// **Repositories**
import { PrismaLoginRepository } from 'src/infrastructure/prisma';
import { PrismaSessionRepository } from 'src/infrastructure/prisma/prisma-session.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import { RepositoryModule } from './module/repository.module';
import { TOKENS } from './module/tokens.constants';
import { UserModule } from './module/user/user.module';

/**
 * Módulo de autenticación que maneja la funcionalidad relacionada con login,
 * autenticación y autorización.
 */
@Module({
  controllers: [AuthController],
  providers: [
    JwtAzureStrategy,
    JwtInternalStrategy,
    RefreshTokenStrategy,
    PermissionService,
    PrismaService,
    ManageSessionUseCase,
    RefreshTokenUseCase,
    AuthUseCase,
    {
      provide: TOKENS.LOGIN_REPOSITORY,
      useClass: PrismaLoginRepository,
    },
    {
      provide: TOKENS.SESSION_REPOSITORY,
      useClass: PrismaSessionRepository,
    },
  ],
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'internal', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    RepositoryModule,
    UserModule,
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtAzureStrategy,
    JwtInternalStrategy,
    RefreshTokenStrategy,
    ManageSessionUseCase,
    RefreshTokenUseCase,
    AuthUseCase,
  ],
})
export class AuthModule {}
