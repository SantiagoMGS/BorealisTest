import { Controller, Get, UseGuards, Req, HttpStatus, HttpCode, Logger, Post, Body, Request } from '@nestjs/common';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';
import { LoginDto } from '../user/dtos/login.dto';
import { AuthUseCase } from 'src/core/domain/uses-cases/auth/auth.use-case';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {
    Logger.log('✅ AuthController inicializado');
  }

  @UseGuards(CustomAuthGuard)
  @Get('secure-data')
  @HttpCode(HttpStatus.OK)
  getSecureData(@Req() request) {
    Logger.log('🟢 Request recibido en AuthController:', request.user);

    if (!request.user) {
      Logger.error('🔴 request.user es undefined');
      return { message: 'Acceso denegado', error: 'El usuario no fue autenticado correctamente' };
    }

    return { message: '✅ Acceso permitido a datos protegidos', user: request.user };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authUseCase.validateUser(loginDto.email, loginDto.password);
    console.log(user);
    
    return this.authUseCase.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('internal')) // Protegido con tokens internos
  getProfile(@Request() req) {
    return {
      message: 'Perfil del usuario autenticado internamente',
      user: req.user,
    };
  }
}
