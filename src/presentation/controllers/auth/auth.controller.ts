import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Get, UseGuards, Req, HttpStatus, HttpCode, Post, Body, Request, Logger, ConflictException } from '@nestjs/common';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';
import { LoginDto } from '../user/dtos/login.dto';
import { AuthUseCase } from 'src/core/domain/uses-cases/auth/auth.use-case';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenUseCase } from 'src/core/domain/uses-cases/auth/refresh-token.use-case';
import { RefreshTokenGuard } from 'src/core/domain/uses-cases/auth/guards/refresh-token.guard';
import { ManageSessionUseCase } from 'src/core/domain/uses-cases/auth/manage-session.use-case';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly manageSessionUseCase: ManageSessionUseCase
  ) { }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Request() req) {
    const refreshToken = req.headers['x-refresh-token'];
    const userAgent = req.headers['user-agent'];

    const {
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt
    } = await this.refreshTokenUseCase.refreshAccessToken(refreshToken);

    await this.manageSessionUseCase.createSession(
      userId,
      newRefreshToken,
      userAgent
    );

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
    };
  }
  @Post('logout')
  async logout(@Req() req, @Body('refreshToken') refreshToken: string) {
    await this.refreshTokenUseCase.logout(req.user.id);
    await this.manageSessionUseCase.invalidateSession(refreshToken);
    return { message: 'Logout exitoso' };
  }

  @Get('sessions')
  @UseGuards(AuthGuard('internal'))
  async getSessions(@Req() req) {
    const sessions = await this.manageSessionUseCase.getActiveSessions(req.user.id);
    return { sessions };
  }

  @UseGuards(CustomAuthGuard)
  @Get('secure-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener datos seguros del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve los datos seguros del usuario autenticado.',
    schema: {
      example: {
        message: '✅ Acceso permitido a datos protegidos',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'usuario@example.com',
          name: 'Usuario Ejemplo',
        },
      },
    },
  })
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
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales del usuario para autenticación.',
    examples: {
      example1: {
        summary: 'Ejemplo de entrada',
        value: {
          email: 'usuario@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario autenticado exitosamente.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'usuario@example.com',
          name: 'Usuario Ejemplo',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciales inválidas.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const user = await this.authUseCase.validateUser(loginDto.email, loginDto.password);
    const loginResponse = await this.authUseCase.login(user);
    const refreshToken = loginResponse.tokens.refresh_token;

    //  Reemplaza la sesión si ya existe
    await this.manageSessionUseCase.createSession(
      user.id,
      refreshToken,
      req.headers['user-agent']
    );

    return {
      ...loginResponse,
      user,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('internal'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener perfil del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve el perfil del usuario autenticado.',
    schema: {
      example: {
        message: 'Perfil del usuario autenticado internamente',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'usuario@example.com',
          name: 'Usuario Ejemplo',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
  getProfile(@Request() req) {
    return {
      message: 'Perfil del usuario autenticado internamente',
      user: req.user,
    };
  }
}