import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';

@Controller('api')
export class AuthController {
  constructor(

  ) {
    console.log('✅ AuthController inicializado');
  }

  @UseGuards(CustomAuthGuard) // 👈 Usa `CustomAuthGuard`
  @Get('secure-data')
  getSecureData(@Req() request) {
    console.log('🟢 Request recibido en AuthController:', request.user);

    if (!request.user) {
      console.error('🔴 request.user es undefined');
      return { message: 'Acceso denegado', error: 'El usuario no fue autenticado correctamente' };
    }

    return { message: 'Acceso permitido a datos protegidos', user: request.user };
  }

}
