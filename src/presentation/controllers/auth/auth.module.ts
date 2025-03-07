import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { AuthController } from './authController';
import { PrismaUserRepository } from 'src/infrastructure/prisma/auth/prisma-user.repository';
import { CreateUserUseCase } from 'src/core/domain/uses-cases/auth/create-user.use-case';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/core/domain/uses-cases/auth/jwtStrategy';
@Module({
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    PrismaService,
    PrismaUserRepository,
    { provide: 'IUserRepository', useClass: PrismaUserRepository },
    CreateUserUseCase

  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // 👈 IMPORTANTE
    JwtModule.register({}),
  ],
  exports: [PassportModule, JwtModule, JwtStrategy, CreateUserUseCase], // 👈 EXPORTARLO PARA QUE OTROS MÓDULOS LO VEAN
})
export class AuthModule { }
