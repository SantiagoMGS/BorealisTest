import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/presentation/controllers/auth/authController';
import { JwtStrategy } from './jwtStrategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false}), // 👈 IMPORTANTE
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy], // 👈 DEBE ESTAR AQUÍ
  exports: [PassportModule, JwtModule, JwtStrategy], // 👈 EXPORTARLO PARA QUE OTROS MÓDULOS LO VEAN
})
export class AuthModule {}
