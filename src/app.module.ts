import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/domain/uses-cases/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // 👈 Asegura que Passport está activo

    AuthModule, // 👈 REGÍSTRALO PRIMERO
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
