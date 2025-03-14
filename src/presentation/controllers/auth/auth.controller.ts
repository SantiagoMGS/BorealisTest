import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Get, UseGuards, Req, HttpStatus, HttpCode, Post, Body, Request, Logger } from '@nestjs/common';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';
import { LoginDto } from '../user/dtos/login.dto';
import { AuthUseCase } from 'src/core/domain/uses-cases/auth/auth.use-case';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private readonly authUseCase: AuthUseCase) { }

  @UseGuards(CustomAuthGuard)
  @Get('secure-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener datos seguros del usuario' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Devuelve los datos seguros del usuario autenticado.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuario autenticado exitosamente.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciales inválidas.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authUseCase.validateUser(loginDto.email, loginDto.password);
    return { ...await this.authUseCase.login(user), user: user };
  }

  @Get('profile')
  @UseGuards(AuthGuard('internal'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener perfil del usuario' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Devuelve el perfil del usuario autenticado.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  getProfile(@Request() req) {
    return {
      message: 'Perfil del usuario autenticado internamente',
      user: req.user,
    };
  }
}