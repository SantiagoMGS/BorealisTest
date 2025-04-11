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

import { CoreModule } from './core.module';

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
      provide: 'ILoginRepository',
      useClass: PrismaLoginRepository,
    },
    {
      provide: 'ISessionRepository',
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
    CoreModule, // 👈 Para acceder a IUserRepository
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
export class AuthModule { }
