import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { LoginRepositoryImplService } from '@infrastructure/repositories/auth/auth-login.repository-impl.service';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { envs } from '@core/config';
import { JwtStrategy } from '@infrastructure/strategies/jwt.service';

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
    LoginDataSourceService,
    LoginRepositoryImplService,
    {
      provide: LoginRepository,
      useClass: LoginRepositoryImplService,
    },
    LoginUseCase,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
