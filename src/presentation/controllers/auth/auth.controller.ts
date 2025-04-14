import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { AuthUseCase } from 'src/core/domain/uses-cases/auth/auth.use-case';
import { CustomAuthGuard } from 'src/core/domain/uses-cases/auth/guards/custom-auth.guard';
import { RefreshTokenGuard } from 'src/core/domain/uses-cases/auth/guards/refresh-token.guard';
import { ManageSessionUseCase } from 'src/core/domain/uses-cases/auth/manage-session.use-case';
import { RefreshTokenUseCase } from 'src/core/domain/uses-cases/auth/refresh-token.use-case';
import { LoginDto } from '../user/dtos/login.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly manageSessionUseCase: ManageSessionUseCase,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales del usuario para autenticación.',
  })
  @ApiStandardResponses({ ok: 'Usuario autenticado exitosamente.', badRequest: true })
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const user = await this.authUseCase.validateUser(loginDto.email, loginDto.password);
    const loginResponse = await this.authUseCase.login(user);
    const refreshToken = loginResponse.tokens.refresh_token;

    await this.manageSessionUseCase.createSession(
      user.id,
      refreshToken,
      req.headers['user-agent'],
    );

    return {
      ...loginResponse,
      companies: user.companies,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiStandardResponses({ ok: 'Token refrescado correctamente.' })
  async refreshTokens(@Request() req) {
    const refreshToken = req.headers['x-refresh-token'];
    const userAgent = req.headers['user-agent'];

    const {
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt,
    } = await this.refreshTokenUseCase.refreshAccessToken(refreshToken);

    await this.manageSessionUseCase.createSession(userId!, newRefreshToken, userAgent);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      refreshTokenExpiresAt,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } })
  @ApiStandardResponses({ ok: 'Logout exitoso.', badRequest: true })
  async logout(@Req() req, @Body('refreshToken') refreshToken: string) {
    await this.refreshTokenUseCase.logout(req.user.id);
    await this.manageSessionUseCase.invalidateSession(refreshToken);
    return { message: 'Logout exitoso' };
  }

  @Get('sessions')
  @UseGuards(AuthGuard('internal'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener sesiones activas' })
  @ApiStandardResponses({ ok: 'Sesiones activas del usuario.' })
  async getSessions(@Req() req) {
    const sessions = await this.manageSessionUseCase.getActiveSessions(req.user.id);
    return { sessions };
  }

  @Get('profile')
  @UseGuards(AuthGuard('internal'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiStandardResponses({ ok: 'Perfil del usuario autenticado.' })
  getProfile(@Request() req) {
    return {
      message: 'Perfil del usuario autenticado internamente',
      user: req.user,
    };
  }

  @UseGuards(CustomAuthGuard)
  @Get('secure-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener datos seguros del usuario' })
  @ApiStandardResponses({ ok: 'Acceso permitido a datos protegidos.' })
  getSecureData(@Req() request) {
    if (!request.user) {
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
