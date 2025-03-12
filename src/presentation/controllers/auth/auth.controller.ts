import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor() {
    this.logger.log('✅ AuthController inicializado');
  }

  @UseGuards(CustomAuthGuard)
  @Get('secure-data')
  @HttpCode(HttpStatus.OK)
  getSecureData(@Req() request) {
    Logger.log('🟢 Request recibido en AuthController:', request.user);

    if (!request.user) {
      Logger.error('🔴 request.user es undefined');
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
}
