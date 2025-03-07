import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from 'src/core/domain/uses-cases/auth/create-user.use-case';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly createUserUseCase: CreateUserUseCase,
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

  @Post('create-user')
  async createUser(@Body() userDto: CreateUserDto, @Req() req) {
    return this.createUserUseCase.execute(userDto);
  }
}
