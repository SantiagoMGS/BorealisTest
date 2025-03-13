import { Controller, Get, UseGuards, Req, HttpStatus, HttpCode,  Post, Body, Request, Logger } from '@nestjs/common';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';
import { LoginDto } from '../user/dtos/login.dto';
import { AuthUseCase } from 'src/core/domain/uses-cases/auth/auth.use-case';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private readonly authUseCase: AuthUseCase) { }

  @UseGuards(CustomAuthGuard)
  @Get('secure-data')
  @HttpCode(HttpStatus.OK)
  getSecureData(@Req() request) {
    this.logger.log('🟢 Request recibido en AuthController:', request.user);

    if (!request.user) {
      this.logger.error('🔴 request.user es undefined');
      return {
        message: 'Acceso denegado',
        error: 'El usuario no fue autenticado correctamente',
      };
    }

    return {
      message: '✅ Acceso permitido a datos protegidos',
      user: request.user,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authUseCase.validateUser(loginDto.email, loginDto.password);
    this.logger.log("user", user);

    return { ...await this.authUseCase.login(user), companies: user.companies };
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
